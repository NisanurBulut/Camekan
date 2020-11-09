using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Camekan.DataAccess.Repositories;
using Camekan.DataAccess.Specification;
using Camekan.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Camekan.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
      //  private readonly ProductRepository _productRepo;
      //  public ProductController(ProductRepository productRepo)
      //  {
      //      _productRepo = productRepo;
      //  }
      //public async Task<IActionResult<List<ProductEntity>>> GetProducts()
      //  {
      //      var spec = new ProductsWithTypesAndBrandsSpecification();
      //      var products = await _productRepo.gete
      //  }
    }
}
