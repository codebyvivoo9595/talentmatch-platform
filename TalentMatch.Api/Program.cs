
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http.Headers;
using System.Text;
using TalentMatch.Api.Data;
using TalentMatch.Api.Models;
using TalentMatch.Api.Services;


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
                        ValidateIssuer = true,
                        ValidateAudience = true,
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

            //app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
