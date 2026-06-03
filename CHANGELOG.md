# Changelog

Alle noemenswaardige wijzigingen aan dit project worden hier vastgelegd.

Het formaat is gebaseerd op [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
en dit project volgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-06-03

### Added

- ListCard — toont de in de EU goedgekeurde insecten als lijst, met
  verordeningscode en bron per soort, plus een lege staat voor pending
  soorten (1AM-245).
- TimelineCard — toont de goedkeuringstijdlijn van een insect (EFSA-start →
  EFSA positief → EU-goedkeuring) voor één soort of alle soorten
  chronologisch. Karmijn/E120 wordt netjes afgevangen als uitzondering
  zonder novel-food-traject (1AM-246).
- Vergelijkingsweergave in ListCard — "Wat is het verschil tussen X en Y?"
  rendert twee ingrediënten naast elkaar. Routering via de classifier
  (difference → list-card, identity → decoder-card) (1AM-256).

### Changed

- QuestionResolver routeert nu ook `list-card` en `timeline-card` naar de
  bijbehorende componenten in plaats van de fallback.

### Fixed

- Vergelijkings-id's uit de classifier worden genormaliseerd
  (underscore/koppelteken → spatie) zodat de weergave bestand is tegen
  variaties in de modeluitvoer (1AM-256).

## [0.4.0] - 2026-05-30

### Added

- Generative UI kaart-componenten voor vervolgvragen: DecoderCard (ingrediënt-uitleg),
  DeflectionCard (doorverwijzing naar de juiste autoriteit) en ClarificationCard.
- "Meer weten?" sectie in het scanresultaat — gebruikers kunnen na een scan een
  vervolgvraag stellen over een ingrediënt of EU-regelgeving, met een contextuele
  hint op basis van het gevonden ingrediënt. Optionele uitklap die de snelle-scan
  niet verstoort.
- Herbruikbare `useAskMore` hook + `askQuestion` API-functie voor de vraag-meer-flow.
- Preview-routes voor losse componenten (decoder-card, deflection-card,
  clarification-card, vraag-meer, ask-more-section) als ontwikkel-hulpmiddel.

### Changed

- `ClassifierResponse` type verplaatst naar de API-laag zodat de
  dependency-richting component/hook → API is.
- Doorverwijs-URL's in de deflectie-flow ingevuld met de echte autoriteiten.

## [0.3.0] - 2026-05-12

### Added

- Migratie van de frontend naar Lovable (TanStack Start + Vite + Cloudflare
  Workers runtime).
- Custom domain live: [insect-alert.com](https://insect-alert.com).

[Unreleased]: https://github.com/1am-it/insect-alert-frontend/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/1am-it/insect-alert-frontend/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/1am-it/insect-alert-frontend/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/1am-it/insect-alert-frontend/releases/tag/v0.3.0
