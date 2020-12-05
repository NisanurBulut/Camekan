using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
namespace Camekan.Entities
{
    public class AddressEntity:BaseEntity
    {
      
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zipcode { get; set; }
        [Required]
       
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}
