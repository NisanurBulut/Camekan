using Camekan.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Camekan.DataAccess
{
    public class AddressConfiguration : IEntityTypeConfiguration<AddressEntity>
    {
        public void Configure(EntityTypeBuilder<AddressEntity> builder)
        {
          
            builder.HasKey(a => a.Id);
            builder.HasOne(a => a.AppUser).WithOne(a => a.Address).HasForeignKey<AppUser>(a => a.Id);
            // adres=>öğretmen
            // kullanıcı => ders
            // Her adresin bir kullanıcısı mevcuttur lakin her kullanıcısın birden fazla adresi olabilir.
        }
    }
}
