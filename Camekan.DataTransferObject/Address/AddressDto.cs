using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataTransferObject
{
    public class AddressDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
