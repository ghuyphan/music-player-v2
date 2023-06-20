import React, { useState, useRef, useEffect } from 'react';
import './styles.css'; // Import the CSS file
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fontsource/montserrat';
import myImage from './images/myImage.jpg'; // Import your background image file
import albumCover from './images/albumCover.jpg'; // Import your album cover image file
import musicFile from './music/song.mp3'; // Import your music file

const MusicPlayer = () => {
  const [songTitle, setSongTitle] = useState('Hơn Cả Yêu');
  const [artistName, setArtistName] = useState('Đức Phúc');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [songLength, setSongLength] = useState(0);
  const [playedTime, setPlayedTime] = useState(0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const lyrics = [
    { time: 0, text: "Em hay hỏi anh" },
    { time: 3, text: "Rằng anh yêu em nhiều không?" },
    { time: 7, text: "Anh không biết phải nói thế nào" },
    { time: 10, text: "Để đúng với cảm xúc trong lòng" },
    { time: 15, text: "Khi anh nhìn em" },
    { time: 18, text: "Là anh thấy cuộc đời anh" },
    { time: 22, text: "Là quá khứ và cả tương lai" },
    { time: 25, text: "Là hiện tại không bao giờ phai" },
    { time: 29, text: "Tình yêu trong anh vẫn luôn thầm lặng" },
    { time: 32.5, text: "Nhưng không có nghĩa không rộng lớn" },
    { time: 36.5, text: "Chỉ là anh đôi khi khó nói nên lời" },
    { time: 41, text: "Mong em hãy cảm nhận thôi" },
    { time: 45, text: "Cao hơn cả núi, dài hơn cả sông" },
    { time: 49, text: "Rộng hơn cả đất, xanh hơn cả trời" },
    { time: 54, text: "Anh yêu em, anh yêu em nhiều thế thôi" },
    { time: 59, text: "" },

    // Add more lyric lines with their corresponding timestamps in seconds
  ];
  
  const [previousLyric, setPreviousLyric] = useState('');
  const [currentLyric, setCurrentLyric] = useState('');
  const [nextLyric, setNextLyric] = useState('');

  const calculateBrightestColor = (imageSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageSrc;

      img.addEventListener('load', () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
        let brightestColor = [0, 0, 0]; // [R, G, B]

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];

          if (r + g + b > brightestColor[0] + brightestColor[1] + brightestColor[2]) {
            brightestColor = [r, g, b];
          }
        }

        const brightestColorRGB = `rgb(${brightestColor[0]}, ${brightestColor[1]}, ${brightestColor[2]})`;
        resolve(brightestColorRGB);
      });
    });
  };

  const handlePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (isFinished) {
        audioRef.current.currentTime = 0; // Rewind to the beginning
        setIsFinished(false);
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        const currentTime = audio.currentTime;
        const duration = audio.duration;
        const progressPercent = (currentTime / duration) * 100;
        setProgress(progressPercent);
    
        const currentLyricIndex = lyrics.findIndex((lyric) => lyric.time > Math.floor(currentTime));
        const previousLyric = lyrics[currentLyricIndex - 1];
        const currentLyric = previousLyric ? previousLyric.text : '';
        const nextLyric = lyrics[currentLyricIndex] ? lyrics[currentLyricIndex].text : '';
    
        setCurrentLyric(currentLyric);
        setNextLyric(nextLyric);
        // Check if no lyrics are loaded initially
        if (!currentLyric && !nextLyric) {
            setCurrentLyric('No lyrics');
            setNextLyric('');
        } else {
            setCurrentLyric(currentLyric);
            setNextLyric(nextLyric);
        }
    
        // Update the played time
        setPlayedTime(currentTime);
    
        const progressBar = document.querySelector('.progress-bar');
        const progressBarWidth = progressBar.clientWidth;
        const indicatorPosition = (progressBarWidth * progressPercent) / 100;
    
        const progressIndicator = document.querySelector('.progress-indicator');
        const indicatorWidth = progressIndicator.clientWidth;
        const adjustedPosition = indicatorPosition - indicatorWidth / 2;
    
        const maxPosition = progressBarWidth;
        const clampedPosition = Math.min(Math.max(0, adjustedPosition), maxPosition);
    
        progressIndicator.style.left = `${clampedPosition}px`;
        
        // Check if the song has finished
        if (currentTime === duration) {
          setIsPlaying(false);
          setIsFinished(true);
        }
    };
  

  const animateProgressIndicator = () => {
    const audio = audioRef.current;
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    if (currentTime < duration) {
      const progressPercent = (currentTime / duration) * 100;

      const progressBar = document.querySelector('.progress-bar');
      const progressBarWidth = progressBar.clientWidth;
      const indicatorPosition = (progressBarWidth * progressPercent) / 100;

      const progressIndicator = document.querySelector('.progress-indicator');
      const indicatorWidth = progressIndicator.clientWidth;
      const adjustedPosition = indicatorPosition - indicatorWidth / 2;

      const maxPosition = progressBarWidth - indicatorWidth;
      const clampedPosition = Math.min(Math.max(0, adjustedPosition), maxPosition);

      progressIndicator.style.left = `${clampedPosition}px`;

      // Delay the next animation frame by 500 milliseconds
      setTimeout(() => {
        requestAnimationFrame(animateProgressIndicator);
      }, 500);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', () => setIsPlaying(false));

    // Set the song length once the metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
      setSongLength(audio.duration);
    });

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  useEffect(() => {
    calculateBrightestColor(albumCover)
      .then((brightestColor) => {
        setProgressColor(brightestColor);
      })
      .catch((error) => {
        console.error('Error calculating brightest color:', error);
      });
        // Play the audio when the component mounts
        audioRef.current.play();
        setIsPlaying(true);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleProgressBarClick = (event) => {
    const progressBar = progressBarRef.current;
    const progressBarWidth = progressBar.clientWidth;
    const offsetX = event.clientX - progressBar.getBoundingClientRect().left;
    const progressPercent = (offsetX / progressBarWidth) * 100;
  
    const audio = audioRef.current;
    const duration = audio.duration;
    const currentTime = (progressPercent / 100) * duration;
  
    audio.currentTime = currentTime;
    setProgress(progressPercent);
  };
  

  return (
    <div className="container">
      <img src={myImage} alt="Background Image" className="background-image" />

      <div className="song-details">
        <h2 className="song-title" style={{ fontFamily: 'Arial' }}>
          {songTitle}
        </h2>
        <h3 className="artist-name" style={{ fontFamily: 'Arial' }}>
          {artistName}
        </h3>
        <img src={albumCover} alt="Album Cover" className="album-cover" />
        <div className="lyrics-container">
          <p className="lyric-line previous">{previousLyric}</p>
          <p className="lyric-line current">{currentLyric}</p>
          <p className="lyric-line next">{nextLyric}</p>
        </div>
        <div className="progress-bar" ref={progressBarRef} onClick={handleProgressBarClick} style={{ cursor: 'pointer' }}>
        <div className="progress" style={{ width: `${progress}%`, backgroundColor: progressColor }}>
          <div className="progress-indicator" style={{ backgroundColor: progressColor }}></div>
        </div>
      </div>
        <div className="time-details">
          <span className="played-time">{formatTime(playedTime)}</span>
          <span className="song-length">{formatTime(songLength)}</span>
        </div>
        <div className="controls">
          <button className="shuffle-button">
            <i className="fas fa-random"></i>
          </button>
          <button className="control-button" disabled>
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="play-pause-button" onClick={handlePlay}>
            {isPlaying ? (
              <i className="fas fa-pause"></i>
            ) : isFinished ? (
              <i className="fas fa-redo"></i> // Replay icon when the song is finished
            ) : (
              <i className="fas fa-play"></i>
            )}
          </button>
          <button className="control-button" disabled>
            <i className="fas fa-step-forward"></i>
          </button>
          <button className="heart-button" onClick={handleLike}>
            {isLiked ? (
              <i className="fas fa-heart" style={{ color: progressColor }}></i>
            ) : (
              <i className="far fa-heart"></i>
            )}
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={musicFile} />
    </div>
  );
};

export default MusicPlayer;
