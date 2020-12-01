using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Entities
{
    public class ProductItemOrdered
    {
        public ProductItemOrdered()
        {

        }
        public ProductItemOrdered(string productName, int productItemId, string pictureUrl)
        {
            ProductName = productName;
            ProductItemId = productItemId;
            PictureUrl = pictureUrl;
        }

        public string ProductName { get; set; }
        public int ProductItemId { get; set; }
        public string PictureUrl { get; set; }
    }
}
