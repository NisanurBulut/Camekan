using System.Collections.Generic;
using System.Threading.Tasks;
using Camekan.Entities;

namespace Camekan.DataAccess
{
    public interface IOrderService
    {
        Task<OrderEntity> CreateOrderAsync(string buyerEmail, int deliveryMethod, string basketId, Address shippingAddress);
        Task<IReadOnlyList<OrderEntity>> GetOrdersForUserAsync(string buyerEmail);
        Task<OrderEntity> GetOrderByIdAsync(int id,string buyerEmail);
        Task<IReadOnlyList<DeliveryMethodEntity>> GetDeliveryMethodsAsync();
    }
}
