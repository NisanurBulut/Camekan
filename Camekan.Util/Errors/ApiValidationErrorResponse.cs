using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Util.Errors
{
    public class ApiValidationErrorResponse : ApiResponse
    {
        public ApiValidationErrorResponse():base(400)
        {

        }
        public IEnumerable<string> Errors { get; set; }
    }
}
