const express = require('express');
const axios = require('axios');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servuj frontend z "public"
app.use(express.static(path.join(__dirname, 'public')));

// Přesměrování na Discord OAuth2
app.get('/login', (req, res) => {
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.CLIENT_ID;
  const scope = 'identify guilds guilds.members.read';
  const state = 'secureRandomState';  // Generuj bezpečnější stav v produkci
  res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code&scope=${scope}&state=${state}`
  );
});

// Callback po přihlášení z Discordu
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const params = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.REDIRECT_URI,
      scope: 'identify guilds guilds.members.read'
    });
    // Získej token
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', params);
    const token = tokenRes.data.access_token;

    // Získej info o uživateli
    const userRes = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const userId = userRes.data.id;

    // Ověř role uživatele ve tvém guildu
    const memberRes = await axios.get(
      `https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const roles = memberRes.data.roles;
    if (!roles.includes(process.env.ROLE_ID)) {
      return res.send('Nemáš potřebnou roli.');
    }

    // Přihlášení OK → přesměruj na frontend
    res.redirect('/');

  } catch (err) {
    console.error(err);
    res.send('Chyba při přihlašování přes Discord.');
  }
});

app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));