using acderby.Server.Data;
using acderby.Server.Models;
using acderby.Server.ViewModels;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

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

        public ApiController(ILogger<ApiController> logger, ApplicationDbContext context, IHttpContextAccessor contextAccessor, BlobServiceClient blobServiceClient)
        {
            _logger = logger;
            _context = context;
            _contextAccessor = contextAccessor;

            _blobContainerClient = blobServiceClient.GetBlobContainerClient("photos");
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
        [Route("addPerson")]
        [Authorize]
        public async Task<ActionResult> AddPerson([FromForm] AddPersonRequest person)
        {

            var newPerson = new Person()
            {
                Id = Guid.NewGuid(),
                Name = person.Name,
                Number = person.Number,
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
        [Route("updatePerson")]
        [Authorize]
        public async Task<ActionResult> UpdatePerson([FromForm] UpdatePersonRequest person)
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
        [Route("deletePerson")]
        [Authorize(Roles = ("Admin, Editor"))]
        public async Task<ActionResult> DeletePlayer([FromForm] Guid id)
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
    }
}
