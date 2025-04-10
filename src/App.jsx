import { useEffect, useState } from "react";

const API_URL = "https://growth-backend-udim.onrender.com/api/posts";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  // Charger les posts
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setPosts)
      .catch((err) => console.error("Erreur chargement posts :", err));
  }, []);

  // Envoyer un post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newPost,
        author_id: "00000000-0000-0000-0000-000000000001" // ← à remplacer par un vrai ID d’utilisateur
      }),
    });

    if (res.ok) {
      const updated = await fetch(API_URL).then((r) => r.json());
      setPosts(updated);
      setNewPost("");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 font-sans">
      <h1 className="text-2xl font-bold text-center mb-6">GROWTH 🌱</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded mb-2"
          placeholder="Exprime ton idée ici..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Publier
        </button>
      </form>

      <section className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="border p-4 rounded bg-white shadow-sm">
            <p className="mb-1">{post.content}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
