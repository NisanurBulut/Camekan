using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Camekan.Entities
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        [NotMapped]
        public Address Address { get; set; }
    }
}
