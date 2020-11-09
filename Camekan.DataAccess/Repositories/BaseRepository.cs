﻿using Camekan.DataAccess.Context;
using Camekan.DataAccess.IRepositories;
using Camekan.DataAccess.Specification;
using Camekan.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : BaseEntity
    {
        private readonly DatabaseContext _dbContext;
        public BaseRepository(DatabaseContext dbContext)
        {
            dbContext = new DatabaseContext();
        }
        public async Task<T> GetByIdAsync(int id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }


        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
            return await _dbContext.Set<T>()
                .ToListAsync();
        }
        public async Task<T> GetEntityWithSpec(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).ToListAsync();
        }
        private IQueryable<T> ApplySpecification(ISpecification<T> spec)
        {
            return SpecificationEvaluater<T>.GetQuery(_dbContext.Set<T>().AsQueryable(), spec);
        }
    }
}
