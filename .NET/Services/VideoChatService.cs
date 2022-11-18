using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Domain.VideoChat;
using Sabio.Models.Requests.VideoChat;
using SendGrid;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class VideoChatService : IVideoChatService
    {

        IDataProvider _data = null;
        private AppKeys _appKeys;
        public VideoChatService(IDataProvider data, IOptions<AppKeys> appKeys)
        {
            _data = data;
            _appKeys = appKeys.Value;
        }
        public async Task<DailyResponse> CreateRoom()
        {
            DailyResponse dailyResponse = null;

            var properties = new VideoChatRequest();
            var json = JsonConvert.SerializeObject(properties);

            var data = new StringContent(json, Encoding.UTF8, "application/json");

            var url = "https://api.daily.co/v1/rooms/";

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_appKeys.DailyWebRTCAppKey}");


            var response = await client.PostAsync(url, data);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadAsStringAsync();

            if (result != null)
            {
                dailyResponse = JsonConvert.DeserializeObject<DailyResponse>(result);
            }
            return dailyResponse;

        }
        public async Task<DailyRoomListResponse> GetRooms(string room)
        {
            DailyRoomListResponse list = null;
            HttpClient client = new HttpClient();

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, $"https://api.daily.co/v1/meetings?room={room}");

            request.Headers.Add("Authorization", $"Bearer {_appKeys.DailyWebRTCAppKey}");

            request.Content = new StringContent("");
            request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();

            if (responseBody != null)
            {
                list = JsonConvert.DeserializeObject<DailyRoomListResponse>(responseBody);
            }
            return list;

        }
        public List<DailyMeeting> GetAllRooms()
        {
            string procName = "[dbo].[DailyMeetings_SelectAll]";
            List<DailyMeeting> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    DailyMeeting meeting = MapSingleDailyMeeting(reader);

                    if (list == null)
                    {
                        list = new List<DailyMeeting>();
                    }
                    list.Add(meeting);


                });
            return list;
        }

        public List<DailyMeeting> GetRoomsByHostId(int hostId)
        {
            string procName = "[dbo].[DailyMeetings_SelectByHostId]";
            List<DailyMeeting> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@HostId", hostId);
            }
               , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    DailyMeeting meeting = MapSingleDailyMeeting(reader);

                    if (list == null)
                    {
                        list = new List<DailyMeeting>();
                    }
                    list.Add(meeting);


                });
            return list;
        }



        public int AddRoom(DailyMeetingAddRequest model)
        {
            int id = 0;
            string procName = "[dbo].[DailyMeetings_Insert]";

            DataTable myParticipantValue = null;

            if (model.DailyParticipants != null)
            {
                myParticipantValue = MapParticipantsToTable(model.DailyParticipants);
            }

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@HostId", model.HostId);
                col.AddWithValue("@DailyId", model.DailyId);
                col.AddWithValue("@Duration", model.Duration);
                col.AddWithValue("@DailyParticipants", myParticipantValue);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {

                object oId = returnCollection["@Id"].Value;

                Int32.TryParse(oId.ToString(), out id);

            });

            return id;
        }
        private static DailyMeeting MapSingleDailyMeeting(IDataReader reader)
        {
            DailyMeeting meeting = new DailyMeeting();

            int startingIndex = 0;

            meeting.Id = reader.GetSafeInt32(startingIndex++);
            meeting.HostId = reader.GetSafeInt32(startingIndex++);
            meeting.DailyId = reader.GetSafeString(startingIndex++);
            meeting.Duration = reader.GetSafeInt32(startingIndex++);
            meeting.DateCreated = reader.GetSafeDateTime(startingIndex++);
            meeting.Participants = reader.DeserializeObject<List<DailyParticipant>>(startingIndex++);
            return meeting;
        }
        private DataTable MapParticipantsToTable(List<DailyParticipantAddRequest> participants)
        {
            DataTable table = new DataTable();
            table.Columns.Add("MeetingId", typeof(string));
            table.Columns.Add("Name", typeof(string));
            table.Columns.Add("Duration", typeof(int));
            table.Columns.Add("TimeJoined", typeof(int));

            foreach (DailyParticipantAddRequest singleParticipant in participants)
            {
                DataRow row = table.NewRow();
                int startingIndex = 0;

                row[startingIndex++] = singleParticipant.MeetingId;
                row[startingIndex++] = singleParticipant.Name;
                row[startingIndex++] = singleParticipant.Duration;
                row[startingIndex++] = singleParticipant.TimeJoined;

                table.Rows.Add(row);
            }
            return table;
        }

    }
}
