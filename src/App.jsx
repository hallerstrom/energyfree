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
    const { data } = await supabase.from('user_data').select('*').single();
    if (data) setUserData(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="loading">Laddar...</div>;

  return (
    <div className="container">
      <header>
        <h1>EnergiFri ⚡️</h1>
        <p>Heja dig, du är grym!</p>
      </header>

      {userData && (
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
            currentData={userData} 
            onUpdate={fetchData} 
          />
        </main>
      )}
    </div>
  );
}

export default App;