import { useState, useEffect } from 'react';

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
    <div className="card stats-card">
      <div className="stat-item">
        <span className="label">Dagar utan</span>
        <span className="value">{days} st</span>
      </div>
      <div className="divider"></div>
      <div className="stat-item">
        <span className="label">Sparat totalt</span>
        <span className="value-money">{days * costPerDay} kr</span>
      </div>
    </div>
  );
}