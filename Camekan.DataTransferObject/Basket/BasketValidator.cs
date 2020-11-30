using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataTransferObject
{
    public class BasketValidator:AbstractValidator<BasketDto>
    {
        public BasketValidator()
        {
            RuleFor(a => a.Id).NotEmpty();
        }
    }
}
