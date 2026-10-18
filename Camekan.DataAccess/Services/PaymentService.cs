using Camekan.DataAccess.Repositories;
using Camekan.DataAccess.Specification;
using Camekan.Entities;
using Microsoft.Extensions.Configuration;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public PaymentService(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            this._basketRepository = basketRepository;
            this._unitOfWork = unitOfWork;
            this._configuration = configuration;
        }

        public async Task<BasketEntity> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = this._configuration["StripeSettings:SecretKey"];
            var basket = await _basketRepository.GetBasketAsync(basketId);

            if (basket == null) return null;

            var shippingPrice = 0m;

            if (basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _unitOfWork.Repository<DeliveryMethodEntity>().GetByIdAsync((int)basket.DeliveryMethodId, CancellationToken.None);
                shippingPrice = deliveryMethod.Price;
            }
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<ProductEntity>().GetByIdAsync(item.Id, CancellationToken.None);
                if (productItem.Price != item.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var service = new PaymentIntentService();
            PaymentIntent paymentIntent;
            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = CalculateAmount(basket, shippingPrice),
                    Currency = "TRY",
                    AllowedPaymentMethodTypes = new List<string>() { "card" }
                };
                paymentIntent = await service.CreateAsync(options);
                basket.PaymentIntentId = paymentIntent.Id;
                basket.ClientSecret = paymentIntent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = CalculateAmount(basket, shippingPrice)
                };
                await service.UpdateAsync( basket.PaymentIntentId, options);         
            }
            await _basketRepository.UpdateBasketAsync(basket);
            return basket;
        }

        public Task<OrderEntity> UpdateOrderPaymentFailed(string paymentIntentId)
        {
            return SetOrderStatus(paymentIntentId, OrderStatus.PaymentFailed);
        }

        public Task<OrderEntity> UpdateOrderPaymentSucceeded(string paymentIntentId)
        {
            return SetOrderStatus(paymentIntentId, OrderStatus.PaymentReceived);
        }

        private async Task<OrderEntity> SetOrderStatus(string paymentIntentId, OrderStatus status)
        {
            var spec = new OrderByPaymentIntentIdSpecification(paymentIntentId);
            var order = await _unitOfWork.Repository<OrderEntity>().GetEntityWithSpec(spec, CancellationToken.None);
            if (order == null) return null;
            order.Status = status;
            _unitOfWork.Repository<OrderEntity>().Update(order);
            await _unitOfWork.Complete();
            return order;
        }

        // Stripe wants the smallest currency unit (kuruş). Round once, do not cut each part.
        private static long CalculateAmount(BasketEntity basket, decimal shippingPrice)
        {
            var total = basket.Items.Sum(a => a.Quantity * a.Price) + shippingPrice;
            return (long)Math.Round(total * 100, MidpointRounding.AwayFromZero);
        }
    }
}
