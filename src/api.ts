import axios from "axios";
import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  hltoken: string;
}

const API_BASE_URL = "https://services.leadconnectorhq.com";

const getApiToken = () => {
  const preferences = getPreferenceValues<Preferences>();
  return preferences.hltoken;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getApiToken()}`,
    "Content-Type": "application/json",
    "Version": "2021-07-28",
    "Accept": "application/json"
  },
});