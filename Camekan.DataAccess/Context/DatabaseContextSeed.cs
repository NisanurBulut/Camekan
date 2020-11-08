using Camekan.Entities;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
namespace Camekan.DataAccess.Context
{
    public class DatabaseContextSeed
    {
        public static async Task SeedAsync(DatabaseContext context,ILoggerFactory loggerFactory)
        {
            try
            {
                if (!context.tProductBrand.Any())
                {
                    var brandDatas = File.ReadAllText("");
                    var brands = JsonSerializer.Deserialize<List<ProductBrandEntity>>(brandDatas);
                    context.tProductBrand.AddRange(brands);
                    await context.SaveChangesAsync();

                    var productDatas = File.ReadAllText("");
                    var products = JsonSerializer.Deserialize<List<ProductEntity>>(productDatas);
                    context.tProduct.AddRange(products);
                    await context.SaveChangesAsync();

                    var productTypeDatas = File.ReadAllText("");
                    var productTypes = JsonSerializer.Deserialize<List<ProductTypeEntity>>(productTypeDatas);
                    context.tProductType.AddRange(productTypes);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<DatabaseContextSeed>();
                logger.LogError(ex, "An error occured during seeding data");
            }
        }
    }
}
