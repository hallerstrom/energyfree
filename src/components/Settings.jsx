import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Save, RefreshCcw, X, Bell } from 'lucide-react';

export default function Settings({ currentData, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(currentData);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // --- PUSH via ntfy.sh direkt från frontend ---
  const sendDailyPush = async () => {
    setIsSubscribing(true);
    try {
      const start = new Date(form.start_date).getTime();
      const diffDays = Math.max(
        0,
        Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24))
      );
      const savedMoney = diffDays * form.cost_per_drink;

      const topic = `energyfree_user_${currentData.id}`;

      await fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        body: `Dag ${diffDays} – du har sparat ${savedMoney} kr`,
        headers: { 'Title': 'Morgonnotis ✨' },
      });

      alert("Push skickad! 🔔");
    } catch (err) {
      console.error(err);
      alert("Kunde inte skicka push. Kolla nätverk och ntfy.sh.");
    } finally {
      setIsSubscribing(false);
    }
  };
  // ---------------------------------------------

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
    if (window.confirm("Är du säker? Din streak nollställs till just nu.")) {
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

        {/* --- PUSH via ntfy.sh --- */}
        <div className="form-group" style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} /> Skicka daglig push
          </label>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
            Få en push-notis varje dag med din nuvarande streak och pengar sparade.
          </p>
          <button
            className="secondary-btn"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={sendDailyPush}
            disabled={isSubscribing}
          >
            {isSubscribing ? 'Skickar...' : 'Skicka push nu'}
          </button>
        </div>
        {/* ------------------- */}

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
