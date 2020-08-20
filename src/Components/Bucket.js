import React, { Component } from "react";
import * as functions from "../Utils/functions";
import { Accordion, Card } from "react-bootstrap";
import BucketItem from "./BucketItem";
import * as storage from "../Utils/storage";
import GradientLabel from "./GradientLabel";
import AddSite from "./AddSite";
import {
  ArrowBarDown,
  ArrowBarUp,
  Check2,
  PencilSquare,
  TrashFill,
  XCircleFill,
} from "react-bootstrap-icons";

/**
 * Component displaying a bucket
 */
export class Bucket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      collapsed: true,
      nameInput: "",
      decayInput: "",
      regenInput: "",
    };
  }

  /**
   * Changes a property
   * @param {String} key The property to change
   * @param {String} value The new value of the property
   */
  edit(key, value) {
    this.props.handleEdit(this.props.id, key, value);
  }

  /**
   * Called when the check mark is pressed. Validatews and saves the edits made.
   */
  saveEdits() {
    //makes sure a number between 1 and 999 is entered
    const validateNum = (num) =>
      !isNaN(num) && num !== "" && num > 0 && num <= 999;

    if (validateNum(this.state.decayInput)) {
      this.edit("decay", Number(this.state.decayInput));
    }
    if (validateNum(this.state.regenInput)) {
      this.edit("regen", Number(this.state.regenInput));
    }
    if (this.state.nameInput !== "") {
      this.edit("name", this.state.nameInput);
    }
    //resets the tentative edit fields
    this.setState({
      nameInput: "",
      decayInput: "",
      regenInput: "",
    });
  }

  /**
   * Validates and adds a site to the bucket
   * @param {*} e
   */
  addSite = async (event) => {
    event.preventDefault();
    this.setState({ validated: true });
    if (!event.currentTarget.checkValidity()) return;
    const watchedSites = await storage.getSites();
    const potentialSite = functions.getSiteName(
      "https://" + this.state.addSiteInput
    );
    console.log(potentialSite);
    if (!(potentialSite in watchedSites)) {
      this.edit(
        "bucketSites",
        this.props.data.bucketSites.concat(potentialSite)
      );
      storage.save("sites", {
        ...watchedSites,
        [potentialSite]: this.props.id,
      });
      this.setState({ addSiteInput: "" });
    } else {
      this.setState({ siteAlreadyInBucketError: true });
    }
  };

  /**
   * Removes a site from the bucket
   * @param {*} siteToRemove
   */
  removeSite = async (siteToRemove) => {
    const watchedSites = await storage.getSites();
    delete watchedSites[siteToRemove];
    const updatedBucketSites = this.props.data.bucketSites.filter(
      (site) => site !== siteToRemove
    );
    this.edit("bucketSites", updatedBucketSites);
    storage.save("sites", watchedSites);
  };

  render() {
    const bucket = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: "30px",
    };

    const button = {
      padding: 0,
      height: "100%",
      border: 0,
      background: "transparent",
    };

    const invisibleButtonWrapper = {
      border: 0,
      margin: 0,
      padding: 0,
      backgroundColor: "transparent",
    };

    const nameInput = {
      border: "1px solid gray",
      fontSize: "20px",
      height: "36px",
      width: "250px",
      borderRadius: "5px",
    };
    const settingInput = {
      border: "1px solid gray",
      fontSize: "12px",
      height: "36px",
      width: "110px",
      borderRadius: "5px",
    };

    return (
      <Accordion>
        <Card>
          <Card.Header>
            <div style={bucket}>
              {this.state.editMode ? (
                <input
                  style={nameInput}
                  placeholder="Bucket Name"
                  value={this.state.nameInput}
                  onChange={(e) => this.setState({ nameInput: e.target.value })}
                  type="text"
                />
              ) : (
                <h1 style={{ fontSize: "28px" }}>{this.props.data.name}</h1>
              )}
              <div style={{ display: "flex", fontSize: "26px" }}>
                <Accordion.Toggle eventKey="0" style={button}>
                  {this.state.collapsed ? (
                    <ArrowBarDown
                      onClick={() =>
                        this.setState({ collapsed: !this.state.collapsed })
                      }
                    />
                  ) : (
                    <ArrowBarUp
                      onClick={() =>
                        this.setState({ collapsed: !this.state.collapsed })
                      }
                    />
                  )}
                </Accordion.Toggle>
                <button className="mx-2" style={invisibleButtonWrapper}>
                  {this.state.editMode ? (
                    <Check2
                      onClick={() => {
                        this.saveEdits();
                        this.setState({ editMode: false });
                      }}
                    />
                  ) : (
                    <PencilSquare
                      onClick={() => this.setState({ editMode: true })}
                    />
                  )}
                </button>
                <button style={invisibleButtonWrapper}>
                  {this.state.editMode ? (
                    <TrashFill
                      onClick={() => this.setState({ editMode: false })}
                    />
                  ) : (
                    <XCircleFill
                      onClick={() => this.props.handleRemoval(this.props.id)}
                    />
                  )}
                </button>
              </div>
            </div>
            <div
              className="mt-2"
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <div className="mr-1">
                {this.state.editMode ? (
                  <input
                    className="px-1 mr-1"
                    style={settingInput}
                    placeholder="Decay (minutes)"
                    value={this.state.decayInput}
                    onChange={(e) =>
                      this.setState({ decayInput: e.target.value })
                    }
                    type="number"
                    min="1"
                    max="999"
                  />
                ) : (
                  <GradientLabel
                    className="mr-1"
                    label="Decay"
                    value={this.props.data.decay}
                    width="110px"
                  />
                )}
              </div>
              <div>
                {this.state.editMode ? (
                  <input
                    className="px-1"
                    style={settingInput}
                    placeholder="Regen (minutes)"
                    value={this.state.regenInput}
                    onChange={(e) =>
                      this.setState({ regenInput: e.target.value })
                    }
                    type="number"
                    min="1"
                    max="999"
                  />
                ) : (
                  <GradientLabel
                    label="Regen"
                    value={this.props.data.regen}
                    width="110px"
                  />
                )}
              </div>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              {this.props.data.bucketSites.map((site) => (
                <BucketItem
                  key={site}
                  site={site}
                  showRemove={this.state.editMode}
                  handleRemoval={this.removeSite}
                />
              ))}
              <AddSite
              className="mt-2"
                bucketID={this.props.id}
                addToBucket={(site) =>
                  this.edit(
                    "bucketSites",
                    this.props.data.bucketSites.concat(site)
                  )
                }
              />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default Bucket;
