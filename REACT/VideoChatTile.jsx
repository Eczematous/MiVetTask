import React, { useEffect, useRef } from "react";
import { useMediaTrack } from "@daily-co/daily-react-hooks";
import VideoChatTileVideo from "./VideoChatTileVideo";
import PropTypes from "prop-types";
import { useParticipantProperty } from "@daily-co/daily-react-hooks";

function VideoChatTile({ id, isScreenShare, isLocal, isAlone }) {
  const mediaTrack = useMediaTrack(id, isScreenShare ? "screenAudio" : "audio");
  const ref = useRef(null);
  const username = useParticipantProperty(id, "user_name");
  useEffect(() => {
    if (mediaTrack?.state === "playable") {
      if (ref?.current) {
        ref.current.srcObject =
          mediaTrack && new MediaStream([mediaTrack.persistentTrack]);
      }
    }
  }, [mediaTrack]);

  let containerClasses = isScreenShare ? "tile-screenshare" : "tile-video";

  if (isLocal) {
    containerClasses += " self-view";
    if (isAlone) {
      containerClasses += " alone";
    }
  }

  return (
    <div className={containerClasses}>
      <VideoChatTileVideo id={id} isScreenShare={isScreenShare} />
      {mediaTrack && <audio autoPlay ref={ref} />}
      <div className="username">
        {username || id} {isLocal && "(you)"}
      </div>
    </div>
  );
}

export default VideoChatTile;

VideoChatTile.propTypes = {
  id: PropTypes.string,
  isScreenShare: PropTypes.bool,
  isLocal: PropTypes.bool,
  isAlone: PropTypes.bool,
};
