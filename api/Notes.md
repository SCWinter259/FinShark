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

After that, create a database like how they do in the guide. When connecting to database in Rider, the connection string is:

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