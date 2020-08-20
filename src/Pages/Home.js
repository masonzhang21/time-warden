import React, { Component } from "react";
import { Button, Spinner, OverlayTrigger, Popover } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";
import * as functions from "../Utils/functions";
import * as constants from "../Utils/constants";
export class Home extends Component {
  constructor() {
    super();
    //good: whether it's green (no watched sites open) or red (1+ watched sites open)
    this.state = {
      loading: true,
      good: false,
      blackoutInitiated: false,
    };
    functions.getOpenWatchedSites().then((sites) => {
      if (sites.length === 0) {
        //no watched sites are open
        this.setState({ good: true });
      }
      this.setState({ loading: false });
    });
  }

  /**
   * Closes all watched sites
   */
  handleNuke = () => {
    this.setState({ good: true });
    functions.removeAllWatchedSites();
  };

  /**
   * Locks all sites in all buckets (sets percent faded to 100)
   */
  handleBlackout = () => {
    this.setState({ blackoutInitiated: true });
    functions.lockAllWatchedSites();
  };

  /**
   * Displayed when a watched site is open
   */
  bad = () => {
    const button = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    };
    //Info explanation for the nuke button
    const nukePopover = (
      <Popover>
        <Popover.Title>
          <i>Operation: Destroy Evil</i>
        </Popover.Title>
        <Popover.Content>
          <p style={{ fontSize: "12px" }}>
            Closes all tabs that the Time Warden is watching over
          </p>
        </Popover.Content>
      </Popover>
    );
    return (
      <div style={{ color: constants.blue }}>
        <img
          className="mb-3"
          src={require("../Resources/redEye.png")}
          alt=""
          draggable="false"
          style={{ height: "100px" }}
        />
        <p style={{ fontSize: "24px" }}>THE TIME WARDEN IS WATCHING YOU</p>
        <p style={{ fontSize: "20px" }}>...and she's dissapointed.</p>

        <Button
          className="mt-4"
          variant="danger"
          size="lg"
          onClick={this.handleNuke}
          style={button}
          block
        >
          <p>
            Execute <i>Operation: Destroy Evil</i>
          </p>
          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="bottom"
            overlay={nukePopover}
          >
            <InfoCircle
              style={{
                fontSize: "16px",
                position: "absolute",
                right: "20px",
              }}
            />
          </OverlayTrigger>
        </Button>
      </div>
    );
  };

  /**
   * Displayed when no watched tabs are open
   */
  good = () => {
    const button = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    };
    // Info explanation for the blackout button
    const blackoutPopover = (
      <Popover>
        <Popover.Title>
          <i>Operation: Total Blackout</i>
        </Popover.Title>
        <Popover.Content>
          <p style={{ fontSize: "12px" }}>Sets all tabs to maximum darkness</p>
        </Popover.Content>
      </Popover>
    );
    return (
      <div style={{ color: constants.blue }}>
        <img
          className="mb-3"
          src={require("../Resources/greenSmiley.png")}
          alt=""
          draggable="false"
          style={{ height: "100px" }}
        />
        <p style={{ fontSize: "24px" }}>THE TIME WARDEN IS WATCHING YOU</p>
        <p style={{ fontSize: "20px" }}>
          {this.state.blackoutInitiated
            ? "...and she's so proud!"
            : "...and she wants you to click the button."}
        </p>
        <Button
          className="mt-4"
          variant="success"
          size="lg"
          onClick={this.handleBlackout}
          disabled={this.state.blackoutInitiated}
          style={button}
          block
        >
          {this.state.blackoutInitiated ? (
            "Operation complete. All sites locked."
          ) : (
            <p>
              Execute <i>Operation: Total Blackout</i>
            </p>
          )}
          {!this.state.blackoutInitiated && (
            <OverlayTrigger
              trigger={["hover", "focus"]}
              placement="bottom"
              overlay={blackoutPopover}
            >
              <InfoCircle
                style={{
                  fontSize: "16px",
                  position: "absolute",
                  right: "20px",
                }}
              />
            </OverlayTrigger>
          )}
        </Button>
      </div>
    );
  };

  render() {
    const page = {
      display: "flex",
      flexDirection: "column",
    };
    const header = {
      fontSize: "60px",
      margin: 0,
      fontFamily: "Rowdies, cursive",
    };
    const container = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      flexGrow: 1,
    };
    return (
      <div className="px-3" style={page}>
        <p style={header}>Time Warden </p>
        <div className="mt-3" style={container}>
          {this.state.loading ? <Spinner/> : this.state.good ? this.good() : this.bad()}
        </div>
      </div>
    );
  }
}

export default Home;
