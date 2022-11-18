import React from "react";

function VideoChatError() {
  const onRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="call">
      <div className="info-box get-user-media-error">
        <h1 className="h1-font">Camera or Microphone is OFF</h1>
        <p className="p-centering">
          Please check that devices are not being used by a different
          application.
        </p>
        <button
          className="button-main button-template"
          onClick={onRefresh}
          type="button"
        >
          Please Try Again
        </button>
      </div>
    </div>
  );
}
export default VideoChatError;
