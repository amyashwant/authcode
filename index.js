const express = require("express");
const app = express();
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { dbConnect } = require("./configuration/dbconfig");
dbConnect();

app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use("/api/v1", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`server at port ${PORT}`);
});
