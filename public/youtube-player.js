/**
 * LJ MUSIC OS — YOUTUBE MUSIC / IFRAME PLAYER ADAPTER
 * Seamless YouTube Audio/Video stream controller using the YouTube IFrame API
 * with time tracking, volume normalization, and state synchronization.
 */

class YouTubePlayerAdapter {
  constructor(options = {}) {
    this.containerId = options.containerId || "yt-audio-container";
    this.player = null;
    this.isReady = false;
    this.isPlaying = false;
    this.currentVideoId = null;
    this.currentTrack = null;
    this.timeUpdateTimer = null;
    this.onStateChangeCallback = null;
    this.sdkLoaded = false;
  }

  loadSdk() {
    if (window.YT && window.YT.Player) {
      this.sdkLoaded = true;
      this.initPlayer();
      return;
    }

    // Ensure hidden container exists
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = this.containerId;
      container.style.position = "absolute";
      container.style.width = "1px";
      container.style.height = "1px";
      container.style.opacity = "0.01";
      container.style.pointerEvents = "none";
      container.style.left = "-9999px";
      document.body.appendChild(container);
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    window.onYouTubeIframeAPIReady = () => {
      this.sdkLoaded = true;
      console.log("⚡ YouTube IFrame API Ready");
      this.initPlayer();
    };

    document.head.appendChild(script);
  }

  initPlayer() {
    if (!window.YT || !window.YT.Player) return;

    this.player = new window.YT.Player(this.containerId, {
      height: '180',
      width: '320',
      playerVars: {
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: (event) => {
          this.isReady = true;
          console.log("✅ YouTube Audio Player Ready");
          if (this.pendingVideoId) {
            const vId = this.pendingVideoId;
            const tInfo = this.currentTrack;
            this.pendingVideoId = null;
            this.playVideoId(vId, tInfo);
          }
        },
        onStateChange: (event) => {
          this.handleStateChange(event.data);
        },
        onError: (err) => {
          console.warn("YouTube Player error:", err);
        }
      }
    });
  }

  handleStateChange(playerState) {
    // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    if (playerState === window.YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      this.startTimeTracker();
    } else if (playerState === window.YT.PlayerState.PAUSED || playerState === window.YT.PlayerState.ENDED) {
      this.isPlaying = false;
      this.stopTimeTracker();
    }

    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        source: 'youtube',
        isPlaying: this.isPlaying,
        track: this.currentTrack,
        position: this.player ? this.player.getCurrentTime() : 0,
        duration: this.player ? this.player.getDuration() : 0
      });
    }
  }

  startTimeTracker() {
    this.stopTimeTracker();
    this.timeUpdateTimer = setInterval(() => {
      if (this.player && this.isPlaying && this.onStateChangeCallback) {
        this.onStateChangeCallback({
          source: 'youtube',
          isPlaying: this.isPlaying,
          track: this.currentTrack,
          position: this.player.getCurrentTime(),
          duration: this.player.getDuration()
        });
      }
    }, 500);
  }

  stopTimeTracker() {
    if (this.timeUpdateTimer) {
      clearInterval(this.timeUpdateTimer);
      this.timeUpdateTimer = null;
    }
  }

  async playVideoId(videoId, trackInfo = null) {
    this.currentVideoId = videoId;
    if (trackInfo) this.currentTrack = trackInfo;

    if (!this.player || !this.isReady) {
      console.warn("YouTube player not ready yet; queueing video ID:", videoId);
      this.pendingVideoId = videoId;
      return false;
    }

    try {
      if (typeof this.player.loadVideoById === 'function') {
        this.player.loadVideoById({ videoId: videoId, startSeconds: 0 });
        this.isPlaying = true;
        return true;
      }
      return false;
    } catch (err) {
      console.error("YouTube play error:", err);
      return false;
    }
  }

  async togglePlay() {
    if (!this.player || !this.isReady) return false;
    if (this.isPlaying) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
    return true;
  }

  async pause() {
    if (this.player && this.isReady) {
      this.player.pauseVideo();
      this.isPlaying = false;
      return true;
    }
    return false;
  }

  async resume() {
    if (this.player && this.isReady) {
      this.player.playVideo();
      this.isPlaying = true;
      return true;
    }
    return false;
  }

  async seek(seconds) {
    if (this.player && this.isReady) {
      this.player.seekTo(seconds, true);
      return true;
    }
    return false;
  }

  async setVolume(percent) {
    if (this.player && this.isReady) {
      this.player.setVolume(Math.max(0, Math.min(100, percent)));
    }
  }

  onStateChange(cb) {
    this.onStateChangeCallback = cb;
  }
}

window.YouTubePlayerAdapter = YouTubePlayerAdapter;
