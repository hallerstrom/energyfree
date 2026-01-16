import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Settings({ data, reload }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(data);

  const save = async () => {
    await supabase
      .from("user_data_v2")
      .update(form)
      .eq("id", data.id);

    setOpen(false);
    reload();
  };

  if (!open)
    return (
      <button
        className="secondary-btn"
        onClick={() => setOpen(true)}
      >
        Inställningar
      </button>
    );

  return (
    <div className="modal-overlay">
      <div className="modal-content card settings-modal">
        <div className="modal-header">
          <h3>Inställningar</h3>
          <button className="close-icon" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="form-group">
          <label>Kostnad per dryck</label>
          <input
            className="modern-input"
            type="number"
            value={form.cost_per_drink}
            onChange={e =>
              setForm({ ...form, cost_per_drink: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Mål (kr)</label>
          <input
            className="modern-input"
            type="number"
            value={form.goal_amount}
            onChange={e =>
              setForm({ ...form, goal_amount: e.target.value })
            }
          />
        </div>

        <div className="button-group">
          <button className="save-btn" onClick={save}>
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}
