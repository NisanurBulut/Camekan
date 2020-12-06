using Camekan.DataAccess;
using Camekan.Entities;
using Camekan.Util.Errors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Camekan.WebAPI.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
   
    public class PaymentController : BaseApiController
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            this._paymentService = paymentService;
        }

        [Route("[action]")]
        [HttpPost]
        public async Task<ActionResult<BasketEntity>> CreateOrUpdatePaymentIntent(string basketId)
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

            if (basket == null) return BadRequest(new ApiResponse(400,"Sepet bilgilerine erişilemedi"));

            return basket;
        }
    }
}
