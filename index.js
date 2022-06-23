const express = require("express");
const config = require("config");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/db")();
require("./startup/logging")();



const PORT = process.env.PORT || config.get("port");
app.listen(PORT, () => console.log(`Listening on ${PORT}...`))