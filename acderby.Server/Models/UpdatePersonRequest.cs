namespace acderby.Server.Models
{
    public class UpdatePersonRequest: AddPersonRequest
    {
        public Guid Id { get; set; }
    }
}
