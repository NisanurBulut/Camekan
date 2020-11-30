using Camekan.DataAccess;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Camekan.Entities;

namespace Camekan.WebAPI.Extensions
{
    public static class UserManagerExtension
    {
        public static async Task<AppUser> FindUserByClaimsPrincipleWithAddressAsync(this UserManager<AppUser> input, ClaimsPrincipal user)
        {
            var email = user.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            return await input.Users.Include(a => a.Address).SingleOrDefaultAsync(a => a.Email == email);
        }
        public static async Task<AppUser> FindByEmailFromClaimsPrincipalAsync(this UserManager<AppUser> input, ClaimsPrincipal user)
        {
            var email = user.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            return await input.Users.SingleOrDefaultAsync(a => a.Email == email);
        }
    }
}
