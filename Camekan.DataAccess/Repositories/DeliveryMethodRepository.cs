using Camekan.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Camekan.DataAccess.Context;
using Microsoft.EntityFrameworkCore;

namespace Camekan.DataAccess.Repositories
{
    public class DeliveryMethodRepository : BaseRepository<DeliveryMethodEntity>, IDeliveryModethodRepository
    {
        private readonly DatabaseContext _context;
        public DeliveryMethodRepository(DatabaseContext context) : base(context)
        {
            _context = context;
        }
    }
}
