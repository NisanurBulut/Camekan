using Camekan.API.Extensions;
using Camekan.API.Helpers;
using Camekan.DataAccess.Context;
using Camekan.Entities;
using Camekan.Util.Mapping;
using Camekan.Util.Middleware;
using Camekan.WebAPI.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace Camekan.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers(options => options.Filters.Add<ValidationFilter>());
            builder.Services.AddAutoMapper(cfg => { }, typeof(MappingProfiles));
            builder.Services.AddDbContext<DatabaseContext>();
            builder.Services.AddStartupServices();
            builder.Services.AddIdentityServices(builder.Configuration);

            builder.Services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var config = ConfigurationOptions.Parse(builder.Configuration.GetConnectionString("Redis"), true);
                return ConnectionMultiplexer.Connect(config);
            });
            builder.Services.AddApiDocumentationExtension();
            builder.Services.AddCors(option =>
            {
                option.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200", "https://localhost:4200");
                });
            });



            var app = builder.Build();

            app.UseMiddleware<ExceptionMiddleware>();
            app.UseStatusCodePagesWithReExecute("/errors/{0}");
            app.UseStaticFiles();
            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseApiDocumentation();
            app.MapControllers();


            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
           
                try
                {
                    var contextIdentity = services.GetRequiredService<DatabaseContext>();
                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    await contextIdentity.Database.MigrateAsync();
                    await DatabaseIdentityContextSeed.SeedUserAsync(userManager, loggerFactory);

                    var context = services.GetRequiredService<DatabaseContext>();
                    await context.Database.MigrateAsync();
                    await DatabaseContextSeed.SeedAsync(context, loggerFactory);

                }
                catch (Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex, "An error occured during migration");
                }
            }
           
            app.Run();
        }
    }
}
