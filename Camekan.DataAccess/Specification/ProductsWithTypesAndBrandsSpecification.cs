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
        public ProductsWithTypesAndBrandsSpecification(string sort, int? brandId, int? typeId)
            : base(x => (!brandId.HasValue || x.ProductBrandId==brandId) && 
            (!typeId.HasValue || x.ProductTypeId==typeId))
        {
            AddInclude(a => a.ProductBrand);
            AddInclude(a => a.ProductType);
            AddOrderBy(a => a.Name); // default

            if (!string.IsNullOrEmpty(sort))
            {
                switch (sort)
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
