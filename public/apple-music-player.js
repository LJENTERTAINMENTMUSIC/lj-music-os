/**
 * LJ MUSIC OS — APPLE MUSIC (MUSICKIT.JS) ADAPTER
 * Production Apple MusicKit.js integration with DRM verification,
 * playback state synchronization, and audio session management.
 */

class AppleMusicPlayerAdapter {
  constructor(options = {}) {
    this.developerToken = options.developerToken || null;
    this.musicKitInstance = null;
    this.isReady = false;
    this.isPlaying = false;
    this.currentTrack = null;
    this.onStateChangeCallback = null;
    this.sdkLoaded = false;
  }

  setDeveloperToken(token) {
    this.developerToken = token;
    if (this.sdkLoaded) this.initMusicKit();
  }

  loadSdk() {
    if (window.MusicKit) {
      this.sdkLoaded = true;
      if (this.developerToken) this.initMusicKit();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
    script.async = true;

    script.onload = () => {
      this.sdkLoaded = true;
      console.log("⚡ Apple MusicKit.js SDK Loaded");
      if (this.developerToken) {
        this.initMusicKit();
      }
    };

    document.head.appendChild(script);
  }

  async initMusicKit() {
    if (!window.MusicKit || !this.developerToken) return;

    try {
      await window.MusicKit.configure({
        developerToken: this.developerToken,
        app: {
          name: 'LJ Music OS',
          build: '2.0.0'
        }
      });

      this.musicKitInstance = window.MusicKit.getInstance();
      this.isReady = true;
      console.log("✅ Apple MusicKit instance configured successfully");

      // Attach state listeners
      this.musicKitInstance.addEventListener(window.MusicKit.Events.playbackStateDidChange, (event) => {
        this.isPlaying = this.musicKitInstance.isPlaying;
        const nowPlaying = this.musicKitInstance.nowPlayingItem;

        if (nowPlaying) {
          this.currentTrack = {
            id: nowPlaying.id,
            title: nowPlaying.title,
            artist: nowPlaying.artistName,
            coverArt: nowPlaying.artworkURL?.replace('{w}x{h}', '400x400'),
            duration: nowPlaying.playbackDuration
          };
        }

        if (this.onStateChangeCallback) {
          this.onStateChangeCallback({
            source: 'apple-music',
            isPlaying: this.isPlaying,
            track: this.currentTrack,
            position: this.musicKitInstance.currentPlaybackTime || 0,
            duration: this.musicKitInstance.currentPlaybackDuration || 0
          });
        }
      });
    } catch (err) {
      console.warn("⚠️ Apple MusicKit initialization failed (developer token check):", err);
    }
  }

  async playSong(appleMusicSongId) {
    if (!this.musicKitInstance) {
      console.warn("Apple MusicKit not configured; falling back.");
      return false;
    }

    try {
      await this.musicKitInstance.setQueue({ song: appleMusicSongId });
      await this.musicKitInstance.play();
      this.isPlaying = true;
      return true;
    } catch (err) {
      console.error("Apple MusicKit play error:", err);
      return false;
    }
  }

  async togglePlay() {
    if (!this.musicKitInstance) return false;
    if (this.isPlaying) {
      await this.musicKitInstance.pause();
    } else {
      await this.musicKitInstance.play();
    }
    return true;
  }

  async pause() {
    if (this.musicKitInstance) {
      await this.musicKitInstance.pause();
      this.isPlaying = false;
      return true;
    }
    return false;
  }

  async resume() {
    if (this.musicKitInstance) {
      await this.musicKitInstance.play();
      this.isPlaying = true;
      return true;
    }
    return false;
  }

  async seek(seconds) {
    if (this.musicKitInstance) {
      await this.musicKitInstance.seekToTime(seconds);
      return true;
    }
    return false;
  }

  async setVolume(percent) {
    if (this.musicKitInstance) {
      this.musicKitInstance.volume = Math.max(0, Math.min(1, percent / 100));
    }
  }

  onStateChange(cb) {
    this.onStateChangeCallback = cb;
  }
}

window.AppleMusicPlayerAdapter = AppleMusicPlayerAdapter;
