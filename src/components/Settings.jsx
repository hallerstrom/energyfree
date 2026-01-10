import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Settings({ currentData, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(currentData);

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
    const confirmRestart = window.confirm("Är du säker på att du vill börja om? Din streak kommer att nollställas till idag.");
    
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
    <button className="secondary-btn" onClick={() => setIsOpen(true)} style={{ marginTop: '20px' }}>
      Inställningar & Nollställ
    </button>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content card">
        <h3>Inställningar</h3>
        
        <label className="label">Startdatum (när du slutade):</label>
        <input 
          type="datetime-local" 
          value={form.start_date.slice(0, 16)} 
          onChange={e => setForm({...form, start_date: new Date(e.target.value).toISOString()})} 
        />
        
        <label className="label">Kostnad per burk (kr):</label>
        <input type="number" value={form.cost_per_drink} onChange={e => setForm({...form, cost_per_drink: e.target.value})} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label className="label">Mål (dagar):</label>
            <input type="number" value={form.goal_days} onChange={e => setForm({...form, goal_days: e.target.value})} />
          </div>
          <div>
            <label className="label">Mål (kronor):</label>
            <input type="number" value={form.goal_amount} onChange={e => setForm({...form, goal_amount: e.target.value})} />
          </div>
        </div>

        <button onClick={saveSettings} style={{ backgroundColor: '#10b981', marginBottom: '10px' }}>Spara ändringar</button>
        
        <button onClick={restartStreak} style={{ backgroundColor: '#ef4444', marginBottom: '10px' }}>
          ⚠️ Börja om från idag
        </button>

        <button className="secondary-btn" onClick={() => setIsOpen(false)}>Avbryt</button>
      </div>
    </div>
  );
}