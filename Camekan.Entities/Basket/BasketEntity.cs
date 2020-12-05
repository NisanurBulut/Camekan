using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Entities
{
   public class BasketEntity
    {
        public BasketEntity()
        {

        }
        public BasketEntity(string id)
        {
            Id = id;
        }
        public string Id { get; set; }
        public List<BasketItemEntity> Items { get; set; } = new List<BasketItemEntity>();
        public int? DeliveryMethodId { get; set; }
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }
    }
}
