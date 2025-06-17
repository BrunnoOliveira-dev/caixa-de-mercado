const express = require("express");
const router = express.Router();
const path = require("path");
const uuid = require("uuid");

const pages_views = path.join(__dirname, "../../front_end/pages");

router.get("/", (req, res) => {
    res.sendFile(path.join(pages_views, "Home.html"));
});

router.get("/caixa", (req, res) => {
    res.sendFile(path.join(pages_views, "Caixa.html"));
});

router.get("/estoque", (req, res) => {
    res.sendFile(path.join(pages_views, "Estoque.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(pages_views, "Login.html"));
});

module.exports = router;