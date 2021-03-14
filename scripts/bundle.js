const dom = require("jsdom");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const OUT = path.resolve(process.cwd(), "out");
const INDEX = path.resolve(OUT, "index.html");
const page = new dom.JSDOM(fs.readFileSync(INDEX));
const crpyto = require("crypto");
const p = [];
[...page.window.document.querySelectorAll("*[src]")].forEach((el) => {
  console.log(el.src);
  if (el.src) {
    el.innerHTML = fs.readFileSync(path.join(OUT, el.src), "utf-8");
  }
  el.removeAttribute("src");
  el.removeAttribute("async");
});
[...page.window.document.querySelectorAll(`link[rel="preload"]`)].forEach(
  (el) => {
    el.remove();
  }
);
//<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/tonsky/FiraCode@4/distr/fira_code.css" />
[...page.window.document.querySelectorAll(`link[rel="stylesheet"]`)].forEach(
  (el) => {
    if (el.getAttribute("rel") === "stylesheet") {
      const style = page.window.document.createElement("style");
      if (el.href.startsWith("http")) {
        p.push(
          new Promise((resolve) => {
            fetch(el.href)
              .then((res) => res.text())
              .then((value) => {
                style.innerHTML = value;
                el.replaceWith(style);
                resolve();
              });
          })
        );
      } else {
        style.innerHTML = fs.readFileSync(path.join(OUT, el.href), "utf-8");
        el.replaceWith(style);
      }
    }
  }
);

Promise.all(p).then(() => {
  fs.writeFileSync(path.join(OUT, "dist.html"), page.serialize());
  const pass = page.window.document.body.innerHTML;
  crpyto.createHmac("sha256", pass).update();
});
