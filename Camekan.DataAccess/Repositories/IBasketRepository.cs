using Camekan.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public interface IBasketRepository
    {
        Task<BasketEntity> GetBasketAsync(string basketId, CancellationToken cancellationToken = default);
        Task<BasketEntity> UpdateBasketAsync(BasketEntity basketEntity, CancellationToken cancellationToken = default);
        Task<bool> DeleteBasketAsync(string basketId, CancellationToken cancellationToken = default);
    }
}
