import { useState, useEffect, useRef } from 'react';
import JournalList from './JournalList';
import DataVisualization from './DataVisualization';
import { generateTestData } from '../utils/testData';

function loadAllData() {
  const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
  const metricsByDate = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('metrics-')) {
      const date = key.substring(8);
      metricsByDate[date] = JSON.parse(localStorage.getItem(key));
    }
  }
  return { entries, metricsByDate };
}

function DataPage() {
  const [allData, setAllData] = useState(loadAllData);
  const [dateRange, setDateRange] = useState(7);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(allData.entries));
    Object.keys(allData.metricsByDate).forEach(date => {
      localStorage.setItem(`metrics-${date}`, JSON.stringify(allData.metricsByDate[date]));
    });
  }, [allData]);

  // --- FULLY IMPLEMENTED EVENT HANDLERS ---

  const handleExport = () => {
    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowjournal-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleDelete = (idToDelete) => {
    const updatedEntries = allData.entries.filter(entry => entry.id !== idToDelete);
    setAllData(prevData => ({ ...prevData, entries: updatedEntries }));
  };
  
  const handleEdit = (idToEdit, newText) => {
    const updatedEntries = allData.entries.map(entry => {
      if (entry.id === idToEdit) {
        return { ...entry, text: newText };
      }
      return entry;
    });
    setAllData(prevData => ({ ...prevData, entries: updatedEntries }));
  };

  const handleGenerateData = () => {
    if (window.confirm("This will replace all current data. Are you sure?")) {
      const testData = generateTestData();
      setAllData(testData);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.entries && importedData.metricsByDate) {
          if (window.confirm("Importing will replace all current data. Continue?")) {
            setAllData(importedData);
            alert("Data imported successfully!");
          }
        } else {
          alert("Invalid data file format.");
        }
      } catch (error) {
        alert("Failed to read or parse the file.");
      }
    };
    reader.readAsText(file);
    event.target.value = null; 
  };
  
  // --- RENDER ---
  return (
    <div className="data-container">
      <DataVisualization 
        entries={allData.entries} 
        metricsByDate={allData.metricsByDate} 
        dateRange={dateRange}
      />

      <div className="data-controls">
        <div className="date-range-selector">
          <button onClick={() => setDateRange(7)} className={dateRange === 7 ? 'active' : ''}>7 Days</button>
          <button onClick={() => setDateRange(30)} className={dateRange === 30 ? 'active' : ''}>30 Days</button>
        </div>
        <div className="data-actions">
          <button onClick={handleImportClick} className="action-button">Import JSON</button>
          <button onClick={handleGenerateData} className="action-button danger">Generate Test Data</button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="application/json"
          />
        </div>
      </div>

      <div className="data-header">
        <h2>All Journal Entries</h2>
        <button onClick={handleExport} className="export-button">Export All Data</button>
      </div>
      
      <JournalList 
        entries={allData.entries} 
        metricsByDate={allData.metricsByDate}
        onDeleteEntry={handleDelete}
        onEditEntry={handleEdit} 
      />
    </div>
  );
}

export default DataPage;