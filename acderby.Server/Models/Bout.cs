using System.ComponentModel.DataAnnotations.Schema;

namespace acderby.Server.Models
{
    public class Bout
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public required DateTime Date { get; set; }
        public Team? HomeTeam { get; set; }
        public int? HomeTeamScore { get; set; }
        public Person? HomeTeamMVPJammer { get; set; }
        public Person? HomeTeamMVPBlocker { get; set; }
        public Team? AwayTeam { get; set; }
        public int? AwayTeamScore { get; set; }
        public  Person? AwayTeamMVPJammer { get; set; }
        public Guid? AwayTeamMVPBlockerId { get; set; }
        public Person? AwayTeamMVPBlocker { get; set; }
        public Uri? ImageUrl { get; set; }
    }
}
