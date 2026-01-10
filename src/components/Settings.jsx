import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Save, RefreshCcw, X, Bell } from 'lucide-react'; // Lade till Bell-ikonen

export default function Settings({ currentData, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(currentData);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // --- NY FUNKTION FÖR NOTISER ---
  const subscribeToNotifications = async () => {
    setIsSubscribing(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
      });

    const { error } = await supabase
    .from('push_subscriptions')
    .insert([
        { 
        // Vi säkerställer att vi skickar med rätt ID från currentData
        user_id: currentData.id, 
        subscription_data: subscription 
        }
    ]);

      if (error) throw error;
      alert("Notiser är nu aktiverade! 🔔");
    } catch (err) {
      console.error(err);
      alert("Kunde inte aktivera notiser. Kolla att du gett tillåtelse i webbläsaren.");
    } finally {
      setIsSubscribing(false);
    }
  };
  // ------------------------------

  const saveSettings = async () => {
    const { error } = await supabase
      .from('user_data')
      .update({
        cost_per_drink: parseInt(form.cost_per_drink),
        goal_amount: parseInt(form.goal_amount),
        goal_days: parseInt(form.goal_days),
        start_date: form.start_date
      })
      .eq('id', currentData.id);

    if (!error) {
      setIsOpen(false);
      onUpdate();
    }
  };

  const restartStreak = async () => {
    const confirmRestart = window.confirm("Är du säker? Din streak nollställs till just nu.");
    if (confirmRestart) {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('user_data')
        .update({ start_date: now })
        .eq('id', currentData.id);
      if (!error) {
        setIsOpen(false);
        onUpdate();
      }
    }
  };

  if (!isOpen) return (
    <button className="secondary-btn" onClick={() => setIsOpen(true)}>
      Inställningar & Nollställ
    </button>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content card settings-modal">
        <div className="modal-header">
          <h3>Inställningar</h3>
          <button className="close-icon" onClick={() => setIsOpen(false)}><X size={20}/></button>
        </div>
        
        <div className="form-group">
          <label>När slutade du?</label>
          <input 
            type="datetime-local" 
            className="modern-input"
            value={form.start_date.slice(0, 16)} 
            onChange={e => setForm({...form, start_date: new Date(e.target.value).toISOString()})} 
          />
        </div>

        {/* --- NY SEKTION FÖR NOTISER --- */}
        <div className="form-group" style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} /> Dagliga påminnelser
          </label>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
            Få en push-notis varje dag med din nuvarande streak och pengar sparade.
          </p>
          <button 
            className="secondary-btn" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={subscribeToNotifications}
            disabled={isSubscribing}
          >
            {isSubscribing ? 'Aktiverar...' : 'Aktivera Notiser'}
          </button>
        </div>
        {/* ---------------------------- */}
        
        <div className="form-group">
          <label>Kostnad per burk (kr)</label>
          <input 
            type="number" 
            className="modern-input"
            value={form.cost_per_drink} 
            onChange={e => setForm({...form, cost_per_drink: e.target.value})} 
          />
        </div>
        
        <div className="input-grid">
          <div className="form-group">
            <label>Mål (dagar)</label>
            <input 
              type="number" 
              className="modern-input"
              value={form.goal_days} 
              onChange={e => setForm({...form, goal_days: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label>Mål (kronor)</label>
            <input 
              type="number" 
              className="modern-input"
              value={form.goal_amount} 
              onChange={e => setForm({...form, goal_amount: e.target.value})} 
            />
          </div>
        </div>

        <div className="button-group">
          <button className="save-btn" onClick={saveSettings}>
            <Save size={18} /> Spara ändringar
          </button>
          
          <button className="restart-btn" onClick={restartStreak}>
            <RefreshCcw size={18} /> Börja om från idag
          </button>
        </div>
      </div>
    </div>
  );
}