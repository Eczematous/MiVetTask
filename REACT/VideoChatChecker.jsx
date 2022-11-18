import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  useLocalParticipant,
  useVideoTrack,
  useDevices,
  useDaily,
  useDailyEvent,
} from "@daily-co/daily-react-hooks";
import VideoChatError from "./VideoChatError";
import PropTypes from "prop-types";
import debug from "sabio-debug";

function VideoChatChecker({ joinCall, cancelCall }) {
  const localParticipant = useLocalParticipant();
  const videoTrack = useVideoTrack(localParticipant?.session_id);
  const {
    microphones,
    speakers,
    cameras,
    setMicrophone,
    setCamera,
    setSpeaker,
  } = useDevices();
  const callObject = useDaily();
  const ref = useRef();
  const [videoChatError, setVideoChatError] = useState(false);
  const [availableCameras, setAvailableCameras] = useState({
    arrayOfCameras: [],
  });
  const [availableMicrophones, setAvailableMicrophones] = useState({
    arrayOfMicrophones: [],
  });

  const [availableSpeakers, setAvailableSpeakers] = useState({
    arrayOfSpeakers: [],
  });
  const _logger = debug.extend("VideoChatChecker");

  useDailyEvent(
    "camera-error",
    useCallback(() => {
      setVideoChatError(true);
    }, [])
  );
  _logger(availableCameras);

  useEffect(() => {
    setAvailableCameras((prevState) => {
      const copyCameras = { ...prevState };
      copyCameras.arrayOfCameras = cameras?.map(mappingCameras);
      return copyCameras;
    });
  }, [cameras]);

  const mappingCameras = (camera) => {
    return (
      <option
        key={`cam-${camera.device.deviceId}`}
        value={camera.device.deviceId}
      >
        {camera.device.label}
      </option>
    );
  };

  useEffect(() => {
    setAvailableMicrophones((prevState) => {
      const copyMicrophones = { ...prevState };
      copyMicrophones.arrayOfMicrophones = microphones?.map(mappingmicrophones);
      return copyMicrophones;
    });
  }, [microphones]);

  const mappingmicrophones = (mic) => {
    return (
      <option key={`mic-${mic.device.deviceId}`} value={mic.device.deviceId}>
        {mic.device.label}
      </option>
    );
  };

  useEffect(() => {
    setAvailableSpeakers((prevState) => {
      const copySpeakers = { ...prevState };
      copySpeakers.arrayOfSpeakers = speakers?.map(mappingSpeakers);
      return copySpeakers;
    });
  }, [speakers]);

  const mappingSpeakers = (speaker) => {
    return (
      <option
        key={`speaker-${speaker.device.deviceId}`}
        value={speaker.device.deviceId}
      >
        {speaker.device.label}
      </option>
    );
  };

  const onChange = (evnt) => {
    callObject.setUserName(evnt.target.value);
  };

  const join = (evnt) => {
    evnt.preventDefault();
    joinCall();
  };

  useEffect(() => {
    if (!videoTrack.persistentTrack) return;
    if (ref?.current) {
      ref.current.srcObject =
        videoTrack.persistentTrack &&
        new MediaStream([videoTrack?.persistentTrack]);
    }
  }, [videoTrack.persistentTrack]);

  const updateMicrophone = (evnt) => {
    setMicrophone(evnt.target.value);
  };

  const updateSpeaker = (evnt) => {
    setSpeaker(evnt.target.value);
  };

  const updateCamera = (evnt) => {
    setCamera(evnt.target.value);
  };

  const showDevices = () => {
    return (
      <form className="hair-check" onSubmit={join}>
        {videoTrack?.persistentTrack && (
          <video className="video-cover" autoPlay muted playsInline ref={ref} />
        )}

        <div>
          <label htmlFor="username">Name:</label>
          <input
            name="username"
            type="text"
            placeholder="Enter Username"
            onChange={(evnt) => onChange(evnt)}
            value={localParticipant?.user_name || " "}
          />
        </div>

        <div>
          <label htmlFor="micOptions">Microphone:</label>
          <select name="micOptions" id="micSelect" onChange={updateMicrophone}>
            {availableMicrophones.arrayOfMicrophones}
          </select>
        </div>

        <div>
          <label htmlFor="speakersOptions">Speakers:</label>
          <select
            name="speakersOptions"
            id="speakersSelect"
            onChange={updateSpeaker}
          >
            {availableSpeakers.arrayOfSpeakers}
          </select>
        </div>
        <div>
          <label htmlFor="cameraOptions">Cameras:</label>
          <select
            name="cameraOptions"
            id="cameraSelect"
            onChange={updateCamera}
          >
            {availableCameras.arrayOfCameras}
          </select>
        </div>
        <button
          className="button-main button-template"
          onClick={join}
          type="submit"
        >
          Join Call
        </button>
        <button
          onClick={cancelCall}
          className="button-main button-template cancel-call mt-3"
          type="button"
        >
          Back To Start
        </button>
      </form>
    );
  };

  return videoChatError ? <VideoChatError /> : showDevices();
}

export default VideoChatChecker;

VideoChatChecker.propTypes = {
  joinCall: PropTypes.func,
  cancelCall: PropTypes.func,
};
