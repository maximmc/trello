// Серверная часть
const express = require('express');
const cors = require('cors');

const app = express();

app.listen(5000, () => {
    console.log("Server has started");
});