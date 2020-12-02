﻿using AutoMapper;
using Camekan.DataTransferObject;
using Camekan.Entities;
using Camekan.Util.Resolvers;

namespace Camekan.Util.Mapping
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<ProductEntity, ProductToReturnDto>()
                .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
                .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<ProductBrandEntity, ProductBrandToReturnDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id));

            CreateMap<ProductTypeEntity, ProductTypeToReturnDto>()
              .ForMember(d => d.Name, o => o.MapFrom(s => s.Name))
              .ForMember(d => d.Id, o => o.MapFrom(s => s.Id));
            
            CreateMap<Address, AddressDto>();
            CreateMap<AddressDto, Address>();

            CreateMap<BasketEntity, BasketDto>();
            CreateMap<BasketDto, BasketEntity>();

            CreateMap<BasketItemEntity, BasketItemDto>();
            CreateMap<BasketItemDto, BasketItemEntity>();

            CreateMap<OrderEntity, OrderDto>();
            CreateMap<OrderDto, OrderEntity>();

            CreateMap<OrderEntity, OrdertoReturnDto>();
            CreateMap<OrdertoReturnDto, OrderEntity>();
        }
    }
}
