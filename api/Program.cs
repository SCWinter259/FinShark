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

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddUserSecrets<Program>();    // for local development user secrets
// for using secrets from key vault
builder.Configuration.AddAzureKeyVault(
    new Uri("https://finsharkkeyvault.vault.azure.net/"),
    new ManagedIdentityCredential(clientId: "71196bb2-8503-4c0e-a474-db42e924842c"));

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();

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

// NewtonsoftJson is used to serialize objects to Json
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

builder.Services.AddControllers();

// connect to db (SQL Server)
// suppress warning because we just know they are there
// var baseConnectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
var baseConnectionString = builder.Configuration.GetConnectionString("AzureSQLDB")!;
var password = builder.Configuration["DBPassword"]!;    //  Get from User Secrets (dev)
//string password = Environment.GetEnvironmentVariable("DB_PASSWORD"); // Get from environment variable (production)

if (string.IsNullOrEmpty(password))
{
    throw new Exception("Database password is not configured.");
}

var fullConnectionString = $"{baseConnectionString};password={password}";

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(fullConnectionString);
});

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
        ValidIssuer = builder.Configuration["Jwt:Issuer"], // configured in appsettings.json
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey =
            new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(
                    builder.Configuration["Jwt:SigningKey"]!)) // suppress warning because we just know the key is there
    };
});

builder.Services.AddScoped<IStockRepository, StockRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IFMPService, FMPService>();
builder.Services.AddHttpClient<IFMPService, FMPService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// enable cors
app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
    //.WithOrigins() this is for when you deploy
    .SetIsOriginAllowed(origin => true)
);

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run(); // important for production (keeps the application host running)