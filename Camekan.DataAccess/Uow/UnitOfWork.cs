using Camekan.DataAccess.Context;
using Camekan.DataAccess.IRepositories;
using Camekan.DataAccess.Repositories;
using Camekan.Entities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DatabaseContext _context;
        private Hashtable _repositories;
        public UnitOfWork(DatabaseContext context)
        {
            this._context = context;
        }
        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IBaseRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if (_repositories == null) _repositories = new Hashtable();
            var type = typeof(TEntity);
            if (!_repositories.Contains(type))
            {
                var repositoryType = typeof(BaseRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(type), _context);
                _repositories.Add(type, repositoryInstance);
            }
            return (IBaseRepository<TEntity>)_repositories[type];
        }
    }
}
