import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import Auth from "./Auth"

const DEFAULT_AUTHOR_ID = "8cc03a68-9015-4d1a-bb7b-c847a5b703c0"

export default function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*, users(full_name, avatar_url)")
      .order("created_at", { ascending: false })

    setPosts(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const author_id = user?.id || DEFAULT_AUTHOR_ID
    const { error } = await supabase
      .from("posts")
      .insert([{ content, author_id }])

    if (error) {
      console.error("Erreur lors de la publication :", error)
    } else {
      setContent("")
      fetchPosts()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!user) return <Auth />

  return (
    <main className="max-w-2xl mx-auto p-6 font-sans text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🌱 GROWTH
        </h1>
        <button onClick={handleLogout} className="text-sm text-red-500 underline">Déconnexion</button>
      </div>

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
        {posts.map((post) => (
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
                👤 <strong>{post.users?.full_name || "Anonyme"}</strong> • 🗓️{" "}
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
  )
}
