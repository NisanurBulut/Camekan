using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Camekan.DataAccess.Services
{
    public class PaymentService : IPaymentService
    {
        Task<BasketEntity> IPaymentService.CreateOrUpdatePaymentIntent(string basketId)
        {
            throw new NotImplementedException();
        }
    }
}
