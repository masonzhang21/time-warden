/*global chrome*/
import React, { Component } from "react";
import Bucket from "../Components/Bucket";
import * as storage from "../Utils/storage";
import { Button, Spinner, Popover, OverlayTrigger } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";
import Switch from "react-switch";
import { defaultBucket } from "../Utils/defaults";
import * as constants from "../Utils/constants";

export class Config extends Component {
  constructor() {
    super();
    this.state = {
      options: undefined,
      buckets: undefined,
    };
    storage.getBuckets().then((buckets) => this.setState({ buckets: buckets }));
    storage.getOptions().then((options) => this.setState({ options: options }));

    //the values in storage are the source of truth
    chrome.storage.onChanged.addListener((changes) => {
      if (changes["buckets"] && "newValue" in changes["buckets"]) {
        storage.getBuckets().then((buckets) => this.setState({ buckets }));
      }
      if (changes["options"] && "newValue" in changes["options"]) {
        this.setState({ options: changes["options"].newValue });
      }
    });
  }

  /**
   * Handler for when the spontaneous combustion switch is flipped
   * @param {Boolean} checked
   */
  toggleSpontaneousCombustion = (checked) => {
    const options = this.state.options;
    options["spontaneousCombustion"] = checked;
    storage.save("options", options);
  };

  /**
   * Changes a bucket's property (by updating the property in storage)
   * Shortcut: using this.state.buckets instead of reading from storage
   * @param {Number} bucketId The bucket to edit
   * @param {String} key The property to change
   * @param {*} newValue The new property value
   */
  editBucket = (bucketId, key, newValue) => {
    const updatedBuckets = this.state.buckets;
    updatedBuckets[bucketId][key] = newValue;
    storage.save("buckets", updatedBuckets);
  };

  /**
   * Removes a bucket
   * @param {Number} id The bucket to remove
   */
  removeBucket = async (id) => {
    const buckets = this.state.buckets;
    const storedSites = await storage.getSites();
    for (const site of buckets[id].bucketSites) {
      delete storedSites[site];
    }
    delete buckets[id];
    storage.save("buckets", buckets);
    storage.save("sites", storedSites);
  };

  /**
   * Adds a bucket
   */
  addBucket = () => {
    //simple way to find a unique ID for the new bucket
    const bucketKeys = Object.keys(this.state.buckets);
    bucketKeys.sort();
    const bucketId = bucketKeys.length === 0 ? 0 : Number(bucketKeys.pop()) + 1;
    storage.save("buckets", {
      ...this.state.buckets,
      [bucketId]: defaultBucket,
    });
  };

  /**
   * Spinner displayed when elements are loading
   */
  loadingElement = (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );

  /**
   * Rows of buckets
   */
  bucketsElement = () => {
    const bucketIds = Object.keys(this.state.buckets);
    return (
      <div>
        {bucketIds.map((id) => (
          <Bucket
            key={id}
            id={id}
            editMode={false}
            data={this.state.buckets[id]}
            handleRemoval={this.removeBucket}
            handleEdit={this.editBucket}
          />
        ))}
      </div>
    );
  };

  /**
   * Rows of options
   */
  optionsElement = () => {
    return (
      <div className="mt-2" style={{ display: "flex", alignItems: "center" }}>
        <Switch
          checked={this.state.options.spontaneousCombustion}
          onChange={(checked) => this.toggleSpontaneousCombustion(checked)}
          onColor={constants.blue}
        />
        <p className="ml-3" style={{ margin: 0, fontSize: "20px" }}>
          Spontaneous Combustion
        </p>
      </div>
    );
  };

  /**
   * Info explanation for how buckets work
   */
  bucketPopover = (
    <Popover style={{ width: "480px" }}>
      <Popover.Title as="h3">How buckets work</Popover.Title>
      <Popover.Content>
        <p style={{ fontSize: "12px" }}>
          Think of each bucket as a container for websites. You can place any
          number of sites in the same bucket, and they'll share time. All sites
          in the same bucket are synced - spending time on one will cause all to
          fade away. Use them to customize how long you're allowed to spend on
          different sites. <br />
          <br />
          Each bucket has a decay rate and regeneration rate. The decay rate
          determines how fast time runs out, while the regeneration rate
          determines how fast you get time back. A decay rate of 10 means that
          you can spend 10 minutes on the sites in the bucket before they fully fade away. A
          regen rate of 10 means that you need to wait 10 minutes for a fully faded site
          to completely unfade.
          <br />
          <br />
          Note that sites only decay when they're the active tab, and sites only
          regen while when every tab in the bucket is closed. If a site in a
          bucket is open but not the active tab, it's in limbo.
        </p>
      </Popover.Content>
    </Popover>
  );

  /**
   * Info explanation for the different options
   */
  optionsPopover = (
    <Popover style={{ width: "480px" }}>
      <Popover.Title as="h3">Options</Popover.Title>
      <Popover.Content>
        <p style={{ fontSize: "12px" }}>
          More to be added soon!
          <br /> <br />
          <strong style={{fontSize: "14px"}}>Spontaneous combustion</strong> <br />
          If turned on, sites have a chance of randomly closing once they reach
          a high level of decay.
        </p>
      </Popover.Content>
    </Popover>
  );

  render() {
    const home = {
      display: "flex",
      flexDirection: "column",
    };
    const header = {
      margin: 0,
      textAlign: "left",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    };

    return (
      <div className="px-3 my-3" style={home}>
        <div style={header}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1 className="mr-3" style={{ fontFamily: "Rowdies, cursive" }}>
              Buckets
            </h1>
            <OverlayTrigger
              trigger={['hover', 'focus']}
              placement="bottom"
              overlay={this.bucketPopover}
            >
              <InfoCircle style={{ fontSize: "25px" }} />
            </OverlayTrigger>
          </div>
          <Button onClick={this.addBucket} variant="info">
            Add Bucket
          </Button>
        </div>
        {this.state.buckets ? this.bucketsElement() : this.loadingElement}
        <div className="mt-3" style={{ display: "flex", alignItems: "center" }}>
          <h1 className="mr-3" style={{ fontFamily: "Rowdies, cursive" }}>
            Options
          </h1>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={this.optionsPopover}
          >
            <InfoCircle style={{ fontSize: "25px" }} />
          </OverlayTrigger>
        </div>
        {this.state.options ? this.optionsElement() : this.loadingElement}
      </div>
    );
  }
}

export default Config;
