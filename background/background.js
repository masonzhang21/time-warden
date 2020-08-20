/*global chrome*/

import * as functions from "../src/Utils/functions";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.query === "isLastOpenTabInBucket") {
    //sends back (to the content script) the number of open tabs that belong to a bucket
    functions.isLastOpenTabInBucket(request.bucketID).then(sendResponse);
  } else if (request.query === "cleanup") {
    //runs cleanup code for when a watched tab is closed
    functions.isLastOpenTabInBucket(request.bucketID).then((isLast) => {
      if (isLast) {
        functions.updateBucket(request.bucketID, "lastActive", Date.now());
        chrome.browserAction.setBadgeText({ text: "OK." });
        chrome.browserAction.setBadgeBackgroundColor({ color: "green" });
      }
    });
    functions.endSession(new Date(request.sessionStart), request.site);
  } else if (request.query === "close") {
    //closes the tab
    chrome.tabs.remove(sender.tab.id);
  }
  return true;
});

chrome.webNavigation.onCompleted.addListener(async function (details) {
  //injects content script in the tabs of watched sites
  const isMainTab = details.frameId === 0 && details.parentFrameId === -1;
  const isWatchedSite = await functions.isWatchedSite(details.url);
  if (isMainTab && isWatchedSite) {
    chrome.tabs.executeScript(details.tabId, {
      file: "content-script.js",
    });
    chrome.browserAction.setBadgeText({ text: "BAD" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
  }
});
