import React, { useState } from "react";

/**
 * Site favicon + abbreviated URL
 * @param {*} props 
 */
export default function Site(props) {
  const [imageExists, setImageExists] = useState(false);
  let imgUrl = "https://" + props.site + "/favicon.ico";

  //tests if a favicon exists at the above url
  let image = document.createElement("img");
  image.src = imgUrl;
  image.onload = () => {
    setImageExists(true);
  };
  image.onerror = () => {
    setImageExists(false);
  };

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center"}}>
      <img
        className="mx-2"
        src={imageExists ? imgUrl : require("../Resources/missingImage.png")}
        alt=""
        style={{
          height: "100%"
        }}
      ></img>
      {props.site}
    </div>
  );
}
