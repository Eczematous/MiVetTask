import axios from "axios";
import { onGlobalSuccess, onGlobalError, API_HOST_PREFIX } from "./serviceHelpers";



const createRoom = () => {

    const room = {
        properties: {
            exp: Math.round(Date.now() / 1000) + 3600,
        },
    }

    const config = {
        method: "POST",
        url: `${API_HOST_PREFIX}/api/videochat`,
        data: room,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ` + process.env.REACT_APP_DAILY_API_KEY
        }
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);


};

const getRoomByName = (room) => {
    const config = {
        method: "GET",
        url: `${API_HOST_PREFIX}/api/videochat/search?room=${room}`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ` + process.env.REACT_APP_DAILY_API_KEY
        }
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getAllRooms = () => {
    const config = {
        method: "GET",
        url: `${API_HOST_PREFIX}/api/videochat/meeting`,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const addRoomInfo = (payload) => {
    const config = {
        method: "POST",
        url: `${API_HOST_PREFIX}/api/videochat/meeting`,
        data: payload,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getRoomsByHostId = (hostId) => {
    const config = {
        method: "GET",
        url: `${API_HOST_PREFIX}/api/videochat/meeting/${hostId}`,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError)
}

const videoChatService = { createRoom, getRoomByName, getAllRooms, addRoomInfo, getRoomsByHostId }

export default videoChatService;