// src/Auth.jsx
import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true = login, false = sign up
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(isLogin ? "Connexion réussie." : "Inscription réussie. Vérifie tes mails.");
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">GROWTH 🌱</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700" type="submit">
          {isLogin ? "Se connecter" : "Créer un compte"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
        <button
          className="text-blue-500 underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </button>
      </p>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </main>
  );
}
