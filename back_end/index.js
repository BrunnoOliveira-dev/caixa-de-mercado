const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const router = require("./router/router.js");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../front_end/src")));
app.use("/node_modules", express.static(path.join(__dirname, "./node_modules")));
app.use(router);



app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
