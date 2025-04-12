import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) alert(error.message)
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{isLogin ? "Connexion" : "Inscription"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
        <p className="text-sm text-center mt-2">
          {isLogin ? "Pas encore inscrit ?" : "Déjà inscrit ?"}{" "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-green-600 underline">
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </form>
    </div>
  )
}
