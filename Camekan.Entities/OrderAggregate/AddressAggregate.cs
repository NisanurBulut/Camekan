using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Entities
{
    public class AddressAggregate
    {
        public AddressAggregate()
        {

        }
        public AddressAggregate(string firstName, string lastName, string city, string street, string state, string zipCode)
        {
            FirstName = firstName;
            LastName = lastName;
            City = city;
            Street = street;
            State = state;
            ZipCode = zipCode;
        }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
    }
}
