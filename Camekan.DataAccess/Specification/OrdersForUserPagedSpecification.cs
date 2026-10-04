using Camekan.Entities;

namespace Camekan.DataAccess.Specification
{
    public class OrdersForUserPagedSpecification : BaseSpecification<OrderEntity>
    {
        public OrdersForUserPagedSpecification(string email, OrderSpecParam param)
            : base(o => o.BuyerEmail == email)
        {
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.Id);
            ApplyPaging(param.PageSize * (param.PageIndex - 1), param.PageSize);
        }
    }
}
