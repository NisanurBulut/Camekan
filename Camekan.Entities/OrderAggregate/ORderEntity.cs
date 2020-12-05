﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Entities
{
   public class OrderEntity:BaseEntity
    {
        public OrderEntity()
        {

        }
        public OrderEntity(List<OrderItemEntity> orderItems,string buyerEmail, DeliveryMethodEntity deliveryMethod, AddressAggregate shipToAddress, decimal subTotal)
        {
            OrderItems = orderItems;
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            SubTotal = subTotal;
        }
       
        public string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public AddressAggregate ShipToAddress { get; set; }
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
