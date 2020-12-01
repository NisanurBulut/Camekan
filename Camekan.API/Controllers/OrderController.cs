using AutoMapper;
using Camekan.Entities;
using Camekan.DataAccess;
using Camekan.DataTransferObject;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;
using Camekan.API.Extensions;
using Camekan.WebAPI.Extensions;
using Camekan.Util.Errors;

namespace Camekan.WebAPI.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {
        private IMapper _mapper { get; set; }
        private IOrderService _orderService { get; }
        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<ActionResult<OrderEntity>> CreateOrder(OrderDto model)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var address = _mapper.Map<AddressDto, Address>(model.ShipToAddress);
            var order = await _orderService.CreateOrderAsync(email,model.DeliveryMethodId,model.BasketId,address);
            if (order == null) return BadRequest(new ApiResponse(400,"Sipariş oluşturma aşamasında bir hata oluştu."));
            return Ok(order);
        }

    }
}
