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

  const handleExport = () => { /* ... unchanged ... */ };
  const handleDelete = (idToDelete) => { /* ... unchanged ... */ };
  const handleEdit = (idToEdit, newText) => { /* ... unchanged ... */ };
  const handleImportClick = () => { fileInputRef.current.click(); };
  const handleFileChange = (event) => { /* ... unchanged ... */ };

  // UPDATED: handleGenerateData with console logs
  const handleGenerateData = () => {
    console.log("'Generate Test Data' button clicked.");
    if (window.confirm("This will replace all current data. Are you sure?")) {
      console.log("User confirmed. Generating data...");
      const testData = generateTestData();
      console.log("Generated data:", testData);
      setAllData(testData);
      console.log("State has been updated with test data.");
    } else {
      console.log("User canceled data generation.");
    }
  };
  
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