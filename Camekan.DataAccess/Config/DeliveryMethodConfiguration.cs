using Camekan.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Camekan.DataAccess
{
    public class DeliveryMethodConfiguration : IEntityTypeConfiguration<DeliveryMethodEntity>
    {
        public void Configure(EntityTypeBuilder<DeliveryMethodEntity> builder)
        {
            builder.ToTable("tDeliveryMethod", "dbo");
            builder.Property(s => s.Price).HasColumnType("decimal(18,2)");
        }
    }
}
