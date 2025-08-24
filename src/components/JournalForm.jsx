import { useState } from 'react';

// A clean, re-typed array of moods to prevent character issues
const MOOD_ROWS = [
  ['😊', '😄', '🥰', '😴'],
  ['😔', '😠', '😨', '😳']
];

function JournalForm({ onLogEntry }) {
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedMoods, setSelectedMoods] = useState([]); 
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMoodSelect = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood));
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleSubmit = () => {
    if (currentEntry.trim() === '' || selectedMoods.length === 0) {
      alert('Please write something and select at least one mood.');
      return;
    }

    onLogEntry({ text: currentEntry, moods: selectedMoods });
    
    setCurrentEntry('');
    setSelectedMoods([]);

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 1500); 
  };

  return (
    <div className="journal-form">
      <div className="mood-selector">
        {MOOD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="mood-row">
            {row.map((mood) => (
              <button 
                key={mood}
                className={`mood-button ${selectedMoods.includes(mood) ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        ))}
      </div>

      <textarea
        placeholder="What's on your mind?"
        rows="5"
        value={currentEntry}
        onChange={(e) => setCurrentEntry(e.target.value)}
      />
      <button onClick={handleSubmit} className={showSuccess ? 'success' : ''}>
        {showSuccess ? 'Saved!' : 'Log Entry'}
      </button>
    </div>
  );
}

export default JournalForm;