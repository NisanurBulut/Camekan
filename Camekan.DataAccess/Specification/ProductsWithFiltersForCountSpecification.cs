using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataAccess.Specification
{
   public class ProductsWithFiltersForCountSpecification:BaseSpecification<ProductEntity>
    {
        public ProductsWithFiltersForCountSpecification(ProductSpecParam productSpecParam)
            : base(x => (!productSpecParam.BrandId.HasValue || x.ProductBrandId== productSpecParam.BrandId) && 
            (!productSpecParam.TypeId.HasValue || x.ProductTypeId== productSpecParam.TypeId))
        {

        }
    }
}
