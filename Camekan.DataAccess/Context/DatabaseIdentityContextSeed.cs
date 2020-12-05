using Camekan.Entities;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Identity;

namespace Camekan.DataAccess.Context
{
    public class DatabaseIdentityContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager,ILoggerFactory loggerFactory)
        {
            try
            {
                
                if (!userManager.Users.Any())
                {
                    var user = new AppUser
                    {
                        DisplayName="Nisanur",
                        Email="nisanurbulut@gmail.com",
                        UserName="nisanurrunasin",
                        Address=new AddressEntity
                        {
                            FirstName="Nisanur",
                            LastName="Bulut",
                            City="Eskişehir",
                            State="ESES",
                            Street="Adalar",
                            Zipcode="2600"
                        }
                    };
                    await userManager.CreateAsync(user, "1");
                   
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<DatabaseContextSeed>();
                logger.LogError(ex, "An error occured during seeding data");
            }
        }
    }
}
