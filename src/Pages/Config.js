/*global chrome*/
import React, { Component } from "react";
import Bucket from "../Components/Bucket";
import BucketItem from "../Components/BucketItem";
import Storage from "../Util/storage";
import { Button, Spinner, Form } from "react-bootstrap";
import Switch from "react-switch";
import utils from "../Util/utils";
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
        this.setState({ buckets: await Storage.getBuckets() });
      }
      if (changes["options"] && "newValue" in changes["options"]) {
        console.log("RC", changes);
        this.setState({ options: changes["options"].newValue });
      }
    });
    this.retrieveBuckets();
    this.retrieveOptions();
  }

  toggleSpontaneousCombustion = (checked) => {
    let options = this.state.options;
    options["spontaneousCombustion"] = true;
    Storage.save("options", options);
  };

  retrieveBuckets = async () => {
    const buckets = await Storage.getBuckets();
    this.setState({ buckets: buckets });
  };

  retrieveOptions = async () => {
    const options = await Storage.getOptions();
    this.setState({ options: options });
  };

  handleBucketEdit = (bucketId, key, newValue) => {
    let updatedBuckets = this.state.buckets;
    updatedBuckets[bucketId][key] = newValue;
    Storage.save("buckets", updatedBuckets);
  };

  removeBucket = async (id) => {
    let buckets = this.state.buckets;
    let storedSites = await Storage.getSites();
    for (const site of buckets[id].bucketSites) {
      delete storedSites[site];
    }
    delete buckets[id];
    Storage.save("buckets", buckets);
    Storage.save("sites", storedSites);
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
    Storage.save("buckets", {
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
