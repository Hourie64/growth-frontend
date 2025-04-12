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
  <main className="max-w-2xl mx-auto p-6 font-sans text-gray-800">
    <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
      🪴 GROWTH
    </h1>

    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <label className="block text-lg font-medium">💬 Exprime ton idée</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Exprime ton idée ici..."
        className="w-full border border-gray-300 rounded-lg p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        rows={4}
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
      >
        Publier
      </button>
    </form>

    <div className="space-y-6">
      {[...posts].reverse().map((post) => (
        <div
          key={post.id}
          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
        >
          <p className="text-lg font-medium">📝 {post.content}</p>

          <div className="flex items-center text-sm text-gray-500 mt-2 gap-2">
            {post.users?.avatar_url ? (
              <img
                src={post.users.avatar_url}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <img
                src="https://via.placeholder.com/48"
                alt="avatar par défaut"
                className="w-6 h-6 rounded-full opacity-50"
              />
            )}
            <span>
              👤{" "}
              <strong>{post.users?.full_name || "Anonyme"}</strong> • 📅{" "}
              {new Date(post.created_at).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            🏷️ Catégorie : {post.category || "Sans catégorie"}
          </p>
        </div>
      ))}
    </div>
  </main>
);
