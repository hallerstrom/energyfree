import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import Stats from "./components/Stats";
import GoalProgress from "./components/GoalProgress";
import Settings from "./components/Settings";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lyssna på auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Hämta eller skapa user_data
  useEffect(() => {
    if (!session?.user) return;

    const loadData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_data_v2")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!data) {
        // skapa default-rad
        const { data: created } = await supabase
          .from("user_data_v2")
          .insert({
            id: session.user.id,
            start_date: new Date().toISOString(),
            cost_per_drink: 0,
            goal_days: 30,
            goal_amount: 1000,
          })
          .select()
          .single();

        setUserData(created);
      } else {
        setUserData(data);
      }

      setLoading(false);
    };

    loadData();
  }, [session]);

  if (loading) return <div className="loading">Laddar...</div>;

  // ❗️INTE INLOGGAD → visa Auth
  if (!session) return <Auth />;

  // Inloggad men data laddas
  if (!userData) return <div className="loading">Skapar din profil...</div>;

  return (
    <div className="container">
      <header>
        <h1>EnergiFri ⚡️</h1>
        <p>Heja dig, du är grym!</p>
      </header>

      <main>
        <Stats
          startDate={new Date(userData.start_date)}
          costPerDay={userData.cost_per_drink}
        />
        <GoalProgress
          startDate={new Date(userData.start_date)}
          costPerDay={userData.cost_per_drink}
          goalAmount={userData.goal_amount}
          goalDays={userData.goal_days}
        />
        <Settings onUpdate={() => setUserData(null)} />
      </main>
    </div>
  );
}

export default App;
