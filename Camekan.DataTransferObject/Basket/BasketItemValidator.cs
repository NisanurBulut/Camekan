using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataTransferObject
{
    public class BasketItemValidator:AbstractValidator<BasketItemDto>
    {
        public BasketItemValidator()
        {
            RuleFor(a => a.Id).NotEmpty();
            RuleFor(a => a.Price).NotEmpty();
            RuleFor(a => a.Brand).NotEmpty();
            RuleFor(a => a.Type).NotEmpty();
            RuleFor(a => a.Quantity).NotEmpty();
            RuleFor(a=>a.Quantity).InclusiveBetween(1,int.MaxValue);
            RuleFor(a => a.Price).InclusiveBetween(1, Decimal.MaxValue);
        }
    }
}
