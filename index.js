import express from "express";
import cors from "cors";
import { readFileSync, existsSync, rmSync } from "fs";
import fileSystem from "fs";
import { display_element, download_element, input_element } from "./model.js";

const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/post_input_element", async (req, res) => {
  let data = await input_element(req.body);
  res.status(201).send(JSON.stringify({ message: data }));
});

//cara 2
app.get("/get_display_element/:id", async (req, res) => {
  let elements = await display_element(req.params.id);
  res.status(200).send(JSON.stringify(elements));
});

app.post("/post_download_element", async (req, res) => {
  let target = req.body.target;
  let elems = req.body.elements.split(",");
  let x = "";
  for (var i = 0; i < elems.length; i++) {
    if (i == 0) x = "'" + elems[0] + "'";
    else x += ",'" + elems[i] + "'";
  }

  let html = readFileSync("element/" + target + ".txt", "utf-8");
  let code = await download_element(target, x);

  let css = "";
  for (var i = 0; i < elems.length; i++) {
    var j = 0;
    var ketemu = false;
    while (j < elems.length && ketemu == false) {
      if (code[j]["kode"] == elems[i]) {
        ketemu = true;
      } else j++;
    }
    if (ketemu == true) {
      css += code[j]["script_css"] + "\r\n";
    }
  }
  html = html.toString();
  html = html.replace("[LETAK_STYLE]", css);

  let the_body = "";
  for (var i = 0; i < elems.length; i++) {
    var j = 0;
    var ketemu = false;
    while (j < elems.length && ketemu == false) {
      if (code[j]["kode"] == elems[i]) {
        ketemu = true;
      } else j++;
    }
    if (ketemu == true) {
      the_body += "<section>\r\n";
      the_body += code[j]["script_html"] + "\r\n";
      the_body += "</section>\r\n";
    }
  }
  html = html.toString();
  html = html.replace("[LETAK_BODY]", the_body);

  const fileName = "gadawangi.html";
  const fileType = "text/html";
  res.writeHead(200, {
    "Content-Disposition": `attachment; filename="${fileName}"`,
    "Content-Type": fileType,
  });
  const download = Buffer.from(html, "UTF-8");
  res.end(download);
});

app.listen(port, () => console.log(`Server port ${port}`));
