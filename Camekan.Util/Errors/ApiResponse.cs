using System;
using System.Collections.Generic;
using System.Text;

namespace Camekan.Util.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string message = null)
        {
            StatusCode = statusCode;
            MessageOfError = message ?? GetDefaultMessafeForstatusCode(statusCode);
        }

        private string GetDefaultMessafeForstatusCode(int statusCode)
        {
            return statusCode switch
            {
                400 => "Bad Request",
                401 => "Authorize Error",
                404 => "Content Not Found",
                500 => "Server Error",
                _ => null
            };
        }

        public int StatusCode { get; set; }
        public string MessageOfError { get; set; }
    }
}
