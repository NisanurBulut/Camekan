using Camekan.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Camekan.DataAccess.Context
{
    public class DatabaseContext : IdentityDbContext<AppUser>
    {
      
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=../Camekan.DataAccess/Camekan.db;Cache=Shared");
            // IdentityDbContext içerisinde yeniden yorumlanabilmesi için
            base.OnConfiguring(optionsBuilder);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            if (Database.ProviderName == "Microsoft.EntityFrameWork.Sqlite")
            {
                foreach(var entityType in modelBuilder.Model.GetEntityTypes())
                {
                    var decimalProperties = entityType.ClrType.GetProperties().Where(a => a.PropertyType == typeof(decimal));
                    var dateTimeProperties = entityType.ClrType.GetProperties().Where(a => a.PropertyType == typeof(DateTimeOffset));
                    foreach (var property in decimalProperties)
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                    }
                    foreach (var property in dateTimeProperties)
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name)
                            .HasConversion(new DateTimeOffsetToBinaryConverter());
                    }
                }
            }
            modelBuilder.ApplyConfiguration(new DeliveryMethodConfiguration());
            modelBuilder.ApplyConfiguration(new OrderConfiguration());
            modelBuilder.ApplyConfiguration(new OrderItemConfiguration());
            modelBuilder.ApplyConfiguration(new ProductConfiguration());
            //modelBuilder.ApplyConfiguration(new AppUserConfiguration());
            //modelBuilder.ApplyConfiguration(new AddressConfiguration());

            
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
        public DbSet<AddressEntity> tAddress { get; set; }
        public DbSet<OrderEntity> tOrder { get; set; }
        public DbSet<OrderItemEntity> tOrderItem { get; set; }
        public DbSet<DeliveryMethodEntity> tDeliveryMethod { get; set; }
        public DbSet<ProductEntity> tProduct { get; set; }
        public DbSet<ProductBrandEntity> tProductBrand { get; set; }
        public DbSet<ProductTypeEntity> tProductType { get; set; }
    }
}
