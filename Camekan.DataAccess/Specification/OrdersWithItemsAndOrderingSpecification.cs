using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Camekan.DataAccess.Specification
{
    public class OrdersWithItemsAndOrderingSpecification : BaseSpecification<OrderEntity>
    {
        public OrdersWithItemsAndOrderingSpecification(string email) : base (o => o.BuyerEmail == email)
        {
            AddInclude(a => a.OrderItems);
            AddInclude(a=>a.DeliveryMethod);
            AddOrderByDescending(a=>a.OrderDate);
        }
        public OrdersWithItemsAndOrderingSpecification(int id, string email)
            : base(o => o.Id==id && o.BuyerEmail == email)
        {
            AddInclude(a => a.OrderItems);
            AddInclude(a => a.DeliveryMethod);
        }
    }
}
