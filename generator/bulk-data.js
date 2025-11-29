/**
 * BulkDataManager - Module for downloading and managing Scryfall bulk card data
 * 
 * This module provides functionality to:
 * - Discover and download Scryfall bulk data files
 * - Manage local storage of card data with versioning
 * - Implement refresh policies based on update timestamps
 * 
 * @see https://scryfall.com/docs/api/bulk-data for API documentation
 */

class BulkDataManager {
  constructor(options = {}) {
    this.datasetType = options.datasetType || 'oracle_cards';
    this.storageKey = options.storageKey || 'scryfall_bulk_data';
    this.metadataKey = options.metadataKey || 'scryfall_bulk_metadata';
    this.previousVersionKey = options.previousVersionKey || 'scryfall_bulk_previous';
    this.baseApiUrl = 'https://api.scryfall.com';
    this.status = 'idle';
    this.onProgress = options.onProgress || (() => {});
  }

  /**
   * Get the bulk data endpoint URL
   * @returns {string}
   */
  getBulkDataListUrl() {
    return `${this.baseApiUrl}/bulk-data`;
  }

  /**
   * Fetch the list of available bulk data files from Scryfall
   * @returns {Promise<Array>} Array of bulk data metadata objects
   */
  async fetchBulkDataList() {
    this.status = 'fetching_metadata';
    this.onProgress({ status: this.status, message: 'Fetching bulk data list...' });
    
    try {
      const response = await fetch(this.getBulkDataListUrl());
      if (!response.ok) {
        throw new Error(`Failed to fetch bulk data list: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      this.status = 'error';
      this.onProgress({ status: this.status, message: error.message });
      throw error;
    }
  }

  /**
   * Find the bulk data entry for the specified dataset type
   * @param {string} type - The dataset type (e.g., 'oracle_cards', 'default_cards', 'all_cards')
   * @returns {Promise<Object>} The bulk data metadata object
   */
  async findBulkDataEntry(type = this.datasetType) {
    const bulkDataList = await this.fetchBulkDataList();
    const entry = bulkDataList.find(item => item.type === type);
    
    if (!entry) {
      throw new Error(`Bulk data type "${type}" not found. Available types: ${bulkDataList.map(i => i.type).join(', ')}`);
    }
    
    return entry;
  }

  /**
   * Get the current stored metadata
   * @returns {Object|null}
   */
  getStoredMetadata() {
    try {
      const stored = localStorage.getItem(this.metadataKey);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Failed to read stored metadata:', e);
      return null;
    }
  }

  /**
   * Check if the local data needs to be refreshed
   * @returns {Promise<Object>} Object with needsRefresh boolean and reason
   */
  async checkRefreshNeeded() {
    const storedMetadata = this.getStoredMetadata();
    
    if (!storedMetadata) {
      return { needsRefresh: true, reason: 'No local data found' };
    }
    
    try {
      const remoteEntry = await this.findBulkDataEntry();
      const remoteUpdatedAt = new Date(remoteEntry.updated_at);
      const localUpdatedAt = new Date(storedMetadata.updated_at);
      
      if (remoteUpdatedAt > localUpdatedAt) {
        return { 
          needsRefresh: true, 
          reason: `New data available (remote: ${remoteEntry.updated_at}, local: ${storedMetadata.updated_at})` 
        };
      }
      
      return { needsRefresh: false, reason: 'Local data is up to date' };
    } catch (error) {
      return { needsRefresh: false, reason: `Could not check: ${error.message}` };
    }
  }

  /**
   * Download the bulk data file
   * @param {Object} entry - The bulk data metadata entry
   * @returns {Promise<Array>} The parsed card data
   */
  async downloadBulkData(entry) {
    this.status = 'downloading';
    this.onProgress({ 
      status: this.status, 
      message: `Downloading ${entry.name}...`,
      size: entry.size
    });
    
    try {
      const response = await fetch(entry.download_uri);
      if (!response.ok) {
        throw new Error(`Failed to download bulk data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the data
      if (!Array.isArray(data)) {
        throw new Error('Downloaded data is not a valid array');
      }
      
      this.status = 'processing';
      this.onProgress({ 
        status: this.status, 
        message: `Processing ${data.length} cards...`,
        cardCount: data.length
      });
      
      return data;
    } catch (error) {
      this.status = 'error';
      this.onProgress({ status: this.status, message: error.message });
      throw error;
    }
  }

  /**
   * Store the bulk data locally
   * @param {Array} data - The card data
   * @param {Object} metadata - The metadata to store
   */
  storeData(data, metadata) {
    this.status = 'storing';
    this.onProgress({ status: this.status, message: 'Storing data locally...' });
    
    try {
      // Keep previous version for rollback
      const currentData = localStorage.getItem(this.storageKey);
      const currentMetadata = localStorage.getItem(this.metadataKey);
      
      if (currentData && currentMetadata) {
        localStorage.setItem(this.previousVersionKey, JSON.stringify({
          data: currentData,
          metadata: currentMetadata
        }));
      }
      
      // Store new data - for large datasets, we'll use a compressed format
      const compressedData = this.compressData(data);
      localStorage.setItem(this.storageKey, compressedData);
      localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
      
      this.status = 'complete';
      this.onProgress({ 
        status: this.status, 
        message: 'Data stored successfully',
        cardCount: data.length
      });
    } catch (error) {
      // If storage fails (quota exceeded), try to store a subset
      if (error.name === 'QuotaExceededError') {
        this.onProgress({ 
          status: 'warning', 
          message: 'Storage quota exceeded, storing card index only...' 
        });
        
        // Store only the essential card index
        const cardIndex = this.createCardIndex(data);
        localStorage.setItem(this.storageKey, JSON.stringify(cardIndex));
        localStorage.setItem(this.metadataKey, JSON.stringify({
          ...metadata,
          indexOnly: true,
          originalCardCount: data.length
        }));
      } else {
        this.status = 'error';
        this.onProgress({ status: this.status, message: error.message });
        throw error;
      }
    }
  }

  /**
   * Compress data for storage (simple field reduction)
   * @param {Array} data - Card data array
   * @returns {string} Compressed JSON string
   */
  compressData(data) {
    // Store only essential fields for querying
    const essentialData = data.map(card => ({
      id: card.id,
      oracle_id: card.oracle_id,
      name: card.name,
      type_line: card.type_line,
      mana_cost: card.mana_cost,
      cmc: card.cmc,
      colors: card.colors,
      color_identity: card.color_identity,
      keywords: card.keywords,
      oracle_text: card.oracle_text,
      power: card.power,
      toughness: card.toughness,
      loyalty: card.loyalty,
      rarity: card.rarity,
      set: card.set,
      set_name: card.set_name,
      collector_number: card.collector_number,
      legalities: card.legalities,
      prices: card.prices,
      image_uris: card.image_uris,
      card_faces: card.card_faces ? card.card_faces.map(face => ({
        name: face.name,
        mana_cost: face.mana_cost,
        type_line: face.type_line,
        oracle_text: face.oracle_text,
        colors: face.colors,
        power: face.power,
        toughness: face.toughness,
        loyalty: face.loyalty,
        image_uris: face.image_uris
      })) : undefined,
      layout: card.layout,
      released_at: card.released_at,
      artist: card.artist,
      lang: card.lang,
      reserved: card.reserved,
      foil: card.foil,
      nonfoil: card.nonfoil,
      promo: card.promo,
      reprint: card.reprint,
      frame: card.frame,
      border_color: card.border_color,
      full_art: card.full_art
    }));
    
    return JSON.stringify(essentialData);
  }

  /**
   * Create a minimal card index for large datasets
   * @param {Array} data - Card data array
   * @returns {Object} Card index
   */
  createCardIndex(data) {
    return {
      cards: data.map(card => ({
        id: card.id,
        oracle_id: card.oracle_id,
        name: card.name,
        type_line: card.type_line,
        mana_cost: card.mana_cost,
        cmc: card.cmc,
        colors: card.colors,
        color_identity: card.color_identity,
        keywords: card.keywords,
        rarity: card.rarity,
        set: card.set,
        legalities: card.legalities
      })),
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Sync bulk data - download or refresh as needed
   * @param {Object} options - Sync options
   * @returns {Promise<Object>} Result of the sync operation
   */
  async syncBulkData(options = {}) {
    const forceRefresh = options.forceRefresh || false;
    
    try {
      // Check if refresh is needed
      if (!forceRefresh) {
        const { needsRefresh, reason } = await this.checkRefreshNeeded();
        if (!needsRefresh) {
          this.status = 'up_to_date';
          this.onProgress({ status: this.status, message: reason });
          return { 
            success: true, 
            refreshed: false, 
            message: reason,
            metadata: this.getStoredMetadata()
          };
        }
        this.onProgress({ status: 'needs_refresh', message: reason });
      }
      
      // Get the bulk data entry
      const entry = await this.findBulkDataEntry();
      
      // Download the data
      const cardData = await this.downloadBulkData(entry);
      
      // Store the data
      const metadata = {
        type: entry.type,
        name: entry.name,
        description: entry.description,
        updated_at: entry.updated_at,
        download_uri: entry.download_uri,
        size: entry.size,
        cardCount: cardData.length,
        syncedAt: new Date().toISOString()
      };
      
      this.storeData(cardData, metadata);
      
      return {
        success: true,
        refreshed: true,
        message: `Successfully synced ${cardData.length} cards`,
        metadata: metadata
      };
    } catch (error) {
      return {
        success: false,
        refreshed: false,
        message: error.message,
        error: error
      };
    }
  }

  /**
   * Get the current bulk data status
   * @returns {Object} Status object
   */
  getBulkStatus() {
    const metadata = this.getStoredMetadata();
    const hasData = !!localStorage.getItem(this.storageKey);
    
    return {
      hasData: hasData,
      metadata: metadata,
      datasetType: metadata?.type || this.datasetType,
      lastUpdated: metadata?.updated_at || null,
      cardCount: metadata?.cardCount || 0,
      syncedAt: metadata?.syncedAt || null,
      filePath: 'localStorage'
    };
  }

  /**
   * Get the stored card data
   * @returns {Array|null}
   */
  getStoredData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : (parsed.cards || []);
    } catch (e) {
      console.warn('Failed to read stored data:', e);
      return null;
    }
  }

  /**
   * Rollback to previous version
   * @returns {boolean} Success
   */
  rollback() {
    try {
      const previous = localStorage.getItem(this.previousVersionKey);
      if (!previous) {
        throw new Error('No previous version available');
      }
      
      const { data, metadata } = JSON.parse(previous);
      localStorage.setItem(this.storageKey, data);
      localStorage.setItem(this.metadataKey, metadata);
      
      this.onProgress({ status: 'rollback', message: 'Rolled back to previous version' });
      return true;
    } catch (error) {
      this.onProgress({ status: 'error', message: `Rollback failed: ${error.message}` });
      return false;
    }
  }

  /**
   * Clear all stored data
   */
  clearData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.metadataKey);
    localStorage.removeItem(this.previousVersionKey);
    this.status = 'cleared';
    this.onProgress({ status: this.status, message: 'All data cleared' });
  }
}

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BulkDataManager;
}
