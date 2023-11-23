namespace acderby.Server.Models
{
    public class AddPersonRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Number {  get; set; }
        public IFormFile? ImageFile { get; set; }
        public string Positions { get; set; } = string.Empty;
    }

    public class PositionRequest
    {
        public Guid TeamId { get; set; }
        public PositionType Type { get; set; }
    }
}
