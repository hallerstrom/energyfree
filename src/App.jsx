import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Stats from './components/Stats';
import GoalProgress from './components/GoalProgress';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    // Hämta inloggad user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Hämta användarens egna data
    const { data, error } = await supabase
      .from('user_data_v2')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) console.error("Kunde inte hämta user_data_v2:", error);
    else setUserData(data);

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="loading">Laddar...</div>;

  if (!userData) return <div className="loading">Logga in för att se din data.</div>;

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
        <Settings 
          onUpdate={fetchData} 
        />
      </main>
    </div>
  );
}

export default App;
