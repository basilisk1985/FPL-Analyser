import React, { useState } from "react";
import './App.css';
import PlayerComparisonLayout from './views/PlayerCompare'
// import Test from './views/modules/PrimeAutoComplete'

function App() {
  const [activeView, setActiveView] = useState("1");

  const renderView = () => {
    switch (activeView) {    
      case "1":
        return <PlayerComparisonLayout/>;
      case "4":
        return <div>Contact Us: Reach out at info@example.com.</div>;
      default:
        return <div>Page not found.</div>;
    }
  };

  return (
    <div className="App">
       <div>
      <nav style={styles.nav}>
        <button style={styles.navButton} onClick={() => setActiveView("1")}>
          Player Comparison
        </button>
        <button style={styles.navButton} onClick={() => setActiveView("4")}>
          Contact
        </button>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>{renderView()}</main>
    </div>
    </div>
  );
}


// Simple inline styles
const styles = {
  nav: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    background: "#282c34",
    color: "#ffffff",
  },
  navButton: {
    padding: "10px 15px",
    background: "#61dafb",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  main: {
    padding: "20px",
    fontSize: "18px",
  },
};

export default App;
