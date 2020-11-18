using Camekan.DataTransferObject;
using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using AutoMapper;

namespace Camekan.Util.Resolvers
{
    public class ProductUrlResolver : IValueResolver<ProductEntity, ProductToReturnDto, string>
    {
        private readonly IConfiguration _config;
        public ProductUrlResolver(IConfiguration config)
        {
            _config = config;
        }
        public string Resolve(ProductEntity source, ProductToReturnDto destination, string destMember, ResolutionContext context)
        {
            if(!string.IsNullOrEmpty(source.PictureUrl))
            {
                return _config["apiUrl"] + source.PictureUrl;
            }
            return null;
        }
    }
}
