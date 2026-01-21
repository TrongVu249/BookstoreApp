using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BookstoreApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class NewSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImageUrl",
                value: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg/960px-The_Great_Gatsby_Cover_1925_Retouched.jpg");

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageUrl",
                value: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/960px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg");

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 3,
                column: "ImageUrl",
                value: "https://cdn.kobo.com/book-images/698a1326-f8b7-4664-8f34-75f6633e816e/1200/1200/False/13xLRb-vHz2DfdgvhkjkHg.jpg");

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 4,
                column: "ImageUrl",
                value: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Sapiens-_A_Brief_History_of_Humankind.png/960px-Sapiens-_A_Brief_History_of_Humankind.png");

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 5,
                column: "ImageUrl",
                value: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg");

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 6,
                column: "ImageUrl",
                value: "https://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg");

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "CategoryId", "CreatedAt", "Description", "ISBN", "ImageUrl", "Language", "PageCount", "Price", "PublishDate", "Publisher", "Status", "StockQuantity", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 7, "Cormac McCarthy", 1, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "A post-apocalyptic journey of a father and son through a devastated world.", "978-0307474278", "https://m.media-amazon.com/images/I/51M7XGLQTBL._AC_UF1000,1000_QL80_.jpg", "English", 287, 16.99m, new DateTime(2006, 9, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), "Vintage", 0, 30, "The Road", null },
                    { 8, "Tara Westover", 2, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "A memoir about growing up without formal education and the pursuit of knowledge.", "978-0812981605", "https://cdn.penguin.co.uk/dam-assets/books/9780099511021/9780099511021-jacket-large.jpg", "English", 352, 18.99m, new DateTime(2018, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Random House", 0, 28, "Educated", null },
                    { 9, "Siddhartha Mukherjee", 3, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "A comprehensive exploration of the history and future of genetic research.", "978-0393354324", "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1452452965i/27276428.jpg", "English", 608, 21.99m, new DateTime(2016, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), "Scribner", 0, 22, "The Gene: An Intimate History", null },
                    { 10, "Andrew Lock", 4, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "A practical guide to building modern web applications with ASP.NET Core.", "978-1617294532", "https://images.manning.com/book/9/37efddf-eba2-42ec-bdca-744dc3de0d1e/Lock-3ed-HI.png", "English", 825, 49.99m, new DateTime(2018, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Manning", 0, 18, "ASP.NET Core in Action", null },
                    { 11, "Michelle Obama", 5, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "An inspiring memoir by the former First Lady of the United States.", "978-1501124020", "https://upload.wikimedia.org/wikipedia/en/0/09/Becoming_%28Michelle_Obama_book%29.jpg", "English", 448, 20.99m, new DateTime(2018, 11, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), "Crown", 0, 35, "Becoming", null },
                    { 12, "George R. R. Martin", 6, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "The first book in the epic fantasy series A Song of Ice and Fire.", "978-0553573404", "https://m.media-amazon.com/images/I/71Jzezm8CBL._AC_UF1000,1000_QL80_.jpg", "English", 694, 17.99m, new DateTime(1996, 8, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), "Bantam", 0, 70, "A Game of Thrones", null },
                    { 13, "Alex Michaelides", 7, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "A psychological thriller about a woman who stops speaking after a tragic event.", "978-0385545969", "https://cdn.waterstones.com/bookjackets/large/9781/4091/9781409181637.jpg", "English", 336, 15.99m, new DateTime(2019, 2, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "Celadon Books", 0, 42, "The Silent Patient", null }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$c0yfTXhEQmQsrOxqmqb4XeoypY9u5Sc1IieQ8UL3vSdrUUrwYUX.i");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "PhoneNumber", "Role", "UpdatedAt", "UserName" },
                values: new object[,]
                {
                    { 14, "Ba Dinh District, Hanoi", new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "minh.nguyen@gmail.com", "Nguyen Minh Quan", true, "$2a$11$K/HrNSGeHKv.i/HPtCLVkeejiSsmypCj5ZANC7RU8JwOFsifQRCj6", "0903123456", 0, null, "minh.nguyen" },
                    { 15, "Warehouse Center, CA", new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "alex.morgan@bookstore.com", "Alex Morgan", true, "$2a$11$xNNVXHUdt0GdZiJx2WhcAOpK6AjnwZw938EMMzY.B5F9YcTVqlz8G", "555-3012", 1, null, "alex.morgan" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImageUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 3,
                column: "ImageUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 4,
                column: "ImageUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 5,
                column: "ImageUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 6,
                column: "ImageUrl",
                value: null);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$0qGSnM5tz71HLfeAF5nlh.lQ2J9xe.RkxzJTJJhJBmF.Z9X6oSr1i");
        }
    }
}
