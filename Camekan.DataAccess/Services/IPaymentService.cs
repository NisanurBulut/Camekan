using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Camekan.DataAccess
{
    public interface IPaymentService
    {
        Task<BasketEntity> CreateOrUpdatePaymentIntent(string basketId, CancellationToken cancellationToken);
        Task<OrderEntity> UpdateOrderPaymentSucceeded(string basketId, CancellationToken cancellationToken);
        Task<OrderEntity> UpdateOrderPaymentFailed(string paymentIntentId, CancellationToken cancellationToken);

    }
}
