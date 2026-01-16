import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Settings from "./Settings";

export default function Dashboard({ user }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase
      .from("user_data_v2")
      .select("*")
      .single();

    if (!data) {
      await supabase.from("user_data_v2").insert({
        id: user.id,
        start_date: new Date().toISOString(),
        cost_per_drink: 0,
        goal_days: 30,
        goal_amount: 1000
      });
      return loadData();
    }

    setData(data);
  };

  if (!data) return <p>Laddar...</p>;

  const days = Math.floor(
    (Date.now() - new Date(data.start_date)) / 86400000
  );
  const saved = days * data.cost_per_drink;

  return (
    <div className="container">
      <header>
        <h1>{days} dagar</h1>
        <p>{saved} kr sparade</p>
      </header>

      <div className="card">
        <h3>Status</h3>
        <p>Fortsätt så 💪</p>
      </div>

      <Settings data={data} reload={loadData} />

      <button
        className="secondary-btn"
        onClick={() => supabase.auth.signOut()}
      >
        Logga ut
      </button>
    </div>
  );
}
