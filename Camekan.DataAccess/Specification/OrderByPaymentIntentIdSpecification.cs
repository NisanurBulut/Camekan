using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Camekan.DataAccess.Specification
{
    public class OrderByPaymentIntentIdSpecification : BaseSpecification<OrderEntity>
    {
        public OrderByPaymentIntentIdSpecification
            (string paymentId) : base(o => o.PaymentIntentId == paymentId)
        {
        }
    }
}
