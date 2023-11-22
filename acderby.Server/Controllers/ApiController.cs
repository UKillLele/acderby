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

            if (person.Positions != null)
            {
                List<Position> positions = [];
                var p = JsonSerializer.Deserialize<List<PositionRequest>>(person.Positions);
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
                        positions.Add(position);
                    }
                }
                newPerson.Positions = positions;
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
            _context.People.Add(newPerson);
            _context.SaveChanges();
            return Ok();
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


    }
}
