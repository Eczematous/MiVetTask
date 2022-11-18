using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.Subscriptions;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/subscriptions")]
    [ApiController]
    public class SubscriptionApiController : BaseApiController
    {

        private ISubscriptionService _service = null;
        public SubscriptionApiController(ISubscriptionService service, ILogger<SubscriptionApiController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpGet("{userId:int}")]
        public ActionResult<ItemsResponse<Subscription>> GetAll(int userId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Subscription> list = _service.GetAllByUserId(userId);
                if(list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<Subscription> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
              
            }
            return StatusCode(code, response);
        }


    }
}
