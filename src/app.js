const dotenv = require("dotenv").config();
const nunjucks = require("nunjucks");
const express = require("express");
const path = require("path");


const app = express();

nunjucks.configure("src/module", {
	autoescape: true,
	express: app,
});

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));
app.use("/node_modules", express.static("node_modules"));


app.get("/", (req, res) => {
	res.render("car/view/index.html");
});


app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
