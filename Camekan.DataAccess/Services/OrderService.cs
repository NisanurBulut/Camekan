using Camekan.DataAccess.IRepositories;
using Camekan.DataAccess.Repositories;
using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;
        private readonly IDeliveryModethodRepository _deliveryRepo;
        private readonly IBasketRepository _basketRepo;

        public OrderService(IOrderRepository orderRepo, 
            IProductRepository productRepo, 
            IDeliveryModethodRepository deliveryRepo,
            IBasketRepository basketRepo)
        {
            this._orderRepo = orderRepo;
            this._productRepo = productRepo;
            this._deliveryRepo = deliveryRepo;
            this._basketRepo = basketRepo;
        }
        public async Task<OrderEntity> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // get basket from the repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // get items from product repo
            var items = new List<OrderItemEntity>();
            foreach(var item in basket.Items)
            {
                var productItem = await _productRepo.GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Name,productItem.Id,productItem.PictureUrl);
                var orderItem = new OrderItemEntity(itemOrdered,productItem.Price,item.Quantity);
                items.Add(orderItem);
            }

            // get delivery method from the repo
            var deliveryMethod = await _deliveryRepo.GetByIdAsync(deliveryMethodId);

            // calculate subtotal
            var subTotal = items.Sum(a => a.Price * a.Quantity);

            // create order
            var order = new OrderEntity(items,buyerEmail,deliveryMethod, shippingAddress, subTotal);
            // save to db

            // return order
            return order;
        }

        public Task<IReadOnlyList<DeliveryMethodEntity>> GetDeliveryMethodsAsync()
        {
            throw new NotImplementedException();
        }

        public Task<OrderEntity> GetOrderByIdAsync(int id, string buyerEmail)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<OrderEntity>> GetOrdersForUserAsync(string buyerEmail)
        {
            throw new NotImplementedException();
        }
    }
}
