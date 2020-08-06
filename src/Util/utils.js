/*global chrome*/

import storage from "./storage";
import { defaultWeek } from "./defaults";
export default {
  urlStemmer(url) {
    try {
      const stemmed = new URL(url).hostname.replace("www.", "");
      return stemmed;
    } catch {
      return undefined;
    }
  },
  async isWatchedSite(site) {
    const sites = Object.keys(await storage.getSites());
    const stemmed = this.urlStemmer(site);
    return sites.includes(stemmed);
  },
  getActiveTab() {
    return new Promise((resolve) => {
      chrome.tabs.query(
        {
          active: true,
          lastFocusedWindow: true,
        },
        (tabs) => (tabs ? resolve(tabs[0]) : resolve(undefined))
      );
    });
  },
  async getSite(url) {
    const sites = await storage.getSites();
    const site = sites[url];

    return new Promise((resolve) => {
      site ? resolve(site) : resolve(undefined);
    });
  },
  async saveSite(url, site) {
    const sites = await storage.getSites();
    sites[url] = site;
    storage.save("sites", sites);
  },
  async getBucketFromId(id) {
    const buckets = await storage.getBuckets();
    return buckets[id] ? buckets[id] : undefined;
  },
  async getBucketFromUrl(url) {
    const site = await this.getSite(url);
    const buckets = await storage.getBuckets();
    return site ? buckets[site.bucketId] : undefined;
  },
  async updateBucket(id, key, value) {
    const buckets = await storage.getBuckets();
    buckets[id][key] = value;
    storage.save("buckets", buckets);
  },
  async numOpenTabsInBucket(id) {
    const { bucketSites } = await this.getBucketFromId(id);
    return new Promise((resolve) => {
      chrome.tabs.query({}, (tabs) => {
        const tabsInBucket = tabs.filter((tab) =>
          bucketSites.includes(this.urlStemmer(tab.url))
        );
        resolve(tabsInBucket.length);
      });
    });
  },
  isSameDay(date1, date2) {

    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  },
  /**
   *
   * @param {*} minutes Number of minutes to add
   * @param {*} day (Optional) day to add time to (defaults to current day). Value between 0-6, where 0 is Sunday
   */
  async addTime(minutes, siteURL, date) {
    //check if it's a new week
    let times = await storage.getTimes();
    const lastSunday = new Date(times.timestamp);
    console.log("url", siteURL)
    const nextSunday = lastSunday.setDate(lastSunday.getDate() + 7);
    if (!(lastSunday < date < nextSunday)) {
      await this.newWeek();
      times = await storage.getTimes();
    }
    const totalTime =
      (times["thisWeek"][date.getDay()][siteURL] || 0) + minutes;
    times["thisWeek"][date.getDay()][siteURL] = totalTime;
    console.log("times", times)
    storage.save("times", times);
  },
  async newWeek() {
    const times = await storage.getTimes();
    times.lastWeek = times.thisWeek;
    times.thisWeek = defaultWeek;
    //update timestamp to the start of this week
    const timestamp = new Date(times.timestamp)
    timestamp.setDate(timestamp.getDate() + 7);
    times.timestamp = timestamp.toJSON()
    await storage.save(times);
  },
  async endTrackerSession(sessionStart, siteURL) {
    const sessionEnd = new Date();
    //if the session spans two different days (ex: 11:55pm-12:05am),
    //add 5 minutes to the previous day and set sessionStart to midnight of the new day.
    //now, sessionStart and sessionEnd are guaranteed to be on the same date.
    console.log("sstart", sessionStart)
    if (!this.isSameDay(sessionStart, sessionEnd)) {
      const midnight = new Date().setHours(0, 0, 0, 0);
      const minutesOnPreviousDay = (midnight - sessionStart) / 1000 / 60;
      this.addTime(minutesOnPreviousDay, siteURL, sessionStart);
      sessionStart = midnight;
    }
    const elapsedMinutes = (sessionEnd - sessionStart) / 1000 / 60;
    this.addTime(elapsedMinutes, siteURL, sessionEnd)
  }
};
