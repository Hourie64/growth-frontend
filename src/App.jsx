
import { useEffect, useState } from "react";

const API_URL = "https://growth-backend-udim.onrender.com/api/posts";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setPosts)
      .catch((err) => console.error("Erreur chargement posts :", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      content: newPost,
      author_id: "demo-user-id"
    };

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const updated = await fetch(API_URL).then((res) => res.json());
      setPosts(updated);
      setNewPost("");
    } catch (error) {
      console.error("Erreur publication :", error);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-semibold mb-4 text-center">GROWTH 🌱</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Exprimez une idée ou une actualité..."
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
          <article
            key={post.id}
            className="border border-gray-300 p-4 rounded bg-white shadow-sm"
          >
            <p className="mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">
              Publié par {post.author_name || "anonyme"} le {new Date(post.created_at).toLocaleString()}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
// Trigger redeploy
