using AutoMapper;
using Camekan.DataAccess.Repositories;
using Camekan.DataAccess.Specification;
using Camekan.DataTransferObject;
using Camekan.Entities;
using Camekan.Util.Errors;
using Camekan.Util.Helpers;
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
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<List<ProductBrandToReturnDto>>> GetProductBrands()
        {
            var list = await _productRepo.GetProductBrandsAsync();

            return Ok(_mapper.Map<List<ProductBrandToReturnDto>>(list));

        }
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<List<ProductTypeToReturnDto>>> GetProductTypes()
        {
            var list = await _productRepo.GetProductTypesAsync();

            return Ok(_mapper.Map<List<ProductTypeToReturnDto>>(list));

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
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery]ProductSpecParam productSpecParam)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productSpecParam);

            var countSpec = new ProductsWithFiltersForCountSpecification(productSpecParam);

            var totalItems = await _productRepo.CountAsync(countSpec);

            var productEntities = await _productRepo.ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<ProductEntity>, IReadOnlyList<ProductToReturnDto>>(productEntities);

            return Ok(new Pagination<ProductToReturnDto>(productSpecParam.PageIndex, productSpecParam.PageSize,totalItems,data));
        }
    }
}
