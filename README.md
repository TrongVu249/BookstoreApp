<img width="903" height="58" alt="image" src="https://github.com/user-attachments/assets/d119f67a-3f1a-4c68-957e-f8111fb6545c" /># BookstoreApp

This Project was built using ASP.NET for Backend and ReactJS as Frontend

A role-based e-commerce management system with JWT authentication (Admin, Staff, Customer).
Features:
• Advanced search, filtering, and categorization for books by title, author, ISBN, category, price, and status.
• Customer purchasing flow with cart management and transaction processing.
• User, book, and category management with search, filtering, and status control.
• Order management work¬ows with multiple states and role-based updates.
• Implemented inventory management with change history and stock updates.
• Admin and staff dashboards for monitoring orders, inventory, and revenue.

Backend using ASP.NET with Layered Architecture and Entity Framework Core to interact and make change to Database through DbContext.
Frontend using ReactJS with TailwindCSS.

Install:
• Make sure appsettings.json is configured for SQL Server connection, and CORS allowed Frontend API.
• In .NET CLI, run these:
  Create Migration: dotnet ef migrations add “Migration_name”
  Update Database: dotnet ef database update
• In Frontend terminal, run "npm install"
• Make sure Backend API is properly configurated in vite.config.js and services/api.js
