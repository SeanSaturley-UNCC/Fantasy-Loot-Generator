import logo from './logo.svg';
import './App.css';

function App() {
  const handleClick = () => {
    console.log("Generate Item clicked!");
  };


  return (
    <div>
      <h1>Fantasy Loot Generator</h1>
      <button onClick={handleClick}>Generate Item</button>
    </div>
  );
}

export default App;
