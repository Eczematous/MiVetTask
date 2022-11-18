using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.VideoChat
{
    public class DailyRoomInfoResponse
    {
        public string Id { get; set; }
        public string Room { get; set; }
        public int Start_Time { get; set; }

        public int Duration { get; set; }
        public bool Ongoing { get; set; }
        public int Max_Participants { get; set; }

        public List<DailyUserInfo> Participants { get; set; }
    }
}
