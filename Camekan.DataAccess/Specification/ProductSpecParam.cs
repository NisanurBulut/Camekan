using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataAccess.Specification
{
    public class ProductSpecParam
    {
        private const int MaxPageSize = 50;
        public int PageIndex { get; set; } = 1;
        private int _pageSize = 6;
        public int PageSize { get => _pageSize; 
                              set => _pageSize = (value > MaxPageSize ? MaxPageSize : value); }
        private string _search;
        public string Search
        {
            get => _search;
            set => _search = value.ToLower();
        }
        public string Sort { get; set; }
        public int? BrandId { get; set; }
        public int? TypeId { get; set; }
    }
}
