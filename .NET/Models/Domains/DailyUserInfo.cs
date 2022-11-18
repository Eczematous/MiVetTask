using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.VideoChat
{
    public class DailyUserInfo
    {
        public Nullable<int> User_Id { get; set; }
        public string Participant_Id { get; set; }
        public string User_Name { get; set; }
        public int Join_Time { get; set; }
        public int Duration { get; set; }
    }
}
