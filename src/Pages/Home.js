import React, { Component } from "react";
import { Button } from "react-bootstrap";

export class Home extends Component {
  constructor() {
    super();
    this.state = {
      good: false,
    };
  }

  handleNuke = () => {
    this.setState({good: true})
  }

  handleBlackout = () => {
    this.setState({good: false})

  }
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
        <p style={{ color: "#4281a4", margin: 0 }}>BIG BROTHER IS WATCHING YOU</p>
        <p style={{ color: "#4281a4", margin: 0, fontSize: "20px" }}>...and he's dissapointed.</p>

        <Button className="mt-4" variant="danger" size="lg" onClick={this.handleNuke} block>
          Nuke All Bad Tabs
        </Button>
      </React.Fragment>
    );
  };

  good = () => {
    return (
        <React.Fragment>
          <img
            className="mb-3"
            src={require("../Resources/greensmiley.png")}
            alt=""
            draggable="false"
            style={{ height: "100px" }}
          />
          <p style={{ color: "#4281a4", margin: 0 }}>BIG BROTHER IS WATCHING YOU</p>
          <p style={{ color: "#4281a4", margin: 0, fontSize: "20px"}}>...and he wants you to click the button.</p>

          <Button className="mt-4" variant="success" size="lg" onClick={this.handleBlackout} block>
            Execute Preemptive Strike: Total Blackout
          </Button>
        </React.Fragment>
      );
  }
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
          {this.state.good ? this.good() : this.bad()}
        </div>
      </div>
    );
  }
}

export default Home;
