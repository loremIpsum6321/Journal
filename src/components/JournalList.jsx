import { useState } from 'react';

// HELPER: Takes a timestamp like "Aug 23 2025, 10:31:06 PM"
// and returns "2025-08-23" to match the metrics key format.
function getYYYYMMDD(entryTimestamp) {
  const date = new Date(entryTimestamp);
  return date.toISOString().split('T')[0];
}

function JournalList({ entries = [], metricsByDate, onDeleteEntry, onEditEntry }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleStartEdit = (entry) => {
    setEditingId(entry.id);
    setEditText(entry.text);
    setOpenMenuId(null); // Close the menu
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = () => {
    onEditEntry(editingId, editText);
    setEditingId(null);
    setEditText('');
  };

  if (entries.length === 0) {
    return (
      <div className="journal-list-empty">
        <p>No entries yet. Write something on the Journal tab to get started!</p>
      </div>
    );
  }

  // A helper to format the display of metric values (e.g., true -> 'Yes')
  const formatMetricValue = (key, value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (key === 'sleepHours') {
      return `${value} hrs`;
    }
    return value;
  };

  // A helper to format the display of metric keys (e.g., sleepHours -> 'Sleep Hours')
  const formatMetricKey = (key) => {
    const words = key.replace(/([A-Z])/g, ' $1');
    return words.charAt(0).toUpperCase() + words.slice(1);
  };

  return (
    <div className="journal-list">
      {entries.map((entry) => {
        const entryDateString = getYYYYMMDD(entry.timestamp);
        const dailyMetrics = metricsByDate[entryDateString];

        return (
          <div key={entry.id} className="journal-entry">
            {editingId === entry.id ? (
              <div className="edit-form">
                <textarea 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)}
                  rows="4"
                />
                <div className="edit-actions">
                  <button onClick={handleCancelEdit}>Cancel</button>
                  <button onClick={handleSaveEdit} className="save">Save</button>
                </div>
              </div>
            ) : (
              <>
                {entry.moods && entry.moods.length > 0 && (
                  <div className="entry-moods">
                    {entry.moods.map(mood => <span key={mood}>{mood}</span>)}
                  </div>
                )}
                <p>{entry.text}</p>
                {dailyMetrics && (
                  <div className="correlated-metrics">
                    {Object.entries(dailyMetrics).map(([key, value]) => (
                      <span key={key}>
                        {formatMetricKey(key)}: <strong>{formatMetricValue(key, value)}</strong>
                      </span>
                    ))}
                  </div>
                )}
                <div className="entry-footer">
                  <small>{entry.timestamp}</small>
                  <div className="entry-menu-container">
                    <button className="entry-menu-button" onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}>
                      ...
                    </button>
                    {openMenuId === entry.id && (
                      <div className="entry-menu">
                        <button onClick={() => handleStartEdit(entry)}>Edit</button>
                        <button onClick={() => onDeleteEntry(entry.id)} className="delete">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  );
}

export default JournalList;