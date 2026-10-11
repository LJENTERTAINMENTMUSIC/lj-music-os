/**
 * Spotify OAuth Authentication Routes
 * Add these to your server.js file
 */

const axios = require('axios');
const express = require('express');
const session = require('express-session');

module.exports = function setupSpotifyAuth(app) {
  // Configure session
  app.use(session({
    secret: process.env.SESSION_SECRET || 'lj-music-os-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));

  /**
   * Step 1: Redirect user to Spotify authorization page
   */
  app.get('/auth/spotify', (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      return res.status(500).json({ 
        error: 'Spotify credentials not configured',
        details: 'Set SPOTIFY_CLIENT_ID and SPOTIFY_REDIRECT_URI in .env'
      });
    }

    const scopes = [
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-read-playback-state',
      'user-modify-playback-state'
    ];

    const authUrl = 'https://accounts.spotify.com/authorize?' +
      new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: scopes.join(' '),
        show_dialog: 'true'
      }).toString();

    console.log('🎵 Redirecting to Spotify login:', authUrl);
    res.redirect(authUrl);
  });

  /**
   * Step 2: Handle Spotify callback
   */
  app.get('/auth/spotify/callback', async (req, res) => {
    const code = req.query.code;
    const error = req.query.error;

    if (error) {
      console.error('❌ Spotify auth error:', error);
      return res.redirect(`/?error=${error}`);
    }

    if (!code) {
      console.error('❌ No authorization code received');
      return res.redirect('/?error=no_code');
    }

    try {
      console.log('🔄 Exchanging code for access token...');

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const expiresIn = response.data.expires_in;

      // Store tokens in session
      req.session.spotifyToken = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: Date.now() + (expiresIn * 1000),
        expires_in: expiresIn
      };

      console.log('✅ Successfully authenticated with Spotify');
      console.log('Token expires in:', expiresIn, 'seconds');

      // Redirect back to app with token in URL
      res.redirect(`/?spotifyToken=${accessToken}&refresh=${refreshToken}`);

    } catch (err) {
      console.error('❌ Token exchange failed:', err.message);
      if (err.response) {
        console.error('Response:', err.response.data);
      }
      res.status(500).json({ 
        error: 'Authentication failed', 
        details: err.message 
      });
    }
  });

  /**
   * Get current Spotify access token
   */
  app.get('/api/spotify/token', (req, res) => {
    if (!req.session.spotifyToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if token is expired and refresh if needed
    if (req.session.spotifyToken.expires_at < Date.now()) {
      console.log('🔄 Token expired, refreshing...');
      refreshSpotifyToken(req.session.spotifyToken.refresh_token)
        .then(newToken => {
          req.session.spotifyToken = newToken;
          res.json(newToken);
        })
        .catch(err => {
          console.error('❌ Token refresh failed:', err.message);
          res.status(401).json({ error: 'Token refresh failed' });
        });
    } else {
      res.json(req.session.spotifyToken);
    }
  });

  /**
   * Logout
   */
  app.get('/auth/spotify/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('❌ Session destroy error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      console.log('✅ User logged out');
      res.redirect('/');
    });
  });

  /**
   * Refresh access token using refresh token
   */
  async function refreshSpotifyToken(refreshToken) {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const newAccessToken = response.data.access_token;
      const expiresIn = response.data.expires_in;

      console.log('✅ Token refreshed successfully');

      return {
        access_token: newAccessToken,
        refresh_token: refreshToken,
        expires_at: Date.now() + (expiresIn * 1000),
        expires_in: expiresIn
      };
    } catch (err) {
      console.error('❌ Token refresh error:', err.message);
      throw err;
    }
  }
};
