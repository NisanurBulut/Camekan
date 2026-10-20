using Camekan.DataTransferObject.Basket;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Camekan.DataTransferObject
{
    public class BasketDto
    {
        [Required, RegularExpression(BasketRules.IdPattern)]
        public string Id { get; set; }
        public List<BasketItemDto> Items { get; set; }
        public int? DeliveryMethodId { get; set; }
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }
        public decimal ShippingPrice { get; set; }
    }
}
