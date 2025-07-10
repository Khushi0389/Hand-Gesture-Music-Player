// Grab elements
const video        = document.getElementById('video');
const canvas       = document.getElementById('canvas');
const ctx          = canvas.getContext('2d');
const statusEl     = document.getElementById('status');
const prevBtn      = document.getElementById('prev');
const playPauseBtn = document.getElementById('playPause');
const nextBtn      = document.getElementById('next');
const trackNameEl  = document.getElementById('trackName');
const seekBar      = document.getElementById('seekBar');
const volBar       = document.getElementById('volBar');
const audio        = document.getElementById('audio');

// Playlist
const tracks = ['track1.mp3','track2.mp3','track3.mp3'];
let current = 0;

// Update track name
function updateTrackName() {
  trackNameEl.textContent = `Track: ${tracks[current]}`;
}

// Button wiring
prevBtn.onclick = () => {
  current = (current - 1 + tracks.length) % tracks.length;
  audio.src = tracks[current];
  audio.play();
  updateTrackName();
};
playPauseBtn.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
};
nextBtn.onclick = () => {
  current = (current + 1) % tracks.length;
  audio.src = tracks[current];
  audio.play();
  updateTrackName();
};

// —— Seek bar sync —— //
audio.addEventListener('loadedmetadata', () => {
  seekBar.max = Math.floor(audio.duration);
});
audio.addEventListener('timeupdate', () => {
  seekBar.value = Math.floor(audio.currentTime);
});
seekBar.addEventListener('input', () => {
  audio.currentTime = seekBar.value;
});

// —— Volume slider —— //
volBar.addEventListener('input', () => {
  audio.volume = volBar.value;
});

// Load HandTrack.js model
handTrack.load({
  flipHorizontal: true,
  maxNumBoxes:    2,
  scoreThreshold: 0.75
}).then(model => {
  statusEl.textContent = '✅ Model loaded — requesting camera…';
  return handTrack.startVideo(video).then(started => ({ model, started }));
}).then(({ model, started }) => {
  if (!started) {
    statusEl.textContent = '❌ Please enable camera';
    return;
  }
  statusEl.textContent = '🚀 Camera started — running detection';
  updateTrackName();
  detectLoop(model);
}).catch(err => {
  console.error(err);
  statusEl.textContent = '❌ Model load failed';
});

let cooldown = false;
function detectLoop(model) {
  model.detect(video).then(predictions => {
    // draw predictions
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    model.renderPredictions(predictions, canvas, ctx, video);

    if (!cooldown && predictions.length > 0) {
      if (predictions.length > 1) {
        prevBtn.click();
      } else {
        const label = predictions[0].label; // "open" or "closed"
        if (label === 'open') playPauseBtn.click();
        if (label === 'closed') nextBtn.click();
      }
      cooldown = true;
      setTimeout(() => cooldown = false, 800);
    }
  }).catch(console.error)
    .finally(() => requestAnimationFrame(() => detectLoop(model)));
}
