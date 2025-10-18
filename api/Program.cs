using api.Data;
using api.Interfaces;
using api.Models;
using api.Repository;
using api.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Azure.Identity;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Logging.AzureAppServices;

var builder = WebApplication.CreateBuilder(args);

// add logging for azure
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddAzureWebAppDiagnostics();

builder.Services.Configure<AzureFileLoggerOptions>(options =>
{
    options.FileName = "azure-diagnostic-";
    options.FileSizeLimit = 50 * 1024; // 50KB
    options.RetainedFileCountLimit = 5;
});

builder.Services.Configure<AzureBlobLoggerOptions>(options =>
{
    options.BlobName = "log.txt";
});

builder.Logging
    .AddFilter("Microsoft", LogLevel.Warning)
    .AddFilter("System", LogLevel.Warning);

var logger = LoggerFactory
    .Create(logging => logging.AddConsole())
    .CreateLogger("Program");

// 1. Add configuration (Key Vault)
if (builder.Environment.IsDevelopment())
{
    // for local development user secrets
    builder.Configuration.AddUserSecrets<Program>();
}
else
{
    // for using secrets from key vault
    builder.Configuration.AddAzureKeyVault(
        new Uri("https://finsharkkeyvault.vault.azure.net/"),
        new ManagedIdentityCredential(clientId: "71196bb2-8503-4c0e-a474-db42e924842c"));
}

// for testing if azure took the key from key vault correctly
var testSecret = builder.Configuration["JWT:SigningKey"];
if (string.IsNullOrEmpty(testSecret))
{
    logger.LogInformation("JWT:SigningKey is missing or null");
}
else
{
    logger.LogInformation("JWT:SigningKey loaded from Key Vault: " + testSecret);
}

// 2. Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// generates swagger doc at [host]/swagger
builder.Services.AddSwaggerGen(option =>
{
    // these added options will add JWT to swagger so that we can test our auth
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
    option.AddSecurityDefinition("Bearer",  new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            []
        }
    });
});

logger.LogInformation("Added Swagger UI");

// NewtonsoftJson is used to serialize objects to Json
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

logger.LogInformation("Added Newtonsoft");

// 3. DB Connection
// suppress warning because we just know they are there
string? baseConnectionString;

if (builder.Environment.IsDevelopment())
{
    baseConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")!; 
}
else
{
    baseConnectionString = builder.Configuration.GetConnectionString("AzureSQLDB");
    if (baseConnectionString == null)
    {
        logger.LogCritical("AzureSQLDB connection string is NULL!");
        throw new InvalidOperationException("Connection string not found!");
    }
    logger.LogInformation("AzureSQLDB connection string loaded from Key Vault");
}

var password = builder.Configuration["DBPassword"];    //  Get from User Secrets (dev) or Azure Key Vault (Prod)
if (string.IsNullOrEmpty(password))
{
    logger.LogCritical("DBPassword string is NULL!");
    throw new Exception("Database password is not configured.");
}
logger.LogInformation("DBPassword loaded from Key Vault");
var fullConnectionString = $"{baseConnectionString};Password={password}";

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(fullConnectionString);
});

// 4. Register Identity and JWT Auth
// Authentication set up in our db
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;
}).AddEntityFrameworkStores<ApplicationDBContext>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        options.DefaultChallengeScheme =
            options.DefaultForbidScheme =
                options.DefaultScheme =
                    options.DefaultSignInScheme =
                        options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"], // configured in appsettings.json
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey =
            new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(
                    builder.Configuration["JWT:SigningKey"]!)) // suppress warning because the key should be there if we reached this step
    };
});

builder.Services.AddScoped<ITokenService, TokenService>();

// 5. CORS Setup
var allowedOrigins = new[] {
    "https://fin-shark.vercel.app", // Your deployed frontend
    "http://localhost:5173"         // Optional: for local development
};

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // only if using cookies/auth
    });
});

// 6. Build the app
var app = builder.Build();
// for auto migrate on Azure
if (builder.Environment.IsProduction())
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        logger.LogInformation($"DB Migration failed: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(); // Use default policy

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run(); // important for production (keeps the application host running)