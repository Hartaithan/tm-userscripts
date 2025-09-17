// ==UserScript==
// @name         PlayStation Library Dump
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  empty description!
// @author       hartaithan
// @match        https://mail.google.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

const messages = {
  "no-elements": "unable to find messages list element",
  "no-element": "unable to find message list element",
};

const getMessagesList = () => {
  const elements = window.document.getElementsByTagName("tbody");
  if (elements.length === 0) throw Error(messages["no-elements"]);
  const list = elements[4];
  if (!list) throw Error(messages["no-element"]);
  return list;
};

const start = () => {
  const list = getMessagesList();
  console.info("list", list);
};

(function () {
  "use strict";

  window.addEventListener("load", () => {
    button.textContent = "Start";
    button.disabled = false;
    button.style.backgroundColor = "#121212";
    button.style.cursor = "pointer";
    button.onclick = start;
  });

  const button = document.createElement("button");
  button.textContent = "Loading...";
  button.disabled = true;

  Object.assign(button.style, {
    position: "absolute",
    bottom: "64px",
    left: "24px",
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed",
    zIndex: "1000",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  });

  document.body.appendChild(button);
})();
