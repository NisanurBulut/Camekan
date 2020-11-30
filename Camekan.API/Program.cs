using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Camekan.DataAccess;
using Camekan.DataAccess.Context;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Camekan.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
                // temporary code blockes
                try
                {
                    var context = services.GetRequiredService<DatabaseContext>();
                    await context.Database.MigrateAsync();
                    await DatabaseContextSeed.SeedAsync(context, loggerFactory);

                    var contextIdentity = services.GetRequiredService<DatabaseContext>();
                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    await contextIdentity.Database.MigrateAsync();
                    await DatabaseIdentityContextSeed.SeedUserAsync(userManager, loggerFactory);
                }
                catch (Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex, "An error occured during migration");
                }
            }
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
