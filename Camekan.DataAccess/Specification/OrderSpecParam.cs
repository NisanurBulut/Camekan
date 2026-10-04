namespace Camekan.DataAccess.Specification
{
    // Paging parameters for the order list
    public class OrderSpecParam
    {
        private const int MaxPageSize = 100;
        public int PageIndex { get; set; } = 1;
        private int _pageSize = 50;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }
    }
}
