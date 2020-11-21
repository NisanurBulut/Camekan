using AutoMapper;
using Camekan.DataAccess.Repositories;
using Camekan.DataAccess.Specification;
using Camekan.DataTransferObject;
using Camekan.Entities;
using Camekan.Util.Errors;
using Camekan.WebAPI.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Camekan.API.Controllers
{
    public class ProductController : BaseApiController
    {
        private readonly IProductRepository _productRepo;
        private readonly IMapper _mapper;
        public ProductController(IProductRepository productsRepo, IMapper mapper)
        {           
            _productRepo = productsRepo;
            _mapper = mapper;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            var productEntity = await _productRepo.GetEntityWithSpec(spec);

            if (productEntity == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<ProductToReturnDto>(productEntity));
            
        }
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetProducts(string sort)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(sort);
            var productEntities = await _productRepo.ListAsync(spec);
            return Ok(_mapper.Map<IReadOnlyList<ProductEntity>, IReadOnlyList<ProductToReturnDto>>(productEntities));
        }
    }
}
