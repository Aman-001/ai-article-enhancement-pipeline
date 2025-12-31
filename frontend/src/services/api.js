import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

export const fetchArticles = () => API.get("/articles");
export const fetchArticleById = (id) => API.get(`/articles/${id}`);
