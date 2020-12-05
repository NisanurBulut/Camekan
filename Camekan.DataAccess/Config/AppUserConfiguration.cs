using Camekan.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Camekan.DataAccess
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.HasOne(a => a.Address).WithOne(a => a.AppUser).HasForeignKey<AddressEntity>(a => a.AppUserId);
        }
    }
}
