
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http.Headers;
using System.Text;
using TalentMatch.Api.Data;
using TalentMatch.Api.Models;
using TalentMatch.Api.Services;
using Microsoft.OpenApi.Models;


namespace TalentMatch.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            //JWT Token Service for generating tokens on login and registration
            builder.Services.AddScoped<JwtTokenService>();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    var jwt = builder.Configuration.GetSection("Jwt");
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwt["Issuer"],
                        ValidAudience = jwt["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwt["Key"]!)
                        )
                    };
                });

            builder.Services.AddAuthorization();

            //Configure HttpClient for AiAnalysisService to include Hugging Face API key in the Authorization header for all requests made by this service. This allows the service to authenticate with the Hugging Face API when calling it to analyze resumes against job descriptions.
            //builder.Services.AddHttpClient<AiAnalysisService>(client =>
            //{
            //    client.DefaultRequestHeaders.Authorization =
            //        new AuthenticationHeaderValue("Bearer", "YOUR_HUGGINGFACE_API_KEY");
            //});

            builder.Services.Configure<AISettings>(
            builder.Configuration.GetSection("AISettings")
            );

            builder.Services.AddHttpClient<AiAnalysisService>(client =>
            {
                client.Timeout = TimeSpan.FromSeconds(60);
            });

            //Added swagger token recieve option.
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "TalentMatch API",
                    Version = "v1"
                });

                // JWT Authentication configuration for JWT Token addition here
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT token like: Bearer {your token}"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
                }
            });
            });


            //Addd DbContext with SQL Server connection string from appsettings.json
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
            builder.Configuration.GetConnectionString("TalentMatchDbConnection")));

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            //Added services for resume parsing, AI analysis, and score calculation. Also added HttpClient for AI analysis service to call external APIs.
            builder.Services.AddScoped<ResumeParserService>();
            builder.Services.AddScoped<AiAnalysisService>();
            builder.Services.AddScoped<ScoreCalculationService>();
            builder.Services.AddScoped<SuggestionService>();
            builder.Services.AddScoped<SkillGapService>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
