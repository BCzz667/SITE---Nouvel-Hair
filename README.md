# Nouvel Hair — Site vitrine

Salon de coiffure mixte · Le Solazur, 32 Route de Fabregas, 83500 La Seyne-sur-Mer

---

## Démarrage rapide

Aucune installation requise. Ouvrez simplement `index.html` dans votre navigateur.

```
double-clic → index.html
```

Pour prévisualiser avec les polices Google Fonts, une connexion internet est nécessaire.
Le site reste fonctionnel sans connexion (polices de secours système).

---

## Structure des fichiers

```
/
├── index.html              page principale
├── css/
│   └── style.css           feuille de styles (un seul fichier)
├── js/
│   └── main.js             JavaScript vanilla (menus, animations, galerie…)
├── assets/
│   ├── img/                photos à fournir (voir liste ci-dessous)
│   └── favicon/
│       └── favicon.svg     logo monogramme NH (à remplacer)
└── README.md               ce fichier
```

---

## Comment modifier le contenu

### Textes

Tous les textes sont directement dans `index.html`. Repérez les sections par leur
commentaire HTML :

```html
<!-- 1. HERO -->
<!-- 2. À PROPOS -->
<!-- 3. SERVICES & TARIFS -->
<!-- 4. ÉQUIPE -->
<!-- 5. GALERIE -->
<!-- 6. AVIS CLIENTS -->
<!-- 7. CONTACT -->
```

### Horaires

Chercher `<!-- HORAIRES À CONFIRMER -->` dans `index.html`.
Deux occurrences : section Contact et Footer.

### Tarifs

Chercher `<!-- PRIX À CONFIRMER -->` dans `index.html`.
Remplacer chaque `-- €` par le tarif réel.

### Téléphone / Adresse

Chercher `04 94 94 49 47` (3 occurrences) et `32 Route de Fabregas` pour les modifier.

---

## Remplacer les images

Déposez vos photos dans `assets/img/` avec les noms suivants, puis dans `index.html`
remplacez chaque bloc `<!-- REMPLACER : ... -->` par la balise `<img>` correspondante.

| Fichier                  | Section    | Ratio conseillé  | Poids max |
|--------------------------|------------|------------------|-----------|
| `hero-bg.jpg`            | Hero       | 16:9 · 1920×1080 | 300 ko    |
| `about-patronne.jpg`     | À propos   | 4:5 · 800×1000   | 150 ko    |
| `team-jess.jpg`          | Équipe     | 1:1 · 640×640    | 80 ko     |
| `team-jessica.jpg`       | Équipe     | 1:1 · 640×640    | 80 ko     |
| `team-pierre.jpg`        | Équipe     | 1:1 · 640×640    | 80 ko     |
| `gallery-01.jpg` … `06`  | Galerie    | 4:5 · 800×1000   | 150 ko    |

**Exemple de remplacement dans index.html :**

```html
<!-- Avant (placeholder) -->
<div class="img-placeholder" aria-hidden="true">…</div>

<!-- Après (vraie photo) -->
<img src="assets/img/about-patronne.jpg"
     alt="Jess, patronne du salon Nouvel Hair à La Seyne-sur-Mer"
     loading="lazy" width="800" height="1000">
```

### Optimisation des images

Pour de meilleures performances, convertissez vos photos en WebP :
- En ligne : [Squoosh](https://squoosh.app) — gratuit, sans inscription
- Qualité recommandée : 80–85 %

---

## Changer la palette de couleurs

Le site inclut deux palettes définies dans `css/style.css` :

| Palette                        | data-theme | Ambiance                    |
|--------------------------------|------------|-----------------------------|
| **A — Douceur Dorée** (défaut) | `light`    | Crème ivoire + or chaud     |
| **B — Nuit Charbon**           | `dark`     | Charbon profond + champagne |

Le visiteur peut basculer via le bouton ☀ / ☾ dans le header.
La préférence est mémorisée dans `localStorage`.

Pour **changer la palette par défaut** au chargement, modifier `js/main.js` :
```js
// Remplacer cette ligne :
const theme = stored || system;
// Par :
const theme = stored || 'light'; // ou 'dark'
```

Pour **personnaliser les couleurs**, modifier les variables CSS dans `css/style.css`,
section `01. Custom Properties`.

---

## Activer le formulaire de contact

Le formulaire simule actuellement l'envoi côté client uniquement.
Pour activer l'envoi réel, choisir une option et modifier `index.html` :

### Option A — Formspree (recommandé, gratuit jusqu'à 50 msgs/mois)

1. Créer un compte sur [formspree.io](https://formspree.io)
2. Créer un formulaire → copier l'ID
3. Dans `index.html`, remplacer `action="#"` par `action="https://formspree.io/f/VOTRE_ID"`
4. Dans `js/main.js`, remplacer le bloc `// Simulation d'envoi` par le `fetch()` Formspree

### Option B — Mailto (simple, sans confirmation)

```html
<form action="mailto:votre@email.fr" method="post" enctype="text/plain"
```

### Option C — Backend personnalisé

Le commentaire dans `js/main.js` (section `08. Form validation`) contient un exemple
de `fetch()` prêt à l'emploi.

---

## Carte Google Maps

Pour utiliser le code d'intégration officiel de votre fiche Google :

1. Aller sur votre fiche Google Maps
2. Clic **Partager** → **Intégrer une carte** → **Copier le code HTML**
3. Remplacer l'`<iframe src="…">` dans la section Contact de `index.html`

Chercher `<!-- REMPLACER le src par le code d'intégration Google Maps -->`.

---

## SEO local — Schema.org

Dans `index.html`, la balise `<script type="application/ld+json">` contient les
données structurées pour Google (adresse, horaires, note, etc.).

Après validation des horaires et de l'URL définitive, mettre à jour :
- `"url"` : URL du site en ligne
- `"openingHoursSpecification"` : horaires confirmés
- `"aggregateRating"` : note Google réelle (à mettre à jour périodiquement)

---

## Hébergement

Le site est 100 % statique (HTML + CSS + JS). Aucun serveur PHP ni base de données.

| Solution                              | Coût            | Niveau       |
|---------------------------------------|-----------------|--------------|
| **Upload FTP** (OVH, o2switch, Ionos) | ~3–5 €/mois     | Débutant     |
| **Netlify** (glisser-déposer)         | Gratuit         | Débutant     |
| **Vercel**                            | Gratuit         | Intermédiaire|
| **GitHub Pages**                      | Gratuit         | Intermédiaire|

### Déploiement Netlify (le plus simple)

1. Aller sur [netlify.com](https://netlify.com) → créer un compte gratuit
2. **Sites** → glisser-déposer le dossier du projet
3. Le site est en ligne immédiatement avec HTTPS automatique

---

## Checklist avant mise en ligne

- [ ] Remplacer toutes les photos placeholders
- [ ] Vérifier et compléter tous les prix (`-- €`)
- [ ] Confirmer les horaires d'ouverture
- [ ] Mettre à jour les balises `og:url` et `canonical` avec l'URL définitive
- [ ] Remplacer l'`<iframe>` Google Maps par le code officiel
- [ ] Activer le formulaire de contact (Formspree ou autre)
- [ ] Ajouter les liens réseaux sociaux (Instagram, Facebook)
- [ ] Remplacer le favicon par le logo définitif
- [ ] Mettre à jour le Schema.org JSON-LD (URL + horaires définitifs)
- [ ] Créer et ajouter la page Mentions Légales
- [ ] Tester sur mobile (iPhone + Android)
- [ ] Tester la navigation clavier (Tab, Entrée, Échap)

---

## Éléments à fournir par le client

Pour finaliser le site, les éléments suivants sont nécessaires :

1. **Photos** (JPG haute résolution) :
   - Photo principale pour le Hero (intérieur salon ou ambiance)
   - Portrait de Jess (À propos + Équipe)
   - Photos de Jessica et Pierre
   - 6 photos de réalisations pour la galerie

2. **Tarifs définitifs** pour chaque prestation

3. **Horaires officiels** (lundi au samedi, ouverture et fermeture)

4. **Logo** du salon (SVG ou PNG haute résolution) — si disponible

5. **Liens réseaux sociaux** (Instagram, Facebook) — URLs complètes

6. **Email de contact** pour le formulaire

7. **Code d'intégration Google Maps** (depuis la fiche Google Business)

8. **Mentions légales** (nom complet, SIRET, adresse du siège, hébergeur)

---

*Site livré prêt à l'emploi — Nouvel Hair · La Seyne-sur-Mer (83500)*
