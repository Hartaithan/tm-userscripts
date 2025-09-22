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
  price: string;
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
  if (elements.length === 0) {
    console.info("elements", elements);
    throw Error(messages["no-elements"]);
  }
  let list: HTMLTableSectionElement | null = null;
  for (const element of elements) {
    const hasChildren = element.children.length >= 1;
    const hasContent = element.outerText.length > 0;
    if (!hasChildren || !hasContent) continue;
    list = element;
    break;
  }
  if (!list) {
    console.info("list", list);
    throw Error(messages["no-element"]);
  }
  return list;
};

const getAllReadableTableHeaders = () => {
  const headers: HTMLTableCellElement[] = [];
  const elements = document.getElementsByTagName("th");
  for (const element of elements) {
    if (!element.outerText.includes("Сведения")) continue;
    headers.push(element);
  }
  return headers;
};

const getReadableRows = (headers: HTMLTableCellElement[]): HTMLElement[] => {
  const rows: HTMLElement[] = [];
  for (const header of headers) {
    const body = header?.parentElement?.parentElement || null;
    if (!body) continue;
    rows.push(body);
  }
  return rows;
};

const readContent = () => {
  const headers = getAllReadableTableHeaders();
  const rows = getReadableRows(headers);

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const children = row?.children;
    for (let idx = 0; idx < children.length; idx++) {
      const child = children[idx].children;
      const length = child.length || 0;
      if (idx === 0 || length === 0) continue;
      const title = child?.[0].textContent.trim() || "Not Found";
      const price = child?.[length - 1].textContent.trim() || "Not Found";
      result.push({ title, price });
      console.log("result", result);
    }
  }
};

const processListItem = async (item: Element, idx: number, total: number) => {
  console.info(`starting to process ${idx}/${total} element on a page`, item);
  clickElement(item);
  await wait(2);
  readContent();
  window.history.back();
  await wait(2);
};

const parseList = async (list: HTMLTableSectionElement) => {
  const total = list.children.length;
  if (total === 0) throw Error(messages["empty-list"]);
  for (let idx = 0; idx < total; idx++) {
    const item = list.children[idx];
    await processListItem(item, idx, total);
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
