using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.DataTransferObject
{
   public class AddressValidator: AbstractValidator<AddressDto>
    {
        public AddressValidator()
        {
            RuleFor(a => a.FirstName).NotEmpty();
            RuleFor(a => a.LastName).NotEmpty();
            RuleFor(a => a.Street).NotEmpty();
            RuleFor(a => a.State).NotEmpty();
            RuleFor(a => a.ZipCode).NotEmpty();
            RuleFor(a => a.City).NotEmpty();
        }
    }
}
