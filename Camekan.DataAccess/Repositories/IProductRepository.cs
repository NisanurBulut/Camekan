using Camekan.DataAccess.IRepositories;
using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public interface IProductRepository :IBaseRepository<ProductEntity>
    {
        Task<ProductEntity> GetProductByIdAsync(int id);
        Task<IReadOnlyList<ProductEntity>> GetProductsAsync();
        Task<IReadOnlyList<ProductBrandEntity>> GetProductBrandsAsync();
        Task<IReadOnlyList<ProductTypeEntity>> GetProductTypesAsync();
    }
}
