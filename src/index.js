const express = require("express");
const rateLimit = require("express-rate-limit");
const { ServerConfig, Logger } = require("./config");
const { AuthMiddleware } = require("./middlewares");

const apiRoutes = require("./routes");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.get("/serverInfo", AuthMiddleware.checkAuth, async ( req, res) => {
  console.log("INSIDE SERVER INFO");
  res.send("User Logged");
})

app.use(
  rateLimit(
    {
      windowMs: 2*60*1000,
      max: 15
    }
  )
);

app.use(express.json());
app.use("/api", apiRoutes);
app.use("/flightService", AuthMiddleware.checkAuth, AuthMiddleware.isAdmin, createProxyMiddleware({
  target: ServerConfig.FLIGHTS_URL,
  changeOrigin: true,
  pathRewrite: { 
    '^/flightsService' : '/'
  }
}))

app.use("/bookingService", AuthMiddleware.checkAuth, createProxyMiddleware({
  target: ServerConfig.BOOKING_URL, 
  changeOrigin: true,
  pathRewrite: { 
    '^/bookingService' : '/'
  }
}))

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  Logger.info("Successfully started the server", "root", { msg: "something" });
});
