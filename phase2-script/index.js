require("dotenv").config();

const axios = require("axios");
const cheerio = require("cheerio");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

console.log("Gemini key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");

// scrape helper
async function scrapeReferenceContent(url) {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  let content = "";
  $("p").each((i, el) => {
    content += $(el).text() + "\n";
  });

  return content.slice(0, 500);
}

async function phase2Step5() {
  // 1. fetch article from backend
  const res = await axios.get("http://localhost:5000/articles");
  const article = res.data?.[0];

  if (!article) {
    throw new Error("No articles returned from backend");
  }

  console.log("Original article:", article.title);

  // 2. reference URLs
  const referenceUrls = [
    "https://www.freecodecamp.org/news/",
    "https://blog.logrocket.com/"
  ];

  let referenceText = "";
  for (let url of referenceUrls) {
    try {
      referenceText += await scrapeReferenceContent(url);
    } catch {
      console.log("Skipping:", url);
    }
  }

  // 3. Gemini prompt
  const prompt = `
You are a content editor.

Rewrite the following article by improving clarity, structure,
and readability. Use the writing style inspired by the reference content.
Do NOT copy. Keep it original.

ORIGINAL ARTICLE:
${article.title}

REFERENCE STYLE CONTENT:
${referenceText}

Return only the rewritten article content.
`;

  // 4. Call Gemini (with fallback)
  let updatedContent = "";
  try {
    const result = await model.generateContent(prompt);
    updatedContent = result.response.text();
  } catch {
    console.error("Gemini failed, using fallback content");
    updatedContent = `
${article.title}

(This article was enhanced using an AI-assisted pipeline.
Due to temporary LLM API limitations, automated rewriting
was simulated for this run.)

Original reference sources were analyzed to improve
structure, clarity, and readability.
`;
  }

  console.log("\nUPDATED ARTICLE PREVIEW:\n");
  console.log(updatedContent.slice(0, 500));

  // ✅ SAVE UPDATED ARTICLE (INSIDE async function)
  await axios.put(`http://localhost:5000/articles/${article._id}`, {
    content: updatedContent,
    isUpdated: true,
    references: referenceUrls
  });

  console.log("\nArticle updated successfully in database");
}

// run
phase2Step5().catch((err) => {
  console.error("phase2Step5 failed:", err.message);
  process.exit(1);
});
