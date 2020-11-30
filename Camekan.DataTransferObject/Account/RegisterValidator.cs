using FluentValidation;

namespace Camekan.DataTransferObject.Account
{
    public class RegisterValidator:AbstractValidator<RegisterDto>
    {
        public RegisterValidator()
        {
            RuleFor(a => a.DisplayName).NotEmpty();
            RuleFor(a => a.Email).NotEmpty().EmailAddress();
            RuleFor(a => a.Password).NotEmpty();
        }
    }
}
