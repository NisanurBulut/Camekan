using Camekan.DataAccess;
using Camekan.DataAccess.Context;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
namespace Camekan.WebAPI.Extensions
{
    public static class IdentityServiceExtension
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services)
        {
            var builder = services.AddIdentityCore<AppUser>();
            builder = new IdentityBuilder(builder.UserType,builder.Services);
            builder.AddEntityFrameworkStores<DatabaseContext>();
            builder.AddSignInManager<SignInManager<AppUser>>();
            services.AddAuthentication();
            return services;
        }
    }
}
