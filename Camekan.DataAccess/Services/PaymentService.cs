using Camekan.DataAccess.Repositories;
using Camekan.Entities;
using Microsoft.Extensions.Configuration;
using Stripe;
using System.Collections.Generic;
using System.Linq;
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
            StripeConfiguration.ApiKey = this._configuration["StripeSettings:ApiKey"];
            var basket = await _basketRepository.GetBasketAsync(basketId);
            var shippingPrice = 0m;

            if (basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await _unitOfWork.Repository<DeliveryMethodEntity>().GetByIdAsync((int)basket.DeliveryMethodId);
                shippingPrice = deliveryMethod.Price;
            }
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<ProductEntity>().GetByIdAsync(item.Id);
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
                    Amount = (long)basket.Items.Sum(a => a.Quantity * (a.Price * 100)) + (long)shippingPrice * 100,
                    Currency = "TRY",
                    PaymentMethodTypes = new List<string>() { "card" }
                };
                paymentIntent = await service.CreateAsync(options);
                basket.PaymentIntentId = paymentIntent.Id;
                basket.ClientSecret = paymentIntent.ClientSecret;
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)basket.Items.Sum(a => a.Quantity * (a.Price * 100)) + (long)shippingPrice * 100
                };
                await service.UpdateAsync( basket.PaymentIntentId, options);         
            }
            await _basketRepository.UpdateBasketAsync(basket);
            return basket;
        }
    }
}
