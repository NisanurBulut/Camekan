using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public class ProductRepository : IProductRepository
    {
        public Task<ProductEntity> GetProductByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<ProductEntity>> GetProductsAsync()
        {
            throw new NotImplementedException();
        }
    }
}
