import Hero from './components/Hero';
import AgendaTimeline from './components/AgendaTimeline';
import AfterParty from './components/AfterParty';

function App() {
  return (
    <div className="min-h-screen" style={{ background: '#000000' }}>
      <Hero />
      <AgendaTimeline />
      <AfterParty />
    </div>
  );
}

export default App;

