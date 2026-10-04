using System.Collections.Generic;
using System.Threading.Tasks;
using Camekan.DataAccess.Specification;
using Camekan.DataTransferObject;
using Camekan.Entities;

namespace Camekan.DataAccess
{
    public interface IOrderService
    {
        Task<OrderEntity> CreateOrderAsync(string buyerEmail, int deliveryMethod, string basketId, AddressAggregate shippingAddress);
        Task<IReadOnlyList<OrderEntity>> GetOrdersForUserAsync(string buyerEmail);
        Task<IReadOnlyList<OrderEntity>> GetOrdersForUserPagedAsync(string buyerEmail, OrderSpecParam param);
        Task<int> CountOrdersForUserAsync(string buyerEmail);
        Task<OrderSummaryDto> GetOrderSummaryForUserAsync(string buyerEmail);
        Task<OrderEntity> GetOrderByIdAsync(int id,string buyerEmail);
        Task<IReadOnlyList<DeliveryMethodEntity>> GetDeliveryMethodsAsync();
    }
}
