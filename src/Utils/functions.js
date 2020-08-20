/*global chrome*/

import * as storage from "./storage";
import { defaultWeek } from "./defaults";

/**
 * Returns the active tab in the current window
 */
export function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      (tabs) => (tabs ? resolve(tabs[0]) : resolve(undefined))
    );
  });
}

/**
 * Stems URLs, e.g. https://www.reddit.com/r/Stormight_Archive --> reddit.com
 *
 * @param {String} url
 */
export function getSiteName(url) {
  try {
    const stemmed = new URL(url).hostname.replace("www.", "");
    return stemmed;
  } catch {
    //not a URL
    return undefined;
  }
}

/**
 * Returns a list of Tabs, each containing a watched site
 */
export async function getOpenWatchedSites() {
  const watchedSites = Object.keys(await storage.getSites());
  const openTabs = await getOpenTabs();
  const openWatchedSites = openTabs.filter((tab) =>
    watchedSites.includes(getSiteName(tab.url))
  );
  return openWatchedSites;
}
/**
 * Determines whether a site is in a bucket
 *
 * @param {String} site (e.g. facebook.com)
 */
export async function isWatchedSite(site) {
  const watchedSites = await Object.keys(await storage.getSites());
  site = this.getSiteName(site);
  return watchedSites.includes(site);
}

/**
 * Returns the bucket that a watched site belongs to
 *
 * @param {String} site
 */
export async function getBucketID(site) {
  const sites = await storage.getSites();
  //possibly undefined, if site is not a watched site.
  return sites[site];
}

/**
 * Retrieves a bucket based on bucketID.
 *
 * @param {Number} id
 */
export async function getBucket(id) {
  const buckets = await storage.getBuckets();
  return buckets[id] ? buckets[id] : undefined;
}

export function getOpenTabs() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      resolve(tabs);
    });
  });
}

/**
 * Edits a bucket's property
 *
 * @param {Number} id The bucket to edit
 * @param {String} key The property to update
 * @param {*} value The new value
 */
export async function updateBucket(id, key, value) {
  const buckets = await storage.getBuckets();
  buckets[id][key] = value;
  await storage.save("buckets", buckets);
}

/**
 * Counts the number of tabs that contain sites belonging to a certain bucket
 *
 * @param {Number} id The bucket whose open sites we're counting
 */
export async function numOpenTabsInBucket(id) {
  const { bucketSites } = await this.getBucket(id);
  const openTabs = await getOpenTabs();
  const tabsInBucket = openTabs.filter((tab) =>
    bucketSites.includes(this.getSiteName(tab.url))
  );
  return tabsInBucket.length;
}

/**
 * Determines whether watched a site is the only open site of its bucket
 * (Technically determines whether there's only one open site for a certain bucket)
 *
 * @param {Number} bucketID
 */
export async function isLastOpenTabInBucket(bucketID) {
  const numOpen = await this.numOpenTabsInBucket(bucketID);
  return numOpen <= 1;
}

/**
 * Determines whether two Date objects represent a time on the same day
 *
 * @param {Date} date1
 * @param {Date} date2
 */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
/**
 * Stores the time spent on a site
 *
 * @param {Number} minutes Amount of time spent on site
 * @param {String} site Site
 * @param {Date} date Timestamp representing the end of the session
 */
export async function addTime(minutes, site, date) {
  //check if it's a new week (start of the week is Sunday at midnight)
  //a timestamp is stored representing Sunday at midnight of the current week
  /* if the extension is not used for multiple weeks (i.e. addTime() doesn't get called for more than one week), 
  it'll update such that previousWeek is the last week on record and thisWeek is the correct week */

  let times = await storage.getTimes();
  const lastSunday = new Date(times.timestamp);
  const nextSunday = new Date(lastSunday);
  nextSunday.setDate(nextSunday.getDate() + 7);
  if (!(lastSunday < date < nextSunday)) {
    await this.newWeek();
    times = await storage.getTimes();
  }
  //total time spent on this site this week
  const totalTime = (times["thisWeek"][date.getDay()][site] || 0) + minutes;
  times["thisWeek"][date.getDay()][site] = totalTime;
  storage.save("times", times);
}

/**
 * Handles the logic of switching to a new week
 */
export async function newWeek() {
  const times = await storage.getTimes();
  //sets lastWeek to thisWeek
  times.lastWeek = times.thisWeek;
  //resets thisWeek's records
  times.thisWeek = defaultWeek;
  //update timestamp to the start of this week
  const timestamp = new Date(times.timestamp);
  timestamp.setDate(timestamp.getDate() + 7);
  times.timestamp = timestamp.toJSON();
  await storage.save(times);
}

/**
 * Handles the logic of ending a session (a continuous period of activity
 * on a watched site) and storing its relevant data
 *
 * @param {Date} sessionStart Timestamp representing the beginning of the session
 * @param {String} site
 */
export async function endSession(sessionStart, site) {
  //this code should never execute, but who knows with async stuff
  if (sessionStart == null) return;

  const sessionEnd = new Date();
  if (!this.isSameDay(sessionStart, sessionEnd)) {
    /* if the session spans two different days (ex: 11:55pm-12:05am),
    add 5 minutes to the previous day and set sessionStart to midnight of the new day.
    this way, sessionStart and sessionEnd are guaranteed to be on the same date. */
    const midnight = new Date(sessionEnd.getTime());
    midnight.setHours(0, 0, 0, 0);
    const minutesOnPreviousDay = (midnight - sessionStart) / 1000 / 60;
    this.addTime(minutesOnPreviousDay, site, sessionStart);
    sessionStart = midnight;
  }
  const elapsedMinutes = (sessionEnd - sessionStart) / 1000 / 60;
  this.addTime(elapsedMinutes, site, sessionEnd);
}

/**
 * Closes all tabs that contain a watched site
 */
export async function removeAllWatchedSites() {
  const openWatchedTabIDs = (await getOpenWatchedSites()).map((tab) => tab.id);
  chrome.tabs.remove(openWatchedTabIDs);
}

/**
 * Fully fades all buckets
 */
export async function lockAllWatchedSites() {
  const buckets = await storage.getBuckets();
  for (const bucketID in Object.keys(buckets)) {
    buckets[bucketID]["percentFaded"] = 100;
    buckets[bucketID]["lastActive"] = Date.now();
  }
  console.log(buckets);
  storage.save("buckets", buckets);
}

/**
 * Formats a time represented by minutes to a string (ex: 67.5 --> 1hr 7min)
 * @param {Number} Number of minutes
 */
export function formatMinutes(value) {
  const hours = Math.floor(value / 60);
  const minutes = Math.floor(value % 60);
  const seconds = Math.round((value % 1) * 60);
  if (hours === 0) {
    if (seconds === 0) {
      return minutes + "min";
    } else if (minutes === 0) {
      return seconds + "sec";
    } else {
      return minutes + "min " + seconds + "sec";
    }
  } else if (hours === 1) {
    return hours + "hrs " + minutes + "min";
  } else {
    return hours + "hr " + minutes + "min";
  }
}
