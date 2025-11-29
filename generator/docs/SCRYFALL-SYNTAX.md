# Scryfall Search Syntax Reference

This guide covers the complete Scryfall search syntax supported by the Query Generator.

## Table of Contents

- [Basic Search](#basic-search)
- [Card Name & Text](#card-name--text)
- [Colors & Color Identity](#colors--color-identity)
- [Types & Subtypes](#types--subtypes)
- [Mana Values & Costs](#mana-values--costs)
- [Power & Toughness](#power--toughness)
- [Rarity](#rarity)
- [Sets & Editions](#sets--editions)
- [Format Legality](#format-legality)
- [Keywords](#keywords)
- [Special Filters](#special-filters)
- [Price Filters](#price-filters)
- [Grouping & Logic](#grouping--logic)
- [Advanced Filters](#advanced-filters)

---

## Basic Search

Simply typing words will search for cards with those words in their name:

```
Lightning Bolt
```

For exact matches, use quotes:

```
"Lightning Bolt"
```

---

## Card Name & Text

### Name Search

| Syntax | Description | Example |
|--------|-------------|---------|
| `name:word` | Partial name match | `name:bolt` |
| `!"Exact Name"` | Exact name match | `!"Lightning Bolt"` |

### Oracle Text (Rules Text)

| Syntax | Description | Example |
|--------|-------------|---------|
| `o:word` | Search oracle text | `o:draw` |
| `o:"exact phrase"` | Exact phrase in oracle text | `o:"draw a card"` |

### Flavor Text

| Syntax | Description | Example |
|--------|-------------|---------|
| `ft:word` | Search flavor text | `ft:doom` |
| `ft:"exact phrase"` | Exact phrase in flavor text | `ft:"the end is near"` |

---

## Colors & Color Identity

### Color Abbreviations

| Letter | Color |
|--------|-------|
| `w` | White |
| `u` | Blue |
| `b` | Black |
| `r` | Red |
| `g` | Green |
| `c` | Colorless |

### Card Color

| Syntax | Description | Example |
|--------|-------------|---------|
| `c=r` | Exactly red | `c=r` |
| `c>=rg` | Red and green or more | `c>=rg` |
| `c<=ub` | Blue and/or black only | `c<=ub` |
| `c=c` | Colorless cards | `c=c` |

### Color Identity (Commander)

| Syntax | Description | Example |
|--------|-------------|---------|
| `id=ub` | Exactly blue-black identity | `id=ub` |
| `id<=wubrg` | Any color identity | `id<=wubrg` |
| `id<=c` | Colorless identity only | `id<=c` |

### Mana Production

| Syntax | Description | Example |
|--------|-------------|---------|
| `produces:g` | Produces green mana | `produces:g` |
| `produces>=2` | Produces 2+ colors | `produces>=2` |

---

## Types & Subtypes

### Card Type

| Syntax | Description | Example |
|--------|-------------|---------|
| `t:creature` | Creature cards | `t:creature` |
| `t:instant` | Instant cards | `t:instant` |
| `t:sorcery` | Sorcery cards | `t:sorcery` |
| `t:enchantment` | Enchantment cards | `t:enchantment` |
| `t:artifact` | Artifact cards | `t:artifact` |
| `t:planeswalker` | Planeswalker cards | `t:planeswalker` |
| `t:land` | Land cards | `t:land` |
| `t:battle` | Battle cards | `t:battle` |

### Subtypes

| Syntax | Description | Example |
|--------|-------------|---------|
| `t:elf` | Elf creature type | `t:elf` |
| `t:aura` | Aura enchantments | `t:aura` |
| `t:equipment` | Equipment artifacts | `t:equipment` |
| `t:legendary` | Legendary permanents | `t:legendary` |

---

## Mana Values & Costs

### Mana Value (CMC)

| Syntax | Description | Example |
|--------|-------------|---------|
| `mv=3` | Mana value exactly 3 | `mv=3` |
| `mv<=2` | Mana value 2 or less | `mv<=2` |
| `mv>=5` | Mana value 5 or more | `mv>=5` |
| `mv>0` | Mana value greater than 0 | `mv>0` |

### Mana Cost

| Syntax | Description | Example |
|--------|-------------|---------|
| `m={2}{U}` | Exact mana cost | `m={2}{U}` |
| `m>={R}{R}` | At least RR in cost | `m>={R}{R}` |

---

## Power & Toughness

### Power

| Syntax | Description | Example |
|--------|-------------|---------|
| `pow=4` | Power exactly 4 | `pow=4` |
| `pow>=4` | Power 4 or greater | `pow>=4` |
| `pow>tou` | Power greater than toughness | `pow>tou` |

### Toughness

| Syntax | Description | Example |
|--------|-------------|---------|
| `tou=5` | Toughness exactly 5 | `tou=5` |
| `tou>=5` | Toughness 5 or greater | `tou>=5` |
| `tou>pow` | Toughness greater than power | `tou>pow` |

---

## Rarity

| Syntax | Description | Example |
|--------|-------------|---------|
| `r=common` | Common rarity | `r=common` |
| `r=uncommon` | Uncommon rarity | `r=uncommon` |
| `r=rare` | Rare rarity | `r=rare` |
| `r=mythic` | Mythic rare rarity | `r=mythic` |
| `r>=rare` | Rare or mythic | `r>=rare` |

---

## Sets & Editions

| Syntax | Description | Example |
|--------|-------------|---------|
| `s:dom` | Dominaria set | `s:dom` |
| `s:neo` | Kamigawa: Neon Dynasty | `s:neo` |
| `s:one` | Phyrexia: All Will Be One | `s:one` |
| `e:dom` | Edition (same as set) | `e:dom` |

### Year & Date

| Syntax | Description | Example |
|--------|-------------|---------|
| `year>=2020` | Cards from 2020 or later | `year>=2020` |
| `year=2023` | Cards from 2023 | `year=2023` |

---

## Format Legality

| Syntax | Description | Example |
|--------|-------------|---------|
| `f:standard` | Standard legal | `f:standard` |
| `f:modern` | Modern legal | `f:modern` |
| `f:legacy` | Legacy legal | `f:legacy` |
| `f:vintage` | Vintage legal | `f:vintage` |
| `f:commander` | Commander legal | `f:commander` |
| `f:pioneer` | Pioneer legal | `f:pioneer` |
| `f:pauper` | Pauper legal | `f:pauper` |
| `f:historic` | Historic legal | `f:historic` |
| `f:brawl` | Brawl legal | `f:brawl` |

### Banned & Restricted

| Syntax | Description | Example |
|--------|-------------|---------|
| `banned:modern` | Banned in Modern | `banned:modern` |
| `banned:commander` | Banned in Commander | `banned:commander` |
| `restricted:vintage` | Restricted in Vintage | `restricted:vintage` |

---

## Keywords

| Syntax | Description | Example |
|--------|-------------|---------|
| `keyword:flying` | Has flying | `keyword:flying` |
| `keyword:trample` | Has trample | `keyword:trample` |
| `keyword:haste` | Has haste | `keyword:haste` |
| `keyword:lifelink` | Has lifelink | `keyword:lifelink` |
| `keyword:deathtouch` | Has deathtouch | `keyword:deathtouch` |
| `keyword:hexproof` | Has hexproof | `keyword:hexproof` |
| `keyword:indestructible` | Has indestructible | `keyword:indestructible` |
| `keyword:vigilance` | Has vigilance | `keyword:vigilance` |
| `keyword:menace` | Has menace | `keyword:menace` |
| `keyword:reach` | Has reach | `keyword:reach` |
| `keyword:flash` | Has flash | `keyword:flash` |
| `keyword:defender` | Has defender | `keyword:defender` |
| `keyword:ward` | Has ward | `keyword:ward` |
| `keyword:"first strike"` | Has first strike | `keyword:"first strike"` |
| `keyword:"double strike"` | Has double strike | `keyword:"double strike"` |

---

## Special Filters

### Is Filters

| Syntax | Description | Example |
|--------|-------------|---------|
| `is:commander` | Valid commanders | `is:commander` |
| `is:spell` | Spell cards | `is:spell` |
| `is:permanent` | Permanent cards | `is:permanent` |
| `is:historic` | Historic permanents | `is:historic` |
| `is:modal` | Modal spells | `is:modal` |
| `is:vanilla` | Vanilla creatures | `is:vanilla` |
| `is:funny` | Silver-border/acorn | `is:funny` |
| `is:booster` | Found in boosters | `is:booster` |
| `is:reprint` | Reprint cards | `is:reprint` |
| `is:promo` | Promo cards | `is:promo` |
| `is:digital` | Digital-only cards | `is:digital` |
| `is:foil` | Available in foil | `is:foil` |
| `is:nonfoil` | Available non-foil | `is:nonfoil` |
| `is:full` | Full art | `is:full` |
| `is:extended` | Extended art | `is:extended` |
| `is:borderless` | Borderless | `is:borderless` |

### Special Land Types

| Syntax | Description | Example |
|--------|-------------|---------|
| `is:fetchland` | Fetch lands | `is:fetchland` |
| `is:shockland` | Shock lands | `is:shockland` |
| `is:dual` | Original dual lands | `is:dual` |
| `-is:basic` | Non-basic lands | `-is:basic` |

---

## Price Filters

| Syntax | Description | Example |
|--------|-------------|---------|
| `usd<10` | Under $10 USD | `usd<10` |
| `usd<=1` | $1 or less USD | `usd<=1` |
| `usd>=100` | $100 or more USD | `usd>=100` |
| `eur<5` | Under €5 EUR | `eur<5` |
| `tix<1` | Under 1 TIX (MTGO) | `tix<1` |

---

## Grouping & Logic

### OR Conditions

Use parentheses with `or`:

```
(t:creature or t:planeswalker)
```

### AND Conditions

Multiple filters are AND by default:

```
t:creature c=r mv<=3
```

### Negation

Use `-` to negate:

```
-is:reprint
-t:land
```

### Complex Examples

```
# Red or green creatures with power >= 4
(c=r or c=g) t:creature pow>=4

# Instants or sorceries that draw cards
(t:instant or t:sorcery) o:"draw a card"

# Creatures that are NOT legendary
t:creature -t:legendary
```

---

## Advanced Filters

### Artist

| Syntax | Description | Example |
|--------|-------------|---------|
| `a:avon` | Artist name contains "avon" | `a:avon` |
| `a:"John Avon"` | Exact artist name | `a:"John Avon"` |

### Frame & Border

| Syntax | Description | Example |
|--------|-------------|---------|
| `frame:2015` | 2015 card frame | `frame:2015` |
| `frame:future` | Future shifted frame | `frame:future` |
| `border:black` | Black border | `border:black` |
| `border:borderless` | Borderless | `border:borderless` |

### Watermark

| Syntax | Description | Example |
|--------|-------------|---------|
| `wm:orzhov` | Orzhov watermark | `wm:orzhov` |
| `wm:phyrexian` | Phyrexian watermark | `wm:phyrexian` |

### Language

| Syntax | Description | Example |
|--------|-------------|---------|
| `lang:ja` | Japanese cards | `lang:ja` |
| `lang:de` | German cards | `lang:de` |
| `lang:en` | English cards | `lang:en` |

---

## Example Queries

### Beginner-Friendly

```
# Red creatures with haste
t:creature c=r keyword:haste

# Blue instant card draw
t:instant c=u o:"draw a card"

# Common artifacts
t:artifact r=common
```

### Commander

```
# Legendary creatures for Commander
t:creature t:legendary is:commander

# Cards legal in Commander under $5
f:commander usd<5

# 5-color commanders
t:legendary is:commander id=wubrg
```

### Budget Deck Building

```
# Modern playable creatures under $1
f:modern t:creature usd<1

# Rare lands under $5
t:land r>=rare usd<5
```

### Competitive

```
# Modern banned cards
banned:modern

# Vintage restricted cards
restricted:vintage

# Legacy legal instants
f:legacy t:instant
```

---

## Tips & Best Practices

1. **Use quotes for multi-word terms**: `o:"draw a card"` not `o:draw a card`

2. **Combine filters for precision**: The more specific, the better results

3. **Use comparison operators**: `>=`, `<=`, `>`, `<`, `=` for numeric values

4. **Negate with `-`**: Exclude unwanted cards with `-is:reprint`

5. **Check format legality**: Always add `f:format` for deck building

6. **Consider budget**: Add price filters like `usd<5` for budget builds

---

## Resources

- [Scryfall Search Reference](https://scryfall.com/docs/syntax) - Official documentation
- [Scryfall API](https://scryfall.com/docs/api) - API documentation
- [MTG Wiki](https://mtg.fandom.com/) - Card game reference
