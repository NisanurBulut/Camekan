using Camekan.DataAccess.Context;
using Camekan.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public class ProductRepository:BaseRepository<ProductEntity>,IProductRepository
    {
        private readonly DatabaseContext _context;
        public ProductRepository(DatabaseContext context):base(context)
        {
            _context = context;
        }

        public async Task<ProductEntity> GetProductByIdAsync(int id, CancellationToken cancellationToken)
        {
            return await _context.tProduct
                .Include(p => p.ProductType)
                .Include(p => p.ProductBrand)
                .Where(p => p.Id == id).
                FirstOrDefaultAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<ProductBrandEntity>> GetProductBrandsAsync(CancellationToken cancellationToken)
        {
            return await _context.tProductBrand.ToListAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<ProductEntity>> GetProductsAsync(CancellationToken cancellationToken)
        {
            return await _context.tProduct
                .Include(p => p.ProductType)
                .Include(p => p.ProductBrand)
                .ToListAsync(cancellationToken);
        }
        public async Task<IReadOnlyList<ProductTypeEntity>> GetProductTypesAsync(CancellationToken cancellationToken)
        {
            return await _context.tProductType.ToListAsync(cancellationToken);
        }
    }
}
