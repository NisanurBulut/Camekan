using Camekan.DataAccess.IRepositories;
using Camekan.Entities;
using System;
using System.Threading.Tasks;

namespace Camekan.DataAccess
{
    public interface IUnitOfWork : IDisposable
    {
        IBaseRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        Task<int> Complete();
    }
}
