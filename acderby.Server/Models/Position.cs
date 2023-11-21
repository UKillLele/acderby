using System.Text.Json.Serialization;

namespace acderby.Server.Models
{
    public class Position
    {
        public Guid Id { get; set; }
        [JsonIgnore]
        public Person? Person { get; set; }
        public required PositionType Type { get; set; }
        [JsonIgnore]
        public Team? Team { get; set; }
    }

    public enum PositionType
    {
        Member,
        CoCaptain,
        Captain,
        BenchCoach,
        HeadCoach
    }
}
