using Camekan.DataAccess;
using Camekan.DataAccess.IRepositories;
using Camekan.DataAccess.Repositories;
using Camekan.DataAccess.Services;
using Camekan.DataTransferObject;
using Camekan.Util.Errors;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace Camekan.API.Extensions
{
    public static class StartupServicesExtension
    {
        public static IServiceCollection AddStartupServices(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IDeliveryModethodRepository, DeliveryMethodRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IBasketRepository, BasketRepository>();
            
            services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
           
            services.AddTransient<IValidator<AddressDto>, AddressValidator>();
            services.AddTransient<IValidator<RegisterDto>, RegisterValidator>();
            services.AddTransient<IValidator<BasketDto>, BasketValidator>();
            services.AddTransient<IValidator<BasketItemDto>, BasketItemValidator>();

            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                    .Where(a => a.Value.Errors.Count > 0)
                    .SelectMany(a => a.Value.Errors)
                    .Select(a => a.ErrorMessage).ToArray();
                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };
                    return new BadRequestObjectResult(errorResponse);
                };
            });
           
            return services;
        }
    }
}
