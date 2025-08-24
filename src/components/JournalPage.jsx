import { useState, useEffect } from 'react';
import JournalForm from './JournalForm';

function getFormattedDateTime() {
  const date = new Date();
  const options = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  };
  return date.toLocaleString('en-US', options).replace(',', '');
}

function JournalPage() {
  const [entries, setEntries] = useState(() => {
    try {
      const savedEntries = localStorage.getItem('journalEntries');
      const parsedEntries = savedEntries ? JSON.parse(savedEntries) : [];
      return Array.isArray(parsedEntries) ? parsedEntries : [];
    } catch (error) {
      console.error("Failed to parse journal entries from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  // LOGIC CHANGE: Expects an object with a 'moods' array
  const handleLogEntry = ({ text, moods }) => {
    const newEntry = {
      id: Date.now(),
      text: text,
      moods: moods, // Changed from 'mood' to 'moods'
      timestamp: getFormattedDateTime()
    };
    setEntries([newEntry, ...entries]);
  };

  return (
    <>
      <JournalForm onLogEntry={handleLogEntry} />
    </>
  );
}

export default JournalPage;