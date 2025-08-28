using BankingSystem.DBContext;
using BankingSystem.Enums; // If your enum is in a separate folder
using BankingSystem.Interfaces;
using BankingSystem.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;


namespace BankingSystem
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Step 1: Create builder object for configuring the application
            var builder = WebApplication.CreateBuilder(args);

            // Step 2: Register DB context and configure SQL Server connection
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

            // Step 3: Read JWT settings from appsettings.json
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");

            // Step 4: Register JWT Authentication service
            builder.Services.AddAuthentication(options =>
            {
                // Set JWT as the default scheme for authentication
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                // Configure how incoming tokens will be validated
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true, // Validate the token's Issuer
                    ValidateAudience = true, // Validate the token's Audience
                    ValidateLifetime = true, // Ensure token is not expired
                    ValidateIssuerSigningKey = true, // Validate the signature/key
                    ValidIssuer = jwtSettings["Issuer"], // Expected Issuer
                    ValidAudience = jwtSettings["Audience"], // Expected Audience
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtSettings["Key"])) // Secret key used to sign the JWT
                };
            });

            // Step 5: Add Authorization service (for [Authorize] attribute)
            builder.Services.AddAuthorization();

            // Step 6: Register the User Repository (Interface -> Implementation)
            builder.Services.AddScoped<IUserAccountRespositry, UserAccountRepository>();

            // Step 7: Register business logic services
            builder.Services.AddScoped<UserService>();

            builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();

            // Step 8: Add support for MVC Controllers
            builder.Services.AddControllers();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                               .AllowAnyHeader()
                               .AllowAnyMethod();
                    });
            });

            // Step 9: Add Swagger (API documentation + testing tool)
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "BankingSystem API", Version = "v1" });

                // JWT Bearer Token in Swagger UI
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' followed by your JWT token.\n\nExample: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });

                // Enum as string in Swagger UI
                c.MapType<TransactionCategory>(() => new OpenApiSchema
                {
                    Type = "string",
                    Enum = Enum.GetNames(typeof(TransactionCategory))
                        .Select(name => new OpenApiString(name))
                        .Cast<IOpenApiAny>()
                        .ToList()
                });
            });


            // Step 10: Build the WebApplication instance
            var app = builder.Build();

            // Step 11: Enable Swagger only in development
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger(); // generates Swagger JSON
                app.UseSwaggerUI(); // shows the Swagger UI
            }

            // Step 12: Enable HTTPS redirection (redirects HTTP → HTTPS)
            app.UseHttpsRedirection(); //ensures only HTTPS is used
           
            app.UseCors("AllowAll");

            // Step 13: Enable Authentication Middleware
            // Validates JWT tokens sent with requests
            app.UseAuthentication(); //checks if the user provided a token

            // Step 14: Enable Authorization Middleware
            // Enforces [Authorize] on protected endpoints
            app.UseAuthorization(); //checks if the user has permission (like [Authorize])

            // Step 15: Map incoming HTTP requests to controller endpoints
            app.MapControllers();


            // Step 16: Start the application
            app.Run();
        }
    }
}
/* Summary of Flow:
User logs in -> gets JWT token
Token is included in Authorization: Bearer <token> header in future requests
Middleware (UseAuthentication + UseAuthorization) handles:
token verification
user identity extraction
enforcing access control via [Authorize] */

/* Authentication = Who are you?
Authorization = What can you do?
*/