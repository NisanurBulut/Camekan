using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public interface IBasketRepository
    {
        Task<BasketEntity> GetBasketAsync(string basketId);
        Task<BasketEntity> UpdateBasketAsync(BasketEntity basketEntity);
        Task<bool> DeleteBasketAsync(string basketId);
    }
}
