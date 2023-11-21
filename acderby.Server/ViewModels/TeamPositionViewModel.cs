using acderby.Server.Models;

namespace acderby.Server.ViewModels
{
    public class TeamPositionViewModel(Position position)
    {
        public Person? Person { get; set; } = position.Person;
        public PositionType Type { get; set; } = position.Type;
    }
}
