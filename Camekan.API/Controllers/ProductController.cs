using AutoMapper;
using Camekan.API.Helpers;
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
using System.Threading;
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

        [Cached(600)]
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<List<ProductBrandToReturnDto>>> GetProductBrands(CancellationToken cancellationToken)
        {
            var list = await _productRepo.GetProductBrandsAsync(cancellationToken);

            return Ok(_mapper.Map<List<ProductBrandToReturnDto>>(list));

        }
        [Cached(600)]
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<List<ProductTypeToReturnDto>>> GetProductTypes(CancellationToken cancellationToken)
        {
            var list = await _productRepo.GetProductTypesAsync(cancellationToken);

            return Ok(_mapper.Map<List<ProductTypeToReturnDto>>(list));

        }
        [Cached(600)]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id, CancellationToken cancellationToken)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            var productEntity = await _productRepo.GetEntityWithSpec(spec, cancellationToken);

            if (productEntity == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<ProductToReturnDto>(productEntity));

        }
        
        [Cached(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery]ProductSpecParam productSpecParam, CancellationToken cancellationToken)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productSpecParam);

            var countSpec = new ProductsWithFiltersForCountSpecification(productSpecParam);

            var totalItems = await _productRepo.CountAsync(countSpec, cancellationToken);

            var productEntities = await _productRepo.ListAsync(spec, cancellationToken);

            var data = _mapper.Map<IReadOnlyList<ProductEntity>, IReadOnlyList<ProductToReturnDto>>(productEntities);

            return Ok(new Pagination<ProductToReturnDto>(productSpecParam.PageIndex, productSpecParam.PageSize,totalItems,data));
        }
    }
}
