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
├── index.html                        page principale
├── mentions-legales.html             mentions légales (LCEN)
├── politique-confidentialite.html    politique de confidentialité (RGPD)
├── robots.txt                        ⚠️ bloque l'indexation (démo)
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

Les horaires figurent à deux endroits d'`index.html` : dans la section Contact
(tableau détaillé, jour par jour) et dans le pied de page (version condensée).
Chercher `<td>Mardi</td>` pour les localiser.

⚠️ Si vous modifiez les horaires, pensez à mettre à jour aussi le bloc
`openingHoursSpecification` des données structurées Schema.org, en haut du fichier.

### Tarifs

Les tarifs sont dans la section Prestations, répartis en trois onglets
(`panel-forfaits`, `panel-coupes`, `panel-prestations`).

Chaque ligne suit la même structure — il suffit de modifier le montant :

```html
<li class="price-item">
  <span class="price-name">Coupe femme</span>
  <span class="price-dots" aria-hidden="true"></span>
  <span class="price-amount">22€&thinsp;*</span>
</li>
```

L'astérisque signale un tarif « cheveux courts ». Pour ajouter une prestation,
dupliquez un bloc `<li>` complet.

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
| `team-ludivine.jpg`      | Équipe     | 1:1 · 640×640    | 80 ko     |
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

La carte interroge Google par **nom d'établissement** plutôt que par adresse :

```
?q=Nouvel+Hair%2C+32+Rte+de+Fabregas%2C+83500+La+Seyne-sur-Mer&hl=fr&output=embed&z=17
```

C'est ce qui fait apparaître « Nouvel Hair » sur le repère et dans l'infobulle.
Une recherche par simple adresse afficherait le nom de la résidence (« le Solazur »).

| Paramètre | Rôle |
|-----------|------|
| `q` | Recherche — le nom du salon en premier |
| `hl=fr` | Libellés de la carte en français |
| `z` | Niveau de zoom (17 = échelle de la rue) |

### Version plus fiable : le code officiel de votre fiche

La recherche textuelle dépend de la façon dont Google interprète la requête. Pour
pointer vers l'identifiant exact de l'établissement :

1. Google Maps → votre fiche **Nouvel Hair**
2. **Partager** → **Intégrer une carte** → **Copier le code HTML**
3. Remplacer l'URL du `src` de l'`<iframe>` dans la section Contact d'`index.html`

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

## Pages légales et conformité RGPD

Deux pages sont liées depuis le pied de page de toutes les pages du site :

| Page | Fondement juridique |
|------|---------------------|
| `mentions-legales.html` | Article 6 de la LCEN (loi n° 2004-575), modifiée par la loi SREN du 21 mai 2024 |
| `politique-confidentialite.html` | RGPD (UE) 2016/679 + loi Informatique et Libertés n° 78-17 |

### Champs à compléter

Chaque information manquante est **surlignée en jaune** sur la page, avec la mention
« à compléter ». Impossible de la manquer à l'œil nu.

Pour les compter depuis un terminal :

```bash
grep -c 'class="todo"' mentions-legales.html politique-confidentialite.html
```

**13 champs** dans les mentions légales, **4** dans la politique de confidentialité.

### ⚠️ Obligation à ne pas négliger : le médiateur de la consommation

Tout professionnel vendant à des particuliers doit adhérer à un médiateur de la
consommation et afficher ses coordonnées (articles L.612-1 et suivants du code de la
consommation). L'absence de cette mention est passible d'une amende administrative
pouvant atteindre 15 000 €.

Il s'agit d'une adhésion payante auprès d'un organisme agréé (CM2C, Medicys, AME Conso,
CNPM Médiation…), de l'ordre de quelques dizaines d'euros par an pour une petite
structure.

> À noter : la plateforme européenne de règlement en ligne des litiges (RLL/ODR) a
> définitivement fermé le 20 juillet 2025, en application du règlement (UE) 2024/3228.
> Les modèles de mentions légales qui la citent encore sont obsolètes — elle
> n'apparaît volontairement pas ici.

### Deux points de conformité technique restants

Le site charge deux ressources hébergées par Google **avant tout consentement du
visiteur**, ce que la CNIL n'autorise pas :

| Ressource | Ce qui est transmis | Correction recommandée |
|-----------|---------------------|------------------------|
| Carte Google Maps | Adresse IP + dépôt de cookies Google | Charger la carte au clic uniquement |
| Polices Google Fonts | Adresse IP | Héberger les polices sur le site |

Une fois ces deux points corrigés, le site ne dépose **plus aucun traceur tiers** et
**aucun bandeau cookies n'est nécessaire** — plus simple, plus rapide, et plus
respectueux des visiteurs.

Le seul stockage restant est la préférence de thème (`nh-theme`), qui ne quitte jamais
le navigateur et est expressément dispensée de consentement.

---

## ⚠️ Le site est actuellement invisible sur Google

Tant que la cliente n'a pas validé, le site est **fermé aux moteurs de recherche** :
il publie ses tarifs, horaires et prénoms d'équipe réels sur une URL publique.

| Fichier | Ce qui bloque l'indexation |
|---------|----------------------------|
| `index.html`, `mentions-legales.html`, `politique-confidentialite.html` | `<meta name="robots" content="noindex, nofollow">` |
| `robots.txt` | `Disallow: /` |

### Le retirer le jour du lancement

1. Dans les **3 pages HTML**, remplacer `noindex, nofollow` par `index, follow`
   (un bloc de commentaire détaillé se trouve juste au-dessus, dans `index.html`)
2. Dans **`robots.txt`**, supprimer `Disallow: /` et décommenter le bloc « EN PRODUCTION »

Vérification en une commande :

```bash
grep -c 'noindex' index.html mentions-legales.html politique-confidentialite.html robots.txt
# Doit renvoyer 0 partout une fois le site lancé
```

> **À ne pas oublier.** Un site laissé en `noindex` n'apparaît jamais dans Google,
> quelle que soit la qualité du référencement local. C'est l'erreur la plus
> fréquente au moment d'une mise en ligne.

### Ce que le `noindex` ne fait pas

Il empêche le **référencement**, pas l'**accès**. Toute personne disposant de l'URL
peut consulter le site, et le code source reste visible sur GitHub tant que le dépôt
est public. Pour une confidentialité réelle avant validation, il faudrait montrer le
site en local (`double-clic → index.html`) plutôt qu'en ligne.

---

## Checklist avant mise en ligne

- [ ] **Retirer le `noindex` des 3 pages HTML et du `robots.txt`** (voir ci-dessus)

- [ ] Remplacer toutes les photos placeholders
- [ ] Vérifier et compléter tous les prix (`-- €`)
- [ ] Confirmer les horaires d'ouverture
- [ ] Mettre à jour les balises `og:url` et `canonical` avec l'URL définitive
- [ ] Remplacer l'`<iframe>` Google Maps par le code officiel
- [ ] Activer le formulaire de contact (Formspree ou autre)
- [ ] Ajouter les liens réseaux sociaux (Instagram, Facebook)
- [ ] Remplacer le favicon par le logo définitif
- [ ] Mettre à jour le Schema.org JSON-LD (URL + horaires définitifs)
- [ ] **Compléter les 17 champs « à compléter » des pages légales** (voir section dédiée)
- [ ] **Adhérer à un médiateur de la consommation** (obligation légale)
- [ ] Traiter les deux points de conformité RGPD (carte Google Maps + polices)
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

8. **Informations légales** — nécessaires aux mentions légales et à la politique de
   confidentialité (17 champs, tous surlignés en jaune sur les pages) :
   - Forme juridique et, le cas échéant, capital social
   - Numéros SIREN et SIRET
   - Numéro de TVA intracommunautaire (ou mention de franchise en base)
   - Nom et prénom du directeur de la publication
   - Adresse e-mail de contact (**obligatoire** — la LCEN exige un contact direct)
   - Compagnie et numéro de contrat d'assurance responsabilité civile professionnelle
   - Intitulé exact du titre professionnel de coiffure
   - **Médiateur de la consommation** : nom, adresse postale, site internet

---

*Site livré prêt à l'emploi — Nouvel Hair · La Seyne-sur-Mer (83500)*
