// src/components/GamesDownload.js
import React from 'react';
import './GamesDownload.css'; // Import the corresponding CSS file

const games = [
  {
    id: 1,
    title: "Game 1: Adventure Quest",
    image: "https://example.com/game1.jpg",
    link: "https://example.com/download/game1",
  },
  {
    id: 2,
    title: "Game 2: Space Odyssey",
    image: "https://example.com/game2.jpg",
    link: "https://example.com/download/game2",
  },
  {
    id: 3,
    title: "Game 3: Pirate's Treasure",
    image: "https://example.com/game3.jpg",
    link: "https://example.com/download/game3",
  },
];

function GamesDownload() {
  return (
    <section id="games-download">
      <h2>Games Download</h2>
      <p>Download and enjoy these amazing games:</p>
      <div className="games-container">
        {games.map((game) => (
          <div className="game-card" key={game.id}>
            <img src={game.image} alt={game.title} className="game-image" />
            <h3>{game.title}</h3>
            <a href={game.link} target="_blank" rel="noopener noreferrer">
              <button className="download-button">Download Game</button>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GamesDownload;