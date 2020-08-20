import React, { useState } from "react";
import "./App.css";
import { Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Pages/Home";
import Config from "./Pages/Config";
import ScreenTime from "./Pages/ScreenTime";
import * as Constants from "./Utils/constants";
function App() {
  const [tab, setTab] = useState("home");
  const app = {
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    color: Constants.darkBlue,
  };
  const tabContainer = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    fontSize: "20px",
    backgroundColor: Constants.darkBlue,
  };

  return (
    <div className="wh100" style={app}>
      <Tabs
      className="pt-2 pl-2"
        style={tabContainer}
        activeKey={tab}
        onSelect={(tab) => setTab(tab)}
      >
        <Tab eventKey="home" title="Home" />
        <Tab eventKey="config" title="Config" />
        <Tab eventKey="screentime" title="Screen Time" />
      </Tabs>
      <div
        className="wh100"
        style={{ backgroundColor: "white", overflow: "auto" }}
      >
        {tab === "home" && <Home />}
        {tab === "config" && <Config />}
        {tab === "screentime" && <ScreenTime />}
      </div>
    </div>
  );
}

export default App;
