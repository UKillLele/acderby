using System.Text.Json.Serialization;

namespace acderby.Server.Models
{
    public class Person
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public int? Number { get; set; }
        public Uri? ImageUrl { get; set; }
        public ICollection<Position> Positions { get; set; } = [];
    }
}
