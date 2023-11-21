using acderby.Server.Models;

namespace acderby.Server.ViewModels
{
    public class PersonPositionViewModel(Position position)
    {
        public PositionType Type { get; set; } = position.Type;
        public Team? Team { get; set; } = position.Team;
    }
}
