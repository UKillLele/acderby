using acderby.Server.Models;

namespace acderby.Server.ViewModels
{
    public class TeamViewModel(Team team)
    {
        public Guid Id { get; set; } = team.Id;
        public string Slug { get; set; } = team.Slug;
        public string Name { get; set; } = team.Name;
        public string Description { get; set; } = team.Description;
        public List<TeamPositionViewModel> Positions { get; set; } = team.Positions.Select(x => new TeamPositionViewModel(x)).ToList();
        public Uri? ImageUrl { get; set; } = team.ImageUrl;
        public Uri LogoUrl { get; set; } = team.LogoUrl;
        public string Color { get; set; } = team.Color;
        public int? SeasonWins { get; set; } = team.SeasonWins;
        public int? SeasonLosses { get; set; } = team.SeasonLosses;
        public int? Ranking { get; set; } = team.Ranking;
    }
}
