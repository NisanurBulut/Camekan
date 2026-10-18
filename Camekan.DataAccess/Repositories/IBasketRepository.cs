using Camekan.Entities;
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
