using Camekan.DataAccess.Context;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Camekan.WebAPI.Controllers
{
    public class BuggyController :BaseApiController
    {
        private readonly DatabaseContext _context;
        public BuggyController(DatabaseContext context)
        {
            _context = context;
        }
        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            return NotFound();
        }
        [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            return BadRequest();
        }
        [HttpGet("basrequest")]
        public ActionResult GetBadRequest()
        {
            return Ok();
        }
    }
}
