--[[
  Scryfall Query Generator - Tabletop Simulator Integration
  
  This script provides integration between the web-based Scryfall Query Generator
  and Tabletop Simulator for Magic: The Gathering gameplay.
  
  Features:
  - Query generation and management
  - Dice-based random selection
  - Player reward system
  - Dynamic query loading from categories
  
  Usage:
  1. Place this script on a game object in TTS
  2. Right-click to access the context menu
  3. Use "Generate Query" to get a random Scryfall search
  4. Use "Reload" to reset the system
]]

-- Configuration
local Config = {
  version = "1.0.0",
  maxHistory = 50,
  defaultCategory = "all"
}

-- Query categories (subset of queries.json)
local QueryCategories = {
  creatures = {
    "t:creature keyword:flying",
    "t:creature keyword:trample pow>=4",
    "t:creature keyword:deathtouch",
    "t:creature keyword:hexproof",
    "t:creature keyword:lifelink",
    "t:creature t:legendary f:commander",
    "t:creature o:\"enters the battlefield\"",
    "t:creature t:dragon",
    "t:creature t:angel",
    "t:creature t:demon"
  },
  spells = {
    "t:instant o:counter",
    "t:instant o:destroy",
    "t:instant o:\"draw a card\"",
    "t:sorcery o:\"destroy all\"",
    "t:sorcery o:\"search your library\"",
    "(t:instant or t:sorcery) mv<=3"
  },
  artifacts = {
    "t:artifact o:\"tap\" o:\"add\"",
    "t:artifact t:equipment",
    "t:artifact t:vehicle",
    "t:artifact mv<=3"
  },
  enchantments = {
    "t:enchantment t:aura",
    "t:enchantment t:saga",
    "t:enchantment o:\"whenever\"",
    "t:enchantment o:\"+1/+1\""
  },
  lands = {
    "t:land -is:basic",
    "t:land produces>=2",
    "t:land is:fetchland",
    "t:land is:shockland"
  },
  commander = {
    "t:legendary is:commander",
    "f:commander mv<=4",
    "f:commander o:\"Sol Ring\"",
    "f:commander t:legendary t:artifact"
  }
}

-- State management
local State = {
  currentCategory = "all",
  queryIndex = 1,
  generatedQueries = {},
  history = {}
}

-- Utility functions
local function getRandomElement(tbl)
  if #tbl == 0 then return nil end
  return tbl[math.random(#tbl)]
end

local function getAllQueries()
  local all = {}
  for _, queries in pairs(QueryCategories) do
    for _, query in ipairs(queries) do
      table.insert(all, query)
    end
  end
  return all
end

local function getQueriesFromCategory(category)
  if category == "all" then
    return getAllQueries()
  end
  return QueryCategories[category] or {}
end

-- Core query generation
local function generateRandomQuery(category)
  category = category or State.currentCategory
  local queries = getQueriesFromCategory(category)
  
  if #queries == 0 then
    return "No queries available for category: " .. category
  end
  
  local query = getRandomElement(queries)
  
  -- Add to history
  table.insert(State.history, 1, {
    query = query,
    category = category,
    timestamp = os.time()
  })
  
  -- Limit history size
  while #State.history > Config.maxHistory do
    table.remove(State.history)
  end
  
  return query
end

local function buildScryfallUrl(query)
  -- Simple URL encoding (TTS doesn't have full URL encoding)
  local encoded = query:gsub(" ", "%%20")
                       :gsub("\"", "%%22")
                       :gsub("<", "%%3C")
                       :gsub(">", "%%3E")
  return "https://scryfall.com/search?q=" .. encoded
end

-- Reward system (compatible with original script)
local Rewards = {
  "1d2+1 life",
  "1d3 treasure tokens",
  "1d2 food tokens",
  "draw 1 card",
  "scry 2"
}

local function generateReward()
  return getRandomElement(Rewards)
end

-- TTS Event Handlers
function onLoad(saveState)
  -- Initialize random seed
  math.randomseed(os.time())
  
  -- Restore state if available
  if saveState and saveState ~= "" then
    local loaded = JSON.decode(saveState)
    if loaded then
      State = loaded
    end
  end
  
  -- Create UI button
  self.createButton({
    label = "🔮 Scryfall Query Generator",
    font_color = {1, 1, 1},
    color = {0.4, 0.4, 0.8},
    position = {0, 0.1, 0},
    rotation = {0, 180, 0},
    width = 2000,
    height = 400,
    font_size = 200,
    click_function = "onButtonClick",
    function_owner = self
  })
  
  -- Add context menu options
  self.addContextMenuItem("Generate Query", onGenerateQuery)
  self.addContextMenuItem("Set Category", onSetCategory)
  self.addContextMenuItem("View History", onViewHistory)
  self.addContextMenuItem("Clear History", onClearHistory)
  self.addContextMenuItem("Reload", onReload)
  
  log("Scryfall Query Generator loaded - Version " .. Config.version)
end

function onSave()
  return JSON.encode(State)
end

function onButtonClick(obj, playerColor, altClick)
  if altClick then
    onViewHistory()
  else
    onGenerateQuery()
  end
end

function onGenerateQuery()
  local query = generateRandomQuery()
  local url = buildScryfallUrl(query)
  local reward = generateReward()
  
  -- Format output
  local output = string.format(
    "[000000][b]Scryfall Query:[/b][-] %s\n" ..
    "[0000FF][b]URL:[/b][-] %s\n" ..
    "[00FF00][b]Bonus:[/b][-] %s",
    query, url, reward
  )
  
  printToAll(output, {1, 1, 1})
  
  -- Update object description
  self.setDescription(query .. "\n\n" .. url)
end

function onSetCategory()
  local categories = {"all"}
  for name, _ in pairs(QueryCategories) do
    table.insert(categories, name)
  end
  
  local message = "Available categories: " .. table.concat(categories, ", ")
  printToAll(message, {0.5, 0.5, 1})
  printToAll("Current: " .. State.currentCategory, {1, 1, 0})
end

function onViewHistory()
  if #State.history == 0 then
    printToAll("No query history", {1, 0.5, 0.5})
    return
  end
  
  printToAll("[b]Recent Queries:[/b]", {1, 1, 1})
  for i = 1, math.min(5, #State.history) do
    local entry = State.history[i]
    printToAll(string.format("%d. [%s] %s", i, entry.category, entry.query), {0.8, 0.8, 0.8})
  end
end

function onClearHistory()
  State.history = {}
  printToAll("Query history cleared", {0.5, 1, 0.5})
end

function onReload()
  self.reload()
end

-- Public API for other scripts
function getQuery(category)
  return generateRandomQuery(category)
end

function getCategories()
  local categories = {"all"}
  for name, _ in pairs(QueryCategories) do
    table.insert(categories, name)
  end
  return categories
end

function setCategory(category)
  if category == "all" or QueryCategories[category] then
    State.currentCategory = category
    return true
  end
  return false
end

function getHistory()
  return State.history
end

--[[
  Advanced Usage Examples:
  
  -- From another script, get a random creature query:
  local generator = getObjectFromGUID("your-generator-guid")
  local query = generator.call("getQuery", {"creatures"})
  
  -- Set the category:
  generator.call("setCategory", {"commander"})
  
  -- Get all available categories:
  local categories = generator.call("getCategories")
]]
