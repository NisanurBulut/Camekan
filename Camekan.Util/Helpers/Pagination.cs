using System.Collections.Generic;

namespace Camekan.Util.Helpers
{
    public class Pagination<T> where T :class
    {
        public Pagination(int index, int size,int count, IReadOnlyList<T> data)
        {
            Index = index;
            Size = size;
            Data = data;
            Count = count;
        }
        public int Index { get; set; }
        public int Size { get; set; }
        public int Count { get; set; }
        public IReadOnlyList<T> Data { get; set; }
    }
}
