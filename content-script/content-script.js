/*global chrome*/
import * as functions from "../src/Utils/functions";
import * as storage from "../src/Utils/storage";

//Date object representing the start of the current session
//A session is a period of time where the tab is visible, denoted by sessionStart and sessionEnd
//sessionStart is undefined between sessions (e.g. when another tab is focused)
let sessionStart;
//URL of the site
const site = functions.getSiteName(window.location.href);

/**
 * wrapper for functions.isLastOpenTabInBucket, which can't be directly used since
 * chrome.tabs can't be accessed in a content script
 *
 * @param {Number} bucketID
 */
function isLastOpenTabInBucket(bucketID) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { query: "isLastOpenTabInBucket", bucketID: bucketID },
      (response) => resolve(response)
    );
  });
}

/**
 * Adds the overlay div to the page's html
 */
function attachOverlay() {
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
  //Prevents content script from attaching twice (in theory this check is not necessary)
  if (document.getElementById("tint") != null) throw Error;
  document.body.appendChild(overlay);
}

/**
 * Sets everything up
 */
async function setup() {
  const bucketID = await functions.getBucketID(site);
  // catches a strange case where addOverlay() activates when the extension is clicked on
  if (bucketID == null || site == null) return;
  sessionStart = new Date();
  const bucket = await functions.getBucket(bucketID);
  const { decay, regen, lastActive } = bucket;
  let percentFaded = bucket.percentFaded;
  if (await isLastOpenTabInBucket(bucketID)) {
    //there are no other tabs open that are in the same bucket as this tab
    //unfades tab based on away time
    const minutesSinceLastActive = (Date.now() - lastActive) / (1000 * 60);
    const percentRegenerated = (minutesSinceLastActive / regen) * 100;
    percentFaded = Math.max(0, percentFaded - percentRegenerated);
    await functions.updateBucket(bucketID, "percentFaded", percentFaded);
  }
  attachOverlay();
  //rate at which the opacity is updated (in ms)
  const tickFrequency = 1000;
  const decayPerTick = (tickFrequency / (1000 * 60) / decay) * 100;
  //needed for the initial transition effect
  setTimeout(() => {
    document.getElementById("tint").style.opacity = percentFaded / 100;
  }, 0);

  //if the spontaneous combustion option is on, chooses a percentFaded to close the tab at
  const shouldCombust = (await storage.getOptions()).spontaneousCombustion;
  const chanceOfCombustion = 0.5;
  let decayToCombustAt;
  if (shouldCombust && Math.random() < chanceOfCombustion) {
    decayToCombustAt = Math.random() * (100 - percentFaded) + percentFaded;
  } else {
    decayToCombustAt = undefined;
  }
  const tick = async () => {
    console.log(percentFaded)
    //always syncs with storage on each tick
    //when multiple tabs from the same bucket are open, you might lose a tick here and there
    let storedPercentFaded = (await functions.getBucket(bucketID)).percentFaded;
    percentFaded = storedPercentFaded + decayPerTick;
    if (percentFaded > 100) {
      percentFaded = 100;
      clearInterval(ticker);
    }
    if (decayToCombustAt != null && percentFaded > decayToCombustAt) {
      chrome.runtime.sendMessage({query: "close"})
    }
    functions.updateBucket(bucketID, "percentFaded", percentFaded);
    document.getElementById("tint").style.opacity = percentFaded / 100;
  };
  let ticker = setInterval(tick, tickFrequency);

  document.addEventListener("visibilitychange", function () {
    //removes the ticker when the tab is not active and reattaches it when it becomes active
    //probably an unnecessary optimization (alternative: check visibility on each tick)
    if (document.visibilityState === "visible") {
      ticker = setInterval(tick, tickFrequency);
      sessionStart = new Date();
    } else {
      clearInterval(ticker);
      functions.endSession(sessionStart, site);
      sessionStart = undefined;
    }
  });

  window.onbeforeunload = () => {
    if (sessionStart == null) return;
    //offloads cleanup code to background script
    chrome.runtime.sendMessage({
      query: "cleanup",
      bucketID: bucketID,
      site: site,
      sessionStart: sessionStart.toJSON(),
    });
  };
}

setup();
