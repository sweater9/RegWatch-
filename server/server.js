const path = require("path");
const express = require("express");
const { getFeed } = require("./feed");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/feed", async (_req, res) => {
  try {
    const feed = await getFeed();
    res.json(feed);
  } catch (err) {
    res.status(500).json({ error: "Could not build the regulatory feed.", detail: String(err?.message || err) });
  }
});

app.listen(PORT, () => {
  console.log(`RegWatch server listening on port ${PORT}`);
});
