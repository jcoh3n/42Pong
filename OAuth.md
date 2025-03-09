Breakdown simple pour intégrer l'authentification 42 dans ton app Next.js
1. Créer une application sur l'API de 42
Va sur https://profile.intra.42.fr/oauth/applications.
Crée une nouvelle application.
Note ton client_id et client_secret.
Mets ton redirect_uri (ex: http://localhost:3000/api/auth/callback).
2. Rediriger l’utilisateur vers 42 pour s’authentifier
Quand un utilisateur veut se connecter, tu le rediriges vers :

tsx
Copier
Modifier
const CLIENT_ID = "your_client_id";
const REDIRECT_URI = "http://localhost:3000/api/auth/callback";
const STATE = "random_string"; // Utilise une valeur aléatoire pour la sécurité

const loginWith42 = () => {
  window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=public&state=${STATE}`;
};
Ajoute ce bouton dans ton app :

tsx
Copier
Modifier
<button onClick={loginWith42}>Se connecter avec 42</button>
L’utilisateur sera redirigé vers l’authentification 42.

3. Récupérer le code et échanger contre un token
Dans Next.js, crée une API route /api/auth/callback.js :

tsx
Copier
Modifier
export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const response = await fetch("https://api.intra.42.fr/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: "http://localhost:3000/api/auth/callback",
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    res.setHeader("Set-Cookie", `token=${data.access_token}; Path=/; HttpOnly`);
    return res.redirect("/");
  } else {
    return res.status(400).json({ error: "Failed to get access token" });
  }
}
4. Utiliser le token pour récupérer les infos utilisateur
Dans ton frontend, fais un appel à ton API pour récupérer les infos :

tsx
Copier
Modifier
const fetchUserData = async () => {
  const res = await fetch("/api/user");
  const data = await res.json();
  console.log(data);
};

useEffect(() => {
  fetchUserData();
}, []);
Dans /api/user.js :

tsx
Copier
Modifier
export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const response = await fetch("https://api.intra.42.fr/v2/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const userData = await response.json();
  res.json(userData);
}
