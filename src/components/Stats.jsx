import { useState, useEffect } from 'react';
import { Calendar, Wallet } from 'lucide-react';

// Hjälp-komponent för animationen
function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (isNaN(end) || end <= 0) {
      setDisplayValue(0);
      return;
    }

    const totalDuration = 1000; // 1 sekund
    const incrementTime = Math.max(totalDuration / end, 10); // Minst 10ms per steg

    const timer = setInterval(() => {
      start += Math.ceil(end / 50); // Öka snabbare om talet är stort
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function Stats({ startDate, costPerDay }) {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const calc = () => {
      const diff = new Date() - startDate;
      setDays(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Översikt</h3>
      
      {/* Rad för Dagar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <div style={{ backgroundColor: '#eff6ff', padding: '10px', borderRadius: '12px' }}>
          <Calendar size={24} color="#3b82f6" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>DAGAR UTAN</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
            <AnimatedNumber value={days} /> st
          </span>
        </div>
      </div>

      {/* Rad för Pengar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ backgroundColor: '#ecfdf5', padding: '10px', borderRadius: '12px' }}>
          <Wallet size={24} color="#10b981" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>SPARAT TOTALT</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
            <AnimatedNumber value={days * costPerDay} /> kr
          </span>
        </div>
      </div>
    </div>
  );
}