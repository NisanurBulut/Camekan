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
using System.Collections.Generic;

namespace Camekan.WebAPI.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class OrderController : BaseApiController
    {
        private IMapper _mapper { get; set; }
        private IOrderService _orderService { get; }
        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }
        [Route("[action]")]
        [HttpPost]
        public async Task<ActionResult<OrderEntity>> CreateOrder(OrderDto model)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var address = _mapper.Map<AddressDto, AddressAggregate>(model.ShipToAddress);
            var order = await _orderService.CreateOrderAsync(email,model.DeliveryMethodId,model.BasketId,address);
            if (order == null) return BadRequest(new ApiResponse(400,"Sipariş oluşturma aşamasında bir hata oluştu."));
            return Ok(order);
        }
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrdertoReturnDto>>> GetOrdersForUser()
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var orders = await _orderService.GetOrdersForUserAsync(email);
            var result = _mapper.Map<IReadOnlyList<OrderEntity>, IReadOnlyList<OrdertoReturnDto>>(orders);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<OrdertoReturnDto>> GetOrderByIdForUser(int id)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var order = await _orderService.GetOrderByIdAsync(id,email);
            if (order == null) return NotFound(new ApiResponse(404));
            var result = _mapper.Map<OrderEntity, OrdertoReturnDto>(order);
            return Ok(result);
        }
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<DeliveryMethodEntity>> GetDeliveryMethods()
        {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }
    }
}
