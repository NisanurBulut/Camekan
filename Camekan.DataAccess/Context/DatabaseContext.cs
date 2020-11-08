using Camekan.Entities.Product;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataAccess.Context
{
    public class DatabaseContext : DbContext
    {

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=../Camekan.DataAccess/Camekan.db;Cache=Shared");
            // IdentityDbContext içerisinde yeniden yorumlanabilmesi için
            base.OnConfiguring(optionsBuilder);
        }
        public DbSet<ProductEntity> tProduct { get; set; }
    }
}
