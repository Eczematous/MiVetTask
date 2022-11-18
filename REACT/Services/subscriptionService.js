import axios from "axios";
import { onGlobalSuccess, onGlobalError, API_HOST_PREFIX } from "./serviceHelpers";

const getSubscriptionByUserId = (id) => {
    const config = {
        method: "GET",
        url: `${API_HOST_PREFIX}/api/subscriptions/${id}`,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError)
}

const subscriptionService = { getSubscriptionByUserId }

export default subscriptionService