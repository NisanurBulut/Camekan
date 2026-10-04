using AutoMapper;
using Camekan.DataAccess;
using Camekan.DataAccess.Specification;
using Camekan.DataTransferObject;
using Camekan.Entities;
using Camekan.Util.Errors;
using Camekan.Util.Helpers;
using Camekan.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Camekan.WebAPI.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class OrderController : BaseApiController
    {
        private IMapper _mapper { get; set; }
        private IOrderService _orderService { get; }
        private readonly IConfiguration _config;
        public OrderController(IOrderService orderService, IMapper mapper, IConfiguration config)
        {
            _orderService = orderService;
            _mapper = mapper;
            _config = config;
        }

        [Route("[action]")]
        [HttpPost]
        public async Task<ActionResult<OrderEntity>> CreateOrder(OrderDto model)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var address = _mapper.Map<AddressDto, AddressAggregate>(model.ShipToAddress);
            var order = await _orderService.CreateOrderAsync(email,model.DeliveryMethodId,model.BasketId,address);
            if (order == null) return BadRequest(new ApiResponse(400,"API_ERROR.ORDER_CREATE_FAILED"));
            return Ok(order);
        }
        
        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrdertoReturnDto>>> GetOrdersForUser()
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var orders = await _orderService.GetOrdersForUserAsync(email);
            var result = _mapper.Map<IReadOnlyList<OrderEntity>, IReadOnlyList<OrdertoReturnDto>>(orders);
            return Ok(result);
        }

        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<Pagination<OrderListItemDto>>> GetOrdersForUserPaged([FromQuery] OrderSpecParam param)
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var count = await _orderService.CountOrdersForUserAsync(email);
            var orders = await _orderService.GetOrdersForUserPagedAsync(email, param);
            var data = _mapper.Map<IReadOnlyList<OrderEntity>, IReadOnlyList<OrderListItemDto>>(orders);
            return Ok(new Pagination<OrderListItemDto>(param.PageIndex, param.PageSize, count, data));
        }

        [Route("[action]")]
        [HttpGet]
        public async Task<ActionResult<OrderSummaryDto>> GetOrderSummaryForUser()
        {
            var email = HttpContext.User.RetrieveEmailFromPrincipal();
            var summary = await _orderService.GetOrderSummaryForUserAsync(email);

            foreach (var book in summary.TopBooks)
            {
                book.PictureUrl = string.IsNullOrEmpty(book.PictureUrl) ? null : _config["apiUrl"] + book.PictureUrl;
            }
            return Ok(summary);
        }

        [Route("[action]")]
        [HttpGet]
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
