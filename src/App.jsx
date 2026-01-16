import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Laddar...</p>;
  if (!session) return <Auth />;

  return <Dashboard user={session.user} />;
}
