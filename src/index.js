const express = require("express");
const rateLimit = require("express-rate-limit");
const { ServerConfig, Logger } = require("./config");
const { AuthMiddleware } = require("./middlewares");

const apiRoutes = require("./routes");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
  rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 15, // Limit each IP to 5 requests per `window`.
  })
);

app.use('/flightService', AuthMiddleware.checkAuth, AuthMiddleware.isAdmin, createProxyMiddleware({ 
  target: ServerConfig.FLIGHTS_URL, 
  changeOrigin: true,
  pathRewrite: { 
    '^/flight Service' : '/'
  }
}));


app.use('/bookingService', AuthMiddleware.checkAuth, createProxyMiddleware({ 
  target: ServerConfig.BOOKING_URL, 
  changeOrigin: true,
  pathRewrite: { 
    '^/bookingService' : '/'
  }
}));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  Logger.info("Successfully started the server", "root", { msg: "something" });
});
