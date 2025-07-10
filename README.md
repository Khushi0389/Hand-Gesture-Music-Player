# 🤟 Hand-Gesture Music Player

A simple browser-based music player you control with your hand gestures!

- **Open palm** toggles Play/Pause  
- **Closed fist** skips to the Next track  
- **Two hands** (both in view) goes to the Prev track  

Powered by [HandTrack.js](https://github.com/victordibia/handtrack.js) for real-time hand detection.


## Setup

1. Clone this repo:
   ```bash
   git clone https://github.com/Khushi0389/Hand-Gesture-Music-Player.git
   cd Hand-Gesture-Music-Player
   ```
   
Install a static server (if you don’t have one):
```
npm install -g http-server
```

Start serving:
```
http-server .
```

Open your browser at http://localhost:8080 and allow camera access.

File Structure
.
├── index.html          # Main page

├── script.js           # Hand-track + gesture logic

├── track1.mp3          # Sample audio files

├── track2.mp3

├── track3.mp3

├── .gitignore

└── README.md

How It Works: 

- HandTrack.js loads a small ML model in the browser.

- We call model.detect(video) each frame, draw boxes, and map labels (open/closed) to controls.

- A simple cooldown prevents multiple triggers per gesture.
