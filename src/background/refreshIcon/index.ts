import { getActiveAnnouncements } from "../announcements";
import getIcons from "./getIcons";

const refreshIcon = async (): Promise<void> => {
  const announcements = await getActiveAnnouncements();
  if (Object.keys(announcements).length === 0) {
    await chrome.action.setIcon({ path: getIcons("default", false) });
  } else {
    await chrome.action.setIcon({ path: getIcons("default", true) });
  }
};

export default refreshIcon;
