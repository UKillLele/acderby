using acderby.Server.Data;
using acderby.Server.Models;
using acderby.Server.ViewModels;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Square;
using Square.Apis;
using Square.Exceptions;
using Square.Models;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace acderby.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        private readonly ILogger<ApiController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        private readonly SquareClient _client;

        public ApiController(
            ILogger<ApiController> logger, 
            ApplicationDbContext context, 
            IHttpContextAccessor contextAccessor, 
            BlobServiceClient blobServiceClient,
            Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _logger = logger;
            _context = context;
            _contextAccessor = contextAccessor;

            _blobContainerClient = blobServiceClient.GetBlobContainerClient("photos"); 

            _client = new SquareClient
                .Builder()
                .Environment(Square.Environment.Sandbox)
                .AccessToken(configuration.GetValue<string>("ConnectionStrings:SquareAccessToken"))
                .Build();
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Ok();
        }

        [HttpGet]
        [Route("teams")]
        public ActionResult Teams() 
        {
            var teams = _context.Teams;
            return Ok(teams);
        }

        [HttpGet]
        [Route("teams/{id}")]
        public ActionResult Teams(string id)
        {
            var team = _context.Teams
                .AsNoTracking()
                .Include(x => x.Positions)
                .ThenInclude(x => x.Person)
                .Select(x => new TeamViewModel(x))
                .ToList()
                .FirstOrDefault(x => x.Slug == id);

            if (team != null)
            {
                return Ok(team);
            }
            return NotFound();
        }

        [HttpPost]
        [Route("add-person")]
        [Authorize]
        public async Task<ActionResult> AddPersonAsync([FromForm] AddPersonRequest person)
        {

            var newPerson = new Person()
            {
                Id = Guid.NewGuid(),
                Name = person.Name,
                Number = person.Number
            }; 
            if (person.ImageFile?.Length > 0)
            {
                using var ms = new MemoryStream();
                person.ImageFile.CopyTo(ms);
                ms.Position = 0;

                BlobClient blobClient = _blobContainerClient.GetBlobClient($"{person.Name}.png");
                await blobClient.UploadAsync(ms, true);
                newPerson.ImageUrl = blobClient.Uri;
            }
            await _context.People.AddAsync(newPerson);
            await _context.SaveChangesAsync();

            if (person.Positions != null)
            {
                var p = JsonSerializer.Deserialize<List<PositionRequest>>(person.Positions, _jsonOptions);
                if (p != null)
                {
                    foreach (var item in p)
                    {
                        var position = new Position()
                        {
                            Id = Guid.NewGuid(),
                            Person = newPerson,
                            Type = item.Type,
                            Team = _context.Teams.FirstOrDefault(x => x.Id == item.TeamId)
                        };
                        await _context.Positions.AddAsync(position);
                    }
                    await _context.SaveChangesAsync();
                }
            };
            return Ok();
        }

        [HttpPut]
        [Route("update-person")]
        [Authorize]
        public async Task<ActionResult> UpdatePersonAsync([FromForm] UpdatePersonRequest person)
        {
            if (_context.People.Single(x => x.Id == person.Id) is Person existingPerson)
            {
                existingPerson.Name = person.Name;
                existingPerson.Number = person.Number;

                if (person.ImageFile?.Length > 0)
                {
                    using var ms = new MemoryStream();
                    person.ImageFile.CopyTo(ms);
                    ms.Position = 0;

                    BlobClient blobClient = _blobContainerClient.GetBlobClient($"{person.Name}.png");
                    await blobClient.UploadAsync(ms, true);
                    existingPerson.ImageUrl = blobClient.Uri;
                }
                if (person.Positions != null)
                {
                    var p = JsonSerializer.Deserialize<List<PositionRequest>>(person.Positions, _jsonOptions);
                    if (p != null)
                    {
                        var existingPositions = _context.Positions.Where(x => x.Person!.Id.Equals(person.Id));
                        foreach (var item in p)
                        {
                            // update position if type changed
                            var position = existingPositions.FirstOrDefault(x => x.Team!.Id.Equals(item.TeamId));
                            if (position != null)
                            {
                                if (!position.Type.Equals(item.Type)) position.Type = item.Type;
                            }
                            else // create position
                            {
                                var newPosition = new Position 
                                { 
                                    Id = Guid.NewGuid(),
                                    Person = existingPerson,
                                    Type = item.Type,
                                    Team = _context.Teams.Single(x => x.Id.Equals(item.TeamId))
                                };
                                await _context.Positions.AddAsync(newPosition);
                            }
                        }
                        await _context.SaveChangesAsync();
                    }
                };
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest("Person does not exist in database");
        }

        [HttpGet]
        [Route("roles")]
        [Authorize]
        public ActionResult Roles()
        {
            var role = _contextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);
            return Ok(new { role });
        }

        [HttpGet]
        [Route("players")]
        [Authorize(Roles=("Admin, Editor"))]
        public ActionResult Players()
        {
            var players = _context.People
                .AsNoTracking()
                .Include(x => x.Positions)
                .ThenInclude(x => x.Team)
                .OrderBy(x => x.Number)
                .Select(x => new PersonViewModel(x))
                .ToList();
            return Ok(players);
        }

        [HttpPost]
        [Route("delete-person")]
        [Authorize(Roles = ("Admin, Editor"))]
        public async Task<ActionResult> DeletePersonAsync([FromForm] Guid id)
        {
            var person = await _context.People.FindAsync(id);
            if (person != null)
            {
                _context.People.Remove(person);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest("Person does not exist in database");
        }

        [HttpPost]
        [Route("process-payment")]
        public async Task<ActionResult> ProcessPaymentAsync()
        {
            var request = await JsonNode.ParseAsync(Request.Body);
            if (request != null)
            {
                var token = (string)request["sourceId"]!;

                var uuid = Guid.NewGuid().ToString();
                var amount = new Money
                    .Builder()
                    .Amount(100L)
                    .Currency("USD")
                    .Build();
                var createPaymentRequest = new CreatePaymentRequest.Builder(
                    sourceId: token,
                    idempotencyKey: uuid)
                    .AmountMoney(amount)
                    .Build();

                try
                {
                    var response = await _client.PaymentsApi.CreatePaymentAsync(createPaymentRequest);
                    return new JsonResult(new { payment = response.Payment });
                }
                catch (ApiException e)
                {
                    return new JsonResult(new { errors = e.Errors });
                }
            }
            return NotFound();
        }

        [HttpPost]
        [Route("update-order")]
        public async Task<ActionResult> UpdateOrderAsync([FromBody] OrderAddItemRequest request)
        {

            var lineItems = new List<OrderLineItem>();
            var itemsToRemove = new List<string>();
            foreach (var item in request.Items)
            {

                if (item.Uid != null)
                {
                    if (Int32.Parse(item.Quantity) > 0)
                    {
                        var orderLineItem = new OrderLineItem.Builder(quantity: item.Quantity)
                          .Uid(item.Uid)
                          .Build();

                        lineItems.Add(orderLineItem);
                    }
                    else
                    {
                        itemsToRemove.Add($"line_items[{item.Uid}]");
                    }
                } 
                else
                {
                    var orderLineItem = new OrderLineItem.Builder(quantity: item.Quantity)
                      .CatalogObjectId(item.LineItemId)
                      .Build();

                    lineItems.Add(orderLineItem);
                }
            }

            var pricingOptions = new OrderPricingOptions.Builder()
              .AutoApplyDiscounts(true)
              .Build();

            var order = new Order.Builder(locationId: "LX5D3XC4CJ77A")
              .LineItems(lineItems)
              .PricingOptions(pricingOptions)
              .Version(request.Version)
              .Build();

            if (request.OrderId != null)
            {
                var body = new UpdateOrderRequest.Builder()
                  .Order(order)
                  .FieldsToClear(itemsToRemove)
                  .IdempotencyKey(Guid.NewGuid().ToString())
                  .Build();

                var result = await _client.OrdersApi.UpdateOrderAsync(request.OrderId, body);

                return Ok(result.Order);
            }
            else
            {
                var body = new CreateOrderRequest.Builder()
                  .Order(order)
                  .IdempotencyKey(Guid.NewGuid().ToString())
                  .Build();

                var result = await _client.OrdersApi.CreateOrderAsync(body);

                return Ok(result.Order);
            }
        }

        [HttpGet]
        [Route("order/{id}")]
        public async Task<ActionResult> GetOrderAsync(string id)
        {
            var result = await _client.OrdersApi.RetrieveOrderAsync(id);
            return Ok(result.Order);
        }
    }
}
