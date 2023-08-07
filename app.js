const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const port = 3001;

const app = express();

app.get("/", function (req, res) {
	console.log("Hi");
	res.status(200).json({ success: true, error: false, message: "Hello" });
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", path.join(__dirname,"views"));
app.set("port", port);
app.listen(port, function () {
	console.log(`App's running on port: ${port}`);
});
