const express = require("express");
const fs = require("fs");
const dsscripts = require("./dsscripts");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/retirada", (request, response) => {
  response.end(fs.readFileSync(__dirname + "/views/retirada.html"));
});

app.get("/form2", (request, response) => {
  response.end(fs.readFileSync(__dirname + "/views/form2.html"));
});

app.get("/form3", (request, response) => {
  response.redirect(fs.readFileSync(__dirname + "/views/form3.html"));
});

app.post("/teste", dsscripts.teste);

app.post("/retirada", dsscripts.desinstala);

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
