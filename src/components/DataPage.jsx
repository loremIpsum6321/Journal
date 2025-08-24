import { useState, useEffect, useRef } from 'react';
import JournalList from './JournalList';
import DataVisualization from './DataVisualization';
import { generateTestData } from '../utils/testData'; // Import our new generator

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
  // NEW: State for the chart's date range
  const [dateRange, setDateRange] = useState(7);
  // NEW: A ref for the hidden file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(allData.entries));
    // Save metrics too, in case they were imported/generated
    Object.keys(allData.metricsByDate).forEach(date => {
      localStorage.setItem(`metrics-${date}`, JSON.stringify(allData.metricsByDate[date]));
    });
  }, [allData]);

  const handleExport = () => { /* ... unchanged ... */ };
  const handleDelete = (idToDelete) => { /* ... unchanged ... */ };
  const handleEdit = (idToEdit, newText) => { /* ... unchanged ... */ };

  // NEW: Handler for the test data button
  const handleGenerateData = () => {
    if (window.confirm("This will replace all current data. Are you sure?")) {
      const testData = generateTestData();
      setAllData(testData);
    }
  };

  // NEW: Handler for the import button
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // NEW: Handler for when a file is selected
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        // Basic validation
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
    // Reset file input value to allow re-uploading the same file
    event.target.value = null; 
  };
  
  return (
    <div className="data-container">
      <DataVisualization 
        entries={allData.entries} 
        metricsByDate={allData.metricsByDate} 
        dateRange={dateRange}
      />

      {/* --- NEW: Control Bar --- */}
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