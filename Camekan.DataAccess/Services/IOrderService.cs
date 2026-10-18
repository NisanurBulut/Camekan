using Camekan.DataAccess.Specification;
using Camekan.DataTransferObject;
using Camekan.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Camekan.DataAccess
{
    public interface IOrderService
    {
        Task<OrderEntity> CreateOrderAsync(string buyerEmail, int deliveryMethod, string basketId, AddressAggregate shippingAddress);
        Task<IReadOnlyList<OrderEntity>> GetOrdersForUserAsync(string buyerEmail, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<OrderEntity>> GetOrdersForUserPagedAsync(string buyerEmail, OrderSpecParam param, CancellationToken cancellationToken = default);
        Task<int> CountOrdersForUserAsync(string buyerEmail, CancellationToken cancellationToken = default);
        Task<OrderSummaryDto> GetOrderSummaryForUserAsync(string buyerEmail, CancellationToken cancellationToken = default);
        Task<OrderEntity> GetOrderByIdAsync(int id,string buyerEmail, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<DeliveryMethodEntity>> GetDeliveryMethodsAsync(CancellationToken cancellationToken = default);
    }
}
