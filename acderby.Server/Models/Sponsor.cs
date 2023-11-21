namespace acderby.Server.Models
{
    public class Sponsor
    {
        public required Guid Id { get; set; }
        public required SponsorshipLevel Level { get; set; }
        public required Uri LogoUrl { get; set; }
    }
}
