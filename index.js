const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected successfully"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.port || 4000, () => {
  console.log("Backend server is running");
});
