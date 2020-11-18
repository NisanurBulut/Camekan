using AutoMapper;
using Camekan.DataTransferObject;
using Camekan.Entities;

namespace Camekan.Util.Mapping
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<ProductEntity,ProductToReturnDto>();
        }
    }
}
