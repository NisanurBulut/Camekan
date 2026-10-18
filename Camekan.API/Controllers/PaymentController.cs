using Camekan.DataAccess;
using Camekan.Entities;
using Camekan.Util.Errors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Camekan.WebAPI.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
   
    public class PaymentController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger;
        private readonly IConfiguration _configuration;

        public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger, IConfiguration configuration)
        {
            this._logger = logger;
            this._paymentService = paymentService;
            this._configuration = configuration;
        }

        [Route("[action]")]
        [HttpPost]
        public async Task<ActionResult<BasketEntity>> CreateOrUpdatePaymentIntent(string basketId, CancellationToken cancellationToken)
        {
            try
            {
                var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

                if (basket == null) return BadRequest(new ApiResponse(400,"API_ERROR.BASKET_NOT_FOUND"));

                return basket;
            }
            catch (StripeException ex) when (ex.StripeError?.Code == "amount_too_small")
            {
                return BadRequest(new ApiResponse(400, "API_ERROR.PAYMENT_AMOUNT_TOO_SMALL"));
            }
            catch (StripeException ex)
            {
                _logger.LogWarning(ex, "Stripe PaymentIntent hatası");
                return BadRequest(new ApiResponse(400, "API_ERROR.PAYMENT_INIT_FAILED"));
            }
        }
        
        [AllowAnonymous]
        [Route("[action]")]
        [HttpPost]
        public async Task<ActionResult> StripeWebHook(CancellationToken cancellationToken)
        {
            var secret = _configuration["StripeSettings:WebhookSecret"];
            if (string.IsNullOrEmpty(secret))
            {
                _logger.LogError("StripeSettings:WebhookSecret is not set.");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            var signature = Request.Headers["Stripe-Signature"].ToString();
            if (string.IsNullOrEmpty(signature))
            {
                return BadRequest();
            }

            using var reader = new StreamReader(Request.Body);
            var json = await reader.ReadToEndAsync();

            Event stripeEvent;
            try
            {
                // The Stripe.net API version can differ from the one set on the Stripe account.
                stripeEvent = EventUtility.ConstructEvent(json, signature, secret, throwOnApiVersionMismatch: false);
            }
            catch (StripeException ex)
            {
                _logger.LogWarning(ex, "Stripe webhook signature is not valid.");
                return BadRequest();
            }

            if (stripeEvent.Data.Object is not PaymentIntent paymentIntent)
            {
                return Ok();
            }

            switch (stripeEvent.Type)
            {
                case EventTypes.PaymentIntentSucceeded:
                    var paidOrder = await _paymentService.UpdateOrderPaymentSucceeded(paymentIntent.Id);
                    _logger.LogInformation("Payment succeeded: {PaymentIntentId}, order {OrderId}", paymentIntent.Id, paidOrder?.Id);
                    break;
                case EventTypes.PaymentIntentPaymentFailed:
                    var failedOrder = await _paymentService.UpdateOrderPaymentFailed(paymentIntent.Id);
                    _logger.LogInformation("Payment failed: {PaymentIntentId}, order {OrderId}", paymentIntent.Id, failedOrder?.Id);
                    break;
            }
            return Ok();
        }
    }
}
