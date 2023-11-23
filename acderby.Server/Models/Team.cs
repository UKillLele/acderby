
using System.ComponentModel.DataAnnotations.Schema;

namespace acderby.Server.Models
{
    public class Team
    {
        public required Guid Id { get; set; }
        public string Slug { get; set; } = string.Empty;
        public required string Name { get; set; }
        public required string Description { get; set; }
        public ICollection<Position> Positions { get; set; } = [];
        public Uri? ImageUrl { get; set; }
        public required Uri LogoUrl { get; set; }
        public required string Color { get; set; }
        public int? SeasonWins { get; set; }
        public int? SeasonLosses { get; set; }
        public int? Ranking { get; set; }
        public Uri? DefaultSkaterImage { get; set; }
    }
}
