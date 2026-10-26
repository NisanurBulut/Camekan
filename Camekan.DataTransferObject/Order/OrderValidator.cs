using FluentValidation;

namespace Camekan.DataTransferObject
{
    public class OrderValidator : AbstractValidator<OrderDto>
    {
        public OrderValidator()
        {
            RuleFor(a => a.ShipToAddress).NotNull().SetValidator(new AddressValidator());
        }
    }
}
