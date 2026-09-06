using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalentMatch.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddGuestUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop table if it exists in a broken state before recreating
            migrationBuilder.Sql(@"
                IF OBJECT_ID('dbo.GuestUsers', 'U') IS NOT NULL
                    DROP TABLE [GuestUsers];
            ");

            migrationBuilder.CreateTable(
                name: "GuestUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    UsageCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUsedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuestUsers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GuestUsers_Email",
                table: "GuestUsers",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop index explicitly only if it exists — avoids error if table was manually modified
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_GuestUsers_Email' AND object_id = OBJECT_ID('GuestUsers'))
                    DROP INDEX [IX_GuestUsers_Email] ON [GuestUsers];
            ");

            migrationBuilder.Sql(@"
                IF OBJECT_ID('dbo.GuestUsers', 'U') IS NOT NULL
                    DROP TABLE [GuestUsers];
            ");
        }
    }
}
