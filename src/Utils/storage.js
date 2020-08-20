/*global chrome*/
import { defaultBucket, defaultWeek } from "./defaults";

/**
 * Retrieves the value of a key
 * @param {String} key
 */
export function getData(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      result[key] ? resolve(result[key]) : resolve(undefined);
    });
  });
}

/**
 * Retrieves the buckets,
 * e.g. {0: defaultBucket, 1: defaultBucket}
 */
export function getBuckets() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("buckets", (response) => {
      if (Object.keys(response).length === 0) {
        save("buckets", { 0: defaultBucket });
        resolve({ 0: defaultBucket });
      } else {
        resolve(response.buckets);
      }
    });
  });
}

/**
 * Retrieves the sites,
 * e.g. {google.com: 1, instagram.com: 2, facebook.com: 2}
 */
export function getSites() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("sites", (response) => {
      if (Object.keys(response).length === 0) {
        save("sites", {});
        resolve({});
      } else {
        resolve(response.sites);
      }
    });
  });
}

/**
 * Retrieves the times,
 * e.g. {lastWeek: {0: {facebook.com: 32.4, instagram.com: 11}, 1: {}, ..., 6: {}},
 *       currentWeek: {0: {}, ..., 6: {facebook.com: 14}},
 *       timestamp: "2020-03-09T22:18:26.625Z"}
 */
export function getTimes() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("times", (response) => {
      if (Object.keys(response).length === 0) {
        const lastSunday = new Date();
        lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
        lastSunday.setHours(0, 0, 0, 0);
        const defaultTimes = {
          thisWeek: defaultWeek,
          lastWeek: defaultWeek,
          timestamp: lastSunday.toJSON(),
        };
        save("times", defaultTimes);
        resolve(defaultTimes);
      } else {
        resolve(response.times);
      }
    });
  });
}

/**
 * Retrieves the options,
 * e.g. {spontaneousCombustion: false, ...}
 */
export function getOptions() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("options", (response) => {
      if (Object.keys(response).length === 0) {
        const defaultOptions = {
          spontaneousCombustion: false,
        };
        save("options", defaultOptions);
        resolve(defaultOptions);
      } else {
        resolve(response.options);
      }
    });
  });
}

/**
 * @description Save in storage
 * @param {string} key - the key used in saving the record is the date
 * @param {object} value - value to save in the sync storage
 */
export function save(key, value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve();
    });
  });
}

/**
 * Clears storage
 */
export function clear() {
  return new Promise((resolve) => {
    chrome.storage.sync.clear(() => {
      resolve();
    });
  });
}
