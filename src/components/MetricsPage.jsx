import { useState, useEffect } from 'react';

function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function MetricsPage() {
  const storageKey = `metrics-${getTodayDateString()}`;

  // NEW: Add x, y, and z to the default metrics object
  const defaultMetrics = {
    sleepHours: 8,
    exercised: false,
    caffeine: 'none',
    x: false,
    y: false,
    z: false,
  };

  const [metrics, setMetrics] = useState(() => {
    const savedMetrics = localStorage.getItem(storageKey);
    // If we load saved data, make sure it includes the new defaults
    return savedMetrics ? { ...defaultMetrics, ...JSON.parse(savedMetrics) } : defaultMetrics;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(metrics));
  }, [metrics, storageKey]);

  const handleMetricChange = (metricName, value) => {
    setMetrics(prevMetrics => ({
      ...prevMetrics,
      [metricName]: value
    }));
  };

  const handleSleepChange = (amount) => {
    const currentHours = Number(metrics.sleepHours);
    let newHours = currentHours + amount;
    if (newHours < 0) newHours = 0;
    handleMetricChange('sleepHours', newHours);
  };

  return (
    <div className="metrics-container">
      <h2>Daily Check-in for {getTodayDateString()}</h2>
      
      <div className="metric-item">
        <label>Hours of Sleep:</label>
        <div className="stepper-control">
          <button onClick={() => handleSleepChange(-0.5)}>−</button>
          <span>{metrics.sleepHours} hrs</span>
          <button onClick={() => handleSleepChange(0.5)}>+</button>
        </div>
      </div>

      <div className="metric-item">
        <label htmlFor="exercised">Did you exercise?</label>
        <input 
          type="checkbox" 
          id="exercised"
          checked={metrics.exercised}
          onChange={(e) => handleMetricChange('exercised', e.target.checked)}
        />
      </div>

      {/* --- NEW: X, Y, and Z Checkboxes --- */}
      <div className="metric-item">
        <label htmlFor="x">X</label>
        <input 
          type="checkbox" 
          id="x"
          checked={!!metrics.x}
          onChange={(e) => handleMetricChange('x', e.target.checked)}
        />
      </div>
      <div className="metric-item">
        <label htmlFor="y">Y</label>
        <input 
          type="checkbox" 
          id="y"
          checked={!!metrics.y}
          onChange={(e) => handleMetricChange('y', e.target.checked)}
        />
      </div>
      <div className="metric-item">
        <label htmlFor="z">Z</label>
        <input 
          type="checkbox" 
          id="z"
          checked={!!metrics.z}
          onChange={(e) => handleMetricChange('z', e.target.checked)}
        />
      </div>

      <div className="metric-item">
        <label htmlFor="caffeine">Caffeine Intake:</label>
        <select 
          id="caffeine"
          value={metrics.caffeine}
          onChange={(e) => handleMetricChange('caffeine', e.target.value)}
        >
          <option value="none">None</option>
          <option value="coffee">Coffee</option>
          <option value="tea">Tea</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
}

export default MetricsPage;