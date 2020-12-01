using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Entities
{
   public class OrderEntity
    {
        public OrderEntity()
        {

        }
        public OrderEntity(string buyerEmail, Address shipToAddress, DeliveryMethodEntity deliveryMethod, decimal subTotal)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            SubTotal = subTotal;
        }
        public int Id { get; set; }
        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public Address ShipToAddress { get; set; }
        public DeliveryMethodEntity DeliveryMethod { get; set; }
        public IReadOnlyList<OrderItemEntity> OrderItems { get; set; }
        public decimal SubTotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string PaymentIntentId { get; set; }
        public decimal GetTotal()
        {
            return SubTotal + DeliveryMethod.Price;
        }
    }
}
