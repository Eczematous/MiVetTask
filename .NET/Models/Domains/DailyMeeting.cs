using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.VideoChat
{
    public class DailyMeeting
    {
        public int Id { get; set; }
        public int HostId { get; set; }
        public string DailyId { get; set; }
        public int Duration { get; set; }
        public DateTime DateCreated { get; set; }
        public List<DailyParticipant> Participants { get; set; }
    }
}
