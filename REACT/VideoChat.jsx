import React, { useEffect, useState, useCallback } from "react";
import videoChatService from "services/videoChatService";
import debug from "sabio-debug";
import DailyIframe from "@daily-co/daily-js";
import { DailyProvider } from "@daily-co/daily-react-hooks";
import VideoChatCall from "./VideoChatCall";
import VideoTray from "./VideoTray";
import VideoChatChecker from "./VideoChatChecker";
import VideoChatLobby from "./VideoChatLobby";
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from "./encodeDecode";
import "./videochat.css";
import PropTypes from "prop-types";
import toastr from "toastr";
import "../../toastr/build/toastr.css";

function VideoChat({ currentUser }) {
  // STATES of user
  const STATE_IDLE = "STATE_IDLE";
  const STATE_CREATING = "STATE_CREATING";
  const STATE_JOINING = "STATE_JOINING";
  const STATE_JOINED = "STATE_JOINED";
  const STATE_LEAVING = "STATE_LEAVING";
  const STATE_ERROR = "STATE_ERROR";
  const STATE_HAIRCHECK = "STATE_HAIRCHECK";

  const [chatState, setChatState] = useState(STATE_IDLE);
  const [roomLink, setRoomLink] = useState(null);
  const [callObject, setCallObject] = useState(null);
  const [serviceError, setServiceError] = useState(false);
  const [roomName, setRoomName] = useState({
    name: "",
  });

  const _logger = debug.extend("VideoChat");

  // CREATING CALL SECTION
  const createCall = useCallback(() => {
    setChatState(STATE_CREATING);

    return videoChatService
      .createRoom()
      .then(onCreateRoomSuccess)
      .catch(onCreateRoomFailed);
  }, []);

  const onCreateRoomSuccess = (response) => {
    _logger("Creating Room Success", response);
    toastr["success"]("Creating Room Success", "Creation Success");
    setRoomName((prevState) => {
      const copyRoomName = { ...prevState };
      copyRoomName.name = response.item.result.name;
      return copyRoomName;
    });
    _logger(roomName);
    return response.item.result.url;
  };

  const onCreateRoomFailed = (err) => {
    _logger("Creating Room Failed", err);
    toastr["error"]("Creating Room Failed", "Creation Failed");
    setRoomLink(null);
    setChatState(STATE_IDLE);
    setServiceError(true);
  };

  const showCall =
    !serviceError &&
    [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(chatState);

  const showChecker = !serviceError && chatState === STATE_HAIRCHECK;

  // my CHECKER to joining call

  const checker = useCallback(async (url) => {
    const newCallObject = DailyIframe.createCallObject();
    setRoomLink(url);
    setCallObject(newCallObject);
    setChatState(STATE_HAIRCHECK);
    await newCallObject.preAuth({ url });
    await newCallObject.startCamera();
  }, []);

  const joinCall = useCallback(() => {
    callObject.join({ url: roomLink });
  }, [callObject, roomLink]);

  //----------- Leaving call -----------------

  const leaveCall = useCallback(() => {
    if (!callObject) {
      return;
    }
    if (chatState === STATE_ERROR) {
      callObject.destroy().then(onDestroySuccessful);
    } else {
      setChatState(STATE_LEAVING);
      callObject.leave();
      if (roomName.name !== "") {
        videoChatService
          .getRoomByName(roomName.name)
          .then(getRoomByNameSuccess)
          .catch(getRoomByNameFailed);
      }
    }
  }, [callObject, chatState]);

  const onDestroySuccessful = () => {
    setRoomLink(null);
    setCallObject(null);
    setChatState(STATE_IDLE);
  };

  const getRoomByNameSuccess = (response) => {
    _logger("GetRoomByName Success", response.item.result.data);
    const participants = response.item.result.data[0].max_Participants;

    _logger("participant count--->", participants);
    const payload = {
      DailyId: response.item.result.data[0].id,
      Duration: response.item.result.data[0].duration,
      HostId: currentUser.id,
      DailyParticipants: [
        {
          MeetingId: response.item.result.data[0].id,
          Name: response.item.result.data[0].participants[0].user_Name,
          Duration: response.item.result.data[0].participants[0].duration,
          TimeJoined: response.item.result.data[0].participants[0].join_Time,
        },
        {
          MeetingId: response.item.result.data[0].id,
          Name: response.item.result.data[0].participants[1].user_Name,
          Duration: response.item.result.data[0].participants[1].duration,
          TimeJoined: response.item.result.data[0].participants[1].join_Time,
        },
      ],
    };
    if (participants >= 2) {
      videoChatService
        .addRoomInfo(payload)
        .then(addRoomInfoSuccess)
        .catch(addRoomInfoFailed);
    }
  };
  const getRoomByNameFailed = (err) => {
    _logger("GetRoomByName Failed", err);
  };

  const addRoomInfoSuccess = (response) => {
    _logger("AddRoomInfo Success", response);
  };

  const addRoomInfoFailed = (err) => {
    _logger("AddRoomInfo Failed", err);
  };
  useEffect(() => {
    const url = roomUrlFromPageUrl();
    if (url) {
      checker(url);
    }
  }, [checker]);

  useEffect(() => {
    const url = pageUrlFromRoomUrl(roomLink);
    if (url === window.location.href) return;
    window.history.replaceState(null, null, url);
  }, [roomLink]);

  //Changing State based on state change

  useEffect(() => {
    if (!callObject) return;
    const events = ["joined-meeting", "left-meeting", "error", "camera-error"];
    function newChatState() {
      switch (callObject.meetingState()) {
        case "joined-meeting":
          setChatState(STATE_JOINED);
          break;
        case "left-meeting":
          callObject.destroy().then(onDestroySuccessful);
          break;
        case "error":
          setChatState(STATE_ERROR);
          break;
        default:
          break;
      }
    }
    // Based off the cases, set the chatState or destroy callobject
    newChatState();
    events.forEach((event) => callObject.on(event, newChatState));
    return () => {
      events.forEach((event) => callObject.off(event, newChatState));
    };
  }, [callObject]);

  // RENDERING BASE ON CHECKER, SHOWCALL
  const renderVideoChat = () => {
    if (serviceError) {
      return (
        <div className="api-error">
          <h1 className="h1-font">NOT WORKING</h1>
        </div>
      );
    }
    if (showChecker) {
      return (
        <DailyProvider callObject={callObject}>
          <VideoChatChecker joinCall={joinCall} cancelCall={leaveCall} />
        </DailyProvider>
      );
    }
    if (showCall) {
      return (
        <DailyProvider callObject={callObject}>
          <VideoChatCall roomName={roomName.name} />
          <VideoTray leaveCall={leaveCall} />
        </DailyProvider>
      );
    }
    return <VideoChatLobby createCall={createCall} checker={checker} />;
  };
  // Shows the VideoChat
  return <div className="container">{renderVideoChat()}</div>;
}

export default VideoChat;

VideoChat.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
  }),
};
