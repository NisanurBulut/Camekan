using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Camekan.DataAccess
{
    public class Address
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        [Required]
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}
