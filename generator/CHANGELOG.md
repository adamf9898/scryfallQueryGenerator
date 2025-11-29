# Changelog

All notable changes to the Scryfall Query Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-29

### Added

#### Core Application
- Complete Scryfall Query Builder class with fluent API
- Random Query Generator for unique query generation
- Web application with three tabs: Query Builder, Random Queries, History

#### Query Builder Features
- Card name search (partial and exact match)
- Oracle text and flavor text search
- Type and subtype filtering
- Color and color identity filters with operators
- Mana value, power, and toughness filters
- Rarity filtering with comparison operators
- Set code search
- Format legality filtering
- Keyword selection via clickable tags
- "Is" filter properties
- Artist, frame, and border filters
- USD price filtering
- Raw query input for advanced syntax

#### Random Query Generator
- 500+ curated pre-built queries
- 20 query categories:
  - Creatures
  - Spells (Instants & Sorceries)
  - Artifacts
  - Enchantments
  - Lands
  - Planeswalkers
  - Commander
  - Formats
  - Removal
  - Card Advantage
  - Mana
  - Tribal
  - Budget
  - Competitive
  - Tokens
  - Counters
  - Graveyard
  - Life Gain
  - Protection
  - Interaction
  - Evasion
  - Card Types
  - Advanced
- Category-based filtering
- Single and batch (5) query generation
- One-click search on Scryfall

#### History Management
- Persistent query history using localStorage
- Save queries from Builder or Random Generator
- Quick access to previous searches
- Export history as JSON
- Clear history option
- Individual query deletion

#### Progressive Web App
- Installable on desktop and mobile
- Offline functionality via Service Worker
- Fast repeat visits with caching

#### User Interface
- Responsive design (desktop, tablet, mobile)
- Clean, modern visual design
- Color-coded MTG mana symbols
- Collapsible advanced sections
- Real-time query preview
- Toast notifications for user feedback

#### Developer Features
- Node.js library with ScryfallQueryBuilder and RandomQueryGenerator
- Jest test suite with 73 tests
- ES6+ JavaScript with modern patterns
- Comprehensive API documentation

### Documentation
- README.md with usage examples
- API documentation (API.md)
- Deployment guide (DEPLOYMENT.md)
- Scryfall syntax reference (SCRYFALL-SYNTAX.md)
- Web app documentation

---

## Future Roadmap

### Planned Features

#### v1.1.0
- [ ] Dark theme option
- [ ] MTG-themed color scheme
- [ ] Keyboard shortcuts
- [ ] Query templates/presets

#### v1.2.0
- [ ] Multiple theme support
- [ ] Import history from JSON
- [ ] Share queries via URL
- [ ] Query favorites with categories

#### v1.3.0
- [ ] Query suggestions/autocomplete
- [ ] Recent searches dropdown
- [ ] Query comparison tool
- [ ] Batch query execution

#### v2.0.0
- [ ] Integration with Scryfall API for live previews
- [ ] Card image previews
- [ ] Deck building integration
- [ ] Advanced statistics and analytics
