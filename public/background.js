/*global chrome*/

import utils from "../src/Util/utils";
import Storage from "../src/Util/storage";
/*
let canChange = true;
async function endSession() {
  const prevSession = await Storage.getData("currentSession");
  await Storage.save("currentSession", null);
  console.log(prevSession.url, Date.now() - prevSession.startTime);
}

async function startSession(url) {
  const storedSession = await Storage.getData("currentSession");
  if (storedSession == null || storedSession.url !== url) {
    Storage.save("currentSession", {
      url: url,
      startTime: Date.now(),
    });
  }
}

async function something() {
  const prevSession = await Storage.getData("currentSession");
  const activeTab = await utils.getActiveTab();
  if (activeTab === undefined) {
    if (prevSession != null) {
      await endSession();
    }
  } else {
    const activeUrl = utils.urlStemmer(activeTab.url);
    const isWatchedSite = await utils.isWatchedSite(activeUrl);
    console.log("activeTab", activeUrl, prevSession, isWatchedSite);
    if (prevSession && activeUrl && prevSession.url !== activeUrl) {
      await endSession();
      if (isWatchedSite) {
        await startSession(activeUrl);
      }
    } else if (!prevSession && activeUrl && isWatchedSite) {
      await startSession(activeUrl);
    }
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeDetails, tab) => {
  console.log("update");
  if (canChange) {
    canChange = false;
    await something();
    canChange = true;
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log("activate");

  if (canChange) {
    canChange = false;
    await something();
    canChange = true;
  }
});
chrome.tabs.onRemoved.addListener(async (tabId, changeDetails, tab) => {
  console.log("remove");

  if (canChange) {
    canChange = false;
    await something();
    canChange = true;
  }
});

chrome.windows.onFocusChanged.addListener(async (window) => {
  console.log("focus");

  if (canChange) {
    canChange = false;
    await something();
    canChange = true;
  }
});
*/
chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
  if (request.query === "numOpenTabs") {
    utils.numOpenTabsInBucket(request.bucketId).then(sendResponse);
  } else if (request.query === "cleanup") {
    utils.numOpenTabsInBucket(request.bucketId).then((numOpen) => {
      if (numOpen === 1) {
        utils.updateBucket(request.bucketId, "lastActive", Date.now());
      }
    })
    utils.endTrackerSession(request.sessionStart, request.siteURL)
  }
  return true
});
chrome.webNavigation.onCompleted.addListener(async function (details) {
  if (details.frameId === 0 && details.parentFrameId === -1 && (await utils.isWatchedSite(details.url))) {
    console.log("Details", details)

    chrome.tabs.executeScript(details.tabId, {
      file: "content-script.js",
    });
  }})
