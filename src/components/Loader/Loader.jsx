import React from "react";
import loader from "./loader.gif";

export default function Loader() {
  return (
    <div style={{ textAlign: "center" }}>
      <img src={loader} alt="" style={{ width: "60px" }} />
    </div>
  );
}
