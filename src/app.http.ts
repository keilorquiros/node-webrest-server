import http from "http";
import fs from "fs";

const server = http.createServer((req, res) => {
  // const data = { name: "John", age: 30, city: "New York" };
  // res.writeHead(200, { "Content-Type": "application/json" });
  // res.end(JSON.stringify(data));

  if (req.url === "/") {
    const htmlFile = fs.readFileSync("./public/index.html", "utf8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlFile);
    return;
  }

  try {
    if (req.url?.endsWith(".js")) {
      res.writeHead(200, { "Content-Type": "text/javascript" });
    } else if (req.url?.endsWith(".css")) {
      res.writeHead(200, { "Content-Type": "text/css" });
    }

    const responseContent = fs.readFileSync(`./public${req.url}`, "utf8");
    res.end(responseContent);
  } catch (error) {
    console.log("Ocurrio un error");
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end();
  }
});

server.listen(8080, () => {
  console.log("Listening on port 8080");
});
