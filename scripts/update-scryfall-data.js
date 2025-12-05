#!/usr/bin/env node

/**
 * Scryfall Data Update Script
 *
 * Fetches the latest data from Scryfall API and updates the local data files.
 * This script is designed to be run manually or via GitHub Actions.
 *
 * Usage: node scripts/update-scryfall-data.js
 */

const fs = require('fs');
const path = require('path');

const SCRYFALL_API_BASE = 'https://api.scryfall.com';
const DATA_DIR = path.join(__dirname, '..', 'data');

// Rate limiting: Scryfall asks for 50-100ms between requests
const DELAY_MS = 100;

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Read and parse a JSON file with error handling
 * @param {string} filePath - Path to the JSON file
 * @returns {Object} Parsed JSON object
 */
function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
  }
}

/**
 * Fetch JSON from a URL with error handling
 * @param {string} url - URL to fetch
 * @returns {Promise<Object>} Parsed JSON response
 */
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`);
  }
  return response.json();
}

/**
 * Fetch all pages of a paginated Scryfall response
 * @param {string} url - Initial URL
 * @returns {Promise<Object[]>} Array of all data items
 */
async function fetchAllPages(url) {
  const allData = [];
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetchJson(nextUrl);
    if (response.data) {
      allData.push(...response.data);
    }
    nextUrl = response.has_more ? response.next_page : null;
    if (nextUrl) {
      await sleep(DELAY_MS);
    }
  }

  return allData;
}

/**
 * Update sets.json with latest set data from Scryfall
 */
async function updateSets() {
  console.log('Fetching sets from Scryfall...');

  const sets = await fetchAllPages(`${SCRYFALL_API_BASE}/sets`);

  // Filter and sort sets
  const now = new Date();
  const recentSets = sets
    .filter((s) => {
      const releaseDate = new Date(s.released_at);
      return (
        releaseDate <= now &&
        ['core', 'expansion', 'masters', 'draft_innovation'].includes(s.set_type)
      );
    })
    .sort((a, b) => new Date(b.released_at) - new Date(a.released_at))
    .slice(0, 20)
    .map((s) => ({
      code: s.code,
      name: s.name,
      releaseDate: s.released_at,
      type: s.set_type,
    }));

  // Read existing sets.json to preserve manual entries
  const setsPath = path.join(DATA_DIR, 'sets.json');
  const existingSets = readJsonFile(setsPath);

  // Update only recentSets, preserve other sections
  existingSets.recentSets = recentSets;

  fs.writeFileSync(setsPath, JSON.stringify(existingSets, null, 2) + '\n');
  console.log(`Updated sets.json with ${recentSets.length} recent sets`);
}

/**
 * Update types.json with latest type data from Scryfall catalogs
 */
async function updateTypes() {
  console.log('Fetching types from Scryfall...');

  // Fetch all type catalogs
  const [creatureTypes, artifactTypes, enchantmentTypes, landTypes, planeswalkerTypes, spellTypes] =
    await Promise.all([
      fetchJson(`${SCRYFALL_API_BASE}/catalog/creature-types`),
      fetchJson(`${SCRYFALL_API_BASE}/catalog/artifact-types`),
      fetchJson(`${SCRYFALL_API_BASE}/catalog/enchantment-types`),
      fetchJson(`${SCRYFALL_API_BASE}/catalog/land-types`),
      fetchJson(`${SCRYFALL_API_BASE}/catalog/planeswalker-types`),
      fetchJson(`${SCRYFALL_API_BASE}/catalog/spell-types`),
    ]);

  // Read existing types.json to preserve manual entries
  const typesPath = path.join(DATA_DIR, 'types.json');
  const existingTypes = readJsonFile(typesPath);

  // Update type arrays
  existingTypes.creatureTypes = creatureTypes.data.sort();
  existingTypes.artifactTypes = artifactTypes.data.sort();
  existingTypes.enchantmentTypes = enchantmentTypes.data.sort();
  existingTypes.planeswalkerTypes = planeswalkerTypes.data.sort();
  existingTypes.spellTypes = spellTypes.data.sort();

  // Update land types - preserve structure but update values
  const basicLandTypes = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest', 'Wastes'];
  const nonBasicLandTypes = landTypes.data.filter((t) => !basicLandTypes.includes(t)).sort();
  existingTypes.landTypes = {
    basic: basicLandTypes,
    nonbasic: nonBasicLandTypes,
  };

  fs.writeFileSync(typesPath, JSON.stringify(existingTypes, null, 2) + '\n');
  console.log(
    `Updated types.json with ${creatureTypes.data.length} creature types, ${artifactTypes.data.length} artifact types, ${enchantmentTypes.data.length} enchantment types`
  );
}

/**
 * Update keywords.json with latest keyword abilities from Scryfall
 */
async function updateKeywords() {
  console.log('Fetching keywords from Scryfall...');

  const [keywordAbilities, keywordActions, abilityWords] = await Promise.all([
    fetchJson(`${SCRYFALL_API_BASE}/catalog/keyword-abilities`),
    fetchJson(`${SCRYFALL_API_BASE}/catalog/keyword-actions`),
    fetchJson(`${SCRYFALL_API_BASE}/catalog/ability-words`),
  ]);

  // Read existing keywords.json to preserve descriptions
  const keywordsPath = path.join(DATA_DIR, 'keywords.json');
  const existingKeywords = readJsonFile(keywordsPath);

  // Create a map of existing keywords with their descriptions
  const existingKeywordMap = new Map();
  for (const category of ['evergreen', 'deciduous', 'common']) {
    for (const keyword of existingKeywords[category] || []) {
      existingKeywordMap.set(keyword.name.toLowerCase(), keyword);
    }
  }

  // Combine all keyword abilities
  const allKeywordAbilities = new Set([...keywordAbilities.data, ...keywordActions.data]);

  // Categorize keywords - preserve existing categories where possible
  const evergreenKeywords = new Set(existingKeywords.evergreen?.map((k) => k.name.toLowerCase()) || []);
  const deciduousKeywords = new Set(existingKeywords.deciduous?.map((k) => k.name.toLowerCase()) || []);

  const newEvergreen = [];
  const newDeciduous = [];
  const newCommon = [];

  for (const keyword of allKeywordAbilities) {
    const lowerKeyword = keyword.toLowerCase();
    const existing = existingKeywordMap.get(lowerKeyword);

    const keywordObj = existing || {
      name: keyword,
      description: '',
      reminder: '',
    };

    // Ensure the name matches the Scryfall capitalization
    keywordObj.name = keyword;

    if (evergreenKeywords.has(lowerKeyword)) {
      newEvergreen.push(keywordObj);
    } else if (deciduousKeywords.has(lowerKeyword)) {
      newDeciduous.push(keywordObj);
    } else {
      newCommon.push(keywordObj);
    }
  }

  // Sort each category
  newEvergreen.sort((a, b) => a.name.localeCompare(b.name));
  newDeciduous.sort((a, b) => a.name.localeCompare(b.name));
  newCommon.sort((a, b) => a.name.localeCompare(b.name));

  existingKeywords.evergreen = newEvergreen;
  existingKeywords.deciduous = newDeciduous;
  existingKeywords.common = newCommon;
  existingKeywords.abilityWords = abilityWords.data.sort();

  fs.writeFileSync(keywordsPath, JSON.stringify(existingKeywords, null, 2) + '\n');
  console.log(
    `Updated keywords.json with ${newEvergreen.length} evergreen, ${newDeciduous.length} deciduous, ${newCommon.length} common keywords, and ${abilityWords.data.length} ability words`
  );
}

/**
 * Main function to run all updates
 */
async function main() {
  console.log('Starting Scryfall data update...\n');

  try {
    await updateSets();
    await sleep(DELAY_MS);

    await updateTypes();
    await sleep(DELAY_MS);

    await updateKeywords();

    console.log('\nScryfall data update complete!');
  } catch (error) {
    console.error('Error updating Scryfall data:', error.message);
    process.exit(1);
  }
}

main();
