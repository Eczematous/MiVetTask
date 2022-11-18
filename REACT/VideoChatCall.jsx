import React, { useState, useCallback, useMemo } from "react";
import {
  useParticipantIds,
  useScreenShare,
  useLocalParticipant,
  useDailyEvent,
} from "@daily-co/daily-react-hooks";
import VideoChatTile from "./VideoChatTile";
import VideoChatError from "./VideoChatError";
import debug from "sabio-debug";

function VideoChatCall() {
  const [videoChatError, setVideoChatError] = useState(false);

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setVideoChatError(true);
    }, [])
  );

  const { screens } = useScreenShare();
  const participantIds = useParticipantIds({ filter: "remote" });
  const localParticipant = useLocalParticipant();
  const _logger = debug.extend("VideoChatCall");

  const isAlone = useMemo(
    () => participantIds?.length < 1 || screens?.length < 1,
    [participantIds, screens]
  );

  _logger(participantIds.length);

  const renderScreen = () => (
    <div className={`${screens.length > 0 ? "is-screenshare" : "call"}`}>
      {localParticipant && (
        <VideoChatTile
          id={localParticipant.session_id}
          isLocal
          isAlone={isAlone}
        />
      )}
      {participantIds?.length > 0 || screens?.length > 0 ? (
        <>
          {participantIds.map((id) => (
            <VideoChatTile key={id} id={id} />
          ))}
          {screens.map((screen) => (
            <VideoChatTile
              key={screen.screenId}
              id={screen.session_id}
              isScreenShare
            />
          ))}
        </>
      ) : (
        <div className="info-box">
          <h1 className="h1-font">No one is here.</h1>
          <p className="p-centering">Share link to invite someone:</p>
          <span className="room-url">{window.location.href}</span>
        </div>
      )}
    </div>
  );
  return videoChatError ? <VideoChatError /> : renderScreen();
}

export default VideoChatCall;
