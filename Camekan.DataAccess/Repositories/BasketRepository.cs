using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;
using System.Text.Json;

namespace Camekan.DataAccess.Repositories
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;
        public BasketRepository(IConnectionMultiplexer connectionMultiplexer)
        {
            _database = connectionMultiplexer.GetDatabase();
        }
        public async Task<bool> DeleteBasketAsync(string basketId)
        {
            return await _database.KeyDeleteAsync(basketId);
        }

        public async Task<BasketEntity> GetBasketAsync(string basketId)
        {
            var data = await _database.StringGetAsync(basketId);
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<BasketEntity>(data);
        }

        public async Task<BasketEntity> UpdateBasketAsync(BasketEntity basketEntity)
        {
            var created = await _database.StringSetAsync(basketEntity.Id,JsonSerializer.Serialize(basketEntity), TimeSpan.FromDays(30));
            if (!created) return null;
            return await GetBasketAsync(basketEntity.Id);
        }
    }
}
