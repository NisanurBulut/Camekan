using Camekan.DataAccess.IRepositories;
using Camekan.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public interface IProductRepository :IBaseRepository<ProductEntity>
    {
        Task<ProductEntity> GetProductByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<ProductEntity>> GetProductsAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<ProductBrandEntity>> GetProductBrandsAsync(CancellationToken cancellationToken = default);
        Task<IReadOnlyList<ProductTypeEntity>> GetProductTypesAsync(CancellationToken cancellationToken = default);
    }
}
