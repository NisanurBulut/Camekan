namespace Camekan.Entities
{
    // Read-only rows of the SQL views in Camekan.DataAccess/Sql/dashboard_views.sql.
    public class DashboardKpiView
    {
        public int TotalBooks { get; set; }
        public int TotalSales { get; set; }
        public int PublisherCount { get; set; }
        public int CategoryCount { get; set; }
    }

    public class DashboardSalesTrendView
    {
        public string Month { get; set; }
        public int UnitsSold { get; set; }
    }

    public class DashboardCategoryView
    {
        public string Name { get; set; }
        public int BookCount { get; set; }
    }

    public class DashboardTopBookView
    {
        public string Title { get; set; }
        public int UnitsSold { get; set; }
    }

    public class DashboardRecentBookView
    {
        public string Title { get; set; }
        public string AddedAt { get; set; }
    }

    public class DashboardTrendingView
    {
        public string Title { get; set; }
        public double? ChangePercent { get; set; }
    }
}
