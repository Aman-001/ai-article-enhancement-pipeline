import React, { useEffect, useState } from "react";
import { fetchArticles } from "../services/api";
import { Link } from "react-router-dom";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles()
      .then((res) => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="container">Loading articles...</p>;

  return (
    <div className="container">
      <h1 style={{ marginBottom: "20px" }}>📚 Article Dashboard</h1>
      <p style={{ marginBottom: "30px", color: "#6b7280" }}>
        View original and AI-enhanced articles with references
      </p>

      {articles.map((article) => (
        <div
          key={article._id}
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h3 style={{ marginBottom: "8px" }}>{article.title}</h3>

            <span
              style={{
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                backgroundColor: article.isUpdated ? "#dcfce7" : "#fee2e2",
                color: article.isUpdated ? "#166534" : "#991b1b"
              }}
            >
              {article.isUpdated ? "Updated" : "Original"}
            </span>
          </div>

          <Link
            to={`/article/${article._id}`}
            style={{
              padding: "8px 14px",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          >
            View →
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Home;
