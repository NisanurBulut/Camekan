using AutoMapper;
using Camekan.DataAccess.Repositories;
using Camekan.DataTransferObject;
using Camekan.DataTransferObject.Basket;
using Camekan.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Camekan.WebAPI.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IMapper _mapper;
        public BasketController(IBasketRepository basketRepository, IMapper mapper)
        {
            _basketRepository = basketRepository;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<BasketEntity>> GetBasketById([Required, RegularExpression(BasketRules.IdPattern)] string id)
        {
            var basket = await _basketRepository.GetBasketAsync(id);
            return Ok(basket?? new BasketEntity(id));
        }
        [HttpPost]
        public async Task<ActionResult<BasketEntity>> UpdateBasket(BasketDto basket)
        {
            var updatedBasket = await _basketRepository.UpdateBasketAsync(_mapper.Map<BasketDto,BasketEntity>(basket));
            return Ok(updatedBasket);
        }
        [HttpDelete]
        public async Task DeleteBasket([Required, RegularExpression(BasketRules.IdPattern)] string id)
        {
             await _basketRepository.DeleteBasketAsync(id);
      
        }
    }
}
