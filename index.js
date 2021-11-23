const http = require("http");
const fs = require("fs");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const card = fs.readFileSync(`${__dirname}/templates/cards.html`, "utf-8");
const product = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  const x = url.parse(req.url,true);
  console.log(x);
  
  if (pathname == "/" || pathname == "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const tempCard = dataObj.map((el) => replaceTemplate(card, el)).join("");
    const newCard = overview.replace("#card#", tempCard);
    res.end(newCard);
  } else if (pathname == "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const current_product = dataObj[query.id];
    const product_output = replaceTemplate(product, current_product);

    res.end(product_output);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h2>Page not found</h2>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening on port 8000");
});
