using System.Collections.Generic;

namespace Camekan.DataTransferObject
{
    public class OrderSummaryDto
    {
        public int Count { get; set; }
        public int Pending { get; set; }
        public decimal Spent { get; set; }
        public int Books { get; set; }
        public decimal Average { get; set; }
        public IReadOnlyList<MonthlySpendingDto> Monthly { get; set; }
        public IReadOnlyList<TopBookDto> TopBooks { get; set; }
    }

    public class MonthlySpendingDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Total { get; set; }
    }

    public class TopBookDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
        public int Quantity { get; set; }
    }
}
