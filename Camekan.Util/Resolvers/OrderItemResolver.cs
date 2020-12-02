using AutoMapper;
using Camekan.DataTransferObject;
using Camekan.Entities;
using Microsoft.Extensions.Configuration;

namespace Camekan.Util.Resolvers
{
    public class OrderItemResolver : IValueResolver<OrderItemEntity, OrderItemDto, string>
    {
        private readonly IConfiguration _config;
        public OrderItemResolver(IConfiguration configuration)
        {
            _config = configuration;
        }
        public string Resolve(OrderItemEntity source, OrderItemDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.ItemOrdered.PictureUrl))
            {
                return _config["apiUrl"] + source.ItemOrdered.PictureUrl;
            }
            return null;
        }
    }
}
