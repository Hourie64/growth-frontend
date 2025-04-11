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
  <main className="max-w-xl mx-auto p-6 font-sans">
    <h1 className="text-2xl font-bold text-center mb-6">GROWTH 🌱</h1>

    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Exprime ton idée ici..."
        className="w-full border p-2 mb-2"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Publier
      </button>
    </form>

    <div className="space-y-6">
      {[...posts].reverse().map((post) => (
        <div key={post.id} className="border-b pb-4">
          <p className="mb-1">{post.content}</p>
                      <p className="text-sm text-gray-600 italic flex items-center gap-2">
  {post.users?.avatar_url && (
    <img
      src={post.users.avatar_url}
      alt="avatar"
      className="w-6 h-6 rounded-full"
    />
  )}
  Publié par <strong>{post.users?.full_name || "Anonyme"}</strong> –{" "}

            {new Date(post.created_at).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-gray-500 italic">
  Catégorie : {post.category || "Sans catégorie"}
</p>

        </div>
      ))}
    </div>
  </main>
);

