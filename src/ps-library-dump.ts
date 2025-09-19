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

interface ResultItem {
  title: string;
  price: number;
}

const result: ResultItem[] = [];

const messages = {
  "no-elements": "unable to find messages list element",
  "no-element": "unable to find message list element",
  "empty-list": "unable to find elements in list",
  "no-click": "element doesn't have click handler",
};

const wait = (sec: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
};

const clickElement = (element: Element) => {
  const isHTMLElement = element instanceof HTMLElement;
  if (isHTMLElement && typeof element.click === "function") {
    element.click();
  } else {
    console.error(messages["no-click"]);
  }
};

const getMessagesList = () => {
  const elements = document.getElementsByTagName("tbody");
  if (elements.length === 0) throw Error(messages["no-elements"]);
  let list: HTMLTableSectionElement | null = null;
  for (const element of elements) {
    const hasChildren = element.children.length > 1;
    const hasContent = element.outerText.length > 0;
    if (!hasChildren || !hasContent) continue;
    list = element;
    break;
  }
  if (!list) throw Error(messages["no-element"]);
  return list;
};

const getAllReadableTableHeaders = () => {
  const result: HTMLTableCellElement[] = [];
  const headers = document.getElementsByTagName("th");
  for (const header of headers) {
    if (!header.outerText.includes("Сведения")) continue;
    result.push(header);
  }
  return result;
};

const getReadableRows = (headers: HTMLTableCellElement[]): HTMLElement[] => {
  const result: HTMLElement[] = [];
  for (const header of headers) {
    const body = header?.parentElement?.parentElement || null;
    if (!body) continue;
    result.push(body);
  }
  return result;
};

const readContent = () => {
  const headers = getAllReadableTableHeaders();
  const rows = getReadableRows(headers);
  console.log("rows", rows);
};

const processListItem = async (item: Element, idx: number) => {
  console.info(`starting to process ${idx} element on a page`);
  clickElement(item);
  await wait(1);
  readContent();
};

const parseList = async (list: HTMLTableSectionElement) => {
  if (list.children.length === 0) throw Error(messages["empty-list"]);
  for (let idx = 0; idx < list.children.length; idx++) {
    const item = list.children[idx];
    await processListItem(item, idx);
    break;
  }
};

const start = () => {
  const list = getMessagesList();
  parseList(list);
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
