import React, { memo, useEffect, useRef } from "react";
import { useMediaTrack } from "@daily-co/daily-react-hooks";
import PropTypes from "prop-types";

const VideoChatTileVideo = memo(({ id, isScreenShare }) => {
  const mediaTrack = useMediaTrack(id, isScreenShare ? "screenVideo" : "video");
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !mediaTrack?.persistentTrack) return;
    video.srcObject = new MediaStream([mediaTrack?.persistentTrack]);
  }, [mediaTrack?.persistentTrack]);
  if (!ref) return null;
  return <video className="video-cover" autoPlay muted playsInline ref={ref} />;
});

export default VideoChatTileVideo;

VideoChatTileVideo.propTypes = {
  id: PropTypes.string,
  isScreenShare: PropTypes.bool,
};
