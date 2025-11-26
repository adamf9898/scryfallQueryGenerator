const ScryfallQueryBuilder = require('../src/ScryfallQueryBuilder');

describe('ScryfallQueryBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new ScryfallQueryBuilder();
  });

  describe('basic query building', () => {
    test('should create an empty query', () => {
      expect(builder.build()).toBe('');
    });

    test('should search by name', () => {
      expect(builder.name('Lightning').build()).toBe('name:Lightning');
    });

    test('should handle multi-word names with quotes', () => {
      expect(builder.name('Lightning Bolt').build()).toBe('name:"Lightning Bolt"');
    });

    test('should search by exact name', () => {
      expect(builder.exactName('Lightning Bolt').build()).toBe('!"Lightning Bolt"');
    });

    test('should search by oracle text', () => {
      expect(builder.oracleText('draw a card').build()).toBe('o:"draw a card"');
    });

    test('should search by type', () => {
      expect(builder.type('creature').build()).toBe('t:creature');
    });

    test('should search by multi-word type', () => {
      expect(builder.type('legendary creature').build()).toBe('t:"legendary creature"');
    });
  });

  describe('color queries', () => {
    test('should search by color identity', () => {
      expect(builder.colorIdentity('ub').build()).toBe('id=ub');
    });

    test('should search by color identity with operator', () => {
      expect(builder.colorIdentity('wubrg', '<=').build()).toBe('id<=wubrg');
    });

    test('should search by color with array', () => {
      expect(builder.color(['u', 'b']).build()).toBe('c=ub');
    });

    test('should search by color with operator', () => {
      expect(builder.color('r', '>=').build()).toBe('c>=r');
    });
  });

  describe('mana and stats queries', () => {
    test('should search by mana cost', () => {
      expect(builder.manaCost('{2}{U}{U}').build()).toBe('m={2}{U}{U}');
    });

    test('should search by mana value', () => {
      expect(builder.manaValue(3).build()).toBe('mv=3');
    });

    test('should search by mana value with operator', () => {
      expect(builder.manaValue(5, '>=').build()).toBe('mv>=5');
    });

    test('should search by power', () => {
      expect(builder.power(4).build()).toBe('pow=4');
    });

    test('should search by power with operator', () => {
      expect(builder.power(2, '>').build()).toBe('pow>2');
    });

    test('should search by toughness', () => {
      expect(builder.toughness(3).build()).toBe('tou=3');
    });

    test('should search by toughness with operator', () => {
      expect(builder.toughness(5, '<=').build()).toBe('tou<=5');
    });
  });

  describe('rarity and set queries', () => {
    test('should search by rarity', () => {
      expect(builder.rarity('mythic').build()).toBe('r=mythic');
    });

    test('should search by rarity with operator', () => {
      expect(builder.rarity('rare', '>=').build()).toBe('r>=rare');
    });

    test('should search by set', () => {
      expect(builder.set('dom').build()).toBe('s:dom');
    });
  });

  describe('format queries', () => {
    test('should search by format', () => {
      expect(builder.format('modern').build()).toBe('f:modern');
    });

    test('should search for banned cards', () => {
      expect(builder.banned('legacy').build()).toBe('banned:legacy');
    });

    test('should search for restricted cards', () => {
      expect(builder.restricted('vintage').build()).toBe('restricted:vintage');
    });
  });

  describe('additional filters', () => {
    test('should search by artist', () => {
      expect(builder.artist('John Avon').build()).toBe('a:"John Avon"');
    });

    test('should search by flavor text', () => {
      expect(builder.flavorText('doom').build()).toBe('ft:doom');
    });

    test('should search by watermark', () => {
      expect(builder.watermark('orzhov').build()).toBe('wm:orzhov');
    });

    test('should search by language', () => {
      expect(builder.language('ja').build()).toBe('lang:ja');
    });

    test('should search by frame', () => {
      expect(builder.frame('2015').build()).toBe('frame:2015');
    });

    test('should search by border', () => {
      expect(builder.border('borderless').build()).toBe('border:borderless');
    });

    test('should search by keyword', () => {
      expect(builder.keyword('flying').build()).toBe('keyword:flying');
    });

    test('should search for mana producers', () => {
      expect(builder.produces('g').build()).toBe('produces:g');
    });
  });

  describe('price queries', () => {
    test('should search by USD price', () => {
      expect(builder.priceUsd(10).build()).toBe('usd=10');
    });

    test('should search by USD price with operator', () => {
      expect(builder.priceUsd(5, '<').build()).toBe('usd<5');
    });

    test('should search by EUR price', () => {
      expect(builder.priceEur(8, '<=').build()).toBe('eur<=8');
    });

    test('should search by TIX price', () => {
      expect(builder.priceTix(2, '>').build()).toBe('tix>2');
    });
  });

  describe('is/not filters', () => {
    test('should use is: filter', () => {
      expect(builder.is('commander').build()).toBe('is:commander');
    });

    test('should use not filter', () => {
      expect(builder.not('reprint').build()).toBe('-is:reprint');
    });
  });

  describe('complex queries', () => {
    test('should combine multiple filters', () => {
      const query = builder
        .type('creature')
        .color('u')
        .manaValue(3, '<=')
        .format('standard')
        .build();
      
      expect(query).toBe('t:creature c=u mv<=3 f:standard');
    });

    test('should add raw query', () => {
      expect(builder.raw('game:paper').build()).toBe('game:paper');
    });

    test('should combine with raw query', () => {
      const query = builder
        .type('instant')
        .raw('game:paper')
        .build();
      
      expect(query).toBe('t:instant game:paper');
    });
  });

  describe('OR grouping', () => {
    test('should create OR groups', () => {
      const query = builder
        .or(b => b.type('creature').type('planeswalker'))
        .build();
      
      expect(query).toBe('(t:creature or t:planeswalker)');
    });
  });

  describe('AND grouping', () => {
    test('should create AND groups', () => {
      const query = builder
        .and(b => b.type('creature').color('r'))
        .build();
      
      expect(query).toBe('(t:creature c=r)');
    });
  });

  describe('negation', () => {
    test('should negate a group', () => {
      const query = builder
        .negate(b => b.type('land'))
        .build();
      
      expect(query).toBe('-(t:land)');
    });
  });

  describe('URL generation', () => {
    test('should generate Scryfall search URL', () => {
      const url = builder.type('creature').color('r').toUrl();
      expect(url).toBe('https://scryfall.com/search?q=t%3Acreature%20c%3Dr');
    });

    test('should generate API URL', () => {
      const url = builder.type('instant').toApiUrl();
      expect(url).toBe('https://api.scryfall.com/cards/search?q=t%3Ainstant');
    });
  });

  describe('utility methods', () => {
    test('should reset builder', () => {
      builder.type('creature').color('r');
      expect(builder.build()).toBe('t:creature c=r');
      
      builder.reset();
      expect(builder.build()).toBe('');
    });

    test('should clone builder', () => {
      builder.type('creature');
      const cloned = builder.clone();
      
      builder.color('r');
      cloned.color('u');
      
      expect(builder.build()).toBe('t:creature c=r');
      expect(cloned.build()).toBe('t:creature c=u');
    });
  });

  describe('edge cases', () => {
    test('should handle empty/null inputs gracefully', () => {
      builder
        .name('')
        .name(null)
        .name(undefined)
        .type('  ')
        .color('r');
      
      expect(builder.build()).toBe('c=r');
    });

    test('should trim whitespace', () => {
      expect(builder.name('  Lightning Bolt  ').build()).toBe('name:"Lightning Bolt"');
    });

    test('should handle zero values', () => {
      expect(builder.manaValue(0).build()).toBe('mv=0');
    });
  });

  describe('real-world query examples', () => {
    test('should build a commander-legal creature search', () => {
      const query = builder
        .type('creature')
        .colorIdentity('wubrg', '<=')
        .format('commander')
        .manaValue(4, '<=')
        .rarity('rare', '>=')
        .build();
      
      expect(query).toBe('t:creature id<=wubrg f:commander mv<=4 r>=rare');
    });

    test('should build a search for cheap instants with card draw', () => {
      const query = builder
        .type('instant')
        .oracleText('draw a card')
        .manaValue(2, '<=')
        .format('modern')
        .build();
      
      expect(query).toBe('t:instant o:"draw a card" mv<=2 f:modern');
    });

    test('should build a search for dual lands', () => {
      const query = builder
        .type('land')
        .oracleText('plains')
        .oracleText('island')
        .not('basic')
        .build();
      
      expect(query).toBe('t:land o:plains o:island -is:basic');
    });
  });
});
