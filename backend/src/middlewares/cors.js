const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;
