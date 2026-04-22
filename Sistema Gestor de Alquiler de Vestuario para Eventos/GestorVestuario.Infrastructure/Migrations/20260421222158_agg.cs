using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestorVestuario.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class agg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Penalidad",
                table: "Alquileres");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Penalidad",
                table: "Alquileres",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
