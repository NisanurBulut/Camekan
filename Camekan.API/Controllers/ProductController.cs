using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Camekan.DataAccess.IRepositories;
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
        private readonly IProductRepository _productRepo;
        public ProductController(IProductRepository productsRepo)
        {           
            _productRepo = productsRepo;
        }

    }
}
