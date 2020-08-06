import React, { Component } from "react";
import Utils from "../Util/utils";
import { Accordion, Card, InputGroup } from "react-bootstrap";
import BucketItem from "./BucketItem";
import Storage from "../Util/storage";
export class Bucket extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      editMode: false,
      collapsed: true,
      nameInput: "",
      decayInput: "",
      regenInput: "",
      addSiteInput: "",
    };
    Storage.getTimes().then(console.log)
  }
  edit(key, value) {
    this.props.handleChange(this.props.id, key, value);
  }

  saveEdits() {
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
    this.setState({
      nameInput: "",
      decayInput: "",
      regenInput: "",
    });
  }

  addSite = async (e) => {
    e.preventDefault();
    const sites = await Storage.getSites();
    const potentialSiteURL = Utils.urlStemmer(this.state.addSiteInput);
    if (!(potentialSiteURL in sites)) {
      this.edit("bucketSites", this.props.data.bucketSites.concat(potentialSiteURL));
      Storage.save("sites", {
        ...sites,
        [potentialSiteURL]: { bucketId: this.props.id, timeSpent: 0, lastUpdated: new Date().toJSON()},
      });
      this.setState({ addSiteInput: "" });
    } else {
      //TO-DO: Display validation error
    }
  };

  removeSite = async (siteToRemove) => {
    const watchedSites = await Storage.getSites();
    delete watchedSites[siteToRemove];
    const updatedBucketSites = this.props.data.bucketSites.filter(
      (i) => i !== siteToRemove
    );
    this.edit("bucketSites", updatedBucketSites);
    Storage.save("sites", watchedSites);
  };

  render() {
    const bucket = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "bottom",
      height: "30px",
    };

    const button = {
      padding: 0,
      height: "100%",
      border: 0,
    };
    const setting = {
      display: "flex",
      alignItems: "center",
      backgroundImage: "linear-gradient(to right, #4f5d75, #ef8354)",
    };
    const settingName = {
      margin: 0,
      padding: 0,
      fontSize: "14px",
    };
    const settingInput = {
      border: this.state.editMode ? "1px solid gray" : 0,
      borderRadius: 0,
      margin: 0,
      padding: 0,
      fontSize: this.state.editMode ? "12px" : "24px",
      height: "36px",
      width: "55px",
      background: !this.state.editMode && "transparent",
    };

    const generateIconElement = (src, onClick) => (
      <input
        className="mx-2"
        type="image"
        src={src}
        alt=""
        draggable="false"
        style={button}
        onClick={onClick}
      />
    );
    const collapseButton = generateIconElement(
      this.state.collapsed
        ? require("../Resources/downarrow.png")
        : require("../Resources/uparrow.png"),
      () => this.setState({ collapsed: !this.state.collapsed })
    );
    const editButton = generateIconElement(
      require("../Resources/edit.svg"),
      () => this.setState({ editMode: true })
    );
    const saveEditsButton = generateIconElement(
      require("../Resources/check.png"),
      () => {
        this.saveEdits();
        this.setState({ editMode: false });
      }
    );
    const deleteEditsButton = generateIconElement(
      require("../Resources/remove.png"),
      () => this.setState({ editMode: false })
    );
    const removeButton = generateIconElement(
      require("../Resources/remove.png"),
      () => this.props.handleRemoval(this.props.id)
    );
    const sites = this.props.data.bucketSites.map((site) => (
      <BucketItem
        key={site}
        site={site}
        showRemove={this.state.editMode}
        handleRemoval={this.removeSite}
      />
    ));
    return (
      <div>
        <Accordion>
          <Card>
            <Card.Header>
              <div style={bucket}>
                <input
                  style={{
                    ...settingInput,
                    fontSize: this.state.editMode ? "20px" : "28px",
                    width: "250px",
                  }}
                  placeholder={this.state.editMode ? "Bucket Name" : undefined}
                  value={
                    this.state.editMode
                      ? this.state.nameInput
                      : this.props.data.name
                  }
                  onChange={(e) => this.setState({ nameInput: e.target.value })}
                  disabled={!this.state.editMode}
                  type="text"
                />
                <div style={{ height: "100%", display: "flex" }}>
                  <Accordion.Toggle
                    eventKey="0"
                    style={{ ...button, background: "transparent" }}
                  >
                    {collapseButton}
                  </Accordion.Toggle>
                  {this.state.editMode ? saveEditsButton : editButton}
                  {this.state.editMode ? deleteEditsButton : removeButton}
                </div>
              </div>
              <div
                className="mt-2"
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <div style={setting}>
                  <p className="px-1" style={settingName}>
                    Decay
                  </p>
                  <input
                    className="px-1"
                    style={settingInput}
                    placeholder={this.state.editMode ? "minutes" : undefined}
                    value={
                      this.state.editMode
                        ? this.state.decayInput
                        : this.props.data.decay
                    }
                    onChange={(e) =>
                      this.setState({ decayInput: e.target.value })
                    }
                    disabled={!this.state.editMode}
                    type="number"
                    min="1"
                    max="999"
                  />
                </div>
                <div className="ml-1" style={setting}>
                  <p className="px-1" style={settingName}>
                    Regen
                  </p>
                  <input
                    className="px-1"
                    style={settingInput}
                    placeholder={this.state.editMode ? "minutes" : undefined}
                    value={
                      this.state.editMode
                        ? this.state.regenInput
                        : this.props.data.regen
                    }
                    onChange={(e) =>
                      this.setState({ regenInput: e.target.value })
                    }
                    disabled={!this.state.editMode}
                    type="number"
                    min="1"
                    max="999"
                  />
                </div>
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                {sites}
                <form
                  className="mt-3"
                  onSubmit={this.addSite}
                  style={{
                    height: "25px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "16px",
                  }}
                >
                  <input
                    placeholder={"Add a website"}
                    style={{ height: "100%" }}
                    type="url"
                    ref={this.myRef}
                    value={this.state.addSiteInput}
                    onChange={(e) => {
                      this.setState({ addSiteInput: e.target.value });
                    }}
                  />
                  <input
                    type="image"
                    style={{ height: "100%" }}
                    src={require("../Resources/add1.png")}
                    alt="submit"
                  />
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}

export default Bucket;
