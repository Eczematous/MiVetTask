using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.VideoChat
{
    public class DailyMeetingAddRequest
    {

        public int HostId { get; set; }
        public string DailyId { get; set; }
        public int Duration { get; set; }
        public  List<DailyParticipantAddRequest> DailyParticipants { get; set; }

    }
}
