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
  if (!elements[4]) throw Error(messages["no-element"]);
  return elements[4];
};

(function () {
  "use strict";

  window.addEventListener("load", () => {
    const list = getMessagesList();
    console.info("list", list);
  });
})();
