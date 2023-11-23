using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace acderby.Server.Migrations
{
    /// <inheritdoc />
    public partial class TeamDefaultSkaterImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DefaultSkaterImage",
                table: "Teams",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultSkaterImage",
                table: "Teams");
        }
    }
}
