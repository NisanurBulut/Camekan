using Camekan.DataAccess.Repositories;
using Camekan.Entities;
using Camekan.DataAccess.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Camekan.DataAccess
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
      
        private readonly IBasketRepository _basketRepo;
        private readonly IPaymentService _paymentService;

        public OrderService(IUnitOfWork unitOfWork,
            IBasketRepository basketRepo, IPaymentService paymentService)
        {
           
            this._basketRepo = basketRepo;
            this._paymentService = paymentService;
            this._unitOfWork = unitOfWork;
        }
        public async Task<OrderEntity> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, AddressAggregate shippingAddress)
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

            // check to see if order is exists
            var spec = new OrderByPaymentIntentIdWithItemsSpecification(basket.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<OrderEntity>().GetEntityWithSpec(spec);

            if (existingOrder != null)
            {
                _unitOfWork.Repository<OrderEntity>().DeleteAsync(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(basket.PaymentIntentId);
            }

            // create order
            var order = new OrderEntity(items,buyerEmail,deliveryMethod, shippingAddress, subTotal, basket.PaymentIntentId);
            _unitOfWork.Repository<OrderEntity>().AddAsync(order);

            // save to db
            var result = await _unitOfWork.Complete();
            
            // return order
            if (result <= 0) return null;
            
          
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethodEntity>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethodEntity>().ListAllAsync();
        }

        public async Task<OrderEntity> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id,buyerEmail);
            return await _unitOfWork.Repository<OrderEntity>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<OrderEntity>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<OrderEntity>().ListAsync(spec);
        }
    }
}
