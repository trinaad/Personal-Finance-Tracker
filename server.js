const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const path = require("path");
const connectDb = require("./config/connectDb");

dotenv.config();

connectDb();

const app = express();

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);

app.use("/api/v1/users", require("./routes/userRoute"));
app.use("/api/v1/transections", require("./routes/transectionRoutes"));

// Serve React static files
app.use(express.static(path.join(__dirname, "client/build")));

// SPA fallback route - serve index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
