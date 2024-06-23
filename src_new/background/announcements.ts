const KEY = "announcements";

async function getAnnouncements(): Promise<Record<string, boolean>> {
  const { [KEY]: announcements } = await chrome.storage.local.get(KEY);
  return announcements;
}

async function addAnnouncement(announcement: string): Promise<void> {
  const announcements = await getAnnouncements();
  if (announcement in announcements) {
    return;
  }
  await chrome.storage.local.set({
    [KEY]: { ...announcements, [announcement]: true },
  });
}

async function removeAnnouncement(announcement: string): Promise<void> {
  const announcements = await getAnnouncements();
  if (!(announcement in announcements)) {
    return;
  }
  await chrome.storage.local.set({
    [KEY]: { ...announcements, [announcement]: false },
  });
}

async function getActiveAnnouncements(): Promise<string[]> {
  const announcements = await getAnnouncements();
  return Object.entries(announcements)
    .filter(([, isActive]) => isActive)
    .map(([announcement]) => announcement);
}

export {
  getAnnouncements,
  addAnnouncement,
  removeAnnouncement,
  getActiveAnnouncements,
};
