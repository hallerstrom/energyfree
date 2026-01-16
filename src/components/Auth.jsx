import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) alert(error.message);
    else alert("Konto skapat. Logga in.");
    setLoading(false);
  };

  return (
    <div className="auth-card">
      <h2>EnergiFri</h2>

      <input
        type="email"
        placeholder="E-post"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={signIn} disabled={loading}>
        Logga in
      </button>

      <button onClick={signUp} disabled={loading}>
        Skapa konto
      </button>
    </div>
  );
}
