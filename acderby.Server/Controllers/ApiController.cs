using acderby.Server.Data;
using acderby.Server.Models;
using acderby.Server.Services;
using acderby.Server.ViewModels;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using NuGet.Packaging;
using QRCoder;
using Square;
using Square.Exceptions;
using Square.Models;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Xml.Linq;


namespace acderby.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        private readonly ILogger<ApiController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        private readonly BlobContainerClient _blobContainerClient;
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        private readonly SquareClient _client;
        private readonly IEmailSender _emailSender;

        public ApiController(
            ILogger<ApiController> logger,
            ApplicationDbContext context,
            IHttpContextAccessor contextAccessor,
            BlobServiceClient blobServiceClient,
            Microsoft.Extensions.Configuration.IConfiguration configuration,
            IEmailSender emailSender)
        {
            _logger = logger;
            _context = context;
            _contextAccessor = contextAccessor;
            _configuration = configuration;
            _emailSender = emailSender;

            _blobContainerClient = blobServiceClient.GetBlobContainerClient("photos");

            _client = new SquareClient
                .Builder()
                .Environment(Square.Environment.Sandbox)
                .AccessToken(configuration.GetValue<string>("ConnectionStrings:SquareAccessToken"))
                .Build();
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
        [Authorize(Roles = ("Admin, Editor"))]
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

        [HttpGet]
        [Route("bouts")]
        public ActionResult GetBouts()
        {
            var bouts = _context.Bouts
                .Include(x => x.HomeTeam)
                .Include(x => x.AwayTeam)
                .OrderBy(x => x.Date)
                .GroupBy(x => x.Date.Date)
                .ToList();
            return Ok(bouts);
        }

        [HttpPost]
        [Route("process-payment")]
        public ActionResult ProcessPayment(PaymentRequest request)
        {
            if (request != null)
            {
                var uuid = Guid.NewGuid().ToString();
                var createPaymentRequest = new CreatePaymentRequest.Builder(
                    sourceId: request.SourceId,
                    idempotencyKey: uuid)
                    .OrderId(request.Order?.Id)
                    .AmountMoney(request.Order?.NetAmountDueMoney)
                    .Build();

                try
                {
                    var response = _client.PaymentsApi.CreatePayment(createPaymentRequest);
                    var fulfillment = request.Order?.Fulfillments[0].Type == "PICKUP" ? request.Order.Fulfillments[0].PickupDetails.Recipient : request.Order?.Fulfillments[0].ShipmentDetails.Recipient;
                    if (fulfillment != null)
                    {
                        QRCodeGenerator qrGenerator = new();
                        QRCodeData qrCodeData = qrGenerator.CreateQrCode(request.Order?.Id, QRCodeGenerator.ECCLevel.Q);
                        PngByteQRCode qrCode = new(qrCodeData);
                        byte[] qrCodeAsPngByteArr = qrCode.GetGraphic(20);
                        using var ms = new MemoryStream(qrCodeAsPngByteArr);
                        var image = new LinkedResource(ms, MediaTypeNames.Image.Png)
                        {
                            ContentId = "QRCode.png",
                            TransferEncoding = TransferEncoding.Base64,
                            ContentLink = new Uri("cid:" + "QRCode.png")
                        };
                        image.ContentType.Name = image.ContentId;

                        string items = string.Empty;
                        if (request.Order != null)
                        {
                            foreach (var item in request.Order.LineItems)
                            {
                                items += ($"<li>{item.Name} x {item.Quantity} @ ${item.BasePriceMoney.Amount / 100}</li>");
                            }
                        }
                        var emailTop = "<!DOCTYPE html><html><head><meta charset='utf-8' /><title></title></head><body><div style='padding: 10px'>";
                        var thanks = "<p>Thank you for supporting ACRD! Here's your order info:</p>";
                        var emailBottom = "<p>Sincerly,</p><p>UKillLele</p></div></body></html>";
                        var template = emailTop;
                        template += $"<p>{fulfillment.DisplayName},</p>";
                        template += thanks;
                        template += $"<ul>{items}</ul>";
                        template += request.Order?.TotalDiscountMoney != null && request.Order.TotalDiscountMoney.Amount > 0 ? $"<p>Discounts: ${request.Order?.TotalDiscountMoney.Amount / 100}</p>" : string.Empty;
                        template += request.Order?.TotalServiceChargeMoney != null && request.Order.TotalServiceChargeMoney.Amount > 0 ? $"<p>Shipping: ${request.Order?.TotalServiceChargeMoney.Amount / 100}</p>" : string.Empty;
                        template += $"<p style='font-weight: bold'>Total: ${request.Order?.TotalMoney.Amount / 100}</p>";
                        template += $"<p>order #: {request.Order?.Id}</p>";
                        template += "<img src='cid:QRCode.png' height='300' width='300' alt='QRCode.png' />";
                        template += emailBottom;

                        AlternateView htmlView = AlternateView.CreateAlternateViewFromString(template, Encoding.UTF8, MediaTypeNames.Text.Html);
                        htmlView.LinkedResources.Add(image);
                        AlternateView plainView = AlternateView.CreateAlternateViewFromString(Regex.Replace(template, "<[^>]+?>", string.Empty), Encoding.UTF8, MediaTypeNames.Text.Plain);
                        plainView.LinkedResources.Add(image);

                        var message = new MailMessage("info@acderby.com", fulfillment.EmailAddress)
                        {
                            IsBodyHtml = true,
                            DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure,
                            Subject = "Assassination City Roller Derby Purchase Receipt",
                        };
                        message.AlternateViews.Add(plainView);
                        message.AlternateViews.Add(htmlView);

                        try
                        {
                            _emailSender.SendEmail(MimeMessage.CreateFromMailMessage(message));
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.ToString());
                        }
                    }
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

            var order = new Order.Builder(locationId: _configuration.GetValue<string>("ConnectionStrings:SquareLocationId"))
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

                try
                {
                    var result = await _client.OrdersApi.UpdateOrderAsync(request.OrderId, body);
                    return Ok(result.Order);
                }
                catch (ApiException ex)
                {
                    return BadRequest(ex.Errors);
                }
            }
            else
            {
                var body = new CreateOrderRequest.Builder()
                  .Order(order)
                  .IdempotencyKey(Guid.NewGuid().ToString())
                  .Build();

                try
                {
                    var result = await _client.OrdersApi.CreateOrderAsync(body);
                    return Ok(result.Order);
                }
                catch (ApiException ex)
                {
                    return BadRequest(ex.Errors);
                }
            }
        }

        [HttpGet]
        [Route("catalog")]
        public async Task<ActionResult> GetCatalogAsync([FromQuery] string category)
        {
            IList<CatalogObject> categories;
            try
            {
                var response = await _client.CatalogApi.ListCatalogAsync(null, "CATEGORY");
                categories = response.Objects;
            }
            catch (ApiException ex)
            {
                return BadRequest(ex.Errors);
            }

            IList<CatalogObject> items;
            try
            {
                var objectTypes = new List<string>(["ITEM"]);
                var exactQuery = new CatalogQueryExact("category_id", categories.FirstOrDefault(x => x.CategoryData?.Name == (category == "tickets" ? "Presale" : "Merchandise"))?.Id);
                var query = new CatalogQuery(exactQuery: exactQuery);
                var response = await _client.CatalogApi.SearchCatalogObjectsAsync(new SearchCatalogObjectsRequest(objectTypes: objectTypes, query: query));
                items = response.Objects;
            }
            catch (ApiException ex)
            {
                return BadRequest(ex.Errors);
            }

            try
            {
                var response = await _client.CatalogApi.ListCatalogAsync(null, "IMAGE");
                items.AddRange(response.Objects);
            }
            catch (ApiException ex)
            {
                return BadRequest(ex.Errors);
            }
            
            return Ok(items);
        }

        [HttpGet]
        [Route("order/{id}")]
        public async Task<ActionResult> GetOrderAsync(string id)
        {
            var result = await _client.OrdersApi.RetrieveOrderAsync(id);
            return Ok(result.Order);
        }

        [HttpPost]
        [Route("validate-address")]
        public ActionResult ValidateAddress([FromForm] Models.Address address)
        {
            var username = _configuration.GetValue<string>("ConnectionStrings:USPSUsername");
            var password = _configuration.GetValue<string>("ConnectionStrings:USPSPassword");

            XDocument requestDoc = new XDocument(
                new XElement("AddressValidateRequest",
                    new XAttribute("USERID", $"{username}"),
                    new XAttribute("PASSWORD", $"{password}"),
                    new XElement("Revision", "1"),
                    new XElement("Address",
                        new XAttribute("ID", "0"),
                        new XElement("Address1", $"{address.Address2}"),
                        new XElement("Address2", $"{address.Address1}"),
                        new XElement("City", $"{address.City}"),
                        new XElement("State", $"{address.State}"),
                        new XElement("Zip5", $"{address.Zipcode}"),
                        new XElement("Zip4", "")
                    )
                )
            );

            try
            {
                var url = "http://production.shippingapis.com/ShippingAPI.dll?API=Verify&XML=" + requestDoc;
                // HttpClient won't work here
                var client = new WebClient();
                var result = client.DownloadString(url);

                var xdoc = XDocument.Parse(result.ToString());
                var parsedAddress = xdoc.Descendants("Address");
                var response = new Models.Address()
                {
                    Address1 = parsedAddress?.Elements("Address2")?.FirstOrDefault()?.Value,
                    Address2 = parsedAddress?.Elements("Address1")?.FirstOrDefault()?.Value,
                    City = parsedAddress?.Elements("City")?.FirstOrDefault()?.Value,
                    State = parsedAddress?.Elements("State")?.FirstOrDefault()?.Value,
                    Zipcode = $"{parsedAddress?.Elements("Zip5")?.FirstOrDefault()?.Value}-{parsedAddress?.Elements("Zip4")?.FirstOrDefault()?.Value}",
                    ReturnText = parsedAddress?.Elements("ReturnText")?.FirstOrDefault()?.Value
                };
                if (response.Address1 == null)
                {
                    var error = parsedAddress?.Elements("Error");
                    return Ok(JsonSerializer.Serialize(error?.Elements("Description")?.FirstOrDefault()?.Value));
                }
                return Ok(response);
            }
            catch (ApiException ex)
            {
                return BadRequest(ex.Errors);
            }
        }

        [HttpPost]
        [Route("add-fulfillment")]
        public async Task<ActionResult> AddFullfillmentAsync([FromBody] AddFulfillmentRequest request)
        { 
            var fulfillments = new List<Fulfillment>();
            var serviceCharges = new List<OrderServiceCharge>();

            if (request.Fulfillment == "shipment")
            {
                var amount = new Money(600, "USD");
                OrderServiceCharge serviceCharge = new OrderServiceCharge(name: "Shipping", amountMoney: amount, calculationPhase: "TOTAL_PHASE");
                serviceCharges.Add(serviceCharge);

                var address = new Square.Models.Address(request.Address1, request.Address2, null, request.State, request.City, postalCode: request.Zipcode);
                var recipient = new FulfillmentRecipient(null, request.DisplayName, request.EmailAddress, request.PhoneNumber, address);
                var shipmentDetails = new FulfillmentShipmentDetails(recipient);
                var fulfillment = new Fulfillment(type: "SHIPMENT", shipmentDetails: shipmentDetails);
                fulfillments.Add(fulfillment);
            } 
            else
            {
                var recipient = new FulfillmentRecipient(null, request.DisplayName, request.EmailAddress, request.PhoneNumber);
                var pickupDetails = new FulfillmentPickupDetails(recipient, pickupAt: "3000-01-01");
                var fulfillment = new Fulfillment(type: "PICKUP", pickupDetails: pickupDetails);
                fulfillments.Add(fulfillment);
            }

            var order = new Order.Builder(locationId: _configuration.GetValue<string>("ConnectionStrings:SquareLocationId"))
              .Version(request.Version)
              .Fulfillments(fulfillments)
              .ServiceCharges(serviceCharges)
              .State("OPEN")
              .Build();

            var body = new UpdateOrderRequest.Builder()
                .Order(order)
                .IdempotencyKey(Guid.NewGuid().ToString())
                .Build();

            try
            {
                var result = await _client.OrdersApi.UpdateOrderAsync(request.OrderId, body);

                return Ok(result.Order);
            }
            catch (ApiException ex)
            {
                return BadRequest(ex.Errors);
            }
        }
    }
}
