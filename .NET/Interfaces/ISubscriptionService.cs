using Sabio.Models.Domain.Subscriptions;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface ISubscriptionService
    {
        List<Subscription> GetAllByUserId(int userId);
    }
}