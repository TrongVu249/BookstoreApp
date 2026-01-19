using BookstoreApp.Server.Models; 
using Microsoft.EntityFrameworkCore;

namespace BookstoreApp.Server.Data
{
    public class BookstoreDbContext: DbContext
    {
        public BookstoreDbContext(DbContextOptions<BookstoreDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<WishlistItem> WishlistItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<InventoryLog> InventoryLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Unique indexes
                entity.HasIndex(e => e.Email)
                      .IsUnique()
                      .HasDatabaseName("IX_Users_Email");

                entity.HasIndex(e => e.UserName)
                      .IsUnique()
                      .HasDatabaseName("IX_Users_UserName");

                // Property configurations
                entity.Property(e => e.Role)
                      .HasConversion<int>();
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => e.Name)
                      .HasDatabaseName("IX_Categories_Name");
            });

            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Unique index on ISBN
                entity.HasIndex(e => e.ISBN)
                      .IsUnique()
                      .HasDatabaseName("IX_Books_ISBN");

                // Index on CategoryId for performance
                entity.HasIndex(e => e.CategoryId)
                      .HasDatabaseName("IX_Books_CategoryId");

                // Index on Status for filtering
                entity.HasIndex(e => e.Status)
                      .HasDatabaseName("IX_Books_Status");

                // Decimal precision
                entity.Property(e => e.Price)
                      .HasColumnType("decimal(18,2)");

                // Enum conversion
                entity.Property(e => e.Status)
                      .HasConversion<int>();

                // Relationship: Book -> Category (Many-to-One)
                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Books)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .HasConstraintName("FK_Books_Categories");
            });

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Composite unique index (user can't have same book twice in cart)
                entity.HasIndex(e => new { e.UserId, e.BookId })
                      .IsUnique()
                      .HasDatabaseName("IX_CartItems_UserId_BookId");

                // Relationship: CartItem -> User
                entity.HasOne(e => e.User)
                      .WithMany(u => u.CartItems)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("FK_CartItems_Users");

                // Relationship: CartItem -> Book
                entity.HasOne(e => e.Book)
                      .WithMany(b => b.CartItems)
                      .HasForeignKey(e => e.BookId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("FK_CartItems_Books");
            });

            modelBuilder.Entity<WishlistItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Composite unique index
                entity.HasIndex(e => new { e.UserId, e.BookId })
                      .IsUnique()
                      .HasDatabaseName("IX_WishlistItems_UserId_BookId");

                // Relationship: WishlistItem -> User
                entity.HasOne(e => e.User)
                      .WithMany(u => u.WishlistItems)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("FK_WishlistItems_Users");

                // Relationship: WishlistItem -> Book
                entity.HasOne(e => e.Book)
                      .WithMany(b => b.WishlistItems)
                      .HasForeignKey(e => e.BookId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("FK_WishlistItems_Books");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Unique index on OrderNumber
                entity.HasIndex(e => e.OrderNumber)
                      .IsUnique()
                      .HasDatabaseName("IX_Orders_OrderNumber");

                // Index on UserId for performance
                entity.HasIndex(e => e.UserId)
                      .HasDatabaseName("IX_Orders_UserId");

                // Index on OrderDate for reporting
                entity.HasIndex(e => e.OrderDate)
                      .HasDatabaseName("IX_Orders_OrderDate");

                // Index on Status for filtering
                entity.HasIndex(e => e.Status)
                      .HasDatabaseName("IX_Orders_Status");

                // Decimal precision
                entity.Property(e => e.TotalAmount)
                      .HasColumnType("decimal(18,2)");

                // Enum conversion
                entity.Property(e => e.Status)
                      .HasConversion<int>();

                // Relationship: Order -> User (Many-to-One)
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .HasConstraintName("FK_Orders_Users");

                // Relationship: Order -> Payment (One-to-One)
                entity.HasOne(e => e.Payment)
                      .WithOne(p => p.Order)
                      .HasForeignKey<Payment>(p => p.OrderId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("FK_Order_Payment");
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Index on OrderId for performance
                entity.HasIndex(e => e.OrderId)
                      .HasDatabaseName("IX_OrderItems_OrderId");

                // Decimal precision
                entity.Property(e => e.PriceAtOrder)
                      .HasColumnType("decimal(18,2)");

                // Relationship: OrderItem -> Order (Many-to-One)
                entity.HasOne(e => e.Order)
                      .WithMany(o => o.OrderItems)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("FK_OrderItems_Orders");

                // Relationship: OrderItem -> Book (Many-to-One)
                entity.HasOne(e => e.Book)
                      .WithMany(b => b.OrderItems)
                      .HasForeignKey(e => e.BookId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .HasConstraintName("FK_OrderItems_Books");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Index on OrderId for performance
                entity.HasIndex(e => e.OrderId)
                      .HasDatabaseName("IX_Payments_OrderId");

                // Index on Status for filtering
                entity.HasIndex(e => e.Status)
                      .HasDatabaseName("IX_Payments_Status");

                // Decimal precision
                entity.Property(e => e.Amount)
                      .HasColumnType("decimal(18,2)");

                // Enum conversion
                entity.Property(e => e.Status)
                      .HasConversion<int>();
            });

            modelBuilder.Entity<InventoryLog>(entity =>
            {
                entity.HasKey(e => e.Id);

                // Index on BookId for performance
                entity.HasIndex(e => e.BookId)
                      .HasDatabaseName("IX_InventoryLogs_BookId");

                // Index on UserId for audit tracking
                entity.HasIndex(e => e.UserId)
                      .HasDatabaseName("IX_InventoryLogs_UserId");

                // Index on LoggedAt for reporting
                entity.HasIndex(e => e.LoggedAt)
                      .HasDatabaseName("IX_InventoryLogs_LoggedAt");

                // Relationship: InventoryLog -> User (Many-to-One)
                entity.HasOne(e => e.User)
                      .WithMany(u => u.InventoryLogs)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .HasConstraintName("FK_InventoryLogs_Users");

                // Relationship: InventoryLog -> Book (Many-to-One)
                entity.HasOne(e => e.Book)
                      .WithMany(b => b.InventoryLogs)
                      .HasForeignKey(e => e.BookId)
                      .OnDelete(DeleteBehavior.Restrict)
                      .HasConstraintName("FK_InventoryLogs_Books");
            });

            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Categories
            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    Id = 1,
                    Name = "Fiction",
                    Description = "Fiction novels and stories",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Category
                {
                    Id = 2,
                    Name = "Non-Fiction",
                    Description = "Real-world topics and information",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Category
                {
                    Id = 3,
                    Name = "Science",
                    Description = "Scientific books and research",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Category
                {
                    Id = 4,
                    Name = "Technology",
                    Description = "Technology and programming books",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Category
                {
                    Id = 5,
                    Name = "Biography",
                    Description = "Life stories and biographies",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Category
                {
                    Id = 6,
                    Name = "Fantasy",
                    Description = "Fantasy and magical worlds",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Category
                {
                    Id = 7,
                    Name = "Mystery",
                    Description = "Mystery and thriller books",
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed Admin User (Username: admin, Password: Admin@123)
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    UserName = "admin",
                    Email = "admin@bookstore.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    FullName = "System Administrator",
                    PhoneNumber = "555-0001",
                    Address = "123 Admin Street, System City",
                    Role = UserRole.Admin,
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 14,
                    UserName = "minh.nguyen",
                    Email = "minh.nguyen@gmail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
                    FullName = "Nguyen Minh Quan",
                    PhoneNumber = "0903123456",
                    Address = "Ba Dinh District, Hanoi",
                    Role = UserRole.Customer,
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 15,
                    UserName = "alex.morgan",
                    Email = "alex.morgan@bookstore.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
                    FullName = "Alex Morgan",
                    PhoneNumber = "555-3012",
                    Address = "Warehouse Center, CA",
                    Role = UserRole.Staff,
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 1, 2, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed Sample Books
            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    ISBN = "978-0743273565",
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Description = "A classic American novel set in the Jazz Age, exploring themes of decadence, idealism, and social upheaval.",
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg/960px-The_Great_Gatsby_Cover_1925_Retouched.jpg",
                    Price = 15.99m,
                    StockQuantity = 50,
                    Publisher = "Scribner",
                    PublishDate = new DateTime(1925, 4, 10),
                    PageCount = 180,
                    Language = "English",
                    CategoryId = 1,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 2,
                    ISBN = "978-0061120084",
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Description = "A gripping tale of racial injustice and childhood innocence in the American South.",
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/960px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
                    Price = 18.99m,
                    StockQuantity = 35,
                    Publisher = "Harper Perennial",
                    PublishDate = new DateTime(1960, 7, 11),
                    PageCount = 324,
                    Language = "English",
                    CategoryId = 1,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 3,
                    ISBN = "978-0451524935",
                    Title = "1984",
                    Author = "George Orwell",
                    Description = "A dystopian masterpiece about surveillance, propaganda, and totalitarianism.",
                    ImageUrl = "https://cdn.kobo.com/book-images/698a1326-f8b7-4664-8f34-75f6633e816e/1200/1200/False/13xLRb-vHz2DfdgvhkjkHg.jpg",
                    Price = 14.99m,
                    StockQuantity = 60,
                    Publisher = "Signet Classic",
                    PublishDate = new DateTime(1949, 6, 8),
                    PageCount = 328,
                    Language = "English",
                    CategoryId = 1,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 4,
                    ISBN = "978-0062316097",
                    Title = "Sapiens: A Brief History of Humankind",
                    Author = "Yuval Noah Harari",
                    Description = "An exploration of how Homo sapiens came to dominate the world.",
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Sapiens-_A_Brief_History_of_Humankind.png/960px-Sapiens-_A_Brief_History_of_Humankind.png",
                    Price = 24.99m,
                    StockQuantity = 40,
                    Publisher = "Harper",
                    PublishDate = new DateTime(2015, 2, 10),
                    PageCount = 443,
                    Language = "English",
                    CategoryId = 2,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 5,
                    ISBN = "978-0132350884",
                    Title = "Clean Code: A Handbook of Agile Software Craftsmanship",
                    Author = "Robert C. Martin",
                    Description = "A guide to writing clean, maintainable code that works.",
                    ImageUrl = "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
                    Price = 44.99m,
                    StockQuantity = 25,
                    Publisher = "Prentice Hall",
                    PublishDate = new DateTime(2008, 8, 1),
                    PageCount = 464,
                    Language = "English",
                    CategoryId = 4,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 6,
                    ISBN = "978-0439708180",
                    Title = "Harry Potter and the Sorcerer's Stone",
                    Author = "J.K. Rowling",
                    Description = "The first book in the beloved Harry Potter series about a young wizard's adventures.",
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg",
                    Price = 12.99m,
                    StockQuantity = 100,
                    Publisher = "Scholastic",
                    PublishDate = new DateTime(1998, 9, 1),
                    PageCount = 309,
                    Language = "English",
                    CategoryId = 6,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 7,
                    ISBN = "978-0307474278",
                    Title = "The Road",
                    Author = "Cormac McCarthy",
                    Description = "A post-apocalyptic journey of a father and son through a devastated world.",
                    ImageUrl = "https://m.media-amazon.com/images/I/51M7XGLQTBL._AC_UF1000,1000_QL80_.jpg",
                    Price = 16.99m,
                    StockQuantity = 30,
                    Publisher = "Vintage",
                    PublishDate = new DateTime(2006, 9, 26),
                    PageCount = 287,
                    Language = "English",
                    CategoryId = 1,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 8,
                    ISBN = "978-0812981605",
                    Title = "Educated",
                    Author = "Tara Westover",
                    Description = "A memoir about growing up without formal education and the pursuit of knowledge.",
                    ImageUrl = "https://cdn.penguin.co.uk/dam-assets/books/9780099511021/9780099511021-jacket-large.jpg",
                    Price = 18.99m,
                    StockQuantity = 28,
                    Publisher = "Random House",
                    PublishDate = new DateTime(2018, 2, 20),
                    PageCount = 352,
                    Language = "English",
                    CategoryId = 2,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 9,
                    ISBN = "978-0393354324",
                    Title = "The Gene: An Intimate History",
                    Author = "Siddhartha Mukherjee",
                    Description = "A comprehensive exploration of the history and future of genetic research.",
                    ImageUrl = "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1452452965i/27276428.jpg",
                    Price = 21.99m,
                    StockQuantity = 22,
                    Publisher = "Scribner",
                    PublishDate = new DateTime(2016, 5, 17),
                    PageCount = 608,
                    Language = "English",
                    CategoryId = 3,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 10,
                    ISBN = "978-1617294532",
                    Title = "ASP.NET Core in Action",
                    Author = "Andrew Lock",
                    Description = "A practical guide to building modern web applications with ASP.NET Core.",
                    ImageUrl = "https://images.manning.com/book/9/37efddf-eba2-42ec-bdca-744dc3de0d1e/Lock-3ed-HI.png",
                    Price = 49.99m,
                    StockQuantity = 18,
                    Publisher = "Manning",
                    PublishDate = new DateTime(2018, 8, 1),
                    PageCount = 825,
                    Language = "English",
                    CategoryId = 4,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 11,
                    ISBN = "978-1501124020",
                    Title = "Becoming",
                    Author = "Michelle Obama",
                    Description = "An inspiring memoir by the former First Lady of the United States.",
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/0/09/Becoming_%28Michelle_Obama_book%29.jpg",
                    Price = 20.99m,
                    StockQuantity = 35,
                    Publisher = "Crown",
                    PublishDate = new DateTime(2018, 11, 13),
                    PageCount = 448,
                    Language = "English",
                    CategoryId = 5,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 12,
                    ISBN = "978-0553573404",
                    Title = "A Game of Thrones",
                    Author = "George R. R. Martin",
                    Description = "The first book in the epic fantasy series A Song of Ice and Fire.",
                    ImageUrl = "https://m.media-amazon.com/images/I/71Jzezm8CBL._AC_UF1000,1000_QL80_.jpg",
                    Price = 17.99m,
                    StockQuantity = 70,
                    Publisher = "Bantam",
                    PublishDate = new DateTime(1996, 8, 6),
                    PageCount = 694,
                    Language = "English",
                    CategoryId = 6,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                },
                new Book
                {
                    Id = 13,
                    ISBN = "978-0385545969",
                    Title = "The Silent Patient",
                    Author = "Alex Michaelides",
                    Description = "A psychological thriller about a woman who stops speaking after a tragic event.",
                    ImageUrl = "https://cdn.waterstones.com/bookjackets/large/9781/4091/9781409181637.jpg",
                    Price = 15.99m,
                    StockQuantity = 42,
                    Publisher = "Celadon Books",
                    PublishDate = new DateTime(2019, 2, 5),
                    PageCount = 336,
                    Language = "English",
                    CategoryId = 7,
                    Status = BookStatus.Available,
                    CreatedAt = new DateTime(2024, 1, 3, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
