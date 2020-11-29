using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public class BasketRepository : IBasketRepository
    {
        public Task<bool> DeleteBasketAsync(string basketId)
        {
            throw new NotImplementedException();
        }

        public Task<BasketEntity> GetBasketAsync(string basketId)
        {
            throw new NotImplementedException();
        }

        public Task<BasketEntity> UpdateBasketAsync(BasketEntity basketEntity)
        {
            throw new NotImplementedException();
        }
    }
}
