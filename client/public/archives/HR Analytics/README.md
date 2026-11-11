# HR Analytics Dashboard — Rapport Power BI

## Table des matières
1. [Vue d'ensemble](#1-vue-densemble)
2. [Modèle de données](#2-modèle-de-données)
3. [Catalogue des mesures DAX](#3-catalogue-des-mesures-dax)
4. [Page 1 : Vue Globale](#4-page-1--vue-globale)
5. [Page 3 : Analyses Avancées](#5-page-3--analyses-avancées)
6. [Ce que raconte le dashboard](#6-ce-que-raconte-le-dashboard)
7. [Slicers et filtres](#7-slicers-et-filtres)
8. [Guide d'interprétation](#8-guide-dinterprétation)

---

## 1. Vue d'ensemble

| Élément | Détail |
|---------|--------|
| **Source de données** | `HR_Analytics.csv` (38 colonnes, import) |
| **Table principale** | `HR_Analytics` |
| **Pages actives** | 2 (page 2 supprimée par l'utilisateur) |
| **Page 1** | `page1_vue_globale` — Vue stratégique RH |
| **Page 3** | `page3_analyses_avancees` — Analyses approfondies |

---

## 2. Modèle de données

Chaque ligne = 1 collaborateur identifié par `EmployeeNumber`. Aucune dimension temporelle (pas de date/mois). Le rapport est un **instantané statique** de la situation RH.

### Colonnes disponibles (38)

**Identification** : `EmpID`, `EmployeeCount`, `EmployeeNumber`

**Démographie** : `Age`, `AgeGroup` (18-25, 26-35, 36-45, 46-55, 55+), `Gender`, `MaritalStatus`, `DistanceFromHome`

**Poste** : `Department` (Research & Development, Sales, Human Resources), `JobRole`, `JobLevel` (1-5), `BusinessTravel`, `OverTime`

**Éducation** : `Education` (1-5), `EducationField`, `TrainingTimesLastYear`

**Carrière** : `YearsAtCompany`, `YearsInCurrentRole`, `YearsSinceLastPromotion`, `YearsWithCurrManager`, `TotalWorkingYears`, `NumCompaniesWorked`

**Rémunération** : `MonthlyIncome`, `SalarySlab` (Upto 5k / 5k-10k / 10k-15k / 15k-20k / Above 20k), `DailyRate`, `HourlyRate`, `MonthlyRate`, `PercentSalaryHike`

**Satisfaction** (1-4) : `EnvironmentSatisfaction`, `JobSatisfaction`, `RelationshipSatisfaction`, `WorkLifeBalance`, `JobInvolvement`

**Performance** : `PerformanceRating` (1-4), `StockOptionLevel`, `StandardHours`

**Mobilité** : `Attrition` (Yes = départ / No = resté)

---


---

## 3. Catalogue des mesures DAX

> Définitions dans `HR_Analytics.SemanticModel/definition/tables/HR_Analytics.tmdl`

### 3.1 Effectifs et mouvement

| Mesure | Formule DAX | Description |
|--------|-------------|-------------|
| `Nombre_Employés` | `DISTINCTCOUNT(EmployeeNumber)` | Effectif total (comptage distinct) |
| `Nb_Départs` | `CALCULATE(DISTINCTCOUNT(EmployeeNumber), Attrition="Yes")` | Nombre d'employés ayant quitté l'entreprise |
| `Taux_Rotation_Pct` | `DIVIDE([Nb_Départs], [Nombre_Employés])` | Taux de turnover / attrition en % |
| `Nb_Heures_Supplémentaires` | `CALCULATE(DISTINCTCOUNT(EmployeeNumber), OverTime="Yes")` | Nombre d'employés en heures sup |
| `Taux_Absentéisme_Pct` | `DIVIDE([Nb_Heures_Supplémentaires], [Nombre_Employés])` | Proxy du taux d'absentéisme |
| `Nb_Promotions_Cette_Année` | `CALCULATE(COUNT(EmployeeNumber), YearsSinceLastPromotion=0)` | Promotions cette année |
| `Taux_Promotion_Pct` | `DIVIDE([Nb_Promotions], [Nombre_Employés])` | Taux de promotion en % |

### 3.2 Ancienneté et expérience

| Mesure | Formule DAX | Description |
|--------|-------------|-------------|
| `Ancienneté_Moyenne_Années` | `AVERAGE(YearsAtCompany)` | Ancienneté moyenne dans l'entreprise (années) |
| `Expérience_Moyenne_Années` | `AVERAGE(TotalWorkingYears)` | Expérience professionnelle totale moyenne |
| `Ancienneté_Poste_Actuel_Moy` | `AVERAGE(YearsInCurrentRole)` | Ancienneté moyenne sur le poste actuel |
| `Ancienneté_Manager_Actuel_Moy` | `AVERAGE(YearsWithCurrManager)` | Ancienneté moyenne avec le manager actuel |
| `Distance_Moyenne_Domicile` | `AVERAGE(DistanceFromHome)` | Distance moyenne domicile-travail (km) |

### 3.3 Satisfaction et performance

| Mesure | Formule DAX | Description |
|--------|-------------|-------------|
| `Satisfaction_Environnement_Moy` | `AVERAGE(EnvironmentSatisfaction)` | Score moyen satisfaction environnement (1-4) |
| `Satisfaction_Travail_Moy` | `AVERAGE(JobSatisfaction)` | Score moyen satisfaction au travail (1-4) |
| `Satisfaction_Relations_Moy` | `AVERAGE(RelationshipSatisfaction)` | Score moyen satisfaction relationnelle (1-4) |
| `Équilibre_Vie_Travail_Moy` | `AVERAGE(WorkLifeBalance)` | Score moyen équilibre vie pro/perso (1-4) |
| `Implication_Travail_Moy` | `AVERAGE(JobInvolvement)` | Score moyen d'implication (1-4) |
| `Performance_Moyenne` | `AVERAGE(PerformanceRating)` | Note de performance moyenne (1-4) |
| `Score_Satisfaction_Global` | `(ENV + JOB + REL + WLB) / 4` | **Indice composite** des 4 dimensions de satisfaction |

### 3.4 Rémunération

| Mesure | Formule DAX | Description |
|--------|-------------|-------------|
| `Salaire_Moyen_Mensuel` | `AVERAGE(MonthlyIncome)` | Revenu mensuel moyen ($) |
| `Masse_Salariale_Mensuelle` | `SUM(MonthlyIncome)` | Masse salariale mensuelle totale ($) |
| `Salaire_Moyen_Par_Département` | `AVERAGEX(HR_Analytics, MonthlyIncome)` | Salaire moyen par service |


---

## 4. Page 1 : Vue Globale

### KPI Cards (en haut)

| GUID | Mesure affichée | Ce qu'elle montre |
|------|-----------------|-------------------|
| `7bac7d5b` | `Nombre_Employés` | **Effectif total** de l'entreprise |
| `439eb64c` | `Équilibre_Vie_Travail_Moy` | Score moyen d'équilibre vie/travail (1-4) |
| `10b55c37` | `Performance_Moyenne` | Note de performance moyenne (1-4) |

### Graphiques (milieu et bas)

| GUID | Type | Axes | Titre | Analyse |
|------|------|------|-------|---------|
| `b1c89894` | Camembert | Genre × Nombre_Employés | "Répartition des employés par genres" | Parité H/F |
| `e02ad15a` | Tableau croisé | EducationField × Education × Nombre_Employés | "Carte du pics d'activités" | Effectifs par domaine × niveau d'études |
| `297f9b90` | Barres horizontales | Department × Nombre_Employés | "Nombre d'employés par départements" | Taille des services |
| `dc1230c4` | Aires empilées | YearsAtCompany × Nombre_Employés | "Ancienneté par nombre d'employés" | Distribution de l'ancienneté |
| `97c9aeb9` | Colonnes groupées | Department × Ancienneté_Moyenne_Années | (sans titre) | Quel service fidélise le mieux |

### Slicer

| GUID | Champ | Label | Effet |
|------|-------|-------|-------|
| `aabd05fae` | `Attrition` | "Filtre Attrition" | Yes = partants / No = restés |

### Éléments décoratifs

`1cf2f627` (Textbox) · `32d28ebc` (Barre supérieure) · `1655c463` `1725559c` `96c4e03e` `8a7740dd` (Cadres conteneurs)

---

## 5. Page 3 : Analyses Avancées

### KPI Cards (en haut)

| GUID | Mesure | Label | Ce qu'elle montre |
|------|--------|-------|-------------------|
| `fe10e19f` | `Nb_Départs` | — | **Volume total des départs** |
| `e6fb0271` | `Taux_Promotion_Pct` | Taux_Promotion | % d'employés promus cette année |
| `58c3c187` | `Taux_Rotation_Pct` | Taux_Rotation | **Taux de turnover** en % |
| `18ab506d` | `Score_Satisfaction_Global` | — | **Indice global de satisfaction** (0-4) |

### Graphiques

| GUID | Type | Axes | Analyse |
|------|------|------|---------|
| `aee06fdc` | Colonnes groupées | Department × Nb_Promotions_Cette_Année | Quel service promut le plus |
| `b95ef46c` | Courbe | YearsAtCompany × Salaire_Moyen_Mensuel | Courbe salariale selon l'ancienneté |
| `f1dc12c0` | Donut | AgeGroup × Nombre_Employés | Pyramide des âges |
| `b2c22aef` | Donut | MaritalStatus × Nombre_Employés | Situation familiale |
| `31b231aa` | Barres | Department × Nombre_Employés | Effectifs par service |
| `a55a567e` | Tableau | JobRole × Nb_Heures_Sup × Taux_Absentéisme | Postes à risque burnout |

### Slicers

| GUID | Champ | Label | Valeurs |
|------|-------|-------|---------|
| `197257de` | `Department` | Department | R&D, Sales, Human Resources |
| `bab00afb` | `SalarySlab` | Tranche salariale | Upto 5k, 5k-10k, 10k-15k, 15k-20k, Above 20k |


---

## 6. Ce que raconte le dashboard

### Page 1 — "L'état des lieux RH"

C'est la page d'entrée : un **tableau de bord synthétique** qui répond aux 3 questions fondamentales :

1. **Combien** : `Nombre_Employés` → l'effectif total
2. **Comment ils se sentent** : `Équilibre_Vie_Travail_Moy` → le climat social
3. **Comment ils performent** : `Performance_Moyenne` → l'efficacité collective

Les graphiques complètent par la **structure** :
- **Camembert genre** → la parité H/F dans l'entreprise
- **Pivot formation** → la cartographie des compétences (domaine × niveau d'études)
- **Barres par départements** → la taille relative des services
- **Aires ancienneté** → la pyramide d'expérience (juniors vs seniors)
- **Colonnes ancienneté par dept** → quel service fidélise le mieux ses employés

**Le slicer Attrition est l'outil clé** : basculez-le sur "Yes" et toute la page se redessine pour ne montrer **que les partants**. Vous voyez instantanément leur profil : département, ancienneté, poste. C'est l'analyse du **"qui part et pourquoi"**.

---

### Page 3 — "Les leviers d'action RH"

C'est la page de **pilotage et décision**. On y trouve les KPI de gestion des talents :

- **Nb_Départs** — le volume absolu de turnover
- **Taux_Promotion_Pct** — l'investissement dans les carrières internes
- **Taux_Rotation_Pct** — le risque de fuite des talents
- **Score_Satisfaction_Global** — le thermomètre social (0-4)

Les graphiques répondent à des questions précises :

- **Promotions par départements** : "Quel service investit dans ses collaborateurs ?"
- **Salaire × Ancienneté** (courbe) : "La politique salariale est-elle cohérente ? Y a-t-il un plateau ?"
- **Pyramide des âges** : "Risquons-nous une vague de départs à la retraite ?"
- **Situation familiale** : "Faut-il adapter nos avantages (mutuelle famille, gardes d'enfants) ?"
- **Tableau heures sup × absentéisme** : **l'analyse la plus stratégique du dashboard** — identifie les **postes en zone de burnout**. Un rôle avec beaucoup d'heures sup ET un fort absentéisme = intervention prioritaire.

**Slicers** : filtrez par département ou par tranche de salaire pour des analyses ciblées.

---

## 7. Slicers et filtres

| Slicer | Page | Champ | Valeurs | Usage |
|--------|------|-------|---------|-------|
| `Attrition` | 1 | `Attrition` | Yes / No | Profil des partants vs restants |
| `Department` | 3 | `Department` | R&D, Sales, HR | Comparer les services |
| `SalarySlab` | 3 | `SalarySlab` | Upto 5k → Above 20k | Analyser par strate salariale |

> **Note** : Pas de filtre temporel (date/mois) car la table `HR_Analytics` ne contient pas de colonne temporelle. Pour une analyse dans le temps, il faudrait une **table de dates** séparée (dimension date) et un modèle en étoile.

---

## 8. Guide d'interprétation

### Scores de satisfaction (échelle 1-4)

| Score | Lecture |
|-------|---------|
| 3.0 – 4.0 | :white_check_mark: Excellent — collaborateurs engagés |
| 2.5 – 3.0 | :warning: Correct — à surveiller |
| 2.0 – 2.5 | :large_orange_circle: Alerte — plan d'action recommandé |
| < 2.0 | :red_circle: Critique — intervention immédiate |

### Taux de rotation

| Taux | Lecture | Coût estimé |
|------|---------|-------------|
| < 5% | :white_check_mark: Excellente rétention | — |
| 5 – 10% | :warning: Acceptable | — |
| 10 – 20% | :large_orange_circle: Turnover élevé | 50-200% du salaire annuel par départ |
| > 20% | :red_circle: Problème structurel | Étude approfondie nécessaire |

### Mesures à surveiller en priorité

1. **`Score_Satisfaction_Global`** : prédicteur du turnover. Sous 2.5 → risque de vague de départs
2. **`Taux_Rotation_Pct`** : au-delà de 10% → le coût de recrutement explose
3. **`Nb_Heures_Supplémentaires`** : au-delà de 30% → signal d'alerte burnout
4. **`Ancienneté_Moyenne_Années`** : faible (< 3 ans) + turnover élevé = problème de marque employeur

### Combinaisons d'analyse recommandées

| Action | Question métier |
|--------|-----------------|
| Slicer Attrition = Yes sur page 1 | "Qui sont ceux qui partent ?" (profil type) |
| Slicer Department = Sales + regarder Salaire_Moyen_Mensuel | "Les Sales sont-ils bien payés vs R&D ?" |
| Slicer SalarySlab = Upto 5k + regarder Taux_Rotation_Pct | "Les bas salaires partent-ils plus ?" |
| Courbe YearsAtCompany sur page 3 | "La fidélisation s'améliore-t-elle avec l'ancienneté ?" |
| Tableau heures sup page 3 | "Quels postes sont en burnout ?" |

---

*Rapport généré depuis `HR_Analytics.SemanticModel` + `HR_Analytics.Report` (PBIP).*
*Dernière mise à jour : 28/08/2026.*
