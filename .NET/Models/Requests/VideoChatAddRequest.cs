using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.VideoChat
{

    public class VideoChatRequest
    {

        public VideoChatRequest()
        {
            this.properties = new Properties();
            DateTime today = DateTime.Now;
            long unixTime = ((DateTimeOffset)today).ToUnixTimeSeconds() + 1800;
            this.properties.exp = unixTime;
            
        }
        public Properties properties { get; set; }

    }
    public class Properties
    {
        public long exp { get; set; }
    }
}
