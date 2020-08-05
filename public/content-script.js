/*global chrome location*/
const { default: utils } = require("../src/Util/utils");
const { default: storage } = require("../src/Util/storage");
function numOpenTabsInBucket(id) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { query: "numOpenTabs", bucketId: id },
      (response) => {
        resolve(response);
      }
    );
  });
}

let sessionStart;


function trackTimeSpentOnSite() {
  sessionStart = new Date();
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      sessionStart = new Date();
    } else {
      sessionStart = undefined
      utils.endTrackerSession(sessionStart);
    }
  });
}
//assume site exists and is watched
async function addOverlay() {
  trackTimeSpentOnSite();
  const url = utils.urlStemmer(location.href);
  const site = await utils.getSite(url);
  const bucket = await utils.getBucketFromUrl(url);
  let percentFaded = bucket.percentFaded;
  console.log("%faded", percentFaded);

  const { decay, regen, lastActive } = bucket;
  //calculates regenerated time
  const minutesSinceLastActive = (Date.now() - lastActive) / (1000 * 60);
  if ((await numOpenTabsInBucket(site.bucketId)) === 1) {
    const percentRegenerated = Math.round(
      (minutesSinceLastActive / regen) * 100
    );
    percentFaded = Math.max(0, percentFaded - percentRegenerated);
    await utils.updateBucket(site.bucketId, "percentFaded", percentFaded);
    console.log(
      "lastActive",
      minutesSinceLastActive,
      "%regen",
      percentRegenerated
    );
  }

  //rate at which the opacity is updated (in ms)
  const tickFrequency = 3000;
  const decayPerTick = (tickFrequency / (1000 * 60) / decay) * 100;
  console.log(decay, decayPerTick);

  let overlay = document.createElement("div");
  overlay.id = "tint";
  const css = {
    position: "fixed" /* keeps the screen covered durning scroll */,
    zIndex: 100000 /* puts it on top of everything */,
    top: 0,
    left: 0,
    minWidth: "100vw",
    minHeight: "100vh",
    backgroundColor: "black",
    opacity: 0,
    transition: "opacity 0.5s",
    pointerEvents: "none" /* so we can click through it */,
  };
  Object.assign(overlay.style, css);
  if (document.getElementById("tint") != null) {
    return;
  }
  document.body.appendChild(overlay);
  const tick = async () => {
    let storedPercentFaded = await utils.getBucketFromId(site.bucketId);
    storedPercentFaded = storedPercentFaded.percentFaded;
    if (document.visibilityState === "visible") {
      percentFaded = storedPercentFaded + decayPerTick;
      console.log(percentFaded);
      utils.updateBucket(site.bucketId, "percentFaded", percentFaded);
      document.getElementById("tint").style.opacity = percentFaded / 100;
    }
    if (percentFaded >= 100) {
      percentFaded = 100;
      clearInterval(ticker);
    }
  };
  setTimeout(tick, 30);
  const ticker = setInterval(tick, tickFrequency);

  window.onbeforeunload = () => {
    chrome.runtime.sendMessage({ query: "cleanup", bucketId: site.bucketId, siteURL: url, sessionStart: sessionStart });
    return undefined;
  };
}
addOverlay();

//whenever endSession() is called, do a check to update timeSinceLastActive stamps
//to enforce regen: 1) when possibly using regen, check if there's any tabs in bucket and 2) only update lastActive if this is the last tab in the bucket
