using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataTransferObject
{
    public class OrderDto
    {
        public string BasketId { get; set; }
        public int DeliveryMethodId { get; set; }
        public AddressDto ShipToAddress { get; set; }
    }
}
