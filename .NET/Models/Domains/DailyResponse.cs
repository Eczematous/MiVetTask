using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.VideoChat
{
    public class DailyResponse
    {
        public string Url { get; set; }
        public string Id { get; set; }
        public bool Api_Created { get; set; }

        public DateTime Created_At { get; set; }
        public string Name { get; set; }
        public DailyConfig Config { get; set; }
    }

    
}
