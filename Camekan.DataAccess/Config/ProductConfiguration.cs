using Camekan.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataAccess.Config
{
    public class ProductConfiguration : IEntityTypeConfiguration<ProductEntity>
    {
        public void Configure(EntityTypeBuilder<ProductEntity> builder)
        {
            builder.ToTable("tProduct", "dbo");
            builder.HasKey(a => a.Id);
            builder.Property(a => a.Id).IsRequired();
            builder.Property(a => a.Name).IsRequired().HasMaxLength(100);
            builder.Property(a => a.Description).IsRequired().HasMaxLength(200);
            builder.Property(a => a.Price).IsRequired().HasColumnType("decimal(18,2)");
            builder.Property(a => a.PictureUrl).IsRequired();
            builder.HasOne(a => a.ProductBrand).WithMany().HasForeignKey(a => a.ProductBrandId);
            builder.HasOne(a => a.ProductType).WithMany().HasForeignKey(a => a.ProductTypeId);
        }
    }
}
