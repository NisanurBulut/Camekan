using Camekan.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Camekan.DataAccess
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItemEntity>
    {
        public void Configure(EntityTypeBuilder<OrderItemEntity> builder)
        {
            builder.ToTable("tOrderItem", "dbo");
            builder.HasKey(a => a.Id);
            builder.OwnsOne(o => o.ItemOrdered, oi => { oi.WithOwner(); });
            builder.Property(s => s.Price).HasColumnType("decimal(18,2)");
        }
    }
}
