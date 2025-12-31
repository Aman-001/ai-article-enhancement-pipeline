const express = require("express");
const connectDB = require("./config/db");
const Article = require("./model/Article");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000"
}));


// connect DB
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("API running!");
});


// READ API routes
app.get("/articles", async (req, res) => {
  const articles = await Article.find()
    .sort({ createdAt: 1 })
    .limit(5);

  res.json(articles);
});


app.get("/articles/:id", async (req, res) => {
    const articles = await Article.findById(req.params.id);
    res.json(articles);
});

// CREATE API route
app.post("/articles", async (req, res) => {
  const article = await Article.create(req.body);
  res.json(article);
});

// UPDATE API route
app.put("/articles/:id", async (req, res) => {
  const updated = await Article.findByIdAndUpdate(
    req.params.id,
    req.body
  );
  res.json(updated);
});

// DELETE API route
app.delete("/articles/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ message: "Article deleted" });
});





const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
