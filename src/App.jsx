import { useState, useEffect } from "react";

const API_URL = "https://growth-backend-udim.onrender.com/api/posts";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setPosts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ title: "Post sans titre", content }),

    });

    if (res.ok) {
      setContent("");
      fetchPosts();
    } else {
      console.error("Erreur lors de la publication.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

return (
  <main className="max-w-2xl mx-auto py-8 px-4 font-sans bg-white text-gray-900">
    <h1 className="text-4xl font-semibold mb-6 tracking-tight flex items-center gap-2">
      GROWTH <span className="text-2xl">🌱</span>
    </h1>

    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Exprime ton idée ici..."
        className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={3}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Publier
      </button>
    </form>

    <div className="space-y-6">
      {[...posts].reverse().map((post) => (
        <div key={post.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
          <p className="text-lg mb-2">{post.content}</p>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            {post.users?.avatar_url ? (
              <img
                src={post.users.avatar_url}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300" />
            )}
            <span>
              Publié par <strong>{post.users?.full_name || "Anonyme"}</strong>
              {" — "}
              {new Date(post.created_at).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Catégorie : {post.category || "Sans catégorie"}
          </p>
        </div>
      ))}
    </div>
  </main>
);


