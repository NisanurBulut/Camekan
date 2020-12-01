using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Entities
{
    public class OrderItemEntity : BaseEntity
    {
        public OrderItemEntity()
        {

        }
        public OrderItemEntity(ProductItemOrdered ıtemOrdered, int quantity, decimal price)
        {
            ItemOrdered = ıtemOrdered;
            Quantity = quantity;
            Price = price;
        }
        public ProductItemOrdered ItemOrdered { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
