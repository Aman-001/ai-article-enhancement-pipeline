import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchArticleById } from "../services/api";

function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticleById(id)
      .then((res) => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="container">Loading article...</p>;
  if (!article) return <p className="container">Article not found</p>;

  return (
    <div className="container">
      <Link to="/" style={{ fontSize: "14px" }}>← Back</Link>

      <h1 style={{ marginTop: "20px" }}>{article.title}</h1>

      <a
        href={article.link}
        target="_blank"
        rel="noreferrer"
        style={{ display: "inline-block", marginBottom: "20px" }}
      >
        🔗 Visit Original Source
      </a>

      {article.isUpdated ? (
        <>
          <h2 style={{ marginTop: "30px" }}>✨ Updated Article</h2>

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              whiteSpace: "pre-wrap",
              lineHeight: "1.7",
              marginTop: "10px"
            }}
          >
            {article.content}
          </div>

          <h3 style={{ marginTop: "30px" }}>📚 References</h3>
          <ul>
            {article.references?.map((ref, index) => (
              <li key={index}>
                <a href={ref} target="_blank" rel="noreferrer">
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p style={{ marginTop: "20px", color: "#6b7280" }}>
          This article has not been enhanced yet.
        </p>
      )}
    </div>
  );
}

export default Article;
