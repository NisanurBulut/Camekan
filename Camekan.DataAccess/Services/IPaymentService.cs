using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess
{
    public interface IPaymentService
    {
        Task<BasketEntity> CreateOrUpdatePaymentIntent(string basketId);
        Task<OrderEntity> UpdateOrderPaymentSucceeded(string basketId);
        Task<OrderEntity> UpdateOrderPaymentFailed(string paymentIntentId);

    }
}
