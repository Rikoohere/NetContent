import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './styles.css';
import CreateAccounts from './CreateAccounts';
import CompleteCaptchas from './CompleteCaptchas';
import scriptsData from './robloxscripts.json'; // Import scripts data
import crackedData from './cracked.json'; // Import games data
import minecraftModsData from './minecraftmods.json'; // Import Minecraft mods data

function Home() {
  const location = useLocation();

  // Scroll to the correct section based on the hash in the URL
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <>
      <section id="home">
        <h2>Home</h2>
        <div className="welcome-message">
          <p>🎮 Welcome to <strong>NetContent</strong>! 🎉</p>
          <p>Your ultimate destination for the latest Roblox scripts, gaming tips, and money-making guides. Dive in and explore!</p>
        </div>
        <div className="updates">
          <h3>📢 Latest Updates</h3>
          <ul>
            <li>🚀 Added <strong>Winter MM2 SnowToken Script</strong> for Celestial Grinding!</li>
            <li>🎄 Released the <strong>King Legacy Christmas 2025 Update</strong> script!</li>
            <li>🐟 New <strong>Fisch Script</strong> for auto-fishing and infinite totems!</li>
            <li>🛠️ Website redesign complete! Enjoy the new pixel-style look.</li>
          </ul>
        </div>
      </section>
      <section id="make-money">
        <h2 className="blinking-text">Make Money</h2>
        <p>Choose a way to start earning:</p>
        <div className="card-container">
          <div className="card make-money-card">
            <h3>Create Accounts</h3>
            <p>Earn $$$ for every account you create.</p>
            <Link to="/create-accounts">
              <button className="script-button">Get Started</button>
            </Link>
          </div>
          <div className="card make-money-card">
            <h3>Complete Captchas</h3>
            <p>Earn $$$ for every 20 captchas you solve.</p>
            <Link to="/complete-captchas">
              <button className="script-button">Get Started</button>
            </Link>
          </div>
        </div>
      </section>
      <section id="games-download">
        <h2>Cracked Download</h2>
        <p>Download and enjoy these amazing Tools & Games:</p>
        <div className="games-container">
          {crackedData.map((game) => (
            <div className="game-card" key={game.id}>
              <img src={game.image} alt={game.title} className="game-image" />
              <h3>{game.title}</h3>
              <a href={game.link} target="_blank" rel="noopener noreferrer">
                <button className="download-button">Download</button>
              </a>
            </div>
          ))}
        </div>
      </section>
      <section id="roblox-scripts">
        <h2>Roblox Scripts</h2>
        <p>Check out these awesome Roblox scripts:</p>
        <div className="card-container">
          {scriptsData.map((script) => (
            <div className="card" key={script.id}>
              <img src={script.image} alt={script.title} className="script-image" />
              <h3>{script.title}</h3>
              <a href={script.link} target="_blank" rel="noopener noreferrer">
                <button className="script-button">Get Script</button>
              </a>
            </div>
          ))}
        </div>
      </section>
      <section id="minecraft-mods">
        <h2>Minecraft Mods</h2>
        <p>Explore these amazing Minecraft mods:</p>
        <div className="card-container">
          {minecraftModsData.map((mod) => (
            <div className="card" key={mod.id}>
              <img src={mod.image} alt={mod.title} className="script-image" />
              <h3>{mod.title}</h3>
              <a href={mod.link} target="_blank" rel="noopener noreferrer">
                <button className="script-button">Download Mod</button>
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Welcome to NetContent</h1>
        </header>
        <nav>
          <Link to="/#home">Home</Link>
          <Link to="/#make-money">Make Money</Link>
          <Link to="/#games-download">Cracked Download</Link>
          <Link to="/#roblox-scripts">Roblox Scripts</Link>
          <Link to="/#minecraft-mods">Minecraft Mods</Link> {/* New link */}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-accounts" element={<CreateAccounts />} />
          <Route path="/complete-captchas" element={<CompleteCaptchas />} />
        </Routes>
        <footer>
          <p>&copy; 2023 NetContent. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;