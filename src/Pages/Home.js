import React, { Component } from "react";
import { Button, Spinner } from "react-bootstrap";
import * as utils from "../Util/utils";
export class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      good: false,
      nuked: false,
    };
    utils.getOpenWatchedSites().then((sites) => {
      if (sites.length === 0) {
        this.setState({ good: true });
      }
      this.setState({ loading: false });
    });
  }

  handleNuke = () => {
    this.setState({ good: true, nuked: true });
    utils.removeAllWatchedSites();
  };

  handleBlackout = () => {
    this.setState({ nuked: true });

    utils.lockAllWatchedSites();
  };
  bad = () => {
    return (
      <React.Fragment>
        <img
          className="mb-3"
          src={require("../Resources/redeye.png")}
          alt=""
          draggable="false"
          style={{ height: "100px" }}
        />
        <p style={{ color: "#4281a4", margin: 0 }}>
          BIG BROTHER IS WATCHING YOU
        </p>
        <p style={{ color: "#4281a4", margin: 0, fontSize: "20px" }}>
          ...and he's dissapointed.
        </p>

        <Button
          className="mt-4"
          variant="danger"
          size="lg"
          onClick={this.handleNuke}
          block
        >
          Nuke All Bad Tabs
        </Button>
      </React.Fragment>
    );
  };

  good = () => {
    console.log(this.state.nuked);
    return (
      <React.Fragment>
        <img
          className="mb-3"
          src={require("../Resources/greensmiley.png")}
          alt=""
          draggable="false"
          style={{ height: "100px" }}
        />
        <p style={{ color: "#4281a4", margin: 0 }}>
          BIG BROTHER IS WATCHING YOU
        </p>
        <p style={{ color: "#4281a4", margin: 0, fontSize: "20px" }}>
          {this.state.nuked
            ? "...and he's so proud!"
            : "...and he wants you to click the button."}
        </p>

        <Button
          className="mt-4"
          variant="success"
          size="lg"
          onClick={this.handleBlackout}
          disabled={this.state.nuked}
          block
        >
          {this.state.nuked
            ? "Operation complete. All sites locked."
            : "Execute Preemptive Strike: Total Blackout"}
        </Button>
      </React.Fragment>
    );
  };
  render() {
    const home = {
      display: "flex",
      flexDirection: "column",
      //backgroundImage: "gray"
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
      <div className="px-3 wh100" style={home}>
        <p style={header}>Time Warden </p>
        <div className="mt-3" style={container}>
          {this.state.loading ? (
            <Spinner animation="border" role="status" />
          ) : this.state.good ? (
            this.good()
          ) : (
            this.bad()
          )}
        </div>
      </div>
    );
  }
}

export default Home;
