import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// --- Helper Functions (Unchanged) ---
const moodScoreMap = { '😔': 1, '😠': 1, '😨': 1.5, '😳': 2, '😴': 2.5, '😊': 4, '😄': 5, '🥰': 5 };
function getYYYYMMDD(entryTimestamp) { const date = new Date(entryTimestamp); return date.toISOString().split('T')[0]; }
function processDataForChart(entries, metricsByDate, dateRange) {
  const chartData = [];
  const allKnownMetrics = ['exercised', 'x', 'y', 'z'];
  for (let i = dateRange - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const shortDate = date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    const metrics = metricsByDate[dateString];
    const entriesForDay = entries.filter(e => getYYYYMMDD(e.timestamp) === dateString);
    let totalMoodScore = 0; let moodCount = 0;
    if (entriesForDay.length > 0) {
      entriesForDay.forEach(entry => {
        if (entry.moods) {
          entry.moods.forEach(mood => {
            totalMoodScore += moodScoreMap[mood] || 3;
            moodCount++;
          });
        }
      });
    }
    const averageMood = moodCount > 0 ? (totalMoodScore / moodCount) : null;
    const dataPoint = {
      name: shortDate,
      "Sleep Hours": metrics ? Number(metrics.sleepHours) : null,
      "Average Mood": averageMood,
    };
    allKnownMetrics.forEach(metric => { dataPoint[metric] = metrics ? !!metrics[metric] : false; });
    chartData.push(dataPoint);
  }
  return chartData;
}

// NEW: A map of our event metrics to unique colors for the dots
const eventMetricColors = {
  exercised: '#8884d8', // Purple
  x: '#82ca9d',         // Green
  y: '#ffc658',         // Yellow
  z: '#ff7300'          // Orange
};

// NEW: A powerful custom dot component that renders multiple dots for multiple events
const MultiEventDot = (props) => {
  const { cx, cy, payload } = props;

  // If there's no data for this point, render nothing
  if (cy === null || cy === undefined) {
    return null;
  }

  // Find which events are true for this data point
  const activeEvents = Object.keys(eventMetricColors).filter(key => payload[key]);

  // If there are no events, render a standard small dot
  if (activeEvents.length === 0) {
    return <circle cx={cx} cy={cy} r={3} fill="#ff5b5b" />;
  }

  // If there are events, render a stack of colored dots
  return (
    <g>
      {activeEvents.map((key, index) => (
        <circle 
          key={key}
          cx={cx} 
          // Stagger the dots vertically, centered on the original point
          cy={cy + (index * 8) - (activeEvents.length - 1) * 4} 
          r={5} 
          fill={eventMetricColors[key]}
          stroke="#121212"
          strokeWidth={2}
        />
      ))}
    </g>
  );
};

function DataVisualization({ entries = [], metricsByDate = {}, dateRange = 7 }) {
  const chartData = processDataForChart(entries, metricsByDate, dateRange);

  return (
    <div className="visualization-container">
      <h3>Trends for the Last {dateRange} Days</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="name" stroke="#a0a0a0"  interval="preserveStartEnd"/>
          <YAxis stroke="#a0a0a0" domain={[0, 'dataMax + 1']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }} 
            cursor={{fill: '#33333380'}}
          />
          <Legend wrapperStyle={{ top: -10 }}/>
          <Line 
            type="monotone" 
            dataKey="Sleep Hours" 
            stroke="#6b7fff" 
            strokeWidth={2}
            connectNulls
            dot={{ r: 3 }} // Use a simple dot for the sleep line
          />
          <Line 
            type="monotone" 
            dataKey="Average Mood" 
            stroke="#ff5b5b" 
            strokeWidth={2}
            connectNulls
            // Use our powerful new multi-dot component for the mood line
            dot={<MultiEventDot />}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="event-legend">
        {Object.entries(eventMetricColors).map(([key, color]) => (
          <div key={key} className="legend-item">
            <div className="legend-color-box" style={{ backgroundColor: color }}></div>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataVisualization;