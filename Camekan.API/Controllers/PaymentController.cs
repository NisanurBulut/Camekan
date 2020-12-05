using Camekan.DataAccess;
using Camekan.Entities;
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
            return await _paymentService.CreateOrUpdatePaymentIntent(basketId);
        }
    }
}
