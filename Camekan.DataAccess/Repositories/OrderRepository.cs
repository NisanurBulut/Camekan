using Camekan.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;
using Camekan.DataAccess.Context;
using Camekan.DataTransferObject;
using Microsoft.EntityFrameworkCore;

namespace Camekan.DataAccess.Repositories
{
    public class OrderRepository : BaseRepository<OrderEntity>, IOrderRepository
    {
        private readonly DatabaseContext _context;
        public OrderRepository(DatabaseContext context) : base(context)
        {
            _context = context;
        }

        // Failed payments are not counted as spending. Pending ones are, because locally the Stripe
        // webhook usually doesn't run and paid orders stay Pending.
        public async Task<OrderSummaryDto> GetSummaryForUserAsync(string buyerEmail, int months)
        {
            var orders = _context.tOrder.Where(o => o.BuyerEmail == buyerEmail);
            var validOrders = orders.Where(o => o.Status != OrderStatus.PaymentFailed);
            var validItems = validOrders.SelectMany(o => o.OrderItems);

            var count = await orders.CountAsync();
            var pending = await orders.CountAsync(o => o.Status == OrderStatus.Pending);
            var books = await validItems.SumAsync(i => i.Quantity);

            // SQLite cannot SUM decimal columns (DatabaseContext's decimal->double conversion never runs), so money is summed in memory.
            var rows = await validOrders
                .Select(o => new { o.OrderDate, o.SubTotal, Shipping = o.DeliveryMethod != null ? o.DeliveryMethod.Price : 0 })
                .ToListAsync();
            var totals = rows.Select(r => new { r.OrderDate, Total = r.SubTotal + r.Shipping }).ToList();
            var spent = totals.Sum(t => t.Total);

            var firstMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(1 - months);
            var monthly = Enumerable.Range(0, months)
                .Select(i => firstMonth.AddMonths(i))
                .Select(m => new MonthlySpendingDto
                {
                    Year = m.Year,
                    Month = m.Month,
                    Total = totals.Where(t => t.OrderDate.Year == m.Year && t.OrderDate.Month == m.Month).Sum(t => t.Total)
                })
                .ToList();

            var topBooks = await validItems
                .GroupBy(i => new { i.ItemOrdered.ProductItemId, i.ItemOrdered.ProductName, i.ItemOrdered.PictureUrl })
                .Select(g => new TopBookDto
                {
                    ProductId = g.Key.ProductItemId,
                    ProductName = g.Key.ProductName,
                    PictureUrl = g.Key.PictureUrl,
                    Quantity = g.Sum(i => i.Quantity)
                })
                .OrderByDescending(b => b.Quantity)
                .Take(3)
                .ToListAsync();

            return new OrderSummaryDto
            {
                Count = count,
                Pending = pending,
                Spent = spent,
                Books = books,
                Average = totals.Count > 0 ? spent / totals.Count : 0,
                Monthly = monthly,
                TopBooks = topBooks
            };
        }
    }
}
