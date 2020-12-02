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
        private readonly IUnitOfWork _unitOfWork;
      
        private readonly IBasketRepository _basketRepo;

        public OrderService(IUnitOfWork unitOfWork,
            IBasketRepository basketRepo)
        {
           
            this._basketRepo = basketRepo;
            this._unitOfWork = unitOfWork;
        }
        public async Task<OrderEntity> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // get basket from the repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            // get items from product repo
            var items = new List<OrderItemEntity>();
            foreach(var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<ProductEntity>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Name,productItem.Id,productItem.PictureUrl);
                var orderItem = new OrderItemEntity(itemOrdered,productItem.Price,item.Quantity);
                items.Add(orderItem);
            }

            // get delivery method from the repo
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethodEntity>().GetByIdAsync(deliveryMethodId);

            // calculate subtotal
            var subTotal = items.Sum(a => a.Price * a.Quantity);

            // create order
            var order = new OrderEntity(items,buyerEmail,deliveryMethod, shippingAddress, subTotal);
            _unitOfWork.Repository<OrderEntity>().AddAsync(order);

            // save to db
            var result = await _unitOfWork.Complete();
            // return order
            if (result <= 0) return null;
            // delete basket
            await _basketRepo.DeleteBasketAsync(basketId);
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
