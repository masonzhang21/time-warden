/*global chrome*/
import { defaultBucket, defaultWeek } from "./defaults";

export default {
  getData(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result) => {
        result[key] ? resolve(result[key]) : resolve(undefined);
      });
    });
  },
  getBuckets() {
    return new Promise((resolve) => {
      chrome.storage.sync.get("buckets", (response) => {
        if (Object.keys(response).length === 0) {
          this.save("buckets", { 0: defaultBucket });
          resolve({ 0: defaultBucket });
        } else {
          resolve(response.buckets);
        }
      });
    });
  },
  getSites() {
    return new Promise((resolve) => {
      chrome.storage.sync.get("sites", (response) => {
        if (Object.keys(response).length === 0) {
          this.save("sites", {});
          resolve({});
        } else {
          resolve(response.sites);
        }
      });
    });
  },
  getTimes() {
    return new Promise((resolve) => {
      chrome.storage.sync.get("times", (response) => {
        if (Object.keys(response).length === 0) {
          const lastSunday = new Date();
          
          lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
          lastSunday.setHours(0, 0, 0, 0);
          const defaultTimes = {
            thisWeek: defaultWeek,
            lastWeek: defaultWeek,
            timestamp: lastSunday,
          };
          this.save("times", defaultTimes);
          resolve({ defaultTimes });
        } else {
          resolve(response.times);
        }
      });
    });
  },
  getOptions() {
    return new Promise((resolve) => {
      chrome.storage.sync.get("options", (response) => {
        if (Object.keys(response).length === 0) {
          const defaultOptions = {
            spontaneousCombustion: false,
          };
          this.save("options", defaultOptions);
          resolve(defaultOptions);
        } else {
          resolve(response.options);
        }
      });
    });
  },

  /**
   * @description save in storage
   * @param {string} key - the key used in saving the record is the date
   * @param {object} value - value to save in the sync storage
   */
  save(key, value) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        resolve();
      });
    });
  },
  clear() {
    return new Promise((resolve) => {
      chrome.storage.sync.clear(() => {
        resolve();
      });
    });
  },
};
