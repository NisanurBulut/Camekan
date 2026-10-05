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
            modelBuilder.ApplyConfiguration(new AppUserConfiguration());
            modelBuilder.ApplyConfiguration(new AddressConfiguration());
            modelBuilder.Entity<DashboardKpiView>().HasNoKey().ToView("vw_dashboard_kpis");
            modelBuilder.Entity<DashboardSalesTrendView>().HasNoKey().ToView("vw_dashboard_sales_trend");
            modelBuilder.Entity<DashboardCategoryView>().HasNoKey().ToView("vw_dashboard_category_distribution");
            modelBuilder.Entity<DashboardTopBookView>().HasNoKey().ToView("vw_dashboard_top_books");
            modelBuilder.Entity<DashboardRecentBookView>().HasNoKey().ToView("vw_dashboard_recent_books");
            modelBuilder.Entity<DashboardTrendingView>().HasNoKey().ToView("vw_dashboard_trending");


            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
        public DbSet<AddressEntity> tAddress { get; set; }
        public DbSet<OrderEntity> tOrder { get; set; }
        public DbSet<OrderItemEntity> tOrderItem { get; set; }
        public DbSet<DeliveryMethodEntity> tDeliveryMethod { get; set; }
        public DbSet<ProductEntity> tProduct { get; set; }
        public DbSet<ProductBrandEntity> tProductBrand { get; set; }
        public DbSet<ProductTypeEntity> tProductType { get; set; }
        public DbSet<DashboardKpiView> DashboardKpis { get; set; }
        public DbSet<DashboardSalesTrendView> DashboardSalesTrend { get; set; }
        public DbSet<DashboardCategoryView> DashboardCategories { get; set; }
        public DbSet<DashboardTopBookView> DashboardTopBooks { get; set; }
        public DbSet<DashboardRecentBookView> DashboardRecentBooks { get; set; }
        public DbSet<DashboardTrendingView> DashboardTrending { get; set; }
    }
}
