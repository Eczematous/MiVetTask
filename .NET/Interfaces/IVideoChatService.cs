using Sabio.Models.Domain;
using Sabio.Models.Domain.VideoChat;
using Sabio.Models.Requests.VideoChat;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public interface IVideoChatService
    {
        Task<DailyResponse> CreateRoom();
        Task<DailyRoomListResponse> GetRooms(string room);

        int AddRoom(DailyMeetingAddRequest model);
        List<DailyMeeting> GetAllRooms();

        List<DailyMeeting> GetRoomsByHostId(int hostId);
    }
}