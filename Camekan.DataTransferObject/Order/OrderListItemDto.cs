using System;

namespace Camekan.DataTransferObject
{
    public class OrderListItemDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; }
    }
}
