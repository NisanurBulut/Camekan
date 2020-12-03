using Camekan.Entities;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Linq;
using System.Reflection;

namespace Camekan.DataAccess.Context
{
    public class DatabaseContextSeed
    {
        public static async Task SeedAsync(DatabaseContext context,ILoggerFactory loggerFactory)
        {
            try
            {
                #region PRODUCT
                if (!context.tProductBrand.Any())
                {
                    var brandDatas = File.ReadAllText("../Camekan.DataAccess/SeedData/brands.json");
                    var brands = JsonSerializer.Deserialize<List<ProductBrandEntity>>(brandDatas);
                    context.tProductBrand.AddRange(brands);
                    await context.SaveChangesAsync();

                    var productTypeDatas = File.ReadAllText("../Camekan.DataAccess/SeedData/types.json");
                    var productTypes = JsonSerializer.Deserialize<List<ProductTypeEntity>>(productTypeDatas);
                    context.tProductType.AddRange(productTypes);
                    await context.SaveChangesAsync();

                    var productDatas = File.ReadAllText("../Camekan.DataAccess/SeedData/products.json");
                    var products = JsonSerializer.Deserialize<List<ProductEntity>>(productDatas);
                    context.tProduct.AddRange(products);
                    await context.SaveChangesAsync();

                }
                #endregion
                #region ORDER-DELIVERY
                if (!context.tDeliveryMethod.Any())
                {
                    var dmData = File.ReadAllText("../Camekan.DataAccess/SeedData/delivery.json");
                    var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethodEntity>>(dmData);
                    context.tDeliveryMethod.AddRange(deliveryMethods);
                    await context.SaveChangesAsync();
                }
                #endregion
            }
            catch (Exception ex)
            {
                var logger = loggerFactory.CreateLogger<DatabaseContextSeed>();
                logger.LogError(ex, "An error occured during seeding data");
            }
        }
    }
}
