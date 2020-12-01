using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Camekan.WebAPI.Extensions
{
    public static class ClaimsPrincipalExtension
    {
        public static string RetrieveEmailFromPrincipal(this ClaimsPrincipal user)
        {
            return user?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        }
    }
}
