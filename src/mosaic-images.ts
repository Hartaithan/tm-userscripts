// ==UserScript==
// @name         Platinum Mosaic Images
// @namespace    http://tampermonkey.net/
// @version      2025-08-03
// @description  empty description!
// @author       hartaithan
// @match        https://plat.grayriver.dk
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const updateLinks = () => {
    let platinums = new Map();
    try {
      const data = localStorage.getItem("vuex");
      const parsed = JSON.parse(data ?? "[]");
      for (const element of parsed?.user?.platinums) {
        const platinum = {
          id: element?.game_id,
          mosaic_image: element?.hires_url,
          psnp_image: element?.imgurl,
        };
        platinums.set(platinum.id, platinum);
      }
    } catch (error) {
      console.log("unable to read platinum list", error);
    }

    let broken = [];
    try {
      const mosaic = document.getElementById("mosaic");
      const elements = mosaic?.children || [];
      for (let index = 1; index < elements.length; index++) {
        const element = elements[index];
        const image = element.children[0].children[0] as HTMLImageElement;
        if (image.naturalWidth === 0) {
          broken.push({ id: element.id, image });
        }
      }
    } catch (error) {
      console.log("unable to get broken images", error);
    }

    try {
      for (let index = 0; index < broken.length; index++) {
        const element = broken[index];
        const data = platinums.get(element.id);
        // TODO: load images trough proxy
        element.image.src = data.psnp_image;
        element.image.style.width = "90px";
        element.image.style.height = "90px";
      }
    } catch (error) {
      console.log("unable to fix broken image", error);
    }
  };

  const button = document.createElement("button");
  button.textContent = "Loading...";
  button.disabled = true;

  Object.assign(button.style, {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed",
    zIndex: "1000",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  });

  document.body.appendChild(button);

  window.onload = () => {
    button.textContent = "Update Links";
    button.disabled = false;
    button.style.backgroundColor = "#007bff";
    button.style.cursor = "pointer";
    button.onclick = updateLinks;
  };
})();
