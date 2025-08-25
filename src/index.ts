import { config } from "dotenv";
import { app } from "./app";
import { connectToDb } from "./db/db";

config({
  path: ".env",
});
const port = Number(process.env.PORT) || 3000;

connectToDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Database connection error ${error}`);
  });
