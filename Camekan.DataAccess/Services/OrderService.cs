using Camekan.DataAccess.Repositories;
using Camekan.DataTransferObject;
using Camekan.Entities;
using Camekan.DataAccess.Specification;
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
        private readonly IOrderRepository _orderRepo;
        private const int SummaryMonths = 6;

        public OrderService(IUnitOfWork unitOfWork,
            IBasketRepository basketRepo, IPaymentService paymentService, IOrderRepository orderRepo)
        {

            this._basketRepo = basketRepo;
            this._paymentService = paymentService;
            this._unitOfWork = unitOfWork;
            this._orderRepo = orderRepo;
        }
        public async Task<OrderEntity> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, AddressAggregate shippingAddress)
        {
          
            var basket = await _basketRepo.GetBasketAsync(basketId);

            var items = new List<OrderItemEntity>();
            foreach(var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<ProductEntity>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Name,productItem.Id,productItem.PictureUrl);
                var orderItem = new OrderItemEntity(itemOrdered,productItem.Price,item.Quantity);
                items.Add(orderItem);
            }

            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethodEntity>().GetByIdAsync(deliveryMethodId);

            var subTotal = items.Sum(a => a.Price * a.Quantity);
            var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<OrderEntity>().GetEntityWithSpec(spec);

            if (existingOrder != null)
            {
                _unitOfWork.Repository<OrderEntity>().Delete(existingOrder);
                await _paymentService.CreateOrUpdatePaymentIntent(basket.PaymentIntentId);
            }

            var order = new OrderEntity(items,buyerEmail,deliveryMethod, shippingAddress, subTotal, basket.PaymentIntentId);
            _unitOfWork.Repository<OrderEntity>().Add(order);

            var result = await _unitOfWork.Complete();
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

        public async Task<IReadOnlyList<OrderEntity>> GetOrdersForUserPagedAsync(string buyerEmail, OrderSpecParam param)
        {
            return await _orderRepo.ListAsync(new OrdersForUserPagedSpecification(buyerEmail, param));
        }

        public async Task<int> CountOrdersForUserAsync(string buyerEmail)
        {
            return await _orderRepo.CountAsync(new BaseSpecification<OrderEntity>(o => o.BuyerEmail == buyerEmail));
        }

        public async Task<OrderSummaryDto> GetOrderSummaryForUserAsync(string buyerEmail)
        {
            return await _orderRepo.GetSummaryForUserAsync(buyerEmail, SummaryMonths);
        }
    }
}
