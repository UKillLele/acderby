using acderby.Server.Models;

namespace acderby.Server.ViewModels
{
    public class PersonViewModel(Person person)
    {
        public Guid Id { get; set; } = person.Id;
        public string Name { get; set; } = person.Name;
        public int? Number { get; set; } = person.Number;
        public Uri? ImageUrl { get; set; } = person.ImageUrl;
        public List<PersonPositionViewModel> Positions { get; set; } = person.Positions.Select(x => new PersonPositionViewModel(x)).ToList();
    }
}
