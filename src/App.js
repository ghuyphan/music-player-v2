import React, { useState } from 'react';
import MusicPlayer from './musicPlayer';
import './App.css';
import myImage from './images/myImage.jpg'; // Import your background image file

const App = () => {
  const [songName, setSongName] = useState('');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  const handleInputChange = (event) => {
    setSongName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (songName.trim() !== '') {
      setShowMusicPlayer(true);
    }
  };

  return (
    <div className="app-container">
      <img src={myImage} alt="Background Image" className="background-image" />
      {!showMusicPlayer ? (
        <div className="input-container">
          <h2 className="input-heading">Find Your Rhythm</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={songName}
              onChange={handleInputChange}
              className="input-field"
            />
            <div className="button-container">
              <button type="submit" className="play-button">
                Play
              </button>
            </div>
          </form>
        </div>
      ) : (
        <MusicPlayer songName={songName} autoPlay={true} />
      )}
    </div>
  );
};


export default App;
