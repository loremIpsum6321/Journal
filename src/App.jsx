import { useState } from 'react';
import './index.css';
import JournalPage from './components/JournalPage';
import MetricsPage from './components/MetricsPage';
import DataPage from './components/DataPage'; // <-- NEW: Import DataPage

function App() {
  const [activeTab, setActiveTab] = useState('journal');

  return (
    <div className="app-container">
      <header>
        <h1>FlowJournal</h1>
        <nav className="tab-nav">
          <button 
            className={activeTab === 'journal' ? 'active' : ''}
            onClick={() => setActiveTab('journal')}
          >
            Journal
          </button>
          <button 
            className={activeTab === 'metrics' ? 'active' : ''}
            onClick={() => setActiveTab('metrics')}
          >
            Metrics
          </button>
          {/* --- NEW: Data Tab Button --- */}
          <button 
            className={activeTab === 'data' ? 'active' : ''}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </nav>
      </header>
      
      <main>
        {activeTab === 'journal' && <JournalPage />}
        {activeTab === 'metrics' && <MetricsPage />}
        {/* --- NEW: Conditional Rendering for DataPage --- */}
        {activeTab === 'data' && <DataPage />}
      </main>
    </div>
  );
}

export default App;