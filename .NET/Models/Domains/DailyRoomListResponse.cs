using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.VideoChat
{
    public class DailyRoomListResponse
    {
        public int Total_Count { get; set; }
        public List<DailyRoomInfoResponse> Data { get; set; }
    }
}
