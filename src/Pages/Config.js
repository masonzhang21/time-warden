/*global chrome*/
import React, { Component } from "react";
import Bucket from "../Components/Bucket";
import BucketItem from "../Components/BucketItem";
import * as storage from "../Util/storage";
import { Button, Spinner, Popover, OverlayTrigger } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";
import Switch from "react-switch";
import * as utils from "../Util/utils";
import { defaultBucket } from "../Util/defaults";

export class Config extends Component {
  constructor() {
    super();
    this.state = {
      options: undefined,
      buckets: undefined,
    };
    chrome.storage.onChanged.addListener(async (changes) => {
      if (changes["buckets"]) {
        this.setState({ buckets: await storage.getBuckets() });
      }
      if (changes["options"] && "newValue" in changes["options"]) {
        this.setState({ options: changes["options"].newValue });
      }
    });
    this.retrieveBuckets();
    this.retrieveOptions();
  }

  toggleSpontaneousCombustion = (checked) => {
    let options = this.state.options;
    options["spontaneousCombustion"] = checked;
    storage.save("options", options);
  };

  retrieveBuckets = async () => {
    const buckets = await storage.getBuckets();
    this.setState({ buckets: buckets });
  };

  retrieveOptions = async () => {
    const options = await storage.getOptions();
    this.setState({ options: options });
  };

  handleBucketEdit = (bucketId, key, newValue) => {
    let updatedBuckets = this.state.buckets;
    updatedBuckets[bucketId][key] = newValue;
    storage.save("buckets", updatedBuckets);
  };

  removeBucket = async (id) => {
    let buckets = this.state.buckets;
    let storedSites = await storage.getSites();
    for (const site of buckets[id].bucketSites) {
      delete storedSites[site];
    }
    delete buckets[id];
    storage.save("buckets", buckets);
    storage.save("sites", storedSites);
  };

  addBucket = () => {
    let bucketKeys = Object.keys(this.state.buckets);
    let bucketId;
    bucketKeys.sort();
    if (bucketKeys.length === 0) {
      bucketId = 0;
    } else {
      bucketId = Number(bucketKeys.pop()) + 1;
    }
    storage.save("buckets", {
      ...this.state.buckets,
      [bucketId]: defaultBucket,
    });
  };

  loadingElement = () => (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );

  bucketElements = () => {
    const bucketIds = Object.keys(this.state.buckets);
    return (
      <div className="wh100">
        {bucketIds.map((id) => {
          const bucket = this.state.buckets[id];
          console.log(bucket, this.state.buckets[id], id, this.state.buckets);
          return (
            <Bucket
              key={id}
              id={id}
              editMode={false}
              data={bucket}
              handleRemoval={this.removeBucket}
              handleChange={this.handleBucketEdit}
            />
          );
        })}
      </div>
    );
  };

  optionsElement = () => {
    return (
      <div className="mt-2" style={{ display: "flex", alignItems: "center" }}>
        <Switch
          checked={this.state.options.spontaneousCombustion}
          onChange={(checked, event, id) =>
            this.toggleSpontaneousCombustion(checked)
          }
        />
        <p className="ml-3" style={{ margin: 0 }}>
          Spontaneous Combustion
        </p>
      </div>
    );
  };

  render() {
    const home = {
      display: "flex",
      flexDirection: "column",
    };
    const header = {
      fontSize: "40px",
      margin: 0,
      fontFamily: "Rowdies, cursive",
      textAlign: "left",
    };
    const buckets = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    };
    const popover = (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Popover Top</Popover.Title>
        <Popover.Content>
          And here's some <strong>amazing</strong> content. It's very engaging.
          right?
        </Popover.Content>
      </Popover>
    );
    return (
      <div className="px-3 wh100" style={home}>
        <div
          className="mt-3"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={header}>Buckets</h1>

          <OverlayTrigger trigger="hover" placement="top" overlay={popover}>
                       <InfoCircle />
          </OverlayTrigger>

          <Button style={{ height: "40px" }} onClick={this.addBucket}>
            Add Bucket
          </Button>
        </div>

        <div className="mt-3" style={buckets}>
          {this.state.buckets ? this.bucketElements() : this.loadingElement()}
        </div>
        <div className="mt-3">
          <h1 style={header}>Options</h1>
          {this.state.options ? this.optionsElement() : this.loadingElement()}
        </div>
      </div>
    );
  }
}

export default Config;
