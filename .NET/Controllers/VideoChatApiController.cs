using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Experimental.ProjectCache;
using Microsoft.Build.Utilities;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.VideoChat;
using Sabio.Models.Requests.VideoChat;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/videochat")]
    [ApiController]
    public class VideoChatApiController : BaseApiController
    {

        private IVideoChatService _service = null;
       
        public VideoChatApiController(IVideoChatService service
            , ILogger<VideoChatApiController> logger) : base(logger)
        {
            _service = service;

        }

        [HttpPost]
        public ActionResult<ItemResponse<DailyResponse>> CreateRoom()
        {
            ObjectResult result = null;

            try
            {
                Task<DailyResponse> dailyResponse = _service.CreateRoom();

                ItemResponse<Task<DailyResponse>> response = new ItemResponse<Task<DailyResponse>>() { Item = dailyResponse };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;

        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Task<List<DailyRoomListResponse>>>> GetRooms(string room)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Task<DailyRoomListResponse> rooms = _service.GetRooms(room);

                if (rooms == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Task<DailyRoomListResponse>>() { Item = rooms };
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

        [HttpPost("meeting")]
        public ActionResult<ItemResponse<int>> AddRoom(DailyMeetingAddRequest model)
        {
            ObjectResult result = null;

            try
            {
               
                int id = _service.AddRoom(model);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;

        }

        [HttpGet("meeting")]
        public ActionResult<ItemsResponse<DailyMeeting>> GetAllRooms()
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                List<DailyMeeting> list = _service.GetAllRooms();

                if(list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<DailyMeeting> { Items = list };
                }

            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);

        }

        [HttpGet("meeting/{hostId:int}")]
        public ActionResult<ItemsResponse<DailyMeeting>> GetRoomsByHostId(int hostId)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                List<DailyMeeting> list = _service.GetRoomsByHostId(hostId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<DailyMeeting> { Items = list };
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
