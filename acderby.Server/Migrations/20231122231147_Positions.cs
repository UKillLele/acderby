using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace acderby.Server.Migrations
{
    /// <inheritdoc />
    public partial class Positions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_People_Teams_TeamId",
                table: "People");

            migrationBuilder.DropForeignKey(
                name: "FK_Position_People_PersonId",
                table: "Position");

            migrationBuilder.DropForeignKey(
                name: "FK_Position_Teams_TeamId",
                table: "Position");

            migrationBuilder.DropIndex(
                name: "IX_People_TeamId",
                table: "People");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Position",
                table: "Position");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "People");

            migrationBuilder.RenameTable(
                name: "Position",
                newName: "Positions");

            migrationBuilder.RenameIndex(
                name: "IX_Position_TeamId",
                table: "Positions",
                newName: "IX_Positions_TeamId");

            migrationBuilder.RenameIndex(
                name: "IX_Position_PersonId",
                table: "Positions",
                newName: "IX_Positions_PersonId");

            migrationBuilder.AlterColumn<Guid>(
                name: "TeamId",
                table: "Positions",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<Guid>(
                name: "PersonId",
                table: "Positions",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Positions",
                table: "Positions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Positions_People_PersonId",
                table: "Positions",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Positions_Teams_TeamId",
                table: "Positions",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Positions_People_PersonId",
                table: "Positions");

            migrationBuilder.DropForeignKey(
                name: "FK_Positions_Teams_TeamId",
                table: "Positions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Positions",
                table: "Positions");

            migrationBuilder.RenameTable(
                name: "Positions",
                newName: "Position");

            migrationBuilder.RenameIndex(
                name: "IX_Positions_TeamId",
                table: "Position",
                newName: "IX_Position_TeamId");

            migrationBuilder.RenameIndex(
                name: "IX_Positions_PersonId",
                table: "Position",
                newName: "IX_Position_PersonId");

            migrationBuilder.AddColumn<Guid>(
                name: "TeamId",
                table: "People",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "TeamId",
                table: "Position",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "PersonId",
                table: "Position",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Position",
                table: "Position",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_People_TeamId",
                table: "People",
                column: "TeamId");

            migrationBuilder.AddForeignKey(
                name: "FK_People_Teams_TeamId",
                table: "People",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Position_People_PersonId",
                table: "Position",
                column: "PersonId",
                principalTable: "People",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Position_Teams_TeamId",
                table: "Position",
                column: "TeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
