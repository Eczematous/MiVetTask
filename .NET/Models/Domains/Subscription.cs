using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Subscriptions
{
    public class Subscription
    {
        public int Id { get; set; }
        public string SubscriptionId { get; set; }
        public int UserId { get; set; }
        public string CustomerId { get; set; }
        public DateTime DateEnded { get; set; }
        public string isActive { get; set; }
        public List<SubscriptionProduct> ProductId { get; set; }
    }
}
