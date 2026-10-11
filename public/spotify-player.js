/**
 * LJ MUSIC OS - Spotify Web Playback Integration
 * Plays real Spotify tracks instead of placeholder audio
 */

class SpotifyPlayer {
  constructor() {
    this.player = null;
    this.token = null;
    this.currentTrack = null;
    this.isPlaying = false;
    this.deviceId = null;
    this.currentPosition = 0;
    this.currentDuration = 0;
  }

  /**
   * Initialize Spotify SDK and connect player
   */
  async init(token) {
    this.token = token;
    
    return new Promise((resolve) => {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log('🎵 Spotify SDK ready, initializing player...');
        
        this.player = new Spotify.Player({
          name: 'LJ Music OS Player',
          getOAuthToken: cb => cb(this.token),
          volume: 0.5
        });

        this.setupListeners();
        
        this.player.connect().then(success => {
          if (success) {
            console.log('✅ Spotify player connected successfully');
            resolve(true);
          } else {
            console.error('❌ Failed to connect Spotify player');
            resolve(false);
          }
        });
      };

      // Load Spotify SDK if not already loaded
      if (!window.Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-web-playback-sdk.js';
        script.async = true;
        document.body.appendChild(script);
      } else {
        // SDK already loaded, trigger ready event
        window.onSpotifyWebPlaybackSDKReady();
      }
    });
  }

  /**
   * Set up all event listeners
   */
  setupListeners() {
    // Player state changed
    this.player.addListener('player_state_changed', state => {
      if (!state) {
        console.warn('State is null');
        return;
      }

      this.isPlaying = !state.paused;
      this.currentTrack = state.current_track;
      this.deviceId = state.device_id;
      this.currentPosition = state.position;
      this.currentDuration = state.duration;

      console.log('🎶 Playback state changed:', {
        track: this.currentTrack?.name || 'Unknown',
        artist: this.currentTrack?.artists?.[0]?.name || 'Unknown',
        playing: this.isPlaying,
        position: Math.round(this.currentPosition / 1000) + 's',
        duration: Math.round(this.currentDuration / 1000) + 's'
      });

      this.updateUI();
      this.sendTelemetry(state);
    });

    // Authentication error
    this.player.addListener('authentication_error', ({ message }) => {
      console.error('❌ Spotify Auth Error:', message);
      alert('Spotify authentication failed. Please log in again.');
    });

    // Playback error
    this.player.addListener('playback_error', ({ message }) => {
      console.error('❌ Spotify Playback Error:', message);
      alert('Playback error: ' + message);
    });

    // Player ready
    this.player.addListener('ready', ({ device_id }) => {
      this.deviceId = device_id;
      console.log('✅ Player ready with device ID:', device_id);
    });

    // Account error
    this.player.addListener('account_error', ({ message }) => {
      console.error('❌ Spotify Account Error:', message);
    });
  }

  /**
   * Play a Spotify URI (track/playlist/album/artist)
   */
  async play(uri) {
    if (!this.player) {
      console.error('❌ Player not initialized');
      return false;
    }

    if (!this.deviceId) {
      console.error('❌ Device ID not available');
      return false;
    }

    try {
      // Use Spotify API to start playback
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ uris: [uri] })
        }
      );

      if (response.ok || response.status === 204) {
        console.log('✅ Playback started for:', uri);
        this.isPlaying = true;
        this.updateUI();
        return true;
      } else {
        console.error('❌ Play request failed:', response.status, response.statusText);
        const error = await response.text();
        console.error('Error details:', error);
        return false;
      }
    } catch (err) {
      console.error('❌ Play error:', err.message);
      return false;
    }
  }

  /**
   * Play by track ID (converts to Spotify URI format)
   */
  async playTrack(trackId) {
    const uri = `spotify:track:${trackId}`;
    return this.play(uri);
  }

  /**
   * Play a playlist by ID
   */
  async playPlaylist(playlistId) {
    const uri = `spotify:playlist:${playlistId}`;
    return this.play(uri);
  }

  /**
   * Play/Pause toggle
   */
  togglePlayPause() {
    if (this.player) {
      this.player.togglePlay();
    }
  }

  /**
   * Pause playback
   */
  pause() {
    if (this.player && this.isPlaying) {
      this.player.togglePlay();
    }
  }

  /**
   * Resume playback
   */
  resume() {
    if (this.player && !this.isPlaying) {
      this.player.togglePlay();
    }
  }

  /**
   * Seek to position (milliseconds)
   */
  seek(ms) {
    if (this.player) {
      this.player.seek(ms);
    }
  }

  /**
   * Set volume (0-1, where 1 is 100%)
   */
  setVolume(volume) {
    if (this.player) {
      const normalized = Math.max(0, Math.min(1, volume));
      this.player.setVolume(normalized);
    }
  }

  /**
   * Get current track info
   */
  getCurrentTrack() {
    return this.currentTrack;
  }

  /**
   * Get playback state
   */
  getState() {
    return {
      track: this.currentTrack,
      isPlaying: this.isPlaying,
      position: this.currentPosition,
      duration: this.currentDuration,
      deviceId: this.deviceId
    };
  }

  /**
   * Update UI with current track info
   */
  updateUI() {
    if (!this.currentTrack) {
      console.warn('No track to display');
      return;
    }

    const nowPlayingContainer = document.getElementById('now-playing');
    if (!nowPlayingContainer) {
      console.warn('now-playing container not found');
      return;
    }

    const track = this.currentTrack;
    const albumArt = track.album?.images?.[0]?.url || '/placeholder.png';
    const progress = (this.currentPosition / this.currentDuration) * 100;
    const currentTime = this.formatTime(this.currentPosition);
    const duration = this.formatTime(this.currentDuration);

    nowPlayingContainer.innerHTML = `
      <div class="glass-panel rounded-2xl p-6 border border-white/10">
        <!-- Album Art & Track Info -->
        <div class="flex items-start space-x-6 mb-6">
          <img src="${albumArt}" 
               alt="${track.name}" 
               class="w-24 h-24 rounded-xl shadow-lg object-cover">
          
          <div class="flex-1">
            <p class="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Now Playing</p>
            <h3 class="text-2xl font-bold text-white mb-1">${this.escapeHtml(track.name)}</h3>
            <p class="text-base text-slate-300 mb-4">${this.escapeHtml(track.artists?.[0]?.name || 'Unknown Artist')}</p>
            
            <!-- Album & Release Info -->
            <div class="flex items-center space-x-4 text-sm text-slate-400">
              <span>${track.album?.name || 'Unknown Album'}</span>
              <span>•</span>
              <span>${track.explicit ? '🅴 Explicit' : 'Clean'}</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <input type="range" 
                 id="progress-slider" 
                 min="0" 
                 max="${this.currentDuration}" 
                 value="${this.currentPosition}"
                 onchange="spotifyPlayer.seek(this.value)"
                 class="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-600">
          
          <div class="flex justify-between text-xs text-slate-400 mt-2 px-1">
            <span>${currentTime}</span>
            <span>${duration}</span>
          </div>
        </div>

        <!-- Player Controls -->
        <div class="flex items-center justify-between">
          <button onclick="spotifyPlayer.togglePlayPause()" 
                  class="flex items-center space-x-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold rounded-lg transition-all shadow-lg">
            <span>${this.isPlaying ? '⏸' : '▶'}</span>
            <span>${this.isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          
          <div class="flex items-center space-x-3">
            <span class="text-sm text-slate-400">Volume:</span>
            <input type="range" 
                   id="volume-slider" 
                   min="0" 
                   max="100" 
                   value="50"
                   onchange="spotifyPlayer.setVolume(this.value / 100)"
                   class="w-24 h-2 bg-slate-700 rounded-lg cursor-pointer accent-purple-600">
          </div>

          <button onclick="spotifyPlayer.getCurrentTrackInfo()" 
                  class="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all text-sm">
            ℹ️ Info
          </button>
        </div>
      </div>
    `;

    // Update progress bar continuously
    this.updateProgressBar();
  }

  /**
   * Update progress bar as song plays
   */
  updateProgressBar() {
    const slider = document.getElementById('progress-slider');
    if (slider && this.isPlaying) {
      slider.value = this.currentPosition;
      requestAnimationFrame(() => this.updateProgressBar());
    }
  }

  /**
   * Format time in milliseconds to MM:SS
   */
  formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Display current track info in console
   */
  getCurrentTrackInfo() {
    const state = this.getState();
    console.log('📊 Current Track Info:', {
      title: state.track?.name,
      artist: state.track?.artists?.[0]?.name,
      album: state.track?.album?.name,
      duration: this.formatTime(state.duration),
      position: this.formatTime(state.position),
      progress: Math.round((state.position / state.duration) * 100) + '%',
      isPlaying: state.isPlaying,
      spotifyUrl: state.track?.external_urls?.spotify
    });

    alert(`Now Playing: "${state.track?.name}" by ${state.track?.artists?.[0]?.name}`);
  }

  /**
   * Send telemetry data to LJ Music OS backend
   */
  async sendTelemetry(state) {
    if (!state.current_track) return;

    const trackId = state.current_track.id;
    const spotifyId = state.current_track.external_ids?.isrc || state.current_track.id;
    const completion = (state.position / state.duration) * 100;

    try {
      await fetch('/api/telemetry/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: trackId,
          spotifyId: spotifyId,
          signalType: this.isPlaying ? 'play' : 'pause',
          metadata: {
            artist: state.current_track.artists?.[0]?.name,
            title: state.current_track.name,
            album: state.current_track.album?.name,
            duration: state.duration,
            position: state.position,
            completionPct: Math.round(completion),
            isPlaying: !state.paused,
            explicit: state.current_track.explicit,
            uri: state.current_track.uri
          }
        })
      });
    } catch (err) {
      console.warn('⚠️ Telemetry send failed:', err.message);
    }
  }

  /**
   * Search for a track on Spotify and play it
   */
  async searchAndPlay(query) {
    if (!this.token) {
      console.error('❌ Not authenticated with Spotify');
      return false;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        {
          headers: { 'Authorization': `Bearer ${this.token}` }
        }
      );

      const data = await response.json();
      const track = data.tracks?.items?.[0];

      if (track) {
        console.log('🔍 Found track:', track.name, '- playing now...');
        return await this.playTrack(track.id);
      } else {
        console.error('❌ Track not found on Spotify:', query);
        return false;
      }
    } catch (err) {
      console.error('❌ Search error:', err.message);
      return false;
    }
  }
}

// Global instance
let spotifyPlayer = new SpotifyPlayer();

console.log('✅ Spotify Player module loaded');
