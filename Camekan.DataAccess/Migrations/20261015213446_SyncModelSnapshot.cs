using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Camekan.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SyncModelSnapshot : Migration
    {
        // Empty on purpose: the database already matches the model.
        // This migration only refreshes the model snapshot (it was made by EF Core 3.1).
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
