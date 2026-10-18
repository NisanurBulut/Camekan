using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Camekan.Entities;
using System.Threading;

namespace Camekan.WebAPI.Extensions
{
    public static class UserManagerExtension
    {
        public static async Task<AppUser> FindUserByClaimsPrincipleWithAddressAsync(this UserManager<AppUser> input, ClaimsPrincipal user, CancellationToken cancellationToken)
        {
            var email = user.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            // join dene
           var appUser= await input.Users.Include(a => a.Address).Where(a => a.Email == email).FirstOrDefaultAsync(cancellationToken);
            return appUser;
        }
        public static async Task<AppUser> FindByEmailFromClaimsPrincipalAsync(this UserManager<AppUser> input, ClaimsPrincipal user, CancellationToken cancellationToken)
        {
            var email = user.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            return await input.Users.Where(a => a.Email == email).SingleOrDefaultAsync(cancellationToken);
        }
    }
}
