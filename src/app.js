require("dotenv").config();
const nunjucks = require("nunjucks");
const express = require("express");
const path = require("path");


const app = express();
const { init: initCarModule } = require("./module/car/module");
const { init: initReserveModule } = require("./module/reserve/module");
const configureDependencyInjectionContainer = require("./config/di");

nunjucks.configure("src/module", {
	autoescape: true,
	express: app,
});

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));
app.use("/node_modules", express.static("node_modules"));
app.use(express.urlencoded({ extended: true }));

const container = configureDependencyInjectionContainer();

app.use(container.get("Session"));

initCarModule(app, container);
initReserveModule(app, container);

const carController = container.get("CarController");

app.get("/", carController.index.bind(carController));


app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
