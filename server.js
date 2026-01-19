
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");

const markets = [
  {
    pair: "BTC/USDT",
    lastPrice: 52410.2,
    change24h: 4.28,
    volume24h: "18.4B",
    trend: "Rising",
  },
  {
    pair: "ETH/USDT",
    lastPrice: 2840.55,
    change24h: 2.11,
    volume24h: "7.3B",
    trend: "Steady",
  },
  {
    pair: "SOL/USDT",
    lastPrice: 112.18,
    change24h: -1.82,
    volume24h: "1.2B",
    trend: "Cooling",
  },
  {
    pair: "BNB/USDT",
    lastPrice: 338.44,
    change24h: 0.92,
    volume24h: "842M",
    trend: "Stable",
  },
];

const portfolio = {
  totalBalance: 42518.4,
  dailyChange: 3.2,
  spotAssets: 29640.1,
  spotPnl: 1050.8,
  futuresMargin: 12878.3,
  futuresPnl: -240.5,
};

const alerts = [
  {
    title: "Funding rate update",
    detail: "BTC perpetual funding at 0.012% in 10m.",
    level: "info",
  },
  {
    title: "High volatility",
    detail: "SOL volatility spiked 18% in the last hour.",
    level: "warning",
  },
  {
    title: "System normal",
    detail: "All trading systems operational.",
    level: "success",
  },
];

const jsonResponse = (res, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
};

const sendNotFound = (res) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
};

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const serveStatic = (pathname, res) => {
  const safePath = path.normalize(pathname).replace(/^(.+[\/])+/, "");
  const filePath = path.join(publicDir, safePath || "index.html");

  if (!filePath.startsWith(publicDir)) {
    sendNotFound(res);
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendNotFound(res);
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (requestUrl.pathname === "/api/markets") {
    jsonResponse(res, { updatedAt: new Date().toISOString(), data: markets });
    return;
  }

  if (requestUrl.pathname === "/api/portfolio") {
    jsonResponse(res, { updatedAt: new Date().toISOString(), data: portfolio });
    return;
  }

  if (requestUrl.pathname === "/api/alerts") {
    jsonResponse(res, { updatedAt: new Date().toISOString(), data: alerts });
    return;
  }

  serveStatic(requestUrl.pathname, res);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${8080}`);
});