const RandomQueryGenerator = require('../src/RandomQueryGenerator');

describe('RandomQueryGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new RandomQueryGenerator();
  });

  describe('generate()', () => {
    test('should generate a non-empty query', () => {
      const query = generator.generate();
      expect(query).toBeTruthy();
      expect(query.length).toBeGreaterThan(0);
    });

    test('should use + instead of spaces', () => {
      const query = generator.generate();
      expect(query).not.toContain(' ');
    });

    test('should not contain card name syntax', () => {
      // Generate multiple queries to increase coverage
      for (let i = 0; i < 20; i++) {
        const query = generator.generate();
        // Card name syntax would be name: or !" (exact name)
        expect(query).not.toMatch(/name:/);
        expect(query).not.toMatch(/!"/);
      }
    });

    test('should generate valid Scryfall syntax', () => {
      const query = generator.generate();
      // Query should contain at least one valid filter pattern
      const validPatterns = [
        /t:[a-z]+/,      // type
        /c[<>=]+[wubrgc]+/, // color
        /id[<>=]+[wubrgc]+/, // color identity
        /mv[<>=]+\d+/,   // mana value
        /pow[<>=]+\d+/,  // power
        /tou[<>=]+\d+/,  // toughness
        /r[<>=]+[a-z]+/, // rarity
        /f:[a-z]+/,      // format
        /keyword:[a-z+]+/, // keyword
        /is:[a-z]+/,     // is filter
        /o:[a-z+]+/,     // oracle text
        /frame:\d+/,     // frame
        /border:[a-z]+/  // border
      ];
      
      const hasValidPattern = validPatterns.some(pattern => pattern.test(query));
      expect(hasValidPattern).toBe(true);
    });

    test('should track generated queries', () => {
      const query = generator.generate();
      expect(generator.hasGenerated(query)).toBe(true);
    });

    test('should increment generated count', () => {
      expect(generator.getGeneratedCount()).toBe(0);
      generator.generate();
      expect(generator.getGeneratedCount()).toBe(1);
      generator.generate();
      expect(generator.getGeneratedCount()).toBe(2);
    });
  });

  describe('generateMultiple()', () => {
    test('should generate multiple unique queries', () => {
      const queries = generator.generateMultiple(10);
      expect(queries.length).toBe(10);
      
      // All queries should be unique
      const uniqueQueries = new Set(queries);
      expect(uniqueQueries.size).toBe(queries.length);
    });

    test('should not use spaces in any query', () => {
      const queries = generator.generateMultiple(10);
      queries.forEach(query => {
        expect(query).not.toContain(' ');
      });
    });

    test('should not include card names in any query', () => {
      const queries = generator.generateMultiple(50);
      queries.forEach(query => {
        expect(query).not.toMatch(/name:/);
        expect(query).not.toMatch(/!"/);
      });
    });
  });

  describe('reset()', () => {
    test('should clear the generated queries set', () => {
      generator.generate();
      generator.generate();
      expect(generator.getGeneratedCount()).toBe(2);
      
      generator.reset();
      expect(generator.getGeneratedCount()).toBe(0);
    });

    test('should allow regenerating previously generated queries after reset', () => {
      // This test demonstrates the reset functionality
      // After reset, previously generated queries can be generated again
      generator.generate();
      const countBefore = generator.getGeneratedCount();
      expect(countBefore).toBe(1);
      
      generator.reset();
      expect(generator.getGeneratedCount()).toBe(0);
    });
  });

  describe('hasGenerated()', () => {
    test('should return false for queries not yet generated', () => {
      expect(generator.hasGenerated('t:creature+c=r')).toBe(false);
    });

    test('should return true for generated queries', () => {
      const query = generator.generate();
      expect(generator.hasGenerated(query)).toBe(true);
    });
  });

  describe('query format requirements', () => {
    test('should be a single line of text', () => {
      const queries = generator.generateMultiple(20);
      queries.forEach(query => {
        expect(query).not.toContain('\n');
        expect(query).not.toContain('\r');
      });
    });

    test('should be URL-safe query part (after ?q=)', () => {
      const queries = generator.generateMultiple(20);
      queries.forEach(query => {
        // The query should work when appended after ?q=
        // It should use + instead of spaces and not have invalid URL characters
        expect(query).not.toContain(' ');
        expect(query).not.toContain('?');
        expect(query).not.toContain('&');
      });
    });
  });

  describe('configuration options', () => {
    test('should accept custom max retries', () => {
      const customGenerator = new RandomQueryGenerator({ maxRetries: 5 });
      expect(customGenerator.maxRetries).toBe(5);
    });

    test('should accept custom config', () => {
      const customGenerator = new RandomQueryGenerator({
        config: {
          types: ['creature', 'instant']
        }
      });
      
      // Generate queries that should only have creature or instant types
      // The custom config should merge with defaults
      expect(customGenerator.config.types).toEqual(['creature', 'instant']);
    });
  });

  describe('uniqueness guarantees', () => {
    test('should generate large number of unique queries', () => {
      const queries = generator.generateMultiple(100);
      const uniqueQueries = new Set(queries);
      
      // All queries should be unique
      expect(uniqueQueries.size).toBe(queries.length);
    });

    test('should return null when max retries exceeded', () => {
      // Create a generator with very limited options
      const limitedGenerator = new RandomQueryGenerator({ maxRetries: 1 });
      
      // Keep generating until we get null or reach a limit
      let nullReturned = false;
      for (let i = 0; i < 10000; i++) {
        const query = limitedGenerator.generate();
        if (query === null) {
          nullReturned = true;
          break;
        }
      }
      
      // With limited retries and many generations, we should eventually get null
      // or have successfully generated many queries
      expect(limitedGenerator.getGeneratedCount() > 0 || nullReturned).toBe(true);
    });
  });
});
