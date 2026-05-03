import ElfGame from './components/ElfGame';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Elf Runner</h1>
      <ElfGame />
      <p className="instructions">
        Press <kbd>SPACE</kbd> or <kbd>↑</kbd> to jump. Tap on mobile.
      </p>
    </div>
  );
}

export default App;
