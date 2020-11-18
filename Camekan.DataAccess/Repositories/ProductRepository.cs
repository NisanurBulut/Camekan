using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Camekan.DataAccess.Context;
using Microsoft.EntityFrameworkCore;

namespace Camekan.DataAccess.Repositories
{
    public class ProductRepository:BaseRepository<ProductEntity>,IProductRepository
    {
        private readonly DatabaseContext _context;
        public ProductRepository(DatabaseContext context):base(context)
        {
            _context = context;
        }

        public async Task<ProductEntity> GetProductByIdAsync(int id)
        {
            return await _context.tProduct
                .Include(p => p.ProductType)
                .Include(p => p.ProductBrand)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<IReadOnlyList<ProductBrandEntity>> GetProductBrandsAsync()
        {
            return await _context.tProductBrand.ToListAsync();
        }
        public async Task<IReadOnlyList<ProductEntity>> GetProductsAsync()
        {
            return await _context.tProduct
                .Include(p => p.ProductType)
                .Include(p => p.ProductBrand)
                .ToListAsync();
        }
        public async Task<IReadOnlyList<ProductTypeEntity>> GetProductTypesAsync()
        {
            return await _context.tProductType.ToListAsync();
        }
    }
}
