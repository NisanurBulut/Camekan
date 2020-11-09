using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess.IRepositories
{
    public interface IBaseRepository<T> where T : BaseEntity
    {
       Task<T> GetByIdAsync(int id);
       Task<IReadOnlyList<T>> ListAllAsync();
    }
}
