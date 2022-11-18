using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.VideoChat
{
    public class DailyParticipantAddRequest
    {
        public string MeetingId { get; set; }
        public string Name { get; set; }
        public int Duration { get; set; }
        public int TimeJoined { get; set; }
    }
}
