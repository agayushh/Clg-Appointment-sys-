"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const app_1 = require("./app");
const db_1 = require("./db/db");
(0, dotenv_1.config)({
    path: ".env",
});
const port = Number(process.env.PORT) || 3000;
(0, db_1.connectToDb)()
    .then(() => {
    app_1.app.listen(port, () => {
        console.log(`server is listening on port ${port}`);
    });
})
    .catch((error) => {
    console.log(`Database connection error ${error}`);
});
