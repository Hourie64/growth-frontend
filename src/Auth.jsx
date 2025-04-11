import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin"); // or "signup"
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (mode === "signin") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      onLogin(result.data.user);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4 text-center">
        {mode === "signin" ? "Connexion" : "Inscription"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
          {mode === "signin" ? "Se connecter" : "S’inscrire"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {mode === "signin" ? (
          <>
            Pas encore de compte ?{" "}
            <button className="text-blue-600 underline" onClick={() => setMode("signup")}>
              S’inscrire
            </button>
          </>
        ) : (
          <>
            Déjà inscrit ?{" "}
            <button className="text-blue-600 underline" onClick={() => setMode("signin")}>
              Se connecter
            </button>
          </>
        )}
      </p>
    </div>
  );
}
