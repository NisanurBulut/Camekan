using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Entities
{
   public class Basket
    {
        public Basket()
        {

        }
        public Basket(string id)
        {
            Id = id;
        }
        public string Id { get; set; }
        public List<BasketItem> Items { get; set; } = new List<BasketItem>();
    }
}
