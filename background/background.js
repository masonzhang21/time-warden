/*global chrome*/

import * as utils from "../src/Util/utils";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.query === "isLastOpenTabInBucket") {
    //sends back (to the content script) the number of open tabs that belong to a bucket
    utils.isLastOpenTabInBucket(request.bucketID).then(sendResponse);
  } else if (request.query === "cleanup") {
    //runs cleanup code for when a watched tab is closed
    utils.isLastOpenTabInBucket(request.bucketID).then((isLast) => {
      if (isLast) {
        utils.updateBucket(request.bucketID, "lastActive", Date.now());
      }
    })
    utils.endSession(new Date(request.sessionStart), request.site);
  } else if (request.query === "close") {
      chrome.tabs.remove(sender.tab.id)
  }
  return true
});

chrome.webNavigation.onCompleted.addListener(async function (details) {
  //injects content script in the tabs of watched sites
  const isMainTab = details.frameId === 0 && details.parentFrameId === -1;
  const isWatchedSite = await utils.isWatchedSite(details.url)
  if (isMainTab && isWatchedSite) {
    chrome.tabs.executeScript(details.tabId, {
      file: "content-script.js",
    });
  }
});
