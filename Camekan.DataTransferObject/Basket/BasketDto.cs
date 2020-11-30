using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataTransferObject
{
    public class BasketDto
    {
        public string Id { get; set; }
        public List<BasketItemDto> Items { get; set; }
    }
}
