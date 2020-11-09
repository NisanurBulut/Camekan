using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataAccess.Specification
{
    public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<ProductEntity>
    {
        public ProductsWithTypesAndBrandsSpecification(int id) : base(x => x.Id == id)
        {
            AddInclude(a => a.ProductBrand);
            AddInclude(a => a.ProductType);
        }
        public ProductsWithTypesAndBrandsSpecification()
        {
            AddInclude(a => a.ProductBrand);
            AddInclude(a => a.ProductType);
        }
    }
}
