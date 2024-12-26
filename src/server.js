require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./index");

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    server = app.listen(process.env.port, () => {
      console.log(`app is listening on port ${process.env.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
