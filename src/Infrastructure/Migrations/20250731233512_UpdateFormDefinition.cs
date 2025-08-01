using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFormDefinition : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FieldDefinitions_FormDefinitions_FormDefinitionId",
                table: "FieldDefinitions");

            migrationBuilder.DropIndex(
                name: "IX_FieldDefinitions_FormDefinitionId",
                table: "FieldDefinitions");

            migrationBuilder.AddForeignKey(
                name: "FK_FieldDefinitions_FormDefinitions_Id",
                table: "FieldDefinitions",
                column: "Id",
                principalTable: "FormDefinitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FieldDefinitions_FormDefinitions_Id",
                table: "FieldDefinitions");

            migrationBuilder.CreateIndex(
                name: "IX_FieldDefinitions_FormDefinitionId",
                table: "FieldDefinitions",
                column: "FormDefinitionId");

            migrationBuilder.AddForeignKey(
                name: "FK_FieldDefinitions_FormDefinitions_FormDefinitionId",
                table: "FieldDefinitions",
                column: "FormDefinitionId",
                principalTable: "FormDefinitions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
