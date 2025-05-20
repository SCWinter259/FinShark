# Notes for .NET on Rider

## Using MS SQL Server

1. Install MS SQL Server

Follow the MS guide [here](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-ubuntu?view=sql-server-ver16&tabs=ubuntu2004) for Ubuntu

If you run into certificate problem, use the following command:

```shell
sqlcmd -S localhost -U sa -P <'Password'> -C
```

The added `-C` will help you skip the certificate.

2. Creating the DB

After that, create a database:

```sql
CREATE DATABASE <databaseName>;
GO
```

When connecting to database in Rider, the connection string is:

```text
Server=tcp:localhost,1433;Database=<DB name>;User ID=sa;Password=<password>;Encrypt=optional;TrustServerCertificate=True;
```

Note that `User ID=sa` because in the step with the certificate you used `sa` as username. If you choose anything else, write that into `User ID`.

3. Connecting your code to the DB

First of all, there is a tool to connect to the database in Rider. Use the connecting string above.

Next, use this command to generate the code that will form tables in you db, based on the models you wrote:

```shell
dotnet ef migrations add <commit name>
```

To actually create the tables (apply the migrations), run:

```shell
dotnet ef database update
```

If you encounter problem with Rider not being able to find .NET try the following:
- Cancel the local terminal and open a new one inside Rider. Rider has its own environment that is easy to be mixed up with the machine's own terminal.
- Try `export DOTNET_ROOT=/home/scwinter/.dotnet` (fill in your own .NET location) if typing `dotnet` in your terminal works but `dotnet ef` does not.

If you encounter error like this:

```text
Your startup project 'api' doesn't reference Microsoft.EntityFrameworkCore.Design. This package is required for the Entity Framework Core Tools to work. Ensure your startup project is correct, install the package, and try again.
```

Then make sure you have all the following packages:
- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Design`
- `Microsoft.EntityFrameworkCore.SqlServer`
- `Microsoft.EntityFrameworkCore.Tools`

## Test accounts

All test users have password the same as email, or with the first letter of email capitalized.

testUser1 token:

```text
eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RVc2VyMUBleGFtcGxlLmNvbSIsImdpdmVuX25hbWUiOiJ0ZXN0VXNlcjEiLCJuYmYiOjE3NDc3MDU3MjMsImV4cCI6MTc0ODMxMDUyMywiaWF0IjoxNzQ3NzA1NzIzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxMzciLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxMzcifQ.PhcG19oe6nAqSzrPMWKkP1GFWuSX9iK3O3fOipv7chFYhc9hc0SytIFIhqVikYv82Hetu7NbaH9nHOs9XBgK2Q
```

## Deleting the database

To list the names of all databases:

```sql
SELECT Name FROM sys.databases;
GO
```

Delete the database:

```sql
DROP DATABASE <databaseName>;
GO
```

## Storing User Secrets

.NET does not have anything equivalent to `.env`. Instead, it uses
***User Secrets*** for development and ***Azure Key Vault*** for deployment.

- [Here](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-9.0&tabs=linux) is the guide for User Secrets
- 