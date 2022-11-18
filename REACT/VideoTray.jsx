import React, { useCallback, useState } from "react";
import {
  useDaily,
  useScreenShare,
  useLocalParticipant,
  useVideoTrack,
  useAudioTrack,
  useDailyEvent,
} from "@daily-co/daily-react-hooks";
import VideoChatMessage from "./VideoChatMessage";

import {
  CameraOff,
  CameraOn,
  MicrophoneOff,
  MicrophoneOn,
  Screenshare,
  Leave,
  ChatIcon,
  ChatHighlighted,
} from "./videoTrayIcons";
import PropTypes from "prop-types";

function VideoTray({ leaveCall }) {
  const callObject = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } =
    useScreenShare();
  const [chat, setChat] = useState(false);
  const [message, setMessage] = useState(false);
  const localParticipant = useLocalParticipant();
  const videoTrack = useVideoTrack(localParticipant?.session_id);
  const audioTrack = useAudioTrack(localParticipant?.session_id);
  const mutedVideo = videoTrack.isOff;
  const mutedAudio = audioTrack.isOff;

  useDailyEvent(
    "app-message",
    useCallback(() => {
      if (!chat) {
        setChat(true);
      }
    }, [chat])
  );

  const toggleVideo = useCallback(() => {
    callObject.setLocalVideo(mutedVideo);
  }, [callObject, mutedVideo]);

  const toggleAudio = useCallback(() => {
    callObject.setLocalAudio(mutedAudio);
  }, [callObject, mutedAudio]);

  const toggleScreenShare = () => {
    isSharingScreen ? stopScreenShare() : startScreenShare();
  };

  const toggleChat = () => {
    setChat(!chat);
    if (message) {
      setMessage(!message);
    }
  };

  return (
    <div className="tray">
      <VideoChatMessage showChat={chat} toggleChat={toggleChat} />
      <div className="tray-buttons-container">
        <div className="controls">
          <button
            onClick={toggleVideo}
            type="button"
            className="button-main p-2"
          >
            {mutedVideo ? <CameraOff /> : <CameraOn />}
            {mutedVideo ? "Turn Camera On" : "Turn Camera Off"}
          </button>
          <button
            onClick={toggleAudio}
            type="button"
            className="button-main p-2"
          >
            {mutedAudio ? <MicrophoneOff /> : <MicrophoneOn />}
            {mutedAudio ? "Turn Microphone On" : "Turn Microphone Off"}
          </button>
        </div>
        <div className="actions">
          <button
            onClick={toggleScreenShare}
            type="button"
            className="button-main p-2"
          >
            <Screenshare />
            {isSharingScreen ? "Stop Screen Sharing" : "Share Screen"}
          </button>
          <button
            onClick={toggleChat}
            type="button"
            className="button-main p-2"
          >
            {message ? <ChatHighlighted /> : <ChatIcon />}
            {chat ? "Hide Chat" : "Show Chat"}
          </button>
          <div className="leave">
            <button
              onClick={leaveCall}
              type="button"
              className="button-main p-2"
            >
              <Leave /> Exit Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default VideoTray;

VideoTray.propTypes = {
  leaveCall: PropTypes.func,
};
