using Camekan.API.Helpers;
using Camekan.DataAccess.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace Camekan.WebAPI.Controllers
{
    public class DashboardController : BaseApiController
    {
        private readonly DatabaseContext _context;
        public DashboardController(DatabaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Cached(300)]
        public async Task<ActionResult> GetDashboard()
        {
            var kpis = await _context.DashboardKpis.SingleAsync();
            return Ok(new
            {
                Kpis = new
                {
                    kpis.TotalBooks,
                    kpis.TotalSales,
                    Authors = kpis.PublisherCount,
                    Categories = kpis.CategoryCount
                },
                SalesTrend = await _context.DashboardSalesTrend.OrderBy(m => m.Month)
                    .Select(m => new { m.Month, Total = m.UnitsSold }).ToListAsync(),
                Categories = await _context.DashboardCategories.OrderByDescending(c => c.BookCount)
                    .Select(c => new { c.Name, Count = c.BookCount }).ToListAsync(),
                TopBooks = await _context.DashboardTopBooks.OrderByDescending(b => b.UnitsSold)
                    .Select(b => new { b.Title, Sales = b.UnitsSold }).ToListAsync(),
                RecentBooks = await _context.DashboardRecentBooks.ToListAsync(),
                Trending = await _context.DashboardTrending
                    .Select(b => new { b.Title, Change = b.ChangePercent }).ToListAsync()
            });
        }
    }
}
