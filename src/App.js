/*global chrome*/

import React, { useState } from "react";
import "./App.css";
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Pages/Home";
import Config from "./Pages/Config";
import ScreenTime from "./Pages/ScreenTime";
import * as Constants from "./Util/constants"
function App() {
  const [key, setKey] = useState("screentime");
  const app = {
    textAlign: "center",
    display: 'flex',
    flexDirection: 'column',
    fontSize: 'calc(1rem + 2vmin)',
    color: Constants.darkBlue, 
  }
  const tabContainer = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 'calc(1rem + 1vmin)',
  };
  const tab = {
    backgroundColor: Constants.offWhite,
    overflow: "auto"
  }
  const header = {
    display: 'flex',
    backgroundColor: Constants.blue,
  }
  return (
    <div className="wh100" style={app}>
      <header className="pt-3" style={header}>
        <img
            className="mx-3 mb-1"
              src={require("./Resources/logo.png")}
              alt=""
              draggable="false"
              style={{width: "50px", height: "50px"}}
            />
        <Tabs
          style={tabContainer}
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="home" title="Home" style={{"color": Constants.darkBlue}}/>
          <Tab eventKey="config" title="Config" />
          <Tab eventKey="screentime" title="Screen Time" />
        </Tabs>
      </header>
      <div className="wh100" style={tab}>
      {key === "home" && <Home />}
      {key === "config" && <Config />}
      {key === "screentime" && <ScreenTime />}
      </div>
      
    </div>
  );
}

export default App;
