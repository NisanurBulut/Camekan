using Camekan.DataAccess.IRepositories;
using Camekan.DataTransferObject;
using Camekan.Entities;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public interface IOrderRepository :IBaseRepository<OrderEntity>
    {
        Task<OrderSummaryDto> GetSummaryForUserAsync(string buyerEmail, int months);
    }
}
