using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalentMatch.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAnalysisResultTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AnalysisResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SkillsScore = table.Column<int>(type: "int", nullable: false),
                    TechStackScore = table.Column<int>(type: "int", nullable: false),
                    ProjectsScore = table.Column<int>(type: "int", nullable: false),
                    ExperienceScore = table.Column<int>(type: "int", nullable: false),
                    OverallScore = table.Column<int>(type: "int", nullable: false),
                    FinalPercentage = table.Column<double>(type: "float", nullable: false),
                    AiResponse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResumeText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobDescription = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalysisResults", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnalysisResults");
        }
    }
}
