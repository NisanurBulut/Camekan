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
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParam productSpecParam)
            : base(x => (!productSpecParam.BrandId.HasValue || x.ProductBrandId== productSpecParam.BrandId) && 
            (!productSpecParam.TypeId.HasValue || x.ProductTypeId== productSpecParam.TypeId))
        {
            AddInclude(a => a.ProductBrand);
            AddInclude(a => a.ProductType);
            AddOrderBy(a => a.Name); // default
            ApplyPaging(productSpecParam.PageSize*(productSpecParam.PageIndex-1), productSpecParam.PageSize);
            if (!string.IsNullOrEmpty(productSpecParam.Sort))
            {
                switch (productSpecParam.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(a => a.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(a => a.Price);
                        break;
                    default:
                        AddOrderBy(a => a.Name); // default
                        break;
                }
            }
        }
    }
}
