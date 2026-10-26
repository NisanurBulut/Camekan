using Camekan.Util.Errors;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Threading.Tasks;

namespace Camekan.API.Helpers
{
    // Runs before every action: validates each argument that has a registered IValidator<T>.
    public class ValidationFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            foreach (var argument in context.ActionArguments.Values)
            {
                if (argument == null) continue;

                var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
                if (context.HttpContext.RequestServices.GetService(validatorType) is not IValidator validator) continue;

                var result = await validator.ValidateAsync(new ValidationContext<object>(argument));
                if (!result.IsValid)
                {
                    // Same body as a model state error, so the client reads both the same way.
                    context.Result = new BadRequestObjectResult(new ApiValidationErrorResponse
                    {
                        Errors = result.Errors.Select(e => e.ErrorMessage)
                    });
                    return;
                }
            }

            await next();
        }
    }
}
