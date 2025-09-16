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

const getMessagesList = () => {
  const elements = window.document.getElementsByTagName("tbody");
  if (elements.length === 0) {
    throw Error("unable to find messages list element");
  }
  if (!elements[5]) {
    throw Error("unable to find message list element");
  }
  return elements[5];
};

(function () {
  "use strict";

  const list = getMessagesList();
  console.info("list", list);
})();
