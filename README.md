# BookstoreApp

This Project was built using ASP.NET for Backend and ReactJS as Frontend < br / >

A role-based e-commerce management system with JWT authentication (Admin, Staff, Customer). < br / >
Features: < br / >
• Advanced search, filtering, and categorization for books by title, author, ISBN, category, price, and status. < br / >
• Customer purchasing flow with cart management and transaction processing. < br / >
• User, book, and category management with search, filtering, and status control. < br / >
• Order management work¬ows with multiple states and role-based updates. < br / >
• Implemented inventory management with change history and stock updates. < br / >
• Admin and staff dashboards for monitoring orders, inventory, and revenue. < br / >

Backend using ASP.NET with Layered Architecture and Entity Framework Core to interact and make change to Database through DbContext. < br / >
Frontend using ReactJS with TailwindCSS. < br / >

Install: < br / >
• Make sure appsettings.json is configured for SQL Server connection, and CORS allowed Frontend API. < br / >
• In .NET CLI, run these: < br / >
  Create Migration: dotnet ef migrations add “Migration_name” < br / >
  Update Database: dotnet ef database update < br / >
• In Frontend terminal, run "npm install" < br / >
• Make sure Backend API is properly configurated in vite.config.js and services/api.js < br / >
