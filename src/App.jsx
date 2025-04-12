import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPosts(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!message.trim()) return;

    await supabase.from("posts").insert([
      {
        content: message,
        user_name: user?.user_metadata?.name || "Utilisateur par défaut",
      },
    ]);

    setMessage("");
    fetchPosts();
  }

  function handleLogout() {
    supabase.auth.signOut();
  }

  // 🔐 Afficher login si pas connecté
  if (!user) {
    return <Auth />;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>GROWTH 🌱</h1>
      <button onClick={handleLogout}>Se déconnecter</button>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Exprime ton idée ici..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Publier</button>
      </form>

      <div style={{ marginTop: 20 }}>
        {posts.map((post) => (
          <div key={post.id}>
            <p>{post.content}</p>
            <small>
              Publié par {post.user_name} –{" "}
              {new Date(post.created_at).toLocaleString("fr-FR")}
            </small>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
