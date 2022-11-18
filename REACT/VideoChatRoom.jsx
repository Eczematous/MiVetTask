import React from "react";
import "../files/filepagination.css";
import PropTypes from "prop-types";
import moment from "moment";
import debug from "sabio-debug";
import { formatDateTime } from "../../utils/dateFormater";

function VideoChatRoom({ room }) {
  const _logger = debug.extend("VideoChatRoom");
  const dateCreated = formatDateTime(room.dateCreated);
  _logger("room --->", room);

  const joinedTime = (time) => {
    const participantTime = new Date(time * 1000);
    const joinedTime = moment(participantTime).format("hh:mm a");
    return joinedTime;
  };

  const mappingParticipants = (participant) => {
    return (
      <li key={participant.id}>
        <strong>{participant.name}:</strong> Joined at{" "}
        {joinedTime(participant.timeJoined)} for{" "}
        {Math.floor(participant.duration / 60)} minutes.
      </li>
    );
  };

  const renderParticipants = () => {
    let participants = null;
    if (room.participants !== null) {
      participants = room.participants.map(mappingParticipants);
    } else {
      participants = "no one";
    }
    return participants;
  };
  return (
    <React.Fragment>
      <tr>
        <td>{room.dailyId}</td>
        <td>{dateCreated}</td>
        <td>{Math.floor(room.duration / 60)} Minutes</td>
        <td>
          <ul>{renderParticipants()}</ul>
        </td>
      </tr>
    </React.Fragment>
  );
}

export default VideoChatRoom;

VideoChatRoom.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number,
    hostId: PropTypes.number,
    dailyId: PropTypes.string,
    duration: PropTypes.number,
    dateCreated: PropTypes.string,
    participants: PropTypes.arrayOf(
      PropTypes.shape({
        duration: PropTypes.number,
        name: PropTypes.string,
        timeJoined: PropTypes.number,
      })
    ),
  }),
};
