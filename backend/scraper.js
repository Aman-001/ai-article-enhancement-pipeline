const puppeteer = require("puppeteer");
const Article = require("./model/Article");
const connectDB = require("./config/db");

 connectDB();

async function scrapeLastBlogs() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu"
    ],
    timeout: 0
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  await page.goto("https://beyondchats.com/blogs/", {
    waitUntil: "networkidle0"
  });

  // Wait for articles to render before querying
  await page.waitForSelector("article h2 a", { timeout: 10000 });

  // Find last page information from pagination
  const { lastHref, lastNum } = await page.evaluate(() => {
    const firstPage = "https://beyondchats.com/blogs/";

    const lastRelEl = Array.from(document.querySelectorAll("a.page-numbers")).find(
      (el) => el.getAttribute("rel") === "last"
    );

    const nums = Array.from(document.querySelectorAll("a.page-numbers"))
      .map((el) => parseInt(el.textContent.trim(), 10))
      .filter((n) => Number.isFinite(n));

    const maxNum = nums.length ? Math.max(...nums) : 1;

    return {
      lastHref: lastRelEl?.href || (maxNum > 1 ? `${firstPage}page/${maxNum}/` : firstPage),
      lastNum: maxNum
    };
  });

  const firstPage = "https://beyondchats.com/blogs/";
  const pageUrlFor = (pageNumber) =>
    pageNumber <= 1 ? firstPage : `${firstPage}page/${pageNumber}/`;

  const collected = [];
  let current = lastNum || 1;

  // Walk backwards from the last page until we collect 5 oldest entries
  while (collected.length < 5 && current >= 1) {
    const targetUrl = current === lastNum && lastHref ? lastHref : pageUrlFor(current);

    await page.goto(targetUrl, { waitUntil: "networkidle0" });
    await page.waitForSelector("article h2 a", { timeout: 10000 });

    const pageArticles = await page.evaluate(() => {
      const nodes = document.querySelectorAll("article");
      const data = [];

      nodes.forEach((node) => {
        const anchor = node.querySelector("h2 a");
        const title = anchor?.innerText?.trim();
        const link = anchor?.href;

        if (title && link) {
          data.push({ title, link });
        }
      });

      return data;
    });

    // Reverse to keep oldest-first order per page
    collected.push(...pageArticles.reverse());
    current -= 1;
  }

  const lastFive = collected.slice(0, 5);

  for (let article of lastFive) {
  await Article.create(article);
}
console.log("Articles saved to database");


  await browser.close();
}

scrapeLastBlogs();
