
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using TalentMatch.Api.Data;
using TalentMatch.Api.Services;
using Microsoft.IdentityModel.Tokens;
using System.Text;


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
            builder.Services.AddHttpClient<AiAnalysisService>();

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
