using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalentMatch.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingskills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MissingSkills",
                table: "AnalysisResults",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MissingSkills",
                table: "AnalysisResults");
        }
    }
}
