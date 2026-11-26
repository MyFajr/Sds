const { Plugin, Modal, Notice, parseYaml } = require('obsidian');

const PALETTES = [
  {
    id: 'candy-pop', name: 'Candy Pop', category: 'Конфетные и десертные', mood: 'Яркая конфетная палитра',
    description: 'Кобальтовые акценты для иностранных слов, фиолетовое произношение и зелёный перевод.', defaultBackground: 'bg-08-reading-rose-cloud', defaultBlocks: 'soft',
    swatches: ['#2868d8', '#9251bd', '#16845e', '#ef6684', '#f0a33b'],
    roles: {
      en: '#2868d8', ipa: '#9251bd', translation: '#16845e', term: '#a23b83',
      definition: '#53627d', focus: '#e74e70', secondary: '#c27a18', soft: '#9555b5', heading: '#6540a2', ink: '#352a45'
    },
    dark: {
      en: '#8fc1ff', ipa: '#d4a4f2', translation: '#82ddb4', term: '#f0a5d7',
      definition: '#bdc1d6', focus: '#ff91aa', secondary: '#f2c078', soft: '#d1a2f0', heading: '#d0b3ff', ink: '#f0e8f7'
    },
    callouts: {
      rule: [48, 112, 210], example: [142, 82, 194], important: [228, 72, 112],
      tip: [31, 145, 103], warning: [209, 132, 34], question: [25, 151, 177],
      practice: [223, 111, 48], success: [28, 153, 102], info: [67, 111, 207],
      note: [119, 111, 151], quote: [194, 82, 143], abstract: [125, 83, 185]
    },
    darkCallouts: {
      rule: [112, 166, 255], example: [194, 146, 235], important: [255, 137, 169],
      tip: [105, 214, 170], warning: [247, 193, 112], question: [99, 211, 231],
      practice: [255, 164, 112], success: [103, 219, 163], info: [133, 171, 255],
      note: [185, 177, 215], quote: [241, 143, 203], abstract: [185, 149, 239]
    }
  },
  {
    id: 'ocean-breeze', name: 'Ocean Breeze', category: 'Морские и водные', mood: 'Свежая морская палитра',
    description: 'Голубые акценты для иностранных слов, аметистовое произношение и бирюзовый перевод.', defaultBackground: 'bg-12-sea-glass', defaultBlocks: 'soft',
    swatches: ['#087eac', '#7854bb', '#13866e', '#e08b49', '#54b9c7'],
    roles: {
      en: '#087eac', ipa: '#7854bb', translation: '#13866e', term: '#197b89',
      definition: '#516c7b', focus: '#d46d3c', secondary: '#9b762d', soft: '#508da9', heading: '#145d82', ink: '#203a49'
    },
    dark: {
      en: '#7bd4ff', ipa: '#c3a7ff', translation: '#75dfbd', term: '#81d5dc',
      definition: '#b6cbd3', focus: '#ffad80', secondary: '#e4c27d', soft: '#8ec5df', heading: '#8dd8f3', ink: '#e4f3f7'
    },
    callouts: {
      rule: [28, 126, 171], example: [121, 86, 184], important: [210, 100, 63],
      tip: [28, 139, 112], warning: [203, 139, 55], question: [20, 151, 179],
      practice: [202, 113, 61], success: [29, 147, 105], info: [48, 118, 179],
      note: [93, 123, 139], quote: [172, 92, 143], abstract: [109, 91, 174]
    },
    darkCallouts: {
      rule: [105, 204, 241], example: [186, 157, 244], important: [255, 160, 126],
      tip: [101, 215, 186], warning: [238, 195, 117], question: [94, 219, 237],
      practice: [255, 169, 119], success: [100, 219, 177], info: [118, 186, 239],
      note: [167, 201, 214], quote: [226, 151, 207], abstract: [175, 157, 232]
    }
  },
  {
    id: 'royal-plum', name: 'Royal Plum', category: 'Ретро, винтаж и поп-арт', mood: 'Насыщенная благородная палитра',
    description: 'Сапфировые акценты для иностранных слов, сливовое произношение и нефритовый перевод.', defaultBackground: 'bg-14-wisteria-haze', defaultBlocks: 'outline',
    swatches: ['#3156a8', '#9a4f91', '#23836e', '#be7b35', '#7651b8'],
    roles: {
      en: '#3156a8', ipa: '#9a4f91', translation: '#23836e', term: '#8b467c',
      definition: '#5c5a70', focus: '#bd5d78', secondary: '#ad762c', soft: '#8562b5', heading: '#493c87', ink: '#30283e'
    },
    dark: {
      en: '#9bb8ff', ipa: '#e0a5d5', translation: '#8bd9c0', term: '#dc9acb',
      definition: '#c9bfd2', focus: '#f29bb5', secondary: '#e8c17f', soft: '#c6a4ec', heading: '#c5b4ff', ink: '#f1eaf6'
    },
    callouts: {
      rule: [61, 94, 174], example: [145, 79, 151], important: [191, 76, 112],
      tip: [38, 132, 108], warning: [187, 125, 49], question: [56, 129, 164],
      practice: [183, 102, 65], success: [37, 139, 103], info: [63, 100, 174],
      note: [112, 100, 136], quote: [178, 79, 132], abstract: [112, 76, 165]
    },
    darkCallouts: {
      rule: [139, 164, 242], example: [221, 148, 218], important: [245, 143, 174],
      tip: [100, 204, 170], warning: [239, 195, 117], question: [127, 197, 226],
      practice: [241, 158, 125], success: [104, 212, 171], info: [138, 166, 232],
      note: [190, 173, 207], quote: [232, 151, 198], abstract: [190, 155, 232]
    }
  }
];

// Built-in palettes also carry distinct callout frame identities. Geometry is
// activated only when the note uses the explicit palette-frame mode.
PALETTES[0].calloutFrames = {
  rule:{preset:'classic',width:1.5,radius:12}, example:{preset:'dashed',width:2,radius:10}, important:{preset:'double',width:3,radius:8},
  tip:{preset:'dotted',width:2,radius:12}, warning:{preset:'left',width:3,radius:8}, question:{preset:'top',width:2,radius:8},
  practice:{preset:'dashed',width:1.5,radius:10}, success:{preset:'classic',width:1.5,radius:12}, info:{preset:'classic',width:1.5,radius:10},
  note:{preset:'left',width:2,radius:10}, quote:{preset:'dotted',width:2,radius:12}, abstract:{preset:'double',width:2,radius:10}
};
PALETTES[1].calloutFrames = {
  rule:{preset:'dashed',width:2,radius:10}, example:{preset:'classic',width:1.5,radius:12}, important:{preset:'left',width:3,radius:8},
  tip:{preset:'double',width:2,radius:10}, warning:{preset:'dotted',width:2,radius:8}, question:{preset:'top',width:2,radius:10},
  practice:{preset:'left',width:2,radius:10}, success:{preset:'classic',width:1.5,radius:12}, info:{preset:'dashed',width:1.5,radius:10},
  note:{preset:'top',width:2,radius:8}, quote:{preset:'double',width:2,radius:10}, abstract:{preset:'dotted',width:2,radius:10}
};
PALETTES[2].calloutFrames = {
  rule:{preset:'dotted',width:2,radius:8}, example:{preset:'double',width:2,radius:10}, important:{preset:'double',width:3,radius:8},
  tip:{preset:'left',width:3,radius:8}, warning:{preset:'dashed',width:2,radius:10}, question:{preset:'classic',width:1.5,radius:8},
  practice:{preset:'top',width:2,radius:8}, success:{preset:'dashed',width:1.5,radius:10}, info:{preset:'left',width:2,radius:8},
  note:{preset:'classic',width:1.5,radius:10}, quote:{preset:'double',width:2,radius:8}, abstract:{preset:'top',width:2,radius:8}
};

const BASE_BLOCK_STYLE = {
  light: {
    backgroundOpacity: 0.13,
    borderWidth: 1,
    borderOpacity: 0.48,
    borderRadius: 12,
    paddingY: 9,
    paddingX: 10,
    gap: 8,
    titleWeight: 600,
    titleSize: 12.2,
    bodySize: 11.7,
    shadow: 'none'
  },
  dark: {
    backgroundOpacity: 0.18,
    borderWidth: 1,
    borderOpacity: 0.55,
    borderRadius: 12,
    paddingY: 9,
    paddingX: 10,
    gap: 8,
    titleWeight: 600,
    titleSize: 12.2,
    bodySize: 11.7,
    shadow: 'none'
  }
};

const BUILTIN_BLOCK_STYLES = [
  {
    id: 'soft',
    name: 'Мягкие цветные',
    description: 'Нежная заливка и спокойная рамка',
    category: 'Мягкие цветные',
    source: 'builtin',
    order: 0,
    base: 'soft',
    style: {
      light: { ...BASE_BLOCK_STYLE.light, backgroundOpacity: 0.13, borderOpacity: 0.48, borderRadius: 12 },
      dark:  { ...BASE_BLOCK_STYLE.dark,  backgroundOpacity: 0.18, borderOpacity: 0.55, borderRadius: 12 }
    },
    calloutOverrides: {},
    colors: { light: {}, dark: {} },
    previewCallouts: ['rule', 'example', 'important', 'tip', 'practice', 'success']
  },
  {
    id: 'rich',
    name: 'Насыщенные',
    description: 'Более заметная заливка и рамка',
    category: 'Насыщенные',
    source: 'builtin',
    order: 1,
    base: 'rich',
    style: {
      light: { ...BASE_BLOCK_STYLE.light, backgroundOpacity: 0.21, borderOpacity: 0.72, borderRadius: 10 },
      dark:  { ...BASE_BLOCK_STYLE.dark,  backgroundOpacity: 0.26, borderOpacity: 0.78, borderRadius: 10 }
    },
    calloutOverrides: {},
    colors: { light: {}, dark: {} },
    previewCallouts: ['rule', 'example', 'important', 'tip', 'practice', 'success']
  },
  {
    id: 'outline',
    name: 'Контурные',
    description: 'Почти прозрачный фон, выразительная рамка',
    category: 'Контурные',
    source: 'builtin',
    order: 2,
    base: 'outline',
    style: {
      light: { ...BASE_BLOCK_STYLE.light, backgroundOpacity: 0.045, borderOpacity: 0.82, borderRadius: 8, borderWidth: 1.5 },
      dark:  { ...BASE_BLOCK_STYLE.dark,  backgroundOpacity: 0.07,  borderOpacity: 0.88, borderRadius: 8, borderWidth: 1.5 }
    },
    calloutOverrides: {},
    colors: { light: {}, dark: {} },
    previewCallouts: ['rule', 'example', 'important', 'tip', 'practice', 'success']
  },
  {
    id: 'glass', name: 'Стеклянные', description: 'Лёгкая полупрозрачная заливка и мягкие границы', category: 'Современные', source: 'builtin', order: 3, base: 'soft',
    style: {
      light: { ...BASE_BLOCK_STYLE.light, backgroundOpacity: 0.09, borderOpacity: 0.34, borderRadius: 16, borderWidth: 1, paddingY: 12, paddingX: 13, gap: 7, titleSize: 12.5, bodySize: 12 },
      dark:  { ...BASE_BLOCK_STYLE.dark,  backgroundOpacity: 0.15, borderOpacity: 0.42, borderRadius: 16, borderWidth: 1, paddingY: 12, paddingX: 13, gap: 7, titleSize: 12.5, bodySize: 12 }
    },
    calloutOverrides: {}, colors: { light: {}, dark: {} }, previewCallouts: ['example', 'tip']
  },
  {
    id: 'bold', name: 'Выразительные', description: 'Более плотная заливка и сильный контраст', category: 'Выразительные', source: 'builtin', order: 4, base: 'rich',
    style: {
      light: { ...BASE_BLOCK_STYLE.light, backgroundOpacity: 0.23, borderOpacity: 0.86, borderRadius: 8, borderWidth: 2, paddingY: 10, paddingX: 12, gap: 8, titleWeight: 750, titleSize: 13, bodySize: 12 },
      dark:  { ...BASE_BLOCK_STYLE.dark,  backgroundOpacity: 0.29, borderOpacity: 0.92, borderRadius: 8, borderWidth: 2, paddingY: 10, paddingX: 12, gap: 8, titleWeight: 750, titleSize: 13, bodySize: 12 }
    },
    calloutOverrides: {}, colors: { light: {}, dark: {} }, previewCallouts: ['important', 'warning']
  },
  {
    id: 'minimal', name: 'Минималистичные', description: 'Почти чистая поверхность с тонким контуром', category: 'Минималистичные', source: 'builtin', order: 5, base: 'outline',
    style: {
      light: { ...BASE_BLOCK_STYLE.light, backgroundOpacity: 0.025, borderOpacity: 0.58, borderRadius: 5, borderWidth: 1, paddingY: 8, paddingX: 10, gap: 5, titleWeight: 600, titleSize: 11.8, bodySize: 11.4 },
      dark:  { ...BASE_BLOCK_STYLE.dark,  backgroundOpacity: 0.045, borderOpacity: 0.66, borderRadius: 5, borderWidth: 1, paddingY: 8, paddingX: 10, gap: 5, titleWeight: 600, titleSize: 11.8, bodySize: 11.4 }
    },
    calloutOverrides: {}, colors: { light: {}, dark: {} }, previewCallouts: ['rule', 'note']
  },
  {
    id: 'rounded', name: 'Скруглённые', description: 'Мягкие заливки, большие скругления и свободные отступы', category: 'Мягкие цветные', source: 'builtin', order: 6, base: 'soft',
    style: {
      light: { ...BASE_BLOCK_STYLE.light, backgroundOpacity: 0.12, borderOpacity: 0.43, borderRadius: 20, borderWidth: 1, paddingY: 13, paddingX: 14, gap: 9, titleWeight: 650, titleSize: 12.5, bodySize: 12 },
      dark:  { ...BASE_BLOCK_STYLE.dark,  backgroundOpacity: 0.18, borderOpacity: 0.5, borderRadius: 20, borderWidth: 1, paddingY: 13, paddingX: 14, gap: 9, titleWeight: 650, titleSize: 12.5, bodySize: 12 }
    },
    calloutOverrides: {}, colors: { light: {}, dark: {} }, previewCallouts: ['tip', 'success']
  },
  {
    id: 'compact', name: 'Компактные', description: 'Экономят место в длинных заметках', category: 'Практичные', source: 'builtin', order: 7, base: 'soft',
    style: {
      light: { ...BASE_BLOCK_STYLE.light, backgroundOpacity: 0.085, borderOpacity: 0.54, borderRadius: 7, borderWidth: 1, paddingY: 6, paddingX: 9, gap: 4, titleWeight: 650, titleSize: 11, bodySize: 10.8 },
      dark:  { ...BASE_BLOCK_STYLE.dark,  backgroundOpacity: 0.13, borderOpacity: 0.62, borderRadius: 7, borderWidth: 1, paddingY: 6, paddingX: 9, gap: 4, titleWeight: 650, titleSize: 11, bodySize: 10.8 }
    },
    calloutOverrides: {}, colors: { light: {}, dark: {} }, previewCallouts: ['abstract', 'example']
  }
];

// Backward-compatible alias used throughout the old code
const BLOCK_STYLES = BUILTIN_BLOCK_STYLES;

const CALLOUTS = [
  ['rule', 'Правило'], ['example', 'Пример'], ['important', 'Важно'],
  ['tip', 'Подсказка'], ['warning', 'Предупреждение'], ['question', 'Вопрос'],
  ['practice', 'Практика'], ['success', 'Успех'], ['info', 'Информация'],
  ['note', 'Заметка'], ['quote', 'Цитата'], ['abstract', 'Кратко']
];

// Five additional themed palettes. The original three palettes remain unchanged.
function esdsHexToRgb(hex) {
  const value = String(hex || '#777777').replace('#', '');
  const full = value.length === 3 ? value.split('').map(ch => ch + ch).join('') : value.slice(0, 6);
  return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16));
}
function esdsBuildThemedPalette(config) {
  const roles = config.roles;
  const dark = config.dark;
  const roleForCallout = {
    rule: 'heading', example: 'ipa', important: 'focus', tip: 'translation', warning: 'secondary',
    question: 'en', practice: 'term', success: 'translation', info: 'en', note: 'definition',
    quote: 'ipa', abstract: 'soft'
  };
  const frames = config.frames || ['classic', 'dashed', 'double', 'left', 'dotted', 'top'];
  const calloutFrames = {};
  CALLOUTS.forEach(([key], index) => {
    calloutFrames[key] = { preset: frames[index % frames.length], width: config.frameWidth || 1.5, radius: config.frameRadius || 10 };
  });
  const callouts = Object.fromEntries(CALLOUTS.map(([key]) => [key, esdsHexToRgb(roles[roleForCallout[key]])]));
  const darkCallouts = Object.fromEntries(CALLOUTS.map(([key]) => [key, esdsHexToRgb(dark[roleForCallout[key]])]));
  return {
    id: config.id, name: config.name, category: config.category, mood: config.mood,
    description: config.description, defaultBackground: config.defaultBackground,
    defaultBlocks: config.defaultBlocks, swatches: config.swatches || [roles.en, roles.ipa, roles.translation, roles.focus, roles.secondary],
    roles, dark, callouts, darkCallouts, calloutFrames, source: 'builtin'
  };
}
PALETTES.push(
  esdsBuildThemedPalette({
    id: 'graphite-amber', name: 'Graphite Amber', category: 'Элегантные и премиальные', mood: 'Сдержанная деловая палитра',
    description: 'Графитовая основа, спокойный синий и янтарные акценты для финансов, экономики и аналитики.',
    defaultBackground: 'bg-05-reading-mist', defaultBlocks: 'minimal', frameWidth: 1.5, frameRadius: 8,
    roles: { en:'#315C7D', ipa:'#80614D', translation:'#34765C', term:'#A65D3B', definition:'#5A6470', focus:'#C58A2A', secondary:'#8C6D42', soft:'#76879A', heading:'#294B63', ink:'#28313A' },
    dark: { en:'#8CC8F0', ipa:'#DAB99B', translation:'#88D4AC', term:'#F0A982', definition:'#C0C9D3', focus:'#F0C36B', secondary:'#D7B981', soft:'#A8BDD0', heading:'#A9D8F5', ink:'#E8EEF4' },
    frames:['classic','left','double','dotted','top','dashed']
  }),
  esdsBuildThemedPalette({
    id: 'forest-sage', name: 'Forest Sage', category: 'Природные и земные', mood: 'Спокойная природная палитра',
    description: 'Шалфейные, хвойные и тёплые зелёные оттенки для науки, природы и длительного чтения.',
    defaultBackground: 'bg-06-reading-sage', defaultBlocks: 'glass', frameWidth: 1.5, frameRadius: 12,
    roles: { en:'#356B55', ipa:'#75619A', translation:'#3F8064', term:'#946A4A', definition:'#647568', focus:'#B17A3B', secondary:'#71864E', soft:'#7E9A83', heading:'#315C49', ink:'#293C32' },
    dark: { en:'#91D5B2', ipa:'#C5B2EC', translation:'#9BE0BD', term:'#E0B48C', definition:'#C1D0C4', focus:'#EFC17D', secondary:'#B8D28B', soft:'#B4D0B8', heading:'#A6E0C1', ink:'#E7F0E9' },
    frames:['left','classic','dotted','top','dashed','double']
  }),
  esdsBuildThemedPalette({
    id: 'terracotta-editorial', name: 'Terracotta Editorial', category: 'Ретро, винтаж и поп-арт', mood: 'Тёплая редакционная палитра',
    description: 'Терракота, охра и чернильные оттенки для истории, культуры и больших текстовых заметок.',
    defaultBackground: 'bg-02-reading-parchment', defaultBlocks: 'outline', frameWidth: 1.5, frameRadius: 8,
    roles: { en:'#9B563B', ipa:'#725B88', translation:'#56765A', term:'#A24F45', definition:'#76675B', focus:'#BF7839', secondary:'#98703D', soft:'#9B7C8C', heading:'#754231', ink:'#3C302A' },
    dark: { en:'#F0AC8B', ipa:'#D0B5E8', translation:'#A9D5A7', term:'#F0A19A', definition:'#D1C1B4', focus:'#F0B777', secondary:'#D9B47B', soft:'#D1B0C2', heading:'#F0B49A', ink:'#F5ECE4' },
    frames:['double','dashed','left','classic','top','dotted']
  }),
  esdsBuildThemedPalette({
    id: 'midnight-signal', name: 'Midnight Signal', category: 'Неоновые и электрические', mood: 'Холодная технологичная палитра',
    description: 'Ночной синий, электрический циан и фиолетовые акценты для технологий, программирования и цифровых тем.',
    defaultBackground: 'bg-29-cobalt-dusk', defaultBlocks: 'bold', frameWidth: 2, frameRadius: 8,
    roles: { en:'#267DBB', ipa:'#8664C7', translation:'#258E8B', term:'#B35A9B', definition:'#566A83', focus:'#1AA6C2', secondary:'#A47A32', soft:'#6C87C4', heading:'#244F86', ink:'#24364E' },
    dark: { en:'#78C9FF', ipa:'#C4A8FF', translation:'#71D8D0', term:'#F0A1D6', definition:'#B5C9E1', focus:'#65E2F5', secondary:'#EBC477', soft:'#AFC4FF', heading:'#A6D1FF', ink:'#E7F1FF' },
    frames:['dashed','double','top','left','classic','dotted']
  }),
  esdsBuildThemedPalette({
    id: 'rose-quartz', name: 'Rose Quartz', category: 'Цветочные и ботанические', mood: 'Мягкая розово-лиловая палитра',
    description: 'Розовый кварц, пыльная роза и ягодные акценты для творческих, личных и дневниковых заметок.',
    defaultBackground: 'bg-13-blush-silk', defaultBlocks: 'rounded', frameWidth: 1.5, frameRadius: 16,
    roles: { en:'#A34E78', ipa:'#7955A3', translation:'#4F8878', term:'#A34A86', definition:'#756477', focus:'#C05F78', secondary:'#B27B45', soft:'#A47BAA', heading:'#784A79', ink:'#463342' },
    dark: { en:'#F0A6C9', ipa:'#C9AEF2', translation:'#9EDCC9', term:'#F3A9D8', definition:'#D2C2D5', focus:'#FF9FB7', secondary:'#E7C08B', soft:'#D4B4DE', heading:'#E2B2E3', ink:'#F4EAF3' },
    frames:['dotted','double','classic','left','top','dashed']
  })
);

const BACKGROUNDS = [
  { id: 'bg-01-reading-ivory', label: '01 · Слоновая кость', group: 'Для чтения' },
  { id: 'bg-02-reading-parchment', label: '02 · Пергамент', group: 'Для чтения' },
  { id: 'bg-03-reading-linen', label: '03 · Натуральный лён', group: 'Для чтения' },
  { id: 'bg-04-reading-oatmilk', label: '04 · Овсяное молоко', group: 'Для чтения' },
  { id: 'bg-05-reading-mist', label: '05 · Туманный серый', group: 'Для чтения' },
  { id: 'bg-06-reading-sage', label: '06 · Шалфейный туман', group: 'Для чтения' },
  { id: 'bg-07-reading-powder-blue', label: '07 · Пудрово-голубой', group: 'Для чтения' },
  { id: 'bg-08-reading-rose-cloud', label: '08 · Розовое облако', group: 'Для чтения' },
  { id: 'bg-09-reading-lavender', label: '09 · Лавандовая бумага', group: 'Для чтения' },
  { id: 'bg-10-reading-sand', label: '10 · Мягкий песок', group: 'Для чтения' },
  { id: 'bg-11-pearl-glow', label: '11 · Жемчужное сияние', group: 'Мягкие градиенты' },
  { id: 'bg-12-sea-glass', label: '12 · Морское стекло', group: 'Мягкие градиенты' },
  { id: 'bg-13-blush-silk', label: '13 · Шёлковый румянец', group: 'Мягкие градиенты' },
  { id: 'bg-14-wisteria-haze', label: '14 · Глициниевая дымка', group: 'Мягкие градиенты' },
  { id: 'bg-15-glacier', label: '15 · Ледник', group: 'Мягкие градиенты' },
  { id: 'bg-16-matcha-cream', label: '16 · Матча со сливками', group: 'Мягкие градиенты' },
  { id: 'bg-17-apricot-haze', label: '17 · Абрикосовая дымка', group: 'Мягкие градиенты' },
  { id: 'bg-18-blue-hour', label: '18 · Синий час', group: 'Мягкие градиенты' },
  { id: 'bg-19-rich-midnight', label: '19 · Полночные чернила', group: 'Тёмные фоны' },
  { id: 'bg-20-rich-navy', label: '20 · Глубокий navy', group: 'Тёмные фоны' },
  { id: 'bg-21-rich-forest', label: '21 · Ночной лес', group: 'Тёмные фоны' },
  { id: 'bg-22-rich-emerald', label: '22 · Изумрудный бархат', group: 'Тёмные фоны' },
  { id: 'bg-23-rich-plum', label: '23 · Сливовый бархат', group: 'Тёмные фоны' },
  { id: 'bg-24-rich-burgundy', label: '24 · Бордовый нуар', group: 'Тёмные фоны' },
  { id: 'bg-25-rich-cocoa', label: '25 · Какао-бархат', group: 'Тёмные фоны' },
  { id: 'bg-26-rich-slate', label: '26 · Графитовый сланец', group: 'Тёмные фоны' },
  { id: 'bg-27-terracotta-wash', label: '27 · Терракотовая вуаль', group: 'Выразительные фоны' },
  { id: 'bg-28-saffron-cream', label: '28 · Шафрановые сливки', group: 'Выразительные фоны' },
  { id: 'bg-29-cobalt-dusk', label: '29 · Кобальтовые сумерки', group: 'Выразительные фоны' },
  { id: 'bg-30-deep-lagoon', label: '30 · Глубокая лагуна', group: 'Выразительные фоны' }
];

// Built-in background IDs are immutable; reuse one Set for ownership checks.
const BUILTIN_BG_IDS = new Set(BACKGROUNDS.map(item => item.id));

// Legacy location is read only for one-time migration; new data uses Plugin.loadData/saveData.
const LEGACY_LIBRARY_PATH = '.obsidian/english-study-design-studio/user-library.json';
const LIBRARY_SCHEMA = 3;
// Keep legacy serialized role keys so existing palette files remain compatible: `en` now labels foreign-language text, `ipa` labels pronunciation/transcription.
const ROLE_KEYS = ['en', 'ipa', 'translation', 'term', 'definition', 'focus', 'secondary', 'soft', 'heading', 'ink'];
const CALLOUT_KEYS = CALLOUTS.map(([key]) => key);
const BLOCK_FRAME_PRESET_KEYS = ['classic', 'dashed', 'dotted', 'double', 'left', 'none', 'top'];
const THEME_PACK_SCHEMA_VERSION = 1;

// Legacy contentProfiles are retained in userData for backward compatibility,
// but the current workflow never asks the user to classify a note by subject.
const CONTENT_PROFILES = [
  { id: 'general', name: 'Универсальный материал', paletteId: 'candy-pop', backgroundId: 'bg-05-reading-mist', blockStyleId: 'soft', description: 'Единая инструкция для любого содержания.', guidance: 'Определяй смысловые роли по содержимому, не по предметной категории.' }
];

const SEMANTIC_ROLES = [
  ['lead', 'Вступление', 'Вводный абзац'], ['focus', 'Главная мысль', 'Ключевая идея'],
  ['focus-secondary', 'Дополнительный акцент', 'Второстепенная идея'], ['focus-soft', 'Мягкий акцент', 'Ненавязчивое выделение'], ['term', 'Термин', 'Важное понятие'],
  ['definition', 'Определение', 'Объяснение понятия'], ['stat', 'Статистика', 'Число или показатель'],
  ['quote', 'Цитата', 'Цитируемый фрагмент'], ['summary', 'Вывод', 'Итоговая мысль'],
  ['source', 'Источник', 'Ссылка или примечание к источнику'], ['note', 'Примечание', 'Дополнительная информация'],
  ['warning', 'Предупреждение', 'Ограничение или риск'], ['example', 'Пример', 'Иллюстрация идеи'],
  ['fact', 'Факт', 'Проверяемая информация'], ['argument', 'Аргумент', 'Обоснование позиции'],
  ['counterpoint', 'Контраргумент', 'Альтернативная позиция'], ['cause', 'Причина', 'Причинно-следственная связь'],
  ['consequence', 'Последствие', 'Результат события'], ['date', 'Дата', 'Важная дата или период'],
  ['person', 'Личность', 'Человек, упомянутый в материале'], ['event', 'Событие', 'Историческое или актуальное событие'],
  ['trend', 'Тренд', 'Направление изменения'], ['risk', 'Риск', 'Риск или потенциальная проблема']
];

// Public, compact class names. Full meanings are shown in the in-plugin registry.
const SHORT_SEMANTIC_CLASSES = [
  ['st-le', 'Вступление', 'Вводный или контекстный абзац', 'lead'],
  ['st-mi', 'Главная мысль', 'Главная идея или ключевой тезис', 'focus'],
  ['st-ac', 'Дополнительный акцент', 'Второстепенный, но полезный акцент', 'focus-secondary'],
  ['st-so', 'Мягкий акцент', 'Ненавязчивое выделение', 'focus-soft'],
  ['st-te', 'Термин', 'Термин или специальное понятие', 'term'],
  ['st-fo', 'Иностранное слово или выражение', 'Слово или выражение на другом языке', 'foreign'],
  ['st-lt', 'Иностранная буква или буквосочетание', 'Одна иностранная буква или короткое сочетание из 2–3 букв', 'foreign-letter'],
  ['st-tr', 'Перевод', 'Перевод или краткое значение', 'translation'],
  ['st-pr', 'Произношение', 'Произношение, транскрипция или романизация', 'pronunciation'],
  ['st-de', 'Определение', 'Объяснение понятия', 'definition'],
  ['st-ex', 'Пример', 'Пример или иллюстрация', 'example'],
  ['st-im', 'Важное', 'Ключевой факт или важное замечание', 'important'],
  ['st-wa', 'Предупреждение', 'Предупреждение, ограничение или исключение', 'warning'],
  ['st-qu', 'Вопрос', 'Вопрос для изучения или размышления', 'question'],
  ['st-su', 'Краткое резюме', 'Краткое содержание', 'summary'],
  ['st-co', 'Вывод', 'Итоговое заключение', 'conclusion'],
  ['st-sc', 'Источник', 'Источник, ссылка или ссылка на материал', 'source'],
  ['st-no', 'Примечание', 'Дополнительная информация', 'note'],
  ['st-nu', 'Число и статистика', 'Числовое значение или показатель', 'stat'],
  ['st-qt', 'Цитата', 'Цитируемый фрагмент', 'quote'],
  ['st-fa', 'Факт', 'Проверяемая информация', 'fact'],
  ['st-ar', 'Аргумент', 'Обоснование позиции', 'argument'],
  ['st-ct', 'Контраргумент', 'Альтернативная позиция', 'counterpoint'],
  ['st-ca', 'Причина', 'Причинная связь', 'cause'],
  ['st-rs', 'Результат', 'Последствие или результат', 'consequence'],
  ['st-da', 'Дата', 'Дата или временной период', 'date'],
  ['st-pe', 'Личность', 'Человек или историческая фигура', 'person'],
  ['st-ev', 'Событие', 'Событие или процесс', 'event'],
  ['st-td', 'Тренд', 'Направление изменения', 'trend'],
  ['st-ri', 'Риск', 'Риск или потенциальная проблема', 'risk']
];

function buildUniversalAiInstruction() {
  const classLines = SHORT_SEMANTIC_CLASSES.map(([code, name, description]) => `- ${code}: ${name} — ${description}`).join('\n');
  return `Оформи предоставленный материал для Obsidian по универсальному стандарту ESDS. Не проси пользователя выбирать предмет, язык или тип заметки: самостоятельно определи смысл материала по содержимому.\n\nИСПОЛЬЗУЙ НАТИВНЫЙ MARKDOWN\n- Заголовки и подзаголовки оформляй Markdown-заголовками (#, ##, ### и т. д.).\n- Таблицы, списки, цитаты и обычные абзацы оставляй Markdown.\n- Не оборачивай большие разделы, таблицы и списки в HTML.\n- HTML span используй только для коротких смысловых фрагментов: <span class=\"st-te\">термин</span>.\n\nУНИВЕРСАЛЬНЫЕ КЛАССЫ ESDS\n${classLines}\n\nПРАВИЛА ПРИМЕНЕНИЯ\n- Отмечай иностранные слова и выражения независимо от языка с помощью st-fo. Не ограничивайся английским.\n- Для отдельной иностранной буквы или короткого буквосочетания из 2–3 букв используй отдельный класс st-lt; не используй st-fo для одиночных букв и таких коротких сочетаний.\n- Отдельно отмечай перевод, значение и пояснение: st-tr и st-de.\n- Произношение, IPA или романизацию обозначай st-pr только когда это действительно нужно.\n- Специальные термины и ключевые понятия обозначай st-te.\n- Выделяй главные мысли, важные факты и предупреждения умеренно.\n- Не выделяй каждое предложение и не превращай заметку в цветную мозаику.\n- Для крупных смысловых блоков используй стандартные Obsidian Callout: [!important], [!warning], [!tip], [!info], [!example], [!quote], [!abstract]. Используй их только по смыслу.\n- Не создавай предметные или языковые CSS-классы. Не придумывай новые коды.\n- Не используй inline style для цветов и оформления. Палитра ESDS сама задаст внешний вид всех поддерживаемых классов.\n- В таблицах также применяй семантические классы к отдельным коротким фрагментам при необходимости.\n- При проектировании будущего оформления таблиц допускай визуальное различие колонок по смысловой роли: собственные оттенки фона и текста, оформление заголовка и умеренные акценты. Это должно задаваться дизайн-системой/палитрой, а не inline-стилями в заметке; не делай все колонки разноцветными без смысловой причины.\n- Сохраняй смысл, факты и формулировки источника. Не выдумывай цифры, цитаты, источники или переводы.\n\nВерни готовую заметку Markdown, совместимую с Obsidian.`;
}

const DEFAULT_CATEGORIES = {
  palettes: [
    { id: 'airy', name: 'Светлые и воздушные', description: 'Чистые светлые оттенки, много пространства и мягкий контраст.', order: 0, protected: true },
    { id: 'pastel', name: 'Пастельные', description: 'Мягкие приглушённые тона и спокойные цветовые сочетания.', order: 1, protected: true },
    { id: 'citrus', name: 'Цитрусовые', description: 'Лимонные, лаймовые, апельсиновые и другие цитрусовые сочетания.', order: 2, protected: true },
    { id: 'fruit-berry', name: 'Фруктовые и ягодные', description: 'Сочные фруктовые и ягодные оттенки.', order: 3, protected: true },
    { id: 'candy-dessert', name: 'Конфетные и десертные', description: 'Сладкие, яркие и игривые цветовые комбинации.', order: 4, protected: true },
    { id: 'tropical', name: 'Сочные и тропические', description: 'Тропические, насыщенные и солнечные оттенки.', order: 5, protected: true },
    { id: 'neon', name: 'Неоновые и электрические', description: 'Контрастные яркие цвета и энергичные акценты.', order: 6, protected: true },
    { id: 'rainbow', name: 'Радужные и многоцветные', description: 'Смелые многоцветные палитры с согласованными акцентами.', order: 7, protected: true },
    { id: 'botanical', name: 'Цветочные и ботанические', description: 'Цветочные, листовые и природные оттенки.', order: 8, protected: true },
    { id: 'ocean', name: 'Морские и водные', description: 'Морская глубина, вода, бирюза и прохладные оттенки.', order: 9, protected: true },
    { id: 'earth', name: 'Природные и земные', description: 'Землистые, древесные, каменные и натуральные оттенки.', order: 10, protected: true },
    { id: 'warm-sun', name: 'Тёплые и солнечные', description: 'Тёплые золотистые, песочные и солнечные сочетания.', order: 11, protected: true },
    { id: 'cosmic', name: 'Космические и фантазийные', description: 'Космические, сияющие и фантазийные цветовые миры.', order: 12, protected: true },
    { id: 'dark-deep', name: 'Тёмные и глубокие', description: 'Глубокие тёмные фоны с читаемыми выразительными акцентами.', order: 13, protected: true },
    { id: 'retro-pop', name: 'Ретро, винтаж и поп-арт', description: 'Ретро-эстетика, винтажные тона и поп-арт контрасты.', order: 14, protected: true },
    { id: 'elegant', name: 'Элегантные и премиальные', description: 'Сдержанные премиальные сочетания и тонкие детали.', order: 15, protected: true },
    { id: 'playful', name: 'Игровые и мультяшные', description: 'Дружелюбные, яркие и мультяшные цветовые решения.', order: 16, protected: true },
    { id: 'artistic', name: 'Артистические и экспериментальные', description: 'Необычные художественные сочетания и смелые эксперименты.', order: 17, protected: true },
    { id: 'mine', name: 'Мои палитры', order: 99, protected: true }
  ],
  backgrounds: [
    { id: 'reading', name: 'Для чтения', description: 'Спокойные нейтральные фоны для длительного чтения.', order: 0, protected: true },
    { id: 'gradients', name: 'Мягкие градиенты', description: 'Плавные переходы цвета и лёгкие атмосферные оттенки.', order: 1, protected: true },
    { id: 'dark', name: 'Тёмные фоны', description: 'Глубокие фоны для комфортного тёмного режима.', order: 2, protected: true },
    { id: 'expressive', name: 'Выразительные фоны', description: 'Более характерные и насыщенные фоновые решения.', order: 3, protected: true },
    { id: 'mine', name: 'Мои фоны', order: 99, protected: true }
  ],
  blockStyles: [
    { id: 'soft', name: 'Мягкие цветные', description: 'Нежные заливки и спокойные границы блоков.', order: 0, protected: true },
    { id: 'rich', name: 'Насыщенные', description: 'Выразительные заливки и более заметные рамки.', order: 1, protected: true },
    { id: 'outline', name: 'Контурные', description: 'Минимум заливки, акцент на границах блоков.', order: 2, protected: true },
    { id: 'modern', name: 'Современные', description: 'Современные лаконичные блоки и детали.', order: 3, protected: true },
    { id: 'expressive', name: 'Выразительные', description: 'Контрастные блоки для особо важных сообщений.', order: 4, protected: true },
    { id: 'minimal', name: 'Минималистичные', description: 'Тонкие линии и минимальное визуальное вмешательство.', order: 5, protected: true },
    { id: 'practical', name: 'Практичные', description: 'Сбалансированное оформление для повседневных конспектов.', order: 6, protected: true },
    { id: 'mine', name: 'Мои стили', order: 99, protected: true }
  ]
};

const DEFAULT_LIBRARY = {
  schemaVersion: LIBRARY_SCHEMA,
  palettes: [],
  backgrounds: [],
  blockStyles: [],
  categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
  favorites: [],
  favoriteItems: [],
  recent: [],
  frameSource: 'palette',
  contentProfiles: clone(CONTENT_PROFILES)
};

function ensureLibraryShape(data) {
  const lib = { ...JSON.parse(JSON.stringify(DEFAULT_LIBRARY)), ...(data || {}) };
  lib.schemaVersion = LIBRARY_SCHEMA;
  lib.frameSource = 'palette';
  ['palettes', 'backgrounds', 'blockStyles', 'favorites', 'favoriteItems', 'recent'].forEach(key => {
    if (!Array.isArray(lib[key])) lib[key] = [];
  });
  ['palettes', 'backgrounds', 'blockStyles'].forEach(key => {
    lib[key] = lib[key].filter(item => item && typeof item === 'object' && !Array.isArray(item));
  });
  if (!Array.isArray(lib.contentProfiles)) lib.contentProfiles = clone(CONTENT_PROFILES);
  // Built-in profiles are always available; retain user-defined profiles with unique IDs.
  const profileMap = new Map(CONTENT_PROFILES.map(profile => [profile.id, clone(profile)]));
  lib.contentProfiles.forEach(profile => {
    if (profile && typeof profile === 'object' && /^[a-z0-9][a-z0-9-]{0,48}$/.test(profile.id || '') && profile.name) {
      profileMap.set(profile.id, { ...(profileMap.get(profile.id) || {}), ...profile });
    }
  });
  lib.contentProfiles = [...profileMap.values()];
  if (!lib.categories || typeof lib.categories !== 'object') {
    lib.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
  }
  const availableBlockStyleIds = new Set([
    ...BUILTIN_BLOCK_STYLES.map(item => item.id),
    ...lib.blockStyles.map(item => item && item.id).filter(id => typeof id === 'string')
  ]);
  if (typeof lib.activeBlockStyleId !== 'string' || !availableBlockStyleIds.has(lib.activeBlockStyleId)) {
    delete lib.activeBlockStyleId;
  }
  ['palettes', 'backgrounds', 'blockStyles'].forEach(kind => {
    if (!Array.isArray(lib.categories[kind])) lib.categories[kind] = [];
    const list = lib.categories[kind];
    const seenIds = new Set(list.map(item => item && item.id).filter(Boolean));
    const seenNames = new Set(list.map(item => item && item.name).filter(Boolean));
    // Keep all built-in/system categories available after upgrades.
    (DEFAULT_CATEGORIES[kind] || []).forEach(defaultCategory => {
      if (!seenNames.has(defaultCategory.name)) {
        const collision = list.find(item => item && item.id === defaultCategory.id);
        if (collision) {
          const safeBase = `${slugify(collision.name || 'custom')}-custom`;
          let safeId = safeBase; let suffix = 2;
          while (seenIds.has(safeId)) safeId = `${safeBase}-${suffix++}`;
          seenIds.delete(collision.id); collision.id = safeId; seenIds.add(safeId);
        }
        list.push(clone(defaultCategory));
        seenIds.add(defaultCategory.id); seenNames.add(defaultCategory.name);
      }
    });
    // Recover categories referenced by existing items so imported/older entries remain organized.
    const itemKey = kind === 'backgrounds' ? 'backgrounds' : kind;
    (lib[itemKey] || []).forEach(item => {
      const name = String(kind === 'backgrounds' ? (item.group || item.category || '') : (item.category || '')).trim();
      if (!name || seenNames.has(name)) return;
      const baseId = slugify(name);
      let id = baseId, suffix = 2;
      while (seenIds.has(id)) id = `${baseId}-${suffix++}`;
      list.push({ id, name, order: list.length + 10, protected: false });
      seenIds.add(id); seenNames.add(name);
    });
    // Ensure stable, unique category IDs and merge duplicate names from older/imported libraries.
    const normalized = [];
    const usedNames = new Set();
    const usedCategoryIds = new Set();
    list.forEach((sourceItem, index) => {
      const item = sourceItem && typeof sourceItem === 'object'
        ? sourceItem
        : { name: `Категория ${index + 1}`, order: index };
      const name = String(item.name || `Категория ${index + 1}`).trim();
      const nameKey = name.toLowerCase();
      if (usedNames.has(nameKey)) return; // Items refer to categories by name; merge duplicate names.
      usedNames.add(nameKey);
      const originalId = String(item.id || slugify(name));
      const baseId = /^[a-z0-9][a-z0-9-]{0,63}$/i.test(originalId) ? originalId.toLowerCase() : slugify(name);
      let id = baseId; let suffix = 2;
      while (usedCategoryIds.has(id)) id = `${baseId}-${suffix++}`;
      usedCategoryIds.add(id);
      const isSystem = (DEFAULT_CATEGORIES[kind] || []).some(category => category.id === id && category.name === name);
      const cleanItem = { ...item, id, name, order: typeof item.order === 'number' ? item.order : index, protected: isSystem };
      delete cleanItem.targetCount; // 25 was a planning target, never a plugin limit.
      normalized.push(cleanItem);
    });
    lib.categories[kind] = normalized;
  });
  return lib;
}

function normalizeClasses(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') return value.split(/[\s,]+/).filter(Boolean);
  return [];
}

// Remove only ESDS-owned class tokens from HTML tags in note content.
// Fenced code blocks are protected so literal examples remain untouched.
function stripEsdsClassesFromNoteContent(content) {
  if (typeof content !== 'string' || !content) return content;
  // These study-* classes are semantic wrappers used by ESDS lesson notes.
  // Keep the span and its text, but remove the class that supplies its colour.
  const studyClasses = new Set([
    'study-en', 'study-ipa', 'study-translation', 'study-term',
    'study-definition', 'study-focus', 'study-focus-secondary', 'study-focus-soft'
  ]);
  const parts = content.split(/(^|\n)(```[^\n]*\n[\s\S]*?\n```|~~~[^\n]*\n[\s\S]*?\n~~~)(?=\n|$)/g);
  return parts.map((part, index) => {
    if (index % 3 === 2) return part;
    return part.replace(/<([a-z][\w:-]*)(\s[^<>]*?)?>/gi, (tag, name, attrs = '') => {
      if (!/\bclass\s*=\s*([\"'])/i.test(attrs)) return tag;
      const nextAttrs = attrs.replace(/\s+class\s*=\s*([\"'])(.*?)\1/gi, (attribute, quote, value) => {
        const kept = value.split(/\s+/).filter(Boolean).filter(token =>
          !token.toLowerCase().startsWith('esds-') && !studyClasses.has(token.toLowerCase())
        );
        return kept.length ? ` class=${quote}${kept.join(' ')}${quote}` : '';
      });
      return `<${name}${nextAttrs}>`;
    });
  }).join('');
}

// Remove ESDS-owned classes from the live DOM of a specific open note.
// Obsidian can keep cssclasses-derived classes on an already-rendered Markdown
// view after vault.process() has updated the file. ESDS Callout CSS is scoped
// to .markdown-preview-view.esds-note / .markdown-source-view.esds-note, so
// removing the classes from the view roots immediately restores the theme CSS.
function stripEsdsClassesFromOpenViews(app, file, isOwnedClass) {
  if (!app || !file || !app.workspace || typeof app.workspace.getLeavesOfType !== 'function') return 0;
  const studyClasses = new Set([
    'study-en', 'study-ipa', 'study-translation', 'study-term',
    'study-definition', 'study-focus', 'study-focus-secondary', 'study-focus-soft'
  ]);
  let removedCount = 0;
  const leaves = app.workspace.getLeavesOfType('markdown') || [];

  leaves.forEach(leaf => {
    const view = leaf && leaf.view;
    if (!view || !view.file || view.file.path !== file.path) return;

    // Refresh the rendered preview/editor first, then strip stale class tokens
    // from the resulting DOM. Do not clear inline styles: this plugin's inline
    // Callout styles are used only by its own settings previews, not note blocks.
    try {
      if (view.previewMode && typeof view.previewMode.rerender === 'function') {
        view.previewMode.rerender(true);
      }
    } catch (error) {
      console.debug('ESDS: Markdown preview refresh skipped during formatting reset.', error);
    }
    try {
      if (view.editor && typeof view.editor.refresh === 'function') view.editor.refresh();
    } catch (error) {
      console.debug('ESDS: Markdown editor refresh skipped during formatting reset.', error);
    }

    const roots = [];
    const outerRoot = view.containerEl || null;
    const innerRoot = view.contentEl || null;
    if (outerRoot) roots.push(outerRoot);
    if (innerRoot && (!outerRoot || typeof outerRoot.contains !== 'function' || !outerRoot.contains(innerRoot))) {
      roots.push(innerRoot);
    }
    roots.forEach(root => {
      const elements = [root];
      if (typeof root.querySelectorAll === 'function') {
        elements.push(...root.querySelectorAll('[class]'));
      }
      elements.forEach(element => {
        if (!element || !element.classList) return;
        Array.from(element.classList).forEach(className => {
          const lower = String(className).toLowerCase();
          const owned = lower.startsWith('esds-') ||
            lower.startsWith(String(NOTE_STYLE_CLASS_PREFIX).toLowerCase()) ||
            studyClasses.has(lower) ||
            (typeof isOwnedClass === 'function' && isOwnedClass(className));
          if (owned && element.classList.contains(className)) {
            element.classList.remove(className);
            removedCount += 1;
          }
        });
      });
    });
  });

  return removedCount;
}

// Remove ESDS-owned class tokens from the cssclasses frontmatter property
// without reserializing the rest of YAML. Every other property, comment and
// value remains byte-for-byte intact. The original cssclasses key is retained
// as an empty list when no classes remain.
function stripEsdsClassesFromFrontmatter(content, isOwnedClass) {
  if (typeof content !== 'string' || !content) return content;
  const match = content.match(/^(---[ \t]*\r?\n)([\s\S]*?)(\r?\n---[ \t]*(?:\r?\n|$))/);
  if (!match) return content;

  // Parse only to understand the value of cssclasses. The original YAML is
  // edited surgically below, so unrelated Properties and YAML formatting stay.
  const frontmatter = parseYaml(match[2]);
  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) return content;
  if (!Object.prototype.hasOwnProperty.call(frontmatter, 'cssclasses')) return content;

  const originalValue = frontmatter.cssclasses;
  const retained = normalizeClasses(originalValue).filter(name => {
    const lower = name.toLowerCase();
    return !isOwnedClass(name) &&
      !lower.startsWith('esds-') &&
      !lower.startsWith(String(NOTE_STYLE_CLASS_PREFIX).toLowerCase());
  });

  const lines = match[2].split(/\r\n|\n|\r/);
  const keyIndex = lines.findIndex(line => /^(['"]?cssclasses['"]?)\s*:/i.test(line));
  if (keyIndex < 0) return content;
  const keyMatch = lines[keyIndex].match(/^(['"]?cssclasses['"]?)\s*:/i);
  if (!keyMatch) return content;

  // A block value may contain indented list items and blank lines. Stop at
  // the next non-empty top-level YAML key/comment so no adjacent property is
  // swallowed when the class list is replaced.
  let blockEnd = keyIndex + 1;
  while (blockEnd < lines.length) {
    const line = lines[blockEnd];
    if (line.trim() && !/^\s/.test(line)) break;
    blockEnd += 1;
  }

  const indent = '';
  const key = keyMatch[1];
  let replacement;
  if (typeof originalValue === 'string') {
    replacement = [`${indent}${key}: ${JSON.stringify(retained.join(' '))}`];
  } else if (retained.length) {
    replacement = [`${indent}${key}:`, ...retained.map(name => `${indent}  - ${JSON.stringify(name)}`)];
  } else {
    replacement = [`${indent}${key}: []`];
  }

  const newline = match[2].includes('\r\n') ? '\r\n' : (match[2].includes('\r') ? '\r' : '\n');
  const updatedFrontmatter = [
    ...lines.slice(0, keyIndex),
    ...replacement,
    ...lines.slice(blockEnd)
  ].join(newline);

  return match[1] + updatedFrontmatter + match[3] + content.slice(match[0].length);
}

function slugify(value) {
  return String(value || 'custom').toLowerCase().trim()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/[а-яё]/g, ch => ({ а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', ж:'zh', з:'z', и:'i', й:'i', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'h', ц:'ts', ч:'ch', ш:'sh', щ:'shch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya' }[ch] || ''))
    .slice(0, 48) || 'custom';
}

function isHexColor(value) {
  return typeof value === 'string' && /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
}

function isValidPaletteColor(value) {
  return isHexColor(value) || (Array.isArray(value) && value.length === 3 && value.every(n => Number.isFinite(n) && n >= 0 && n <= 255));
}

function rgbValue(value) {
  if (Array.isArray(value) && value.length === 3 && value.every(n => Number.isFinite(n) && n >= 0 && n <= 255)) return value.join(', ');
  if (isHexColor(value)) {
    let hex = value.slice(1);
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    if (hex.length >= 6) return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)].join(', ');
  }
  return '120, 120, 120';
}

function colorToHex(value) {
  if (Array.isArray(value) && value.length === 3 && value.every(n => Number.isFinite(n) && n >= 0 && n <= 255)) {
    return `#${value.map(n => Math.round(n).toString(16).padStart(2, '0')).join('')}`;
  }
  if (isHexColor(value)) {
    let hex = value.slice(1).toLowerCase();
    if (hex.length === 3) hex = hex.split('').map(ch => ch + ch).join('');
    if (hex.length >= 6) return `#${hex.slice(0, 6)}`;
  }
  return '#787878';
}

function safeCssBackground(value) {
  if (typeof value !== 'string' || value.length > 300) return false;
  if (/[;{}<>]|url\s*\(|expression\s*\(/i.test(value)) return false;
  return /^#[0-9a-f]{3,8}$/i.test(value) || /^(linear|radial)-gradient\([a-z0-9\s#%,.%()-]+\)$/i.test(value);
}

function clone(value) {
  if (typeof structuredClone === 'function') {
    try { return structuredClone(value); } catch (error) { /* JSON-safe fallback below. */ }
  }
  return JSON.parse(JSON.stringify(value));
}

function makePaletteCss(palette) {
  const cls = `esds-palette-${palette.id}`;
  const roles = palette.roles || {};
  const callouts = palette.callouts || {};
  const darkRoles = palette.dark || roles;
  const darkCallouts = palette.darkCallouts || callouts;
  const selectors = [
    `.markdown-preview-view.esds-note.${cls}`,
    `.markdown-source-view.esds-note.${cls}`,
    `.esds-preview.${cls}`
  ].join(',');
  const roleVars = ROLE_KEYS.map(key => `--esds-${key}: ${isHexColor(roles[key]) ? roles[key] : '#777777'};`).join(' ');
  const calloutVars = CALLOUT_KEYS.map(key => `--esds-callout-${key}: ${rgbValue(callouts[key])};`).join(' ');
  const darkRoleVars = ROLE_KEYS.map(key => `--esds-${key}: ${isHexColor(darkRoles[key]) ? darkRoles[key] : (isHexColor(roles[key]) ? roles[key] : '#dddddd')};`).join(' ');
  const darkCalloutVars = CALLOUT_KEYS.map(key => `--esds-callout-${key}: ${rgbValue(darkCallouts[key])};`).join(' ');
  const mapVars = (fill, text, border) => CALLOUT_KEYS.map(key => {
    const vars = [];
    if (fill && fill[key] && isValidPaletteColor(fill[key])) vars.push(`--esds-callout-fill-${key}:${rgbValue(fill[key])};`);
    if (text && text[key] && isValidPaletteColor(text[key])) vars.push(`--esds-callout-text-${key}:${rgbValue(text[key])};`);
    if (border && border[key] && isValidPaletteColor(border[key])) vars.push(`--esds-callout-border-${key}:${rgbValue(border[key])};`);
    return vars.join(' ');
  }).join(' ');
  const lightExtra = mapVars(palette.calloutFills, palette.calloutTexts, palette.calloutBorders);
  const darkExtra = mapVars(palette.darkCalloutFills, palette.darkCalloutTexts, palette.darkCalloutBorders);
  const darkSelectors = selectors.split(',').map(selector => `body.theme-dark ${selector}`).join(',');
  const frameCss = (mode) => CALLOUT_KEYS.map(type => {
    const frame = (palette.calloutFrames && palette.calloutFrames[type]) || { preset: 'classic', width: 1.5, radius: 10 };
    if (!BLOCK_FRAME_PRESET_KEYS.includes(frame.preset)) return '';
    const preset = NOTE_STYLE_FRAME_PRESETS[frame.preset] || NOTE_STYLE_FRAME_PRESETS.classic;
    const width = Math.max(0, Math.min(8, Number.isFinite(Number(frame.width)) ? Number(frame.width) : 1.5));
    const radius = Math.max(0, Math.min(32, Number.isFinite(Number(frame.radius)) ? Number(frame.radius) : 10));
    const widths = ['top','right','bottom','left'].map(side => preset.style !== 'none' && preset.sides[side] ? `${width}px` : '0px').join(' ');
    const modePrefix = mode === 'dark' ? 'body.theme-dark ' : '';
    const noteSelector = `${modePrefix}.markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).esds-frames-from-palette.${cls} .callout[data-callout="${type}"],${modePrefix}.markdown-source-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).esds-frames-from-palette.${cls} .callout[data-callout="${type}"]`;
    const previewSelector = `${modePrefix}.esds-preview.esds-frames-from-palette.${cls} .esds-demo-callout.esds-callout-${type}`;
    return `${noteSelector},${previewSelector}{border-style:${preset.style} !important;border-width:${widths} !important;border-radius:${radius}px !important;}`;
  }).join('\n');
  return `${selectors}{${roleVars} ${calloutVars} ${lightExtra}} ${darkSelectors}{${darkRoleVars} ${darkCalloutVars} ${darkExtra}}\n${frameCss('light')}\n${frameCss('dark')}`;
}

function mergeStyleProps(base, override) {
  return { ...(base || {}), ...(override || {}) };
}

function stylePropsToVars(props) {
  if (!props) return '';
  const ranges = {
    backgroundOpacity: [0, 1, ''], borderOpacity: [0, 1, ''],
    borderRadius: [0, 32, 'px'], borderWidth: [0, 8, 'px'],
    paddingY: [0, 40, 'px'], paddingX: [0, 48, 'px'], gap: [0, 32, 'px'],
    titleWeight: [100, 900, ''], titleSize: [8, 32, 'px'], bodySize: [8, 28, 'px']
  };
  const parts = [];
  Object.entries(ranges).forEach(([key, [min, max, unit]]) => {
    if (props[key] == null) return;
    const number = Number(props[key]);
    if (!Number.isFinite(number)) return;
    const safe = Math.min(max, Math.max(min, number));
    parts.push(`--esds-block-${({ backgroundOpacity: 'opacity', borderOpacity: 'border-opacity', borderRadius: 'radius', borderWidth: 'border-width', paddingY: 'padding-y', paddingX: 'padding-x', gap: 'gap', titleWeight: 'title-weight', titleSize: 'title-size', bodySize: 'body-size' })[key]}:${safe}${unit}`);
  });
  return parts.join(';');
}

function makeBlockStyleCss(style) {
  if (!style || !/^[a-z0-9][a-z0-9-]{0,89}$/.test(style.id || '') || BUILTIN_BLOCK_STYLES.some(item => item.id === style.id) || style.source === 'builtin') return '';
  const cls = `esds-blocks-${style.id}`;
  const lightBase = mergeStyleProps(BASE_BLOCK_STYLE.light, (style.style && style.style.light) || {});
  const darkBase = mergeStyleProps(BASE_BLOCK_STYLE.dark, (style.style && style.style.dark) || {});
  const lightVars = stylePropsToVars(lightBase);
  const darkVars = stylePropsToVars(darkBase);

  let css = `
.markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout,
.markdown-source-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout,
.esds-preview.${cls} { ${lightVars} }
body.theme-dark .markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout,
body.theme-dark .markdown-source-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout,
body.theme-dark .esds-preview.${cls} { ${darkVars} }
`;

  // Per-callout overrides
  const overrides = style.calloutOverrides || {};
  Object.keys(overrides).filter(type => CALLOUT_KEYS.includes(type)).forEach(type => {
    const ov = overrides[type] || {};
    const lightOv = mergeStyleProps(lightBase, ov.light || {});
    const darkOv = mergeStyleProps(darkBase, ov.dark || {});
    const lVars = stylePropsToVars(lightOv);
    const dVars = stylePropsToVars(darkOv);
    if (lVars) {
      css += `.markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout[data-callout="${type}"],.esds-preview.${cls} .esds-callout-${type},.esds-preview.${cls} .esds-demo-callout.esds-callout-${type}{${lVars}}\n`;
    }
    if (dVars) {
      css += `body.theme-dark .markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout[data-callout="${type}"],body.theme-dark .esds-preview.${cls} .esds-callout-${type},body.theme-dark .esds-preview.${cls} .esds-demo-callout.esds-callout-${type}{${dVars}}\n`;
    }
  });

  // Frame presets are part of the block style itself. Note-local styling has
  // higher selector specificity and can still override these defaults.
  const frameConfig = {
    classic: { style: 'solid', sides: { top: true, right: true, bottom: true, left: true } },
    dashed: { style: 'dashed', sides: { top: true, right: true, bottom: true, left: true } },
    dotted: { style: 'dotted', sides: { top: true, right: true, bottom: true, left: true } },
    double: { style: 'double', sides: { top: true, right: true, bottom: true, left: true } },
    left: { style: 'solid', sides: { top: false, right: false, bottom: false, left: true } },
    none: { style: 'none', sides: { top: false, right: false, bottom: false, left: false } },
    top: { style: 'solid', sides: { top: true, right: false, bottom: false, left: false } }
  };
  ['light', 'dark'].forEach(mode => {
    const modePrefix = mode === 'dark' ? 'body.theme-dark ' : '';
    const modeBase = mode === 'dark' ? darkBase : lightBase;
    CALLOUT_KEYS.forEach(type => {
      const presetId = style.frameOverrides && style.frameOverrides[type] || style.framePreset || 'classic';
      const preset = frameConfig[presetId] || frameConfig.classic;
      const calloutModeProps = mergeStyleProps(modeBase, (((style.calloutOverrides || {})[type] || {})[mode]) || {});
      const parsedWidth = Number(calloutModeProps.borderWidth);
      const width = Number.isFinite(parsedWidth) ? Math.max(0, Math.min(8, parsedWidth)) : 1;
      const widths = ['top', 'right', 'bottom', 'left'].map(side => preset.style !== 'none' && preset.sides[side] ? `${width}px` : '0px').join(' ');
      const declaration = `border-style:${preset.style} !important;border-width:${widths} !important;`;
      css += `${modePrefix}.markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls}:not(.esds-frames-from-palette) .callout[data-callout="${type}"],${modePrefix}.markdown-source-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls}:not(.esds-frames-from-palette) .callout[data-callout="${type}"]{${declaration}}\n`;
      css += `${modePrefix}.esds-preview.${cls}:not(.esds-frames-from-palette) .esds-demo-callout.esds-callout-${type}{${declaration}}\n`;
    });
  });

  // Palette owns all callout colours. Legacy style.colors are retained in data
  // for backwards compatibility, but deliberately do not override the active palette.

  return css;
}

function normalizeBlockStyle(raw = {}) {
  raw = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const base = BUILTIN_BLOCK_STYLES.find(b => b.id === (raw.base || 'soft')) || BUILTIN_BLOCK_STYLES[0];
  const candidateId = String(raw.id || `user-blocks-${slugify(raw.name || 'style')}-${Date.now().toString(36).slice(-4)}`);
  const safeId = /^[a-z0-9-]{1,90}$/i.test(candidateId) && !BUILTIN_BLOCK_STYLES.some(item => item.id === candidateId.toLowerCase()) ? candidateId.toLowerCase() : `user-blocks-${slugify(candidateId)}-${Date.now().toString(36).slice(-4)}`;
  const safeOverrides = {};
  Object.keys(raw.calloutOverrides && typeof raw.calloutOverrides === 'object' ? raw.calloutOverrides : {}).filter(type => CALLOUT_KEYS.includes(type)).forEach(type => {
    const item = raw.calloutOverrides[type] || {};
    const cleanMode = mode => Object.fromEntries(Object.entries(item[mode] || {}).filter(([key, value]) => ['backgroundOpacity','borderOpacity','borderRadius','borderWidth','paddingY','paddingX','gap','titleWeight','titleSize','bodySize'].includes(key) && Number.isFinite(Number(value))).map(([key, value]) => [key, Number(value)]));
    safeOverrides[type] = { light: cleanMode('light'), dark: cleanMode('dark') };
  });
  const safeColors = mode => Object.fromEntries(Object.entries((raw.colors && raw.colors[mode]) || {}).filter(([key, value]) => CALLOUT_KEYS.includes(key) && (isHexColor(value) || (Array.isArray(value) && value.length === 3 && value.every(n => Number.isFinite(n) && n >= 0 && n <= 255)))));
  const safeFrameOverrides = Object.fromEntries(Object.entries(raw.frameOverrides && typeof raw.frameOverrides === 'object' ? raw.frameOverrides : {})
    .filter(([type, preset]) => CALLOUT_KEYS.includes(type) && BLOCK_FRAME_PRESET_KEYS.includes(preset)));
  const style = {
    id: safeId,
    name: String(raw.name || 'Пользовательский стиль').slice(0, 120),
    description: String(raw.description || '').slice(0, 500),
    category: String(raw.category || 'Мои стили').slice(0, 80),
    source: raw.source === 'builtin' ? 'builtin' : 'user',
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 50,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
    base: base.id,
    framePreset: BLOCK_FRAME_PRESET_KEYS.includes(raw.framePreset) ? raw.framePreset : 'classic',
    frameOverrides: safeFrameOverrides,
    style: {
      light: mergeStyleProps(base.style.light, (raw.style && raw.style.light) || {}),
      dark:  mergeStyleProps(base.style.dark,  (raw.style && raw.style.dark)  || {})
    },
    calloutOverrides: safeOverrides,
    colors: { light: safeColors('light'), dark: safeColors('dark') },
    previewCallouts: Array.isArray(raw.previewCallouts)
      ? raw.previewCallouts.filter(type => CALLOUT_KEYS.includes(type)).slice(0, 12)
      : ['rule', 'example', 'important', 'tip', 'practice', 'success']
  };
  return style;
}


// Per-note block styling is embedded as a hidden comment in that note. It never
// writes to the shared ESDS library (data.json) or creates external files.
const NOTE_STYLE_MARKER = 'ESDS_NOTE_STYLE_V1';
const NOTE_STYLE_CLASS_PREFIX = 'esds-note-style-';
const CALLOUTS_DISABLED_ATTRIBUTE = 'data-esds-callouts-disabled';
const NEUTRAL_CALLOUTS_CLASS = 'esds-callouts-neutral';
const NOTE_STYLE_BORDER_TYPES = ['none', 'solid', 'dashed', 'dotted', 'double'];
const NOTE_STYLE_FRAME_PRESETS = {
  classic: { style: 'solid', sides: { top: true, right: true, bottom: true, left: true } },
  dashed: { style: 'dashed', sides: { top: true, right: true, bottom: true, left: true } },
  dotted: { style: 'dotted', sides: { top: true, right: true, bottom: true, left: true } },
  double: { style: 'double', sides: { top: true, right: true, bottom: true, left: true } },
  left: { style: 'solid', sides: { top: false, right: false, bottom: false, left: true } },
  none: { style: 'none', sides: { top: false, right: false, bottom: false, left: false } },
  top: { style: 'solid', sides: { top: true, right: false, bottom: false, left: false } }
};
const NOTE_STYLE_FRAME_PRESET_LABELS = [
  ['classic', 'Классическая'],
  ['dashed', 'Пунктирная'],
  ['dotted', 'Точечная'],
  ['double', 'Двойная'],
  ['left', 'Боковой акцент'],
  ['none', 'Без рамки'],
  ['top', 'Верхний акцент']
];
const NOTE_STYLE_PROP_RANGES = {
  backgroundOpacity: [0, 1], borderOpacity: [0, 1], borderWidth: [0, 8],
  borderRadius: [0, 24], paddingY: [4, 24], paddingX: [4, 28], gap: [0, 20],
  titleWeight: [400, 800], titleSize: [10, 20], bodySize: [10, 18]
};

function makeNoteStyleId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function safeNoteStyleId(value) {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,44}$/i.test(value)
    ? value.toLowerCase() : null;
}

function encodeNoteStyleMarker(config) {
  return `<!-- ${NOTE_STYLE_MARKER}:${encodeURIComponent(JSON.stringify(config))} -->`;
}

function decodeNoteStyleMarker(content) {
  if (typeof content !== 'string') return null;
  const match = content.match(new RegExp(`<!--\\s*${NOTE_STYLE_MARKER}:([^\\s]+)\\s*-->`));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])); }
  catch (error) { console.warn('ESDS local note style marker is invalid:', error); return null; }
}

function upsertNoteStyleMarker(content, config) {
  const marker = encodeNoteStyleMarker(config);
  const pattern = new RegExp(`<!--\\s*${NOTE_STYLE_MARKER}:[\\s\\S]*?-->`);
  if (pattern.test(content)) return content.replace(pattern, marker);
  const frontmatter = /^---\s*\r?\n[\s\S]*?\r?\n---\s*(?:\r?\n|$)/.exec(content);
  if (frontmatter) {
    const index = frontmatter[0].length;
    return `${content.slice(0, index)}${marker}\n${content.slice(index)}`;
  }
  return `${marker}\n${content}`;
}

function normalizeNoteStyleProps(value, defaults) {
  const out = { ...(defaults || {}) };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return out;
  Object.entries(NOTE_STYLE_PROP_RANGES).forEach(([key, [min, max]]) => {
    if (value[key] == null) return;
    const number = Number(value[key]);
    if (Number.isFinite(number)) out[key] = Math.min(max, Math.max(min, number));
  });
  return out;
}

function normalizeNoteBorder(value, defaults) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const defaultSides = (defaults && defaults.sides) || { top: true, right: true, bottom: true, left: true };
  const style = NOTE_STYLE_BORDER_TYPES.includes(source.style) ? source.style : ((defaults && defaults.style) || 'solid');
  const sides = source.sides && typeof source.sides === 'object' ? source.sides : {};
  return {
    style,
    sides: {
      top: sides.top == null ? !!defaultSides.top : !!sides.top,
      right: sides.right == null ? !!defaultSides.right : !!sides.right,
      bottom: sides.bottom == null ? !!defaultSides.bottom : !!sides.bottom,
      left: sides.left == null ? !!defaultSides.left : !!sides.left
    }
  };
}

function getNoteStyleFramePresetId(borderValue) {
  const border = normalizeNoteBorder(borderValue, null);
  if (border.style === 'none' || !Object.values(border.sides).some(Boolean)) return 'none';
  for (const [id, preset] of Object.entries(NOTE_STYLE_FRAME_PRESETS)) {
    if (border.style !== preset.style) continue;
    if (['top', 'right', 'bottom', 'left'].every(side => border.sides[side] === preset.sides[side])) return id;
  }
  return null;
}

function normalizeNoteStyleColors(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const result = {};
  ['all', ...CALLOUT_KEYS].forEach(key => {
    const item = source[key] && typeof source[key] === 'object' ? source[key] : {};
    const clean = {};
    ['fillColor', 'borderColor', 'textColor'].forEach(colorKey => {
      if (isHexColor(item[colorKey])) clean[colorKey] = colorToHex(item[colorKey]);
    });
    if (Object.keys(clean).length) result[key] = clean;
  });
  return result;
}

function normalizeLocalNoteStyle(raw = {}, fallbackId = null) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};
  const id = safeNoteStyleId(raw.id) || safeNoteStyleId(fallbackId);
  if (!id) return null;
  const base = BUILTIN_BLOCK_STYLES.find(item => item.id === raw.base) || BUILTIN_BLOCK_STYLES[0];
  const styleSource = raw.style && typeof raw.style === 'object' ? raw.style : {};
  const calloutSource = raw.calloutOverrides && typeof raw.calloutOverrides === 'object' ? raw.calloutOverrides : {};
  const borderSource = raw.border && typeof raw.border === 'object' ? raw.border : {};
  const borderOverrideSource = raw.borderOverrides && typeof raw.borderOverrides === 'object' ? raw.borderOverrides : {};
  const colorsSource = raw.colors && typeof raw.colors === 'object' ? raw.colors : {};
  const calloutOverrides = {};
  const borderOverrides = {};
  CALLOUT_KEYS.forEach(type => {
    const source = calloutSource[type] && typeof calloutSource[type] === 'object' ? calloutSource[type] : {};
    const light = normalizeNoteStyleProps(source.light, {});
    const dark = normalizeNoteStyleProps(source.dark, {});
    if (Object.keys(light).length || Object.keys(dark).length) calloutOverrides[type] = { light, dark };
    const border = borderOverrideSource[type] && typeof borderOverrideSource[type] === 'object' ? borderOverrideSource[type] : {};
    const cleanBorderOverride = {};
    if (border.light) cleanBorderOverride.light = normalizeNoteBorder(border.light, null);
    if (border.dark) cleanBorderOverride.dark = normalizeNoteBorder(border.dark, null);
    if (Object.keys(cleanBorderOverride).length) borderOverrides[type] = cleanBorderOverride;
  });
  const cleanColorModes = mode => normalizeNoteStyleColors(colorsSource[mode]);
  return {
    id,
    name: String(raw.name || 'Локальное оформление заметки').slice(0, 100),
    base: base.id,
    frameSource: raw.frameSource === 'palette' ? 'palette' : 'local',
    style: {
      light: normalizeNoteStyleProps(styleSource.light, base.style.light),
      dark: normalizeNoteStyleProps(styleSource.dark, base.style.dark)
    },
    calloutOverrides,
    border: {
      light: normalizeNoteBorder(borderSource.light, null),
      dark: normalizeNoteBorder(borderSource.dark, null)
    },
    borderOverrides,
    colors: { light: cleanColorModes('light'), dark: cleanColorModes('dark') }
  };
}

function makeLocalNoteStyleCss(raw) {
  const config = normalizeLocalNoteStyle(raw);
  if (!config) return '';
  const cls = `${NOTE_STYLE_CLASS_PREFIX}${config.id}`;
  let css = '';
  ['light', 'dark'].forEach(mode => {
    const prefix = mode === 'dark' ? 'body.theme-dark ' : '';
    const allColors = (config.colors[mode] || {}).all || {};
    CALLOUT_KEYS.forEach(type => {
      const props = mergeStyleProps(config.style[mode], (config.calloutOverrides[type] && config.calloutOverrides[type][mode]) || {});
      const border = normalizeNoteBorder(
        (config.borderOverrides[type] && config.borderOverrides[type][mode]) || config.border[mode],
        config.border[mode]
      );
      const customColors = { ...allColors, ...(((config.colors[mode] || {})[type]) || {}) };
      const fallbackPalette = PALETTES[0];
      const fallbackCalloutColor = mode === 'dark'
        ? ((fallbackPalette.darkCallouts || fallbackPalette.callouts)[type] || fallbackPalette.callouts[type])
        : fallbackPalette.callouts[type];
      const declarations = [stylePropsToVars(props)];
      if (customColors.fillColor) declarations.push(`--esds-callout-fill-${type}:${rgbValue(customColors.fillColor)}`);
      if (customColors.borderColor) declarations.push(`--esds-callout-border-${type}:${rgbValue(customColors.borderColor)}`);
      if (customColors.textColor) declarations.push(`--esds-callout-text-${type}:${rgbValue(customColors.textColor)}`);
      declarations.push(`--callout-color:var(--esds-callout-border-${type},var(--esds-callout-${type},${rgbValue(fallbackCalloutColor)}))`);
      declarations.push(`--esds-callout-fill:var(--esds-callout-fill-${type},var(--esds-callout-${type},${rgbValue(fallbackCalloutColor)}))`);
      declarations.push(`--esds-callout-text:var(--esds-callout-text-${type},var(--esds-callout-${type},${rgbValue(fallbackCalloutColor)}))`);
      declarations.push(`--esds-callout-border:var(--esds-callout-border-${type},var(--esds-callout-${type},${rgbValue(fallbackCalloutColor)}))`);
      declarations.push(`--callout-background-opacity:${props.backgroundOpacity}`);
      declarations.push(`--callout-border-opacity:${props.borderOpacity}`);
      if (config.frameSource === 'local') {
        const widths = ['top', 'right', 'bottom', 'left'].map(side => border.style !== 'none' && border.sides[side] ? `${props.borderWidth}px` : '0px').join(' ');
        declarations.push(`border-style:${border.style === 'none' ? 'none' : border.style} !important`);
        declarations.push(`border-width:${widths} !important`);
        declarations.push(`border-radius:${props.borderRadius}px !important`);
      }
      declarations.push(`padding:${props.paddingY}px ${props.paddingX}px !important`);
      declarations.push('box-shadow:none !important');
      declarations.push(`border-color:rgba(var(--esds-callout-border),${props.borderOpacity}) !important`);
      declarations.push(`background-color:rgba(var(--esds-callout-fill),${props.backgroundOpacity}) !important`);
      const selector = `${prefix}.markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout[data-callout="${type}"],${prefix}.markdown-source-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout[data-callout="${type}"]`;
      css += `${selector}{${declarations.filter(Boolean).join(';')}}\n`;
      const titleSelector = `${prefix}.markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout[data-callout="${type}"] .callout-title,${prefix}.markdown-source-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout[data-callout="${type}"] .callout-title`;
      css += `${titleSelector}{color:rgb(var(--esds-callout-text)) !important;gap:${props.gap}px !important;font-size:${props.titleSize}px !important;font-weight:${props.titleWeight} !important}\n`;
      const contentSelector = `${prefix}.markdown-preview-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout[data-callout="${type}"] .callout-content,${prefix}.markdown-source-view.esds-note:not([${CALLOUTS_DISABLED_ATTRIBUTE}="true"]).${cls} .callout[data-callout="${type}"] .callout-content`;
      css += `${contentSelector}{color:rgb(var(--esds-callout-text)) !important;font-size:${props.bodySize}px !important}\n`;
    });
  });
  return css;
}

class PreviewModal extends Modal {
  constructor(app, studio) { super(app); this.studio = studio; }
  onOpen() {
    this.modalEl.addClass('esds-preview-modal');
    this.contentEl.addClass('esds-preview-modal-content');
    this.render();
  }
  onClose() { this.contentEl.empty(); }
  render() {
    const p = this.studio.selectedPalette;
    const b = this.studio.selectedBackground;
    const root = this.contentEl; root.empty();

    const header = root.createDiv({ cls: 'esds-header esds-preview-modal-header' });
    const title = header.createDiv({ cls: 'esds-heading-wrap' });
    title.createEl('h2', { text: 'Предпросмотр оформления' });
    title.createEl('p', { text: `${p.name} · ${b.label || b.name} · Геометрия рамок палитры` });

    const preview = root.createDiv({ cls: `esds-preview ${p.id} esds-palette-${p.id} ${b.id} esds-frames-from-palette` });
    this.studio.renderPreview(preview);

    const actions = root.createDiv({ cls: 'esds-preview-actions' });
    const apply = actions.createEl('button', { cls: 'esds-button esds-primary esds-btn-teal', text: '✓ Применить', attr: { type: 'button' } });
    apply.addEventListener('click', async () => {
      apply.disabled = true;
      const ok = await this.studio.applySelected();
      if (ok) { this.close(); this.studio.close(); }
      else apply.disabled = false;
    });

    const cancel = actions.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Закрыть', attr: { type: 'button' } });
    cancel.addEventListener('click', () => this.close());

    const alreadyFavorite = this.studio.isFavorite();
    const fav = actions.createEl('button', { cls: 'esds-button esds-btn-coral', text: alreadyFavorite ? '★ В избранном' : '☆ В избранное', attr: { type: 'button' } });
    if (alreadyFavorite) fav.addClass('is-saved');
    fav.addEventListener('click', async () => {
      const added = await this.studio.addFavorite();
      fav.setText(added ? '★ В избранном' : '★ Уже в избранном');
      fav.addClass('is-saved');
    });
  }
}

class LibraryItemPreviewModal extends Modal {
  constructor(app, studio, kind, items, index = 0) {
    super(app);
    this.studio = studio;
    this.kind = kind;
    this.items = Array.isArray(items) ? items : [];
    this.index = Math.max(0, Math.min(index, this.items.length - 1));
    this.mode = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    this.touchStartX = null;
  }
  onOpen() {
    this.modalEl.addClass('esds-preview-modal', 'esds-library-preview-modal');
    this.contentEl.addClass('esds-preview-modal-content', 'esds-library-preview-content');
    this.render();
  }
  onClose() { this.contentEl.empty(); }
  current() { return this.items[this.index]; }
  render() {
    const root = this.contentEl;
    root.empty();
    const item = this.current();
    if (!item) return;
    const s = this.studio;
    const palette = this.kind === 'palette' ? item : s.selectedPalette;
    const background = this.kind === 'background' ? item : (this.kind === 'palette' ? (s.findBackground(item.defaultBackground) || s.selectedBackground) : s.selectedBackground);
    const block = this.kind === 'blockStyle' ? item : s.getPreferredBlockStyle(palette);
    const name = item.name || item.label || 'Элемент оформления';

    const header = root.createDiv({ cls: 'esds-header esds-preview-modal-header' });
    const heading = header.createDiv({ cls: 'esds-heading-wrap' });
    heading.createEl('h2', { text: name });
    heading.createEl('p', { text: `${this.kind === 'palette' ? 'Палитра' : this.kind === 'background' ? 'Фон заметки' : 'Стиль блоков'} · ${item.category || item.group || 'Моя библиотека'} · ${this.index + 1} из ${this.items.length}` });

    const modeBar = root.createDiv({ cls: 'esds-library-preview-mode' });
    ['light', 'dark'].forEach(mode => {
      const button = modeBar.createEl('button', { cls: `esds-button esds-btn-quiet${this.mode === mode ? ' is-active' : ''}`, text: mode === 'light' ? '☀ Светлая' : '☾ Тёмная', attr: { type: 'button' } });
      button.addEventListener('click', () => { this.mode = mode; this.render(); });
    });

    const preview = root.createDiv({ cls: `esds-library-large-preview esds-preview ${palette.id} esds-palette-${palette.id} ${background.id || ''} esds-frames-from-palette` });
    s.setPreviewTheme(preview, palette, background, block, this.mode);
    if (this.kind === 'palette') s.renderPaletteRichSampleContent(preview);
    else if (this.kind === 'background') s.renderMiniNote(preview, true);
    else s.renderBlockGallery(preview, item.previewCallouts || ['rule', 'example', 'important', 'tip', 'warning', 'success']);

    const navigation = root.createDiv({ cls: 'esds-library-preview-navigation' });
    const previous = navigation.createEl('button', { cls: 'esds-button esds-btn-quiet', text: '‹ Предыдущий', attr: { type: 'button' } });
    previous.disabled = this.items.length < 2;
    previous.addEventListener('click', () => { this.index = (this.index - 1 + this.items.length) % this.items.length; this.render(); });
    const next = navigation.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Следующий ›', attr: { type: 'button' } });
    next.disabled = this.items.length < 2;
    next.addEventListener('click', () => { this.index = (this.index + 1) % this.items.length; this.render(); });
    preview.addEventListener('touchstart', event => { this.touchStartX = event.changedTouches && event.changedTouches[0] ? event.changedTouches[0].clientX : null; }, { passive: true });
    preview.addEventListener('touchend', event => {
      if (this.touchStartX == null || !event.changedTouches || !event.changedTouches[0]) return;
      const delta = event.changedTouches[0].clientX - this.touchStartX;
      this.touchStartX = null;
      if (Math.abs(delta) < 55 || this.items.length < 2) return;
      this.index = (this.index + (delta < 0 ? 1 : -1) + this.items.length) % this.items.length;
      this.render();
    }, { passive: true });

    const actions = root.createDiv({ cls: 'esds-preview-actions esds-library-preview-actions' });
    const apply = actions.createEl('button', { cls: 'esds-button esds-primary esds-btn-teal', text: '✓ Применить', attr: { type: 'button' } });
    apply.addEventListener('click', async () => {
      if (apply.disabled) return;
      apply.disabled = true;
      const oldText = apply.textContent;
      apply.setText('Применяем…');
      try {
        if (this.kind === 'palette') s.selectPalette(item, false);
        else if (this.kind === 'background') s.selectBackground(item, false);
        else { s.selectedBlocks = item; s.activeView = 'studio'; s.activeSection = 'palette'; }
        const applied = await s.applySelected();
        if (applied) {
          this.close();
          s.render();
          new Notice(`Оформление «${name}» применено к текущей заметке.`);
        } else apply.setText(oldText);
      } catch (error) {
        console.error('ESDS preview apply:', error);
        apply.setText(oldText);
      } finally { apply.disabled = false; }
    });
    const favorite = actions.createEl('button', { cls: 'esds-button esds-btn-coral', text: s.isItemFavorite(this.kind, item.id) ? '★ В избранном' : '☆ В избранное', attr: { type: 'button' } });
    favorite.addEventListener('click', async () => {
      await s.toggleItemFavorite(this.kind, item);
      favorite.setText(s.isItemFavorite(this.kind, item.id) ? '★ В избранном' : '☆ В избранное');
    });
    const close = actions.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Закрыть', attr: { type: 'button' } });
    close.addEventListener('click', () => this.close());
  }
}

class PaletteBuilderModal extends Modal {
  constructor(app, studio, existing = null) { super(app); this.studio = studio; this.existing = existing; this.base = clone(existing || studio.selectedPalette); this.inputs = { light: {}, dark: {} }; this.category = (existing && existing.category) || 'Мои палитры'; this.themeMode = 'light'; this.calloutType = 'important'; }
  onOpen() { this.modalEl.addClass('esds-builder-modal'); this.contentEl.addClass('esds-builder-content'); this.render(); }
  onClose() { this.contentEl.empty(); }
  render() {
    const root = this.contentEl; root.empty();
    const header = root.createDiv({ cls: 'esds-header esds-builder-header' });
    const back = header.createEl('button', { cls: 'esds-button esds-btn-quiet esds-back-button esds-builder-back-button', attr: { type: 'button', 'aria-label': 'Назад' } });
    back.createSpan({ cls: 'esds-back-arrow', text: '‹' }); back.createSpan({ cls: 'esds-back-label', text: 'Назад' });
    back.addEventListener('click', () => this.close());
    const h = header.createDiv({ cls: 'esds-heading-wrap' }); h.createEl('h2', { text: this.existing ? 'Редактировать палитру' : 'Создать свою палитру' }); h.createEl('p', { text: 'Настрой цвета ролей. Встроенные шаблоны остаются неизменными.' });
    const body = root.createDiv({ cls: 'esds-builder-body' });
    this.nameInput = body.createEl('input', { cls: 'esds-text-input', attr: { type: 'text', placeholder: 'Название палитры' } });
    this.nameInput.value = this.existing ? this.base.name : `${this.base.name} — моя версия`;
    body.createEl('label', { text: 'Категория' });
    const categorySelect = body.createEl('select', { cls: 'esds-select' });
    this.studio.getCategories('palettes').forEach(cat => {
      const option = categorySelect.createEl('option', { text: cat.name, attr: { value: cat.name } });
      if (cat.name === this.category) option.selected = true;
    });
    categorySelect.addEventListener('change', () => { this.category = categorySelect.value; });

    // The palette owns its complete default visual treatment: colours, background,
    // Callout frame geometry and its recommended base block preset. Advanced overrides remain optional.
    const linkedDesign = body.createDiv({ cls: 'esds-palette-linked-design' });
    linkedDesign.createEl('h3', { text: 'Оформление палитры' });
    linkedDesign.createEl('p', { cls: 'esds-section-note', text: 'Палитра задаёт согласованную систему цветов, оформление блоков и рамки. При смене палитры весь связанный дизайн обновляется автоматически.' });
    linkedDesign.createEl('label', { text: 'Фон по умолчанию' });
    this.defaultBackgroundSelect = linkedDesign.createEl('select', { cls: 'esds-select' });
    this.studio.allBackgrounds().forEach(bg => {
      const option = this.defaultBackgroundSelect.createEl('option', { text: bg.label || bg.name, attr: { value: bg.id } });
      if (bg.id === (this.base.defaultBackground || this.studio.selectedBackground.id)) option.selected = true;
    });
    let refreshLinkedPreview = () => {};
    this.defaultBackgroundSelect.addEventListener('change', () => { this.base.defaultBackground = this.defaultBackgroundSelect.value; refreshLinkedPreview(); });

    const themeToggle = body.createDiv({ cls: 'esds-theme-toggle' });
    const lightBtn = themeToggle.createEl('button', { cls: `esds-button ${this.themeMode === 'light' ? 'esds-primary' : 'esds-btn-quiet'}`, text: 'Light', attr: { type: 'button' } });
    const darkBtn = themeToggle.createEl('button', { cls: `esds-button ${this.themeMode === 'dark' ? 'esds-primary' : 'esds-btn-quiet'}`, text: 'Dark', attr: { type: 'button' } });
    lightBtn.addEventListener('click', () => { this.themeMode = 'light'; this.render(); });
    darkBtn.addEventListener('click', () => { this.themeMode = 'dark'; this.render(); });
    const swatches = body.createDiv({ cls: 'esds-color-grid' });
    const labels = { en:'Иностранные слова', ipa:'Произношение / транскрипция', translation:'Перевод', term:'Термины', definition:'Определения', focus:'Главный акцент', secondary:'Второй акцент', soft:'Мягкий акцент', heading:'Заголовки', ink:'Основной текст' };
    const currentRoles = this.themeMode === 'dark' ? (this.base.dark || this.base.roles) : this.base.roles;
    ROLE_KEYS.forEach(key => {
      const field = swatches.createDiv({ cls: 'esds-color-field' });
      field.createEl('label', { text: labels[key] });
      const value = isHexColor(currentRoles[key]) ? currentRoles[key] : (this.base.roles[key] || '#777777');
      const input = field.createEl('input', { attr: { type: 'color', value } });
      input.value = value; this.inputs[this.themeMode][key] = input;
      const editingMode = this.themeMode;
      input.addEventListener('input', () => {
        if (editingMode === 'dark') this.base.dark = { ...(this.base.dark || this.base.roles), [key]: input.value };
        else this.base.roles = { ...(this.base.roles || {}), [key]: input.value };
        if (this.palettePreview) this.palettePreview.style.setProperty(`--esds-${key}`, input.value);
      });
    });
    const calloutColorsSection = body.createDiv({ cls: 'esds-palette-callout-colors' });
    calloutColorsSection.createEl('h3', { text: 'Цвета информационных блоков' });
    calloutColorsSection.createEl('p', { cls: 'esds-section-note', text: 'Здесь задаются отдельные цвета и геометрия рамки каждого типа блока. Эти рамки применяются вместе с выбранной палитрой; настройки конкретной заметки могут их переопределить.' });
    const calloutTypeSelect = calloutColorsSection.createEl('select', { cls: 'esds-select' });
    CALLOUTS.forEach(([key, label]) => {
      const option = calloutTypeSelect.createEl('option', { text: label, attr: { value: key } });
      if (key === this.calloutType) option.selected = true;
    });
    calloutTypeSelect.addEventListener('change', () => { this.calloutType = calloutTypeSelect.value; this.render(); });
    const calloutColorGrid = calloutColorsSection.createDiv({ cls: 'esds-palette-callout-color-grid' });
    const calloutColorMaps = this.themeMode === 'dark'
      ? { fill: 'darkCalloutFills', text: 'darkCalloutTexts', border: 'darkCalloutBorders', base: this.base.darkCallouts || this.base.callouts }
      : { fill: 'calloutFills', text: 'calloutTexts', border: 'calloutBorders', base: this.base.callouts };
    [['fill', 'Заливка'], ['text', 'Цвет текста блока'], ['border', 'Обводка']].forEach(([kind, label]) => {
      const mapName = calloutColorMaps[kind];
      const map = this.base[mapName] && typeof this.base[mapName] === 'object' ? this.base[mapName] : {};
      const fallback = calloutColorMaps.base && calloutColorMaps.base[this.calloutType] ? calloutColorMaps.base[this.calloutType] : '#777777';
      const value = map[this.calloutType] || fallback;
      const cell = calloutColorGrid.createDiv({ cls: 'esds-color-field' });
      cell.createEl('label', { text: label });
      const input = cell.createEl('input', { attr: { type: 'color', value: colorToHex(value) } });
      input.addEventListener('input', () => {
        this.base[mapName] = { ...(this.base[mapName] || {}), [this.calloutType]: input.value };
        refreshLinkedPreview();
      });
      const reset = cell.createEl('button', { cls: 'esds-icon-btn', text: '×', attr: { type: 'button', title: 'Использовать основной цвет этого блока' } });
      reset.addEventListener('click', () => { if (this.base[mapName]) delete this.base[mapName][this.calloutType]; this.render(); });
    });
    const frameSection = body.createDiv({ cls: 'esds-palette-frame-settings' });
    frameSection.createEl('h4', { text: 'Рамка этого блока в палитре' });
    frameSection.createEl('p', { cls: 'esds-section-note', text: 'Задаёт собственную геометрию этого блока. Эти рамки автоматически применяются к заметке вместе с выбранной палитрой; локальные настройки заметки могут их переопределить.' });
    const frameConfig = (this.base.calloutFrames && this.base.calloutFrames[this.calloutType]) || { preset: 'classic', width: 1.5, radius: 10 };
    const framePresetRow = frameSection.createDiv({ cls: 'esds-prop-field' });
    framePresetRow.createEl('label', { text: 'Тип обрамления' });
    const framePresetSelect = framePresetRow.createEl('select', { cls: 'esds-select' });
    NOTE_STYLE_FRAME_PRESET_LABELS.forEach(([id, label]) => {
      const option = framePresetSelect.createEl('option', { text: label, attr: { value: id } });
      if (frameConfig.preset === id) option.selected = true;
    });
    framePresetSelect.addEventListener('change', () => {
      this.base.calloutFrames = { ...(this.base.calloutFrames || {}), [this.calloutType]: { ...frameConfig, preset: framePresetSelect.value } };
      refreshLinkedPreview();
    });
    [['Толщина рамки', 'width', 0, 8, 0.5], ['Скругление', 'radius', 0, 32, 1]].forEach(([label, key, min, max, step]) => {
      const row = frameSection.createDiv({ cls: 'esds-prop-field' });
      const current = Number.isFinite(Number(frameConfig[key])) ? Number(frameConfig[key]) : (key === 'width' ? 1.5 : 10);
      const labelEl = row.createEl('label', { text: `${label}: ${current} px` });
      const input = row.createEl('input', { cls: 'esds-palette-frame-range', attr: { type: 'range', min: String(min), max: String(max), step: String(step), value: String(current), 'aria-label': label } });
      input.disabled = false;
      let lastApplied = String(input.value);
      const applyFrameValue = () => {
        if (input.disabled) return;
        const numeric = Number(input.value);
        if (!Number.isFinite(numeric)) return;
        const next = Math.max(min, Math.min(max, numeric));
        if (next !== numeric) input.value = String(next);
        const currentValue = String(input.value);
        labelEl.setText(`${label}: ${Number(currentValue).toFixed((String(step).split('.')[1] || '').length)} px`);
        if (currentValue === lastApplied) return;
        lastApplied = currentValue;
        this.base.calloutFrames = { ...(this.base.calloutFrames || {}), [this.calloutType]: { ...(this.base.calloutFrames?.[this.calloutType] || frameConfig), [key]: Number(currentValue) } };
        refreshLinkedPreview();
      };
      input.addEventListener('input', applyFrameValue);
      input.addEventListener('change', applyFrameValue);
    });

    const previewWrap = body.createDiv({ cls: 'esds-block-builder-preview esds-palette-builder-preview' });
    previewWrap.createEl('strong', { text: 'Предпросмотр всей заметки и блоков' });
    this.palettePreview = previewWrap.createDiv({ cls: 'esds-preview esds-inline-theme' });
    refreshLinkedPreview = () => {
      const bg = this.studio.findBackground(this.defaultBackgroundSelect.value) || this.studio.selectedBackground;
      const blocks = this.studio.findBlockStyle(this.base.defaultBlocks) || this.studio.getPreferredBlockStyle(this.base);
      this.palettePreview.className = `esds-preview esds-inline-theme ${this.base.id} esds-palette-${this.base.id} ${bg.id} esds-frames-from-palette`;
      this.studio.setPreviewTheme(this.palettePreview, this.base, bg, blocks, this.themeMode);
    };
    this.palettePreview.style.setProperty('--esds-en', currentRoles.en || '#187b75');
    this.palettePreview.style.setProperty('--esds-ipa', currentRoles.ipa || '#7450a8');
    this.palettePreview.style.setProperty('--esds-translation', currentRoles.translation || '#a64b32');
    this.palettePreview.style.setProperty('--esds-term', currentRoles.term || '#235da5');
    this.palettePreview.style.setProperty('--esds-definition', currentRoles.definition || '#36734b');
    this.palettePreview.style.setProperty('--esds-heading', currentRoles.heading || '#51417d');
    const paletteSample = this.palettePreview.createDiv({ cls: 'esds-rich-sample' });
    paletteSample.createEl('div', { cls: 'esds-rich-title', text: 'Образец оформления' });
    paletteSample.createEl('div', { cls: 'esds-role st-fo', text: 'Foreign word · مصطلح · Begriff' });
    paletteSample.createEl('div', { cls: 'esds-role st-pr', text: 'Произношение / транскрипция' });
    paletteSample.createEl('div', { cls: 'esds-role st-tr', text: 'Перевод или значение понятия' });
    const articleSample = this.palettePreview.createDiv({ cls: 'esds-article-sample' });
    articleSample.createEl('h3', { text: 'Краткий конспект' });
    const termLine = articleSample.createEl('p');
    termLine.createEl('span', { cls: 'st-te', text: 'Термин' });
    termLine.appendText(' — ');
    termLine.createEl('span', { cls: 'st-de', text: 'краткое определение' });
    articleSample.createEl('p', { cls: 'st-mi', text: 'Главная мысль и смысловой акцент.' });
    articleSample.createEl('p', { cls: 'st-nu', text: 'Показатель: 3,5%' });
    this.studio.renderBlockGallery(this.palettePreview, ['rule', 'example', 'important', 'tip', 'warning', 'question']);
    const applyPaletteFramePreview = () => {
      this.palettePreview.querySelectorAll('.esds-demo-callout').forEach(node => {
        const type = Array.from(node.classList).find(name => name.startsWith('esds-callout-'))?.replace('esds-callout-', '');
        const frame = this.base.calloutFrames && this.base.calloutFrames[type];
        if (!frame || !BLOCK_FRAME_PRESET_KEYS.includes(frame.preset)) return;
        const preset = NOTE_STYLE_FRAME_PRESETS[frame.preset] || NOTE_STYLE_FRAME_PRESETS.classic;
        const width = Math.max(0, Math.min(8, Number(frame.width) || 0));
        const widths = ['top','right','bottom','left'].map(side => preset.style !== 'none' && preset.sides[side] ? `${width}px` : '0px').join(' ');
        node.style.setProperty('border-style', preset.style, 'important');
        node.style.setProperty('border-width', widths, 'important');
        node.style.setProperty('border-radius', `${Math.max(0, Math.min(32, Number(frame.radius) || 0))}px`, 'important');
      });
    };
    const baseRefreshLinkedPreview = refreshLinkedPreview;
    refreshLinkedPreview = () => { baseRefreshLinkedPreview(); applyPaletteFramePreview(); };
    refreshLinkedPreview();
    const actions = root.createDiv({ cls: 'esds-preview-actions' });
    const save = actions.createEl('button', { cls: 'esds-button esds-primary esds-btn-teal', text: '✓ Сохранить палитру' });
    save.addEventListener('click', async () => {
      const name = this.nameInput.value.trim();
      if (!name) { new Notice('Введи название палитры.'); return; }
      const palette = clone(this.base);
      palette.name = name; palette.mood = palette.mood || 'Пользовательская палитра'; palette.description = palette.description || 'Создана в English Study Design Studio.';
      if (!this.existing) {
        palette.id = `user-${slugify(name)}-${Date.now().toString(36).slice(-4)}`;
      }
      palette.defaultBackground = this.defaultBackgroundSelect.value || palette.defaultBackground || this.studio.selectedBackground.id;
      // The palette stores its recommended base block preset; it is selected automatically.
      palette.defaultBlocks = palette.defaultBlocks || this.studio.selectedBlocks.id;
      palette.roles = { ...(palette.roles || {}) };
      palette.dark = { ...(palette.dark || palette.roles) };
      ROLE_KEYS.forEach(key => {
        if (this.inputs.light[key]) palette.roles[key] = this.inputs.light[key].value;
        if (this.inputs.dark[key]) palette.dark[key] = this.inputs.dark[key].value;
      });
      palette.swatches = [palette.roles.en, palette.roles.ipa, palette.roles.translation, palette.roles.term, palette.roles.focus];
      const now = new Date().toISOString();
      palette.createdAt = palette.createdAt || now;
      palette.updatedAt = now;
      palette.source = 'user';
      palette.category = this.category || 'Мои палитры';
      const list = this.studio.plugin.userData.palettes;
      if (this.existing) {
        const index = list.findIndex(item => item.id === this.existing.id);
        if (index >= 0) list[index] = palette; else list.push(palette);
      } else list.push(palette);
      await this.studio.plugin.saveUserLibrary();
      this.studio.plugin.refreshGeneratedStyles();
      this.studio.selectedPalette = palette;
      this.studio.selectedBackground = this.studio.findBackground(palette.defaultBackground) || BACKGROUNDS[0];
      this.studio.selectedBlocks = this.studio.getPreferredBlockStyle(palette);
      // The palette's authored block preset is selected automatically with its colours and background.
      this.studio.backgroundOverridden = false;
      this.studio.activeView = 'studio';
      this.studio.activeSection = 'palette';
      this.studio.render();
      this.close();
      new Notice(this.existing ? `Палитра «${name}» обновлена.` : `Палитра «${name}» добавлена в «Мои палитры».`);
    });
  }
}

class BackgroundBuilderModal extends Modal {
  constructor(app, studio, existing = null) { super(app); this.studio = studio; this.existing = existing; this.category = (existing && (existing.group || existing.category)) || 'Мои фоны'; this.themeMode = 'light'; const stops = (value, a, b) => { const found = String(value || '').match(/#[0-9a-f]{6}/ig) || []; return [found[0] || a, found[1] || b]; }; this.colors = { light: stops(existing && existing.light, '#e8f1ed', '#d6e6df'), dark: stops(existing && existing.dark, '#292d35', '#20242d') }; }
  onOpen() { this.modalEl.addClass('esds-builder-modal'); this.contentEl.addClass('esds-builder-content'); this.render(); }
  onClose() { this.contentEl.empty(); }
  render() {
    const root = this.contentEl; root.empty();
    const header = root.createDiv({ cls: 'esds-header esds-builder-header' });
    const back = header.createEl('button', { cls: 'esds-button esds-btn-quiet esds-back-button esds-builder-back-button', attr: { type: 'button', 'aria-label': 'Назад' } });
    back.createSpan({ cls: 'esds-back-arrow', text: '‹' }); back.createSpan({ cls: 'esds-back-label', text: 'Назад' });
    back.addEventListener('click', () => this.close());
    const h = header.createDiv({ cls: 'esds-heading-wrap' }); h.createEl('h2', { text: this.existing ? 'Редактировать фон' : 'Создать свой фон' }); h.createEl('p', { text: 'Настрой цвета и сохрани фон в собственной библиотеке.' });
    const body = root.createDiv({ cls: 'esds-builder-body' });
    body.createEl('label', { text: 'Название фона' });
    const name = body.createEl('input', { cls: 'esds-text-input', attr: { type: 'text', placeholder: 'Например, Mint Paper' } });
    name.value = this.existing ? (this.existing.label || this.existing.name || '') : '';
    body.createEl('label', { text: 'Категория' });
    const categorySelect = body.createEl('select', { cls: 'esds-select' });
    this.studio.getCategories('backgrounds').forEach(cat => {
      const option = categorySelect.createEl('option', { text: cat.name, attr: { value: cat.name } });
      if (cat.name === this.category) option.selected = true;
    });
    categorySelect.addEventListener('change', () => { this.category = categorySelect.value; });
    const themeToggle = body.createDiv({ cls: 'esds-theme-toggle' });
    const lightBtn = themeToggle.createEl('button', { cls: `esds-button ${this.themeMode === 'light' ? 'esds-primary' : 'esds-btn-quiet'}`, text: 'Light', attr: { type: 'button' } });
    const darkBtn = themeToggle.createEl('button', { cls: `esds-button ${this.themeMode === 'dark' ? 'esds-primary' : 'esds-btn-quiet'}`, text: 'Dark', attr: { type: 'button' } });
    lightBtn.addEventListener('click', () => { this.themeMode = 'light'; this.render(); });
    darkBtn.addEventListener('click', () => { this.themeMode = 'dark'; this.render(); });
    const colors = body.createDiv({ cls: 'esds-color-grid esds-background-colors' });
    const c1f = colors.createDiv({ cls: 'esds-color-field' }); c1f.createEl('label', { text: 'Первый цвет' }); const c1 = c1f.createEl('input', { attr: { type: 'color', value: this.colors[this.themeMode][0] } });
    const c2f = colors.createDiv({ cls: 'esds-color-field' }); c2f.createEl('label', { text: 'Второй цвет' }); const c2 = c2f.createEl('input', { attr: { type: 'color', value: this.colors[this.themeMode][1] } });
    const preview = body.createDiv({ cls: 'esds-custom-bg-preview' });
    const previewTitle = preview.createEl('strong', { text: 'Универсальный конспект' });
    const previewText = preview.createEl('span', { text: 'Ключевой термин или иностранное выражение' });
    const previewTranslation = preview.createEl('small', { text: 'Перевод, объяснение или значение' });
    const update = () => {
      this.colors[this.themeMode] = [c1.value, c2.value];
      preview.style.background = `linear-gradient(135deg, ${c1.value} 0%, ${c2.value} 100%)`;
      const textColor = this.themeMode === 'dark' ? '#f1edf5' : '#292b31';
      previewTitle.style.color = textColor; previewText.style.color = textColor; previewTranslation.style.color = textColor;
    };
    c1.addEventListener('input', update); c2.addEventListener('input', update); update();
    const actions = root.createDiv({ cls: 'esds-preview-actions' });
    const save = actions.createEl('button', { cls: 'esds-button esds-primary esds-btn-teal', text: '✓ Сохранить фон' });
    save.addEventListener('click', async () => {
      const label = name.value.trim(); if (!label) { new Notice('Введи название фона.'); return; }
      const now = new Date().toISOString();
      const background = {
        ...(this.existing || {}),
        id: this.existing ? this.existing.id : `bg-custom-${slugify(label)}-${Date.now().toString(36).slice(-4)}`,
        createdAt: (this.existing && this.existing.createdAt) || now, updatedAt: now,
        name: label, label, group: this.category || 'Мои фоны', category: this.category || 'Мои фоны',
        light: `linear-gradient(135deg, ${this.colors.light[0]} 0%, ${this.colors.light[1]} 100%)`,
        dark: `linear-gradient(135deg, ${this.colors.dark[0]} 0%, ${this.colors.dark[1]} 100%)`,
        textColor: (this.existing && this.existing.textColor) || '#302d31',
        darkTextColor: (this.existing && this.existing.darkTextColor) || '#e9eaf0', source: 'user'
      };
      const list = this.studio.plugin.userData.backgrounds;
      if (this.existing) {
        const index = list.findIndex(item => item.id === this.existing.id);
        if (index >= 0) list[index] = background; else list.push(background);
      } else list.push(background);
      await this.studio.plugin.saveUserLibrary(); this.studio.plugin.refreshGeneratedStyles();
      this.studio.selectedBackground = background; this.studio.backgroundOverridden = true;
      this.studio.activeView = 'studio'; this.studio.activeSection = 'background';
      this.studio.render(); this.close();
      new Notice(this.existing ? `Фон «${label}» обновлён.` : `Фон «${label}» добавлен в «Мои фоны».`);
    });
  }
}

class CategoryManagerModal extends Modal {
  constructor(app, studio, kind) {
    super(app);
    this.studio = studio;
    this.kind = kind; // 'palettes' | 'backgrounds' | 'blockStyles'
  }
  onOpen() {
    this.modalEl.addClass('esds-builder-modal');
    this.contentEl.addClass('esds-builder-content');
    this.render();
  }
  onClose() { this.contentEl.empty(); }
  render() {
    const root = this.contentEl;
    root.empty();
    const titles = { palettes: 'Категории палитр', backgrounds: 'Категории фонов', blockStyles: 'Категории стилей блоков' };
    const header = root.createDiv({ cls: 'esds-header esds-builder-header' });
    const back = header.createEl('button', { cls: 'esds-button esds-btn-quiet esds-back-button', attr: { type: 'button' } });
    back.createSpan({ cls: 'esds-back-arrow', text: '‹' });
    back.createSpan({ cls: 'esds-back-label', text: 'Назад' });
    back.addEventListener('click', () => this.close());
    const h = header.createDiv({ cls: 'esds-heading-wrap' });
    h.createEl('h2', { text: titles[this.kind] || 'Категории' });

    const body = root.createDiv({ cls: 'esds-builder-body' });
    const list = this.studio.plugin.userData.categories[this.kind] || [];
    list.sort((a, b) => (a.order || 0) - (b.order || 0));

    list.forEach((cat, index) => {
      const row = body.createDiv({ cls: 'esds-category-manage-row' });
      row.createEl('strong', { text: cat.name });
      if (cat.protected) {
        row.createEl('span', { cls: 'esds-badge-protected', text: 'системная' });
      } else {
        const rename = row.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Переименовать', attr: { type: 'button' } });
        rename.addEventListener('click', async () => {
          const name = prompt('Новое название:', cat.name);
          if (!name || !name.trim()) return;
          if (list.some(item => item.id !== cat.id && item.name.toLowerCase() === name.trim().toLowerCase())) { new Notice('Категория с таким названием уже существует.'); return; }
          const oldName = cat.name;
          cat.name = name.trim();
          const targetItems = this.kind === 'palettes' ? this.studio.plugin.userData.palettes : this.kind === 'backgrounds' ? this.studio.plugin.userData.backgrounds : this.studio.plugin.userData.blockStyles;
          (targetItems || []).forEach(item => {
            const current = this.kind === 'backgrounds' ? (item.group || item.category) : item.category;
            if (current === oldName) {
              if (this.kind === 'backgrounds') { item.group = cat.name; item.category = cat.name; }
              else item.category = cat.name;
            }
          });
          await this.studio.plugin.saveUserLibrary();
          this.render();
        });
        const del = row.createEl('button', { cls: 'esds-button esds-btn-outline-coral', text: 'Удалить', attr: { type: 'button' } });
        del.addEventListener('click', async () => {
          const fallback = list.find(c => c.id !== cat.id) || (DEFAULT_CATEGORIES[this.kind] || [])[0];
          if (!confirm(`Удалить категорию «${cat.name}»? Её элементы будут перенесены в «${fallback ? fallback.name : 'Без категории'}».`)) return;
          const targetItems = this.kind === 'palettes' ? this.studio.plugin.userData.palettes : this.kind === 'backgrounds' ? this.studio.plugin.userData.backgrounds : this.studio.plugin.userData.blockStyles;
          (targetItems || []).forEach(item => {
            const current = this.kind === 'backgrounds' ? (item.group || item.category) : item.category;
            if (current === cat.name) {
              if (this.kind === 'backgrounds') { item.group = fallback ? fallback.name : 'Мои фоны'; item.category = item.group; }
              else item.category = fallback ? fallback.name : (this.kind === 'palettes' ? 'Мои палитры' : 'Мои стили');
            }
          });
          this.studio.plugin.userData.categories[this.kind] = list.filter(c => c.id !== cat.id);
          await this.studio.plugin.saveUserLibrary();
          this.render();
        });
      }
      if (index > 0) {
        const up = row.createEl('button', { cls: 'esds-button esds-btn-quiet', text: '↑', attr: { type: 'button', title: 'Выше' } });
        up.addEventListener('click', async () => {
          const tmp = list[index - 1].order;
          list[index - 1].order = list[index].order;
          list[index].order = tmp;
          await this.studio.plugin.saveUserLibrary();
          this.render();
        });
      }
      if (index < list.length - 1) {
        const down = row.createEl('button', { cls: 'esds-button esds-btn-quiet', text: '↓', attr: { type: 'button', title: 'Ниже' } });
        down.addEventListener('click', async () => {
          const tmp = list[index + 1].order;
          list[index + 1].order = list[index].order;
          list[index].order = tmp;
          await this.studio.plugin.saveUserLibrary();
          this.render();
        });
      }
    });

    const add = body.createEl('button', { cls: 'esds-button esds-btn-teal', text: '＋ Новая категория', attr: { type: 'button' } });
    add.addEventListener('click', async () => {
      const name = prompt('Название категории:');
      if (!name || !name.trim()) return;
      if (list.some(c => c.name === name.trim())) { new Notice('Уже существует.'); return; }
      const baseId = slugify(name.trim());
      let id = baseId; let suffix = 2;
      while (list.some(category => category.id === id)) id = `${baseId}-${suffix++}`;
      list.push({ id, name: name.trim(), order: list.length + 10, protected: false });
      await this.studio.plugin.saveUserLibrary();
      this.render();
    });
  }
}

class DesignStudioModal extends Modal {
  constructor(app, plugin) {
    super(app); this.plugin = plugin;
    this.selectedPalette = PALETTES[0];
    this.selectedBackground = BACKGROUNDS.find(b => b.id === PALETTES[0].defaultBackground) || BACKGROUNDS[0];
    this.selectedBlocks = this.getPreferredBlockStyle(PALETTES[0]);
    this.activeSection = 'palette'; this.activeView = 'studio'; this.advancedOpen = false; this.searchText = ''; this.searchGroup = 'Все'; this.backgroundOverridden = false; this.selectedProfile = CONTENT_PROFILES[0]; this.favoriteGroupsOpen = Object.create(null);
    this.sortModes = { palettes: 'custom', backgrounds: 'custom', blockStyles: 'custom' };
    this.libraryKind = 'palette';
    this.libraryCategory = null;
    this.librarySearchText = '';
    this.paletteCategory = null;
    this.backgroundCategory = null;
    this.catalogPageSize = 24;
    this.plugin.userData.frameSource = 'palette';
    this.frameSource = 'palette';
    this._lastRenderedView = null;
    this.readCurrentSelection();
  }
  sortItems(items, mode) {
    const copy = items.slice();
    if (mode === 'name') return copy.sort((a, b) => String(a.name || a.label || '').localeCompare(String(b.name || b.label || ''), 'ru'));
    if (mode === 'newest') {
      const timestamp = item => {
        const value = Date.parse(item.updatedAt || item.createdAt || '');
        return Number.isFinite(value) ? value : 0;
      };
      return copy.sort((a, b) => timestamp(b) - timestamp(a));
    }
    return copy.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  addSortSelect(parent, kind) {
    const select = parent.createEl('select', { cls: 'esds-select esds-sort-select' });
    [['custom', 'Порядок добавления'], ['name', 'По названию: А—Я'], ['newest', 'Сначала новые']].forEach(([value, label]) => {
      const option = select.createEl('option', { text: label, attr: { value } });
      if ((this.sortModes[kind] || 'custom') === value) option.selected = true;
    });
    select.addEventListener('change', () => { this.sortModes[kind] = select.value; this.render(); });
    return select;
  }
  getPreferredBlockStyle(palette = this.selectedPalette) {
    // A palette is a complete visual package: its own block treatment wins by default.
    // The legacy activeBlockStyleId remains available for old notes and explicit advanced use.
    return (palette && palette.defaultBlocks && this.findBlockStyle(palette.defaultBlocks)) ||
      BUILTIN_BLOCK_STYLES[0];
  }
  async activateBlockStyle(block, rerender = true) {
    const chosen = block && this.findBlockStyle(block.id) || BUILTIN_BLOCK_STYLES[0];
    this.selectedBlocks = chosen;
    this.plugin.userData.activeBlockStyleId = chosen.id;
    await this.plugin.saveUserLibrary();
    if (rerender) {
      this.activeView = 'studio';
      this.activeSection = 'blocks';
      this.render();
    }
  }
  allPalettes() { return [...PALETTES, ...(this.plugin.userData.palettes || [])]; }
  allBackgrounds() { return [...BACKGROUNDS, ...(this.plugin.userData.backgrounds || [])]; }
  allBlockStyles() {
    const user = (this.plugin.userData.blockStyles || []).map(normalizeBlockStyle);
    return [...BUILTIN_BLOCK_STYLES, ...user];
  }
  findPalette(id) { return this.allPalettes().find(item => item.id === id); }
  findBackground(id) { return this.allBackgrounds().find(item => item.id === id); }
  findBlockStyle(id) { return this.allBlockStyles().find(item => item.id === id); }
  getCategories(kind) {
    // The library can contain old or partially edited category entries.
    // Never let one malformed block-style category crash the builder modal.
    const fallback = Array.isArray(DEFAULT_CATEGORIES[kind]) ? DEFAULT_CATEGORIES[kind] : [];
    const stored = this.plugin.userData && this.plugin.userData.categories
      ? this.plugin.userData.categories[kind]
      : null;
    const source = Array.isArray(stored) && stored.length ? stored : fallback;
    const list = source.filter(item =>
      item && typeof item === 'object' && !Array.isArray(item) &&
      typeof item.name === 'string' && item.name.trim().length > 0
    );
    return list.sort((a, b) => {
      const ao = Number(a.order);
      const bo = Number(b.order);
      return (Number.isFinite(ao) ? ao : 0) - (Number.isFinite(bo) ? bo : 0);
    });
  }
  readCurrentSelection() {
    const file = this.app.workspace.getActiveFile(); if (!file) return;
    const fm = this.app.metadataCache.getFileCache(file)?.frontmatter; if (!fm) return;
    const classes = normalizeClasses(fm.cssclasses);
    this.frameSource = 'palette';
    const pClass = classes.find(item => item.startsWith('esds-palette-'));
    const pId = pClass ? pClass.replace(/^esds-palette-/, '') : null;
    const p = pId ? this.findPalette(pId) : null;
    if (p) this.selectedPalette = p;
    const bgClass = classes.find(item => this.findBackground(item));
    const bg = bgClass ? this.findBackground(bgClass) : null;
    if (bg) this.selectedBackground = bg;
    else if (p) this.selectedBackground = this.findBackground(p.defaultBackground) || this.selectedBackground || BACKGROUNDS[0];
    this.backgroundOverridden = !!(p && bg && bg.id !== p.defaultBackground);
    // Subject/content profiles are intentionally not part of the current workflow.
    this.selectedProfile = CONTENT_PROFILES[0];
    const blockClass = classes.find(item => item.startsWith('esds-blocks-'));
    const blockId = blockClass ? blockClass.replace(/^esds-blocks-/, '') : null;
    const block = blockId ? this.findBlockStyle(blockId) : null;
    this.selectedBlocks = block || this.getPreferredBlockStyle(p || this.selectedPalette);
  }
  onOpen() { this.modalEl.addClass('esds-main-modal'); this.contentEl.addClass('esds-main-content'); this.render(); }
  onClose() {
    if (this._catalogSearchTimer) window.clearTimeout(this._catalogSearchTimer);
    this._catalogSearchTimer = null;
    this.contentEl.empty();
  }
  section(root, id, title, subtitle, icon) {
    const isOpen = this.activeSection === id;
    const wrap = root.createDiv({ cls: `esds-accordion esds-section-${id}${isOpen ? ' is-open' : ''}` });
    const triggerId = `esds-section-trigger-${id}`;
    const bodyId = `esds-section-body-${id}`;
    const header = wrap.createEl('button', {
      cls: 'esds-accordion-trigger',
      attr: { type: 'button', id: triggerId, 'aria-expanded': isOpen ? 'true' : 'false', 'aria-controls': bodyId }
    });
    header.createSpan({ cls: 'esds-accordion-icon', text: icon || '›' });
    const labels = header.createDiv({ cls: 'esds-accordion-labels' });
    labels.createEl('strong', { text: title });
    if (subtitle) labels.createEl('small', { text: subtitle });
    header.createSpan({
      cls: 'esds-chevron esds-accordion-chevron',
      text: '›',
      attr: { 'aria-hidden': 'true' }
    });
    header.addEventListener('click', () => {
      this.activeSection = this.activeSection === id ? '' : id;
      this._focusSectionId = id;
      this.render();
    });
    const body = wrap.createDiv({ cls: 'esds-accordion-body', attr: { id: bodyId, role: 'region', 'aria-labelledby': triggerId } });
    if (!isOpen) body.style.display = 'none';
    return { wrap, body: isOpen ? body : null };
  }
  render() {
    if (this._catalogSearchTimer) window.clearTimeout(this._catalogSearchTimer);
    this._catalogSearchTimer = null;
    const root = this.contentEl;
    const sameView = this._lastRenderedView === this.activeView;
    const previousScrollTop = sameView ? (root.querySelector('.esds-main-scroll')?.scrollTop || 0) : 0;
    root.empty();
    if (this.activeView !== 'studio') {
      this.renderSubView();
      const subScroll = root.querySelector('.esds-main-scroll');
      if (subScroll) subScroll.scrollTop = previousScrollTop;
      this._lastRenderedView = this.activeView;
      this.restoreRenderFocus();
      return;
    }

    const scroll = root.createDiv({ cls: 'esds-main-scroll' });

    // Improved current selection indicator
    const summary = scroll.createDiv({ cls: 'esds-current-summary esds-summary-card' });
    const summaryTitle = summary.createDiv({ cls: 'esds-summary-title' });
    summaryTitle.createEl('strong', { text: 'Сейчас выбрано' });
    const summaryBody = summary.createDiv({ cls: 'esds-summary-body' });
    summaryBody.createEl('span', { cls: 'esds-summary-palette', text: `◉ ${this.selectedPalette.name}` });
    summaryBody.createEl('span', { cls: 'esds-summary-sep', text: '·' });
    summaryBody.createEl('span', { cls: 'esds-summary-bg', text: `▧ ${this.selectedBackground.label || this.selectedBackground.name || this.selectedBackground.id}` });
    if (this.backgroundOverridden) {
      const badge = summaryBody.createEl('span', { cls: 'esds-summary-override-badge', text: 'фон переопределён' });
      badge.setAttribute('title', 'Фон отличается от рекомендуемого палитрой');
    }

    const quick = scroll.createDiv({ cls: 'esds-quick-actions' });
    const random = quick.createEl('button', {
      cls: 'esds-button esds-btn-amber',
      text: '✦ Случайное',
      attr: { type: 'button', title: 'Случайное сочетание палитры и фона' }
    });
    random.addEventListener('click', () => this.randomize());

    const shortcuts = scroll.createDiv({ cls: 'esds-library-shortcuts' });
    const lastPalette = (this.plugin.userData.palettes || []).slice(-1)[0];
    const lastAdded = shortcuts.createEl('button', {
      cls: 'esds-button esds-btn-violet',
      text: lastPalette ? `✦ ${lastPalette.name}` : '＋ Создать палитру',
      attr: { type: 'button', title: lastPalette ? `Последняя палитра: ${lastPalette.name}` : 'Создать новую палитру' }
    });
    lastAdded.addEventListener('click', () => {
      if (lastPalette) this.selectPalette(lastPalette);
      else { this.activeView = 'library'; this.render(); }
    });

    // Unified Favorites entry point
    const favCount = (this.plugin.userData.favorites || []).length + (this.plugin.userData.favoriteItems || []).length;
    const favorites = shortcuts.createEl('button', {
      cls: 'esds-button esds-btn-coral',
      text: `★ Избранное (${favCount})`,
      attr: { type: 'button', title: 'Избранные комбинации и элементы' }
    });
    favorites.addEventListener('click', () => { this.activeView = 'favorites'; this.render(); });

    const recent = shortcuts.createEl('button', {
      cls: 'esds-button esds-btn-cyan',
      text: `◷ Недавние (${(this.plugin.userData.recent || []).length})`,
      attr: { type: 'button', title: 'Недавно применённые оформления' }
    });
    recent.addEventListener('click', () => { this.activeView = 'recent'; this.render(); });

    const library = shortcuts.createEl('button', {
      cls: 'esds-button esds-btn-teal',
      text: '▣ Библиотека',
      attr: { type: 'button', title: 'Моя библиотека палитр, фонов и стилей' }
    });
    library.addEventListener('click', () => { this.activeView = 'library'; this.render(); });

    const palette = this.section(scroll, 'palette', 'Общая палитра', 'Меняет текст, фон и блоки сразу', '◉');
    if (palette.body) this.renderPaletteSection(palette.body);
    const background = this.section(scroll, 'background', 'Фон заметки', 'Можно заменить отдельно, не меняя палитру', '▧');
    if (background.body) this.renderBackgroundSection(background.body);
    const blocksAuto = scroll.createDiv({ cls: 'esds-palette-frame-mode esds-palette-frame-mode-info esds-blocks-auto-note' });
    blocksAuto.createEl('strong', { text: 'Оформление блоков подбирается автоматически вместе с палитрой.' });
    blocksAuto.createEl('small', { text: 'У каждой палитры свои формы рамок, заливки, скругления, отступы и акценты. Отдельно выбирать стиль блоков не требуется.' });
    const fineTune = blocksAuto.createEl('button', { cls: 'esds-button esds-btn-quiet esds-auto-blocks-fine-tune', text: 'Дополнительная настройка этой заметки', attr: { type: 'button' } });
    fineTune.addEventListener('click', () => {
      const file = this.app.workspace.getActiveFile();
      if (!file) { new Notice('Сначала открой заметку.'); return; }
      new NoteBlockStyleModal(this.app, this.plugin, this, file).open();
    });
    const aiInstruction = this.section(scroll, 'ai-instruction', 'Универсальная инструкция для ИИ', 'Одна система оформления для любых языков, предметов и конспектов', '✧');
    if (aiInstruction.body) this.renderAiInstructionSection(aiInstruction.body);
    const reference = this.section(scroll, 'reference', 'Справочник и экспорт для ИИ', 'Классы, типы блоков, переменные и правила создания палитр', '⌘');
    if (reference.body) this.renderReferenceSection(reference.body);

    const actions = root.createDiv({ cls: 'esds-main-footer' });
    const apply = actions.createEl('button', {
      cls: 'esds-button esds-btn-violet esds-main-cta esds-apply-note',
      text: '✓ Применить к заметке',
      attr: { type: 'button' }
    });
    apply.addEventListener('click', async () => {
      if (apply.disabled) return;
      apply.disabled = true;
      const previousText = apply.textContent;
      apply.textContent = 'Применяем…';
      try {
        const applied = await this.applySelected();
        if (applied) {
          apply.textContent = '✓ Применено';
          window.setTimeout(() => {
            if (apply.isConnected) apply.textContent = previousText;
          }, 1400);
        } else {
          apply.textContent = previousText;
        }
      } finally {
        apply.disabled = false;
      }
    });
    const reset = actions.createEl('button', { cls: 'esds-button esds-btn-amber esds-footer-default', text: '↺ Применить по умолчанию', attr: { type: 'button', title: 'Вернуть стандартную палитру и фон и применить их к открытой заметке' } });
    reset.addEventListener('click', async () => {
      if (reset.disabled) return;
      reset.disabled = true;
      const previousText = reset.textContent;
      reset.textContent = 'Возвращаем…';
      try {
        this.resetDraft();
        const applied = await this.applySelected();
        reset.textContent = applied ? '✓ По умолчанию' : previousText;
        if (applied) window.setTimeout(() => { if (reset.isConnected) reset.textContent = previousText; }, 1500);
      } finally { reset.disabled = false; }
    });
    const previewBtn = actions.createEl('button', {
      cls: 'esds-button esds-btn-quiet',
      text: '👁 Предпросмотр',
      attr: { type: 'button', title: 'Открыть предпросмотр выбранного оформления' }
    });
    previewBtn.addEventListener('click', () => this.openPreview());

    const remove = actions.createEl('button', {
      cls: 'esds-button esds-danger esds-btn-outline-coral',
      text: 'Убрать оформление',
      attr: { type: 'button', title: 'Удалить все классы оформления ESDS из текущей заметки' }
    });
    remove.addEventListener('click', async () => {
      if (remove.disabled || this._removeDesignPromise) return;
      const confirmed = window.confirm('Убрать оформление ESDS с текущей заметки?\n\nКлассы палитры, фона и локальные стили блоков будут удалены. Текст заметки сохранится.');
      if (!confirmed) return;
      remove.disabled = true;
      const originalText = remove.textContent;
      remove.textContent = 'Удаляем…';
      try {
        const removed = await this.removeDesign();
        remove.textContent = removed ? '✓ Убрано' : originalText;
        if (removed) window.setTimeout(() => {
          if (remove.isConnected) remove.textContent = originalText;
        }, 1600);
      } finally {
        remove.disabled = false;
      }
    });

    scroll.scrollTop = previousScrollTop;
    this._lastRenderedView = this.activeView;
    this.restoreRenderFocus();
  }
  restoreRenderFocus() {
    // Full re-render moves focus to <body>; give it back to the control the
    // user just interacted with so keyboard navigation stays continuous.
    let target = null;
    if (this._focusSectionId) {
      target = this.contentEl.querySelector(`.esds-section-${this._focusSectionId} .esds-accordion-trigger`);
      this._focusSectionId = null;
    } else if (this._focusLibraryTab) {
      target = this.contentEl.querySelector('.esds-library-catalog-tab.is-active');
      this._focusLibraryTab = false;
    } else if (this._focusAdvancedToggle) {
      target = this.contentEl.querySelector('.esds-advanced-toggle');
      this._focusAdvancedToggle = false;
    }
    if (target && typeof target.focus === 'function') {
      try { target.focus(); } catch (focusError) { /* element may be gone */ }
    }
  }
  renderReferenceSection(parent) {
    parent.createEl('p', { cls: 'esds-section-note', text: 'Короткие коды используются в заметках. Полное назначение каждого кода хранится в справочнике ESDS. Все классы универсальны и не привязаны к конкретному языку или предмету.' });
    const list = parent.createDiv({ cls: 'esds-reference-list' });
    SHORT_SEMANTIC_CLASSES.forEach(([code, name, description]) => {
      const row = list.createDiv({ cls: 'esds-reference-row' });
      row.createEl('code', { text: code });
      row.createSpan({ text: `${name} — ${description}` });
      row.createSpan({ cls: 'esds-reference-status', text: 'CSS поддерживается' });
    });
    const legacy = parent.createDiv({ cls: 'esds-reference-legacy-note' });
    legacy.createEl('small', { text: 'Старые классы esds-* и study-* сохраняют поддержку для совместимости со старыми заметками. Для новых заметок используй st-xx.' });
    const callouts = parent.createDiv({ cls: 'esds-reference-callouts' });
    callouts.createEl('strong', { text: 'Стандартные Callout Obsidian' });
    callouts.createEl('p', { text: CALLOUTS.map(([key, label]) => `${key} — ${label}`).join(' · ') });
    parent.createEl('p', { cls: 'esds-section-note', text: 'Палитра задаёт согласованные цвета и рамки, фон — фон заметки, а стиль блоков автоматически берётся из выбранной палитры. Обычная Markdown-разметка остаётся нетронутой.' });
    const actions = parent.createDiv({ cls: 'esds-profile-tools' });
    const copyAll = actions.createEl('button', { cls: 'esds-button esds-btn-violet', text: 'Скопировать универсальную инструкцию ИИ', attr: { type: 'button' } });
    copyAll.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(buildUniversalAiInstruction()); new Notice('Универсальная инструкция ESDS скопирована.'); }
      catch (error) { console.error(error); new Notice('Не удалось скопировать инструкцию.'); }
    });
    const copyClasses = actions.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Скопировать короткие классы', attr: { type: 'button' } });
    copyClasses.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(SHORT_SEMANTIC_CLASSES.map(([code]) => code).join('\n')); new Notice('Список коротких классов скопирован.'); }
      catch (error) { console.error(error); new Notice('Не удалось скопировать список.'); }
    });
  }

  renderAiInstructionSection(parent) {
    parent.createEl('p', { cls: 'esds-section-note', text: 'Не нужно выбирать английский, арабский, историю, экономику или другой тип материала. ИИ самостоятельно распознаёт содержание и применяет общие семантические классы ESDS.' });
    const summary = parent.createDiv({ cls: 'esds-universal-ai-card' });
    summary.createEl('strong', { text: 'Единый стандарт для любых заметок' });
    summary.createEl('p', { text: 'Markdown для структуры; короткие st-xx классы для смысловых фрагментов; стандартные Callout только для действительно важных блоков. Акценты, таблицы, фон и блоки оформляются активной палитрой.' });
    const copy = parent.createEl('button', { cls: 'esds-button esds-btn-violet', text: '⧉ Скопировать инструкцию для ИИ', attr: { type: 'button' } });
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(buildUniversalAiInstruction()); new Notice('Универсальная инструкция для ИИ скопирована.'); }
      catch (error) { console.error(error); new Notice('Не удалось скопировать инструкцию.'); }
    });
    const preview = parent.createDiv({ cls: 'esds-semantic-preview esds-preview esds-note' });
    this.setPreviewTheme(preview, this.selectedPalette, this.selectedBackground, this.selectedBlocks);
    preview.createEl('h3', { text: 'Пример универсального оформления' });
    preview.createEl('p', { cls: 'st-fo', text: 'Foreign word / مصطلح' });
    preview.createEl('p', { cls: 'st-lt', text: 'Foreign letter(s): ñ · th · sch' });
    preview.createEl('p', { cls: 'st-pr', text: 'Транскрипция или произношение' });
    preview.createEl('p', { cls: 'st-tr', text: 'Перевод или значение' });
    preview.createEl('p', { cls: 'st-te', text: 'Ключевой термин' });
    preview.createEl('p', { cls: 'st-de', text: 'Краткое определение понятия.' });
    preview.createEl('p', { cls: 'st-mi', text: 'Главная мысль материала.' });
    preview.createEl('p', { cls: 'st-nu', text: 'Показатель: 3,5%' });
    this.renderBlockGallery(preview, ['important', 'warning', 'example', 'quote']);
  }

  renderSubView() {
    const root = this.contentEl;
    const scroll = root.createDiv({ cls: 'esds-main-scroll esds-subview-scroll' });
    const header = scroll.createDiv({ cls: 'esds-header esds-subview-header' });
    const back = header.createEl('button', { cls: 'esds-button esds-btn-quiet esds-back-button', attr: { type: 'button', 'aria-label': 'Назад' } });
    back.createSpan({ cls: 'esds-back-arrow', text: '‹' });
    back.createSpan({ cls: 'esds-back-label', text: 'Назад' });
    back.addEventListener('click', () => { this.activeView = 'studio'; this.render(); });
    const heading = header.createDiv({ cls: 'esds-heading-wrap' });
    if (this.activeView === 'favorites' || this.activeView === 'itemFavorites') {
      heading.createEl('h2', { text: 'Избранное' });
      heading.createEl('p', { text: 'Сохранённые сочетания и отдельные элементы.' });

      // Tabs for combinations vs items
      const tabs = scroll.createDiv({ cls: 'esds-fav-tabs' });
      const tabCombos = tabs.createEl('button', {
        cls: `esds-button esds-btn-quiet esds-fav-tab${this.activeView === 'favorites' ? ' is-active' : ''}`,
        text: `Сочетания (${(this.plugin.userData.favorites || []).length})`,
        attr: { type: 'button' }
      });
      const tabItems = tabs.createEl('button', {
        cls: `esds-button esds-btn-quiet esds-fav-tab${this.activeView === 'itemFavorites' ? ' is-active' : ''}`,
        text: `Элементы (${(this.plugin.userData.favoriteItems || []).length})`,
        attr: { type: 'button' }
      });
      tabCombos.addEventListener('click', () => { this.activeView = 'favorites'; this.render(); });
      tabItems.addEventListener('click', () => { this.activeView = 'itemFavorites'; this.render(); });

      if (this.activeView === 'favorites') {
        this.renderComboList(scroll, this.plugin.userData.favorites || [], true);
      } else {
        this.renderFavoriteItems(scroll);
      }
    } else if (this.activeView === 'recent') {
      heading.createEl('h2', { text: 'Недавние' });
      heading.createEl('p', { text: 'Последние применённые оформления.' });
      this.renderComboList(scroll, this.plugin.userData.recent || [], false);
    } else {
      heading.createEl('h2', { text: 'Моя библиотека' });
      heading.createEl('p', { text: 'Твои палитры, фоны и инструменты управления коллекцией.' });
      this.renderLibraryView(scroll);
    }
  }
  isItemFavorite(kind, id) {
    return (this.plugin.userData.favoriteItems || []).some(item => item.kind === kind && item.id === id);
  }
  async toggleItemFavorite(kind, item) {
    if (!Array.isArray(this.plugin.userData.favoriteItems)) this.plugin.userData.favoriteItems = [];
    const list = this.plugin.userData.favoriteItems;
    const index = list.findIndex(entry => entry.kind === kind && entry.id === item.id);
    if (index >= 0) list.splice(index, 1);
    else list.unshift({ kind, id: item.id, name: item.name || item.label || item.id, addedAt: new Date().toISOString() });
    await this.plugin.saveUserLibrary();
    new Notice(index >= 0 ? 'Удалено из избранных элементов.' : 'Добавлено в избранные элементы.');
    this.render();
  }
  renderFavoriteItems(parent) {
    const saved = (this.plugin.userData.favoriteItems || []).filter(entry =>
      entry && ['palette', 'background', 'blockStyle'].includes(entry.kind)
    );
    const groups = [
      { kind: 'palette', title: 'Палитры', itemType: 'Палитра', icon: '◉', resolve: id => this.findPalette(id), open: (item, items) => this.openLibraryItemPreview('palette', item, items) },
      { kind: 'background', title: 'Фоны', itemType: 'Фон заметки', icon: '▧', resolve: id => this.findBackground(id), open: (item, items) => this.openLibraryItemPreview('background', item, items) },
      { kind: 'blockStyle', title: 'Дополнительные стили блоков', itemType: 'Дополнительный стиль блоков', icon: '▤', resolve: id => this.findBlockStyle(id), open: (item, items) => this.openLibraryItemPreview('blockStyle', item, items) }
    ];
    const resolvedGroups = groups.map(group => ({
      ...group,
      items: saved
        .filter(entry => entry.kind === group.kind)
        .map(entry => ({ entry, item: group.resolve(entry.id) }))
        .filter(row => row.item)
    }));
    const total = resolvedGroups.reduce((sum, group) => sum + group.items.length, 0);
    if (!total) {
      const empty = parent.createDiv({ cls: 'esds-empty-panel esds-favorite-empty' });
      empty.createEl('strong', { text: 'Пока нет избранных элементов' });
      empty.createEl('p', { text: 'Нажимай ☆ на карточках палитр, фонов и стилей блоков, чтобы сохранить их здесь.' });
      return;
    }

    // Start folded: the user opens only the category they want to browse.
    resolvedGroups.filter(group => group.items.length).forEach(group => {
      const section = parent.createDiv({ cls: `esds-favorite-group esds-favorite-group-${group.kind}` });
      const expanded = this.favoriteGroupsOpen[group.kind] === true;
      const listId = `esds-favorite-group-list-${group.kind}`;
      const heading = section.createEl('button', {
        cls: 'esds-favorite-group-heading',
        attr: { type: 'button', 'aria-expanded': expanded ? 'true' : 'false', 'aria-controls': listId }
      });
      heading.createSpan({ cls: 'esds-favorite-group-icon', text: group.icon });
      heading.createEl('strong', { text: group.title });
      const groupCount = heading.createSpan({ cls: 'esds-favorite-group-count', text: String(group.items.length) });
      const chevron = heading.createSpan({ cls: 'esds-favorite-group-chevron', text: '›', attr: { 'aria-hidden': 'true' } });
      const list = section.createDiv({ cls: 'esds-user-background-list esds-favorite-items-list', attr: { id: listId } });
      list.hidden = !expanded;
      if (expanded) heading.addClass('is-open');
      heading.addEventListener('click', () => {
        const next = !this.favoriteGroupsOpen[group.kind];
        this.favoriteGroupsOpen[group.kind] = next;
        list.hidden = !next;
        heading.setAttribute('aria-expanded', next ? 'true' : 'false');
        heading.toggleClass('is-open', next);
        chevron.setText('›');
      });

      group.items.forEach(({ entry, item }) => {
        const card = list.createDiv({ cls: 'esds-favorite-card' });
        const head = card.createDiv({ cls: 'esds-favorite-card-head' });
        const info = head.createDiv({ cls: 'esds-favorite-item-info' });
        info.createEl('strong', { text: item.name || item.label || entry.name || 'Элемент' });
        const detail = [group.itemType, item.category || item.group].filter(Boolean).join(' · ');
        info.createEl('small', { text: detail || group.itemType });

        // Actions live on their own full-width row so neither button can be pushed off-screen.
        const actions = card.createDiv({ cls: 'esds-favorite-card-actions' });
        const open = actions.createEl('button', { cls: 'esds-button esds-btn-cyan esds-favorite-open-button', text: 'Открыть', attr: { type: 'button' } });
        open.addEventListener('click', () => group.open(item, group.items.map(row => row.item)));
        const remove = actions.createEl('button', { cls: 'esds-button esds-btn-outline-coral esds-favorite-remove-button', text: 'Убрать', attr: { type: 'button', title: 'Убрать из избранного', 'aria-label': 'Убрать из избранного' } });
        remove.addEventListener('click', async () => {
          this.plugin.userData.favoriteItems = (this.plugin.userData.favoriteItems || []).filter(savedItem => !(savedItem.kind === entry.kind && savedItem.id === entry.id));
          await this.plugin.saveUserLibrary();
          card.remove();
          const remaining = list.querySelectorAll('.esds-favorite-card').length;
          groupCount.setText(String(remaining));
          if (!remaining) section.remove();
          if (!parent.querySelector('.esds-favorite-group')) {
            const empty = parent.createDiv({ cls: 'esds-empty-panel esds-favorite-empty' });
            empty.createEl('strong', { text: 'Пока нет избранных элементов' });
            empty.createEl('p', { text: 'Нажимай ☆ на карточках палитр, фонов и стилей блоков, чтобы сохранить их здесь.' });
          }
        });
        const preview = card.createDiv({ cls: `esds-favorite-card-preview esds-favorite-preview-${group.kind}` });
        this.renderFavoriteItemPreview(preview, group.kind, item);
      });
    });
  }
  renderFavoriteItemPreview(parent, kind, item) {
    const fallbackPalette = PALETTES[0];
    const palette = kind === 'palette' ? item : (this.selectedPalette || fallbackPalette);
    const background = kind === 'palette'
      ? (this.findBackground(item.defaultBackground) || BACKGROUNDS[0])
      : (kind === 'background' ? item : (this.selectedBackground || BACKGROUNDS[0]));
    const block = kind === 'blockStyle'
      ? item
      : (this.findBlockStyle(kind === 'palette' ? item.defaultBlocks : (this.selectedBlocks && this.selectedBlocks.id)) || BUILTIN_BLOCK_STYLES[0]);
    if (kind === 'palette') {
      // Use the same live preview renderer as the palette-selection cards,
      // so Favorites and the palette picker always show an identical sample.
      const sample = parent.createDiv({
        cls: `esds-palette-rich-sample esds-preview esds-inline-theme ${palette.id} esds-palette-${palette.id} ${background.id} esds-frames-from-palette`
      });
      this.setPreviewTheme(sample, palette, background, block);
      this.renderPaletteRichSampleContent(sample);
      return;
    }

    const sample = parent.createDiv({
      cls: `esds-preview esds-inline-theme esds-favorite-item-preview ${palette.id} esds-palette-${palette.id} ${background.id} esds-blocks-${block.id} esds-frames-from-palette`
    });
    this.setPreviewTheme(sample, palette, background, block);
    if (kind === 'blockStyle') sample.removeClass('esds-frames-from-palette');

    if (kind === 'background') {
      this.renderBackgroundSampleNote(sample);
    } else {
      this.renderBlockGallery(sample, item.previewCallouts || ['example', 'important']);
    }
  }
  renderComboThumbnail(parent, combo) {
    const palette = this.findPalette(combo.paletteId) || PALETTES[0];
    const background = this.findBackground(combo.backgroundId) || this.findBackground(palette.defaultBackground) || BACKGROUNDS[0];
    const thumb = parent.createDiv({ cls: `esds-combo-thumb esds-preview ${palette.id} esds-palette-${palette.id} ${background.id} esds-frames-from-palette` });
    const note = thumb.createDiv({ cls: 'esds-combo-thumb-note' });
    note.createEl('strong', { cls: 'esds-combo-thumb-heading', text: 'Термин' });
    note.createEl('span', { cls: 'esds-combo-thumb-en', text: 'Ключевое понятие' });
    note.createEl('small', { cls: 'esds-combo-thumb-ipa', text: 'Произношение / пояснение' });
    const callout = note.createDiv({ cls: 'esds-demo-callout esds-callout-important' });
    callout.createEl('strong', { text: 'Важная мысль' });
    callout.createEl('p', { text: 'Образец оформления из палитры' });
    return thumb;
  }
  renderComboList(parent, combos, allowDelete) {
    if (!combos.length) {
      const empty = parent.createDiv({ cls: 'esds-empty-panel' });
      empty.createEl('strong', { text: allowDelete ? 'Пока нет избранных сочетаний' : 'История пока пуста' });
      empty.createEl('p', { text: allowDelete ? 'Добавляй понравившиеся варианты в избранное из окна предпросмотра.' : 'После применения оформления оно автоматически появится здесь.' });
      return;
    }
    const list = parent.createDiv({ cls: 'esds-combo-list' });
    combos.forEach((combo, index) => {
      const card = list.createDiv({ cls: 'esds-combo-card esds-combo-card-clickable', attr: { role: 'button', tabindex: '0', 'aria-label': `Открыть предпросмотр: ${combo.label || 'Оформление'}` } });
      this.renderComboThumbnail(card, combo);
      const info = card.createDiv({ cls: 'esds-combo-info' });
      info.createEl('strong', { text: combo.label || 'Оформление' });
      const palette = this.findPalette(combo.paletteId) || PALETTES[0];
      const background = this.findBackground(combo.backgroundId);
      info.createEl('small', { text: `${palette.name} · ${background ? (background.label || background.name) : 'Фон'} · рамки палитры` });
      const openPreview = () => this.loadCombo(combo);
      card.addEventListener('click', event => { if (event.target.closest('button')) return; openPreview(); });
      card.addEventListener('keydown', event => {
        if (event.target !== card) return;
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPreview(); }
      });
      if (allowDelete) {
        const actions = card.createDiv({ cls: 'esds-combo-actions' });
        const remove = actions.createEl('button', { cls: 'esds-button esds-btn-outline-coral', text: 'Убрать', attr: { type: 'button' } });
        remove.addEventListener('click', async event => {
          event.stopPropagation();
          this.plugin.userData.favorites.splice(index, 1);
          await this.plugin.saveUserLibrary();
          this.render();
        });
      }
    });
  }
  libraryItems(kind) {
    if (kind === 'palette') return this.plugin.userData.palettes || [];
    if (kind === 'background') return this.plugin.userData.backgrounds || [];
    return (this.plugin.userData.blockStyles || []).map(normalizeBlockStyle);
  }
  libraryCategoryName(kind, item) {
    return kind === 'background' ? (item.group || item.category || 'Мои фоны') : (item.category || (kind === 'palette' ? 'Мои палитры' : 'Мои стили'));
  }
  openLibraryItemPreview(kind, item, visibleItems = null) {
    const items = visibleItems && visibleItems.length ? visibleItems : this.libraryItems(kind);
    const index = Math.max(0, items.findIndex(entry => entry.id === item.id));
    new LibraryItemPreviewModal(this.app, this, kind, items, index).open();
  }
  renderLibraryCatalogCard(parent, kind, item, visibleItems) {
    const palette = kind === 'palette' ? item : this.selectedPalette;
    const background = kind === 'background' ? item : (kind === 'palette' ? (this.findBackground(item.defaultBackground) || this.selectedBackground) : this.selectedBackground);
    const block = kind === 'blockStyle' ? item : this.getPreferredBlockStyle(palette);
    const card = parent.createDiv({ cls: `esds-library-catalog-card esds-library-catalog-${kind}` });
    const heading = card.createDiv({ cls: 'esds-library-catalog-heading' });
    heading.createEl('strong', { text: item.name || item.label || 'Без названия' });
    const category = this.libraryCategoryName(kind, item);
    heading.createEl('small', { text: category });
    const preview = card.createDiv({ cls: `esds-library-catalog-thumb esds-preview ${palette.id} esds-palette-${palette.id} ${background.id || ''} esds-frames-from-palette` });
    this.setPreviewTheme(preview, palette, background, block);
    if (kind === 'palette') this.renderPaletteCardThumbnail(preview);
    else if (kind === 'background') this.renderMiniNote(preview, true);
    else this.renderBlockGallery(preview, item.previewCallouts || ['example', 'important', 'tip']);
    const actions = card.createDiv({ cls: 'esds-library-catalog-actions' });
    const view = actions.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Просмотр и применение', attr: { type: 'button' } });
    view.addEventListener('click', () => this.openLibraryItemPreview(kind, item, visibleItems));
    card.addEventListener('click', event => { if (!event.target.closest('button')) this.openLibraryItemPreview(kind, item, visibleItems); });
  }
  renderLibraryCatalog(parent) {
    const kinds = [
      ['palette', 'Палитры'], ['background', 'Фоны'], ['blockStyle', 'Доп. стили блоков']
    ];
    const tabs = parent.createDiv({ cls: 'esds-library-catalog-tabs' });
    kinds.forEach(([kind, label]) => {
      const count = this.libraryItems(kind).length;
      const button = tabs.createEl('button', { cls: `esds-library-catalog-tab${this.libraryKind === kind ? ' is-active' : ''}`, text: `${label} · ${count}`, attr: { type: 'button', 'aria-pressed': this.libraryKind === kind ? 'true' : 'false' } });
      button.addEventListener('click', () => { this.libraryKind = kind; this.libraryCategory = null; this.librarySearchText = ''; this._focusLibraryTab = true; this.render(); });
    });
    const kind = this.libraryKind;
    const allItems = this.libraryItems(kind);
    const categoryKind = kind === 'palette' ? 'palettes' : kind === 'background' ? 'backgrounds' : 'blockStyles';
    const storedCategories = this.getCategories(categoryKind);
    const activeCategoryNames = new Set(allItems.map(item => this.libraryCategoryName(kind, item)));
    const orderedSystemCategories = storedCategories.map(category => category.name);
    const extraCategories = [...activeCategoryNames].filter(name => !orderedSystemCategories.includes(name)).sort((a,b)=>a.localeCompare(b,'ru'));
    const categories = [...new Set([...orderedSystemCategories, ...extraCategories])];
    const controls = parent.createDiv({ cls: 'esds-library-catalog-controls' });
    const search = controls.createEl('input', { cls: 'esds-text-input', attr: { type: 'search', placeholder: 'Поиск по всей коллекции…' } });
    search.value = this.librarySearchText || '';
    const count = controls.createEl('small', { cls: 'esds-library-catalog-count', text: '' });
    const directory = parent.createDiv({ cls: 'esds-catalog-directory' });
    const grid = parent.createDiv({ cls: 'esds-library-catalog-grid' });
    const render = () => {
      directory.empty(); grid.empty();
      const query = (search.value || '').trim().toLocaleLowerCase();
      this.librarySearchText = search.value;
      const selected = this.libraryCategory;
      if (!query && !selected) {
        const heading = directory.createDiv({ cls: 'esds-catalog-directory-heading' });
        heading.createEl('strong', { text: kind === 'palette' ? 'Категории палитр' : kind === 'background' ? 'Категории фонов' : 'Категории стилей блоков' });
        heading.createEl('small', { text: `${allItems.length} элементов · ${categories.length} категорий` });
        const folderGrid = directory.createDiv({ cls: 'esds-catalog-folder-grid' });
        categories.forEach(name => {
          const meta = storedCategories.find(c => c.name === name) || {};
          const items = allItems.filter(item => this.libraryCategoryName(kind, item) === name);
          const folder = folderGrid.createDiv({ cls: 'esds-catalog-folder', attr: { role: 'button', tabindex: '0', 'aria-label': `Открыть ${name}, ${items.length} элементов` } });
          const visual = folder.createDiv({ cls: 'esds-catalog-folder-visual' });
          let swatches = [];
          if (kind === 'palette') {
            const p = items[0];
            swatches = p && p.roles ? [p.roles.heading, p.roles.term, p.roles.focus, p.roles.translation] : ['var(--interactive-accent)', 'var(--color-purple)', 'var(--color-green)', 'var(--color-orange)'];
          } else if (kind === 'background') {
            swatches = ['var(--background-secondary)', 'var(--background-primary-alt)', 'var(--interactive-accent)', 'var(--background-modifier-border)'];
          } else {
            const b = items[0];
            swatches = [b?.colors?.light?.rule, b?.colors?.light?.important, b?.colors?.light?.tip, 'var(--interactive-accent)'];
          }
          swatches.forEach(color => { const swatch = visual.createSpan({ cls: 'esds-catalog-folder-swatch' }); if (color) { if (typeof color === 'string' && color.startsWith('var(')) swatch.style.background = color; else swatch.style.backgroundColor = colorToHex(color); } });
          const info = folder.createDiv({ cls: 'esds-catalog-folder-info' });
          info.createEl('strong', { text: name });
          info.createEl('small', { text: meta.description || (kind === 'palette' ? 'Набор согласованных цветовых дизайнов.' : kind === 'background' ? 'Фоны для оформления заметок.' : 'Дополнительные варианты оформления блоков.') });
          const footer = folder.createDiv({ cls: 'esds-catalog-folder-footer' });
          footer.createSpan({ text: `${items.length} элементов` }); footer.createSpan({ text: 'Открыть ›' });
          const open = () => { this.libraryCategory = name; render(); };
          folder.addEventListener('click', open);
          folder.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        });
        count.setText(`${categories.length} категорий`);
        return;
      }
      const visible = allItems.filter(item => {
        const name = String(item.name || item.label || '').toLocaleLowerCase();
        const desc = String(item.description || item.mood || '').toLocaleLowerCase();
        const category = this.libraryCategoryName(kind, item);
        const matchesQuery = !query || `${name} ${desc} ${category}`.toLocaleLowerCase().includes(query);
        const matchesCategory = !selected || !!query || category === selected;
        return matchesQuery && matchesCategory;
      });
      const header = grid.createDiv({ cls: 'esds-catalog-results-heading' });
      if (selected && !query) {
        const back = header.createEl('button', { cls: 'esds-button esds-btn-quiet', text: '‹ Все категории', attr: { type: 'button' } });
        back.addEventListener('click', () => { this.libraryCategory = null; render(); });
        header.createEl('strong', { text: selected });
      } else header.createEl('strong', { text: 'Результаты поиска по всей коллекции' });
      header.createEl('small', { text: `${visible.length} элементов` });
      count.setText(`${visible.length} из ${allItems.length}`);
      if (!visible.length) {
        grid.createEl('p', { cls: 'esds-empty esds-library-catalog-empty', text: allItems.length ? (query ? 'По запросу ничего не найдено.' : 'В этой категории пока нет элементов.') : `Пока нет элементов этого типа. Используй импорт ниже.` });
        return;
      }
      let rendered = 0;
      const appendBatch = () => {
        const batch = visible.slice(rendered, rendered + this.catalogPageSize);
        batch.forEach(item => this.renderLibraryCatalogCard(grid, kind, item, visible));
        rendered += batch.length;
        const old = grid.querySelector('.esds-catalog-more'); if (old) old.remove();
        if (rendered < visible.length) {
          const more = grid.createEl('button', { cls: 'esds-button esds-btn-quiet esds-catalog-more', text: `Показать ещё · ${visible.length - rendered}`, attr: { type: 'button' } });
          more.addEventListener('click', appendBatch);
        }
      };
      appendBatch();
    };
    search.addEventListener('input', () => {
      if (this._catalogSearchTimer) window.clearTimeout(this._catalogSearchTimer);
      this._catalogSearchTimer = window.setTimeout(() => { this._catalogSearchTimer = null; render(); }, 250);
    });
    render();
  }
  renderLibraryView(parent) {
    const palettes = this.plugin.userData.palettes || [];
    const backgrounds = this.plugin.userData.backgrounds || [];
    const blockStyles = this.plugin.userData.blockStyles || [];

    const intro = parent.createDiv({ cls: 'esds-subsection esds-library-section esds-library-intro' });
    intro.createEl('h3', { text: 'Личная коллекция оформления' });
    intro.createEl('p', { cls: 'esds-section-note', text: 'Импортированные элементы сохраняются в библиотеке плагина. Открой карточку для большого просмотра, переключения светлой/тёмной версии и листания вариантов.' });
    const catalog = parent.createDiv({ cls: 'esds-subsection esds-library-section esds-library-catalog' });
    catalog.createEl('h3', { text: `Каталог · ${palettes.length + backgrounds.length + blockStyles.length} элементов` });
    this.renderLibraryCatalog(catalog);

    const copySection = parent.createDiv({ cls: 'esds-subsection esds-library-section esds-library-copy-section' });
    copySection.createEl('h3', { text: 'Быстрое копирование' });
    copySection.createEl('p', { cls: 'esds-section-note', text: 'Скопируй классы отдельно или готовый блок свойств для заметки.' });
    const copyActions = copySection.createDiv({ cls: 'esds-library-copy-actions' });
    const copyClasses = copyActions.createEl('button', { cls: 'esds-button esds-btn-violet', text: '⧉ Копировать CSS-классы', attr: { type: 'button' } });
    copyClasses.addEventListener('click', () => this.copyClassNames());
    const copyProperties = copyActions.createEl('button', { cls: 'esds-button esds-btn-cyan', text: '▤ Копировать свойства', attr: { type: 'button' } });
    copyProperties.addEventListener('click', () => this.copyProperties());

    const packSection = parent.createDiv({ cls: 'esds-subsection esds-library-section esds-theme-pack-section' });
    packSection.createEl('h3', { text: 'Полные дизайнерские наборы' });
    packSection.createEl('p', { cls: 'esds-section-note', text: 'Один файл переносит палитру и фон вместе с совместимыми настройками оформления блоков.' });
    const packActions = packSection.createDiv({ cls: 'esds-library-actions esds-library-tool-grid' });
    const importPack = packActions.createEl('button', { cls: 'esds-button esds-btn-cyan', text: '⇧ Импорт дизайнерского набора', attr: { type: 'button' } });
    importPack.addEventListener('click', () => this.pickJson('themePack'));
    const exportPack = packActions.createEl('button', { cls: 'esds-button esds-btn-teal', text: '⇩ Экспорт текущего набора', attr: { type: 'button' } });
    exportPack.addEventListener('click', () => this.exportThemePack());

    const tools = parent.createDiv({ cls: 'esds-subsection esds-library-section' });
    tools.createEl('h3', { text: 'Импорт, экспорт и создание' });
    const actions = tools.createDiv({ cls: 'esds-library-actions esds-library-tool-grid' });
    const createPalette = actions.createEl('button', { cls: 'esds-button esds-btn-violet', text: '+ Создать палитру', attr: { type: 'button' } });
    createPalette.addEventListener('click', () => new PaletteBuilderModal(this.app, this).open());
    const createBackground = actions.createEl('button', { cls: 'esds-button esds-btn-lime', text: '+ Создать фон', attr: { type: 'button' } });
    createBackground.addEventListener('click', () => new BackgroundBuilderModal(this.app, this).open());
    const importPalette = actions.createEl('button', { cls: 'esds-button esds-btn-cyan', text: '⇧ Импорт палитр (можно несколько)', attr: { type: 'button' } });
    importPalette.addEventListener('click', () => this.pickJson('palette'));
    const importBackground = actions.createEl('button', { cls: 'esds-button esds-btn-cyan', text: '⇧ Импорт фона', attr: { type: 'button' } });
    importBackground.addEventListener('click', () => this.pickJson('background'));
    const importBlocks = actions.createEl('button', { cls: 'esds-button esds-btn-cyan', text: '⇧ Импорт стиля блоков', attr: { type: 'button' } });
    importBlocks.addEventListener('click', () => this.pickJson('blockStyle'));
    const exportPalette = actions.createEl('button', { cls: 'esds-button esds-btn-teal', text: '⇩ Экспорт палитры', attr: { type: 'button' } });
    exportPalette.addEventListener('click', () => this.exportItem('palette'));
    const exportBackground = actions.createEl('button', { cls: 'esds-button esds-btn-teal', text: '⇩ Экспорт фона', attr: { type: 'button' } });
    exportBackground.addEventListener('click', () => this.exportItem('background'));
    const exportBlocks = actions.createEl('button', { cls: 'esds-button esds-btn-teal', text: '⇩ Экспорт стиля блоков', attr: { type: 'button' } });
    exportBlocks.addEventListener('click', () => this.exportItem('blockStyle'));
    const exportAll = actions.createEl('button', { cls: 'esds-button esds-btn-teal', text: '⇩ Экспорт всей библиотеки', attr: { type: 'button' } });
    exportAll.addEventListener('click', () => this.plugin.exportLibrary());
    const importAll = actions.createEl('button', { cls: 'esds-button esds-btn-cyan', text: '⇧ Восстановить библиотеку', attr: { type: 'button' } });
    importAll.addEventListener('click', () => this.pickJson('library'));

    const advanced = parent.createDiv({ cls: 'esds-subsection esds-advanced-tools' });
    const toggle = advanced.createEl('button', { cls: 'esds-advanced-toggle', text: `${this.advancedOpen ? '⌄' : '›'} Дополнительно`, attr: { type: 'button', 'aria-expanded': this.advancedOpen ? 'true' : 'false' } });
    toggle.addEventListener('click', () => { this.advancedOpen = !this.advancedOpen; this._focusAdvancedToggle = true; this.render(); });
    if (this.advancedOpen) {
      const details = advanced.createDiv({ cls: 'esds-advanced-content' });
      details.createEl('p', { cls: 'esds-path-note', text: 'Пользовательская библиотека автоматически хранится в data.json этого плагина — в его стандартной папке Obsidian. Архив обновления не содержит data.json и не заменяет личную коллекцию.' });
    }
  }
  paletteSwatches(palette) {
    const darkMode = document.body.classList.contains('theme-dark');
    const roleKeys = [
      ['en', 'Иностранные слова'], ['ipa', 'Произношение / транскрипция'], ['translation', 'Перевод'],
      ['term', 'Термин'], ['focus', 'Акцент'], ['secondary', 'Второй акцент']
    ];
    return roleKeys.map(([key, label]) => ({
      label,
      color: colorToHex((darkMode && palette.dark && palette.dark[key]) || (palette.roles && palette.roles[key]))
    }));
  }
  renderPaletteSection(parent) {
    const frameMode = parent.createDiv({ cls: 'esds-palette-frame-mode esds-palette-frame-mode-info' });
    frameMode.createEl('strong', { text: 'Каждая палитра — законченный дизайн всей заметки.' });
    frameMode.createEl('small', { text: 'Цвета, акценты, таблицы, фон и оформление блоков уже согласованы. Выбирай категорию, затем открывай предпросмотр.' });

    const toolbar = parent.createDiv({ cls: 'esds-block-toolbar' });
    const createBtn = toolbar.createEl('button', { cls: 'esds-button esds-btn-violet', text: '＋ Создать палитру', attr: { type: 'button' } });
    createBtn.addEventListener('click', () => new PaletteBuilderModal(this.app, this).open());
    const zipImportBtn = toolbar.createEl('button', { cls: 'esds-button esds-btn-cyan', text: '⇧ ZIP-коллекция', attr: { type: 'button' } });
    zipImportBtn.addEventListener('click', () => this.pickPaletteZip(this.paletteCategory || null));
    const zipExportBtn = toolbar.createEl('button', { cls: 'esds-button esds-btn-teal', text: '⇩ ZIP экспорт', attr: { type: 'button' } });
    zipExportBtn.addEventListener('click', () => this.exportPaletteCategoryZip(this.paletteCategory || null));
    const catBtn = toolbar.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Категории…', attr: { type: 'button' } });
    catBtn.addEventListener('click', () => this.openCategoryManager('palettes'));
    const search = parent.createEl('input', { cls: 'esds-text-input esds-palette-search', attr: { type: 'search', placeholder: 'Поиск по всем палитрам…' } });
    search.value = this.paletteSearchText || '';
    this.addSortSelect(parent, 'palettes');
    const directory = parent.createDiv({ cls: 'esds-catalog-directory' });
    const results = parent.createDiv({ cls: 'esds-palette-template-list esds-catalog-results' });
    const all = this.sortItems(this.allPalettes(), this.sortModes.palettes);
    const groups = new Map();
    all.forEach(item => {
      const category = item.category || 'Мои палитры';
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(item);
    });
    const categoryMeta = this.getCategories('palettes');
    const ordered = [...categoryMeta.map(c => c.name), ...[...groups.keys()].filter(n => !categoryMeta.some(c => c.name === n)).sort((a,b)=>a.localeCompare(b,'ru'))];
    const renderDirectory = query => {
      directory.empty(); results.empty();
      const hasQuery = !!query;
      const selectedCategory = this.paletteCategory;
      if (!hasQuery && !selectedCategory) {
        const heading = directory.createDiv({ cls: 'esds-catalog-directory-heading' });
        heading.createEl('strong', { text: 'Категории палитр' });
        heading.createEl('small', { text: `${all.length} палитр · ${ordered.length} категорий` });
        const grid = directory.createDiv({ cls: 'esds-catalog-folder-grid' });
        ordered.forEach(name => {
          const meta = categoryMeta.find(c => c.name === name) || {};
          const items = groups.get(name) || [];
          const folder = grid.createDiv({ cls: 'esds-catalog-folder', attr: { role: 'button', tabindex: '0', 'aria-label': `Открыть категорию ${name}, ${items.length} элементов` } });
          const visual = folder.createDiv({ cls: 'esds-catalog-folder-visual' });
          const sample = items[0];
          const swatches = sample && sample.roles ? [sample.roles.heading, sample.roles.term, sample.roles.focus, sample.roles.translation] : ['var(--interactive-accent)', 'var(--color-purple)', 'var(--color-green)', 'var(--color-orange)'];
          swatches.forEach(color => { const swatch = visual.createSpan({ cls: 'esds-catalog-folder-swatch' }); if (color) { if (typeof color === 'string' && color.startsWith('var(')) swatch.style.background = color; else swatch.style.backgroundColor = colorToHex(color); } });
          const info = folder.createDiv({ cls: 'esds-catalog-folder-info' });
          info.createEl('strong', { text: name });
          info.createEl('small', { text: meta.description || 'Палитры с единым визуальным характером.' });
          const footer = folder.createDiv({ cls: 'esds-catalog-folder-footer' });
          footer.createSpan({ text: `${items.length} ${items.length === 1 ? 'палитра' : 'палитр'}` });
          footer.createSpan({ text: 'Открыть ›' });
          const open = () => { this.paletteCategory = name; renderDirectory(''); };
          folder.addEventListener('click', open);
          folder.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        });
        return;
      }
      const matching = all.filter(item => {
        const name = String(item.name || '').toLocaleLowerCase();
        const desc = String(item.description || item.mood || '').toLocaleLowerCase();
        const cat = String(item.category || '').toLocaleLowerCase();
        return (!selectedCategory || !!query || item.category === selectedCategory) && (!query || `${name} ${desc} ${cat}`.includes(query));
      });
      const header = results.createDiv({ cls: 'esds-catalog-results-heading' });
      if (selectedCategory && !query) {
        const back = header.createEl('button', { cls: 'esds-button esds-btn-quiet', text: '‹ Все категории', attr: { type: 'button' } });
        back.addEventListener('click', () => { this.paletteCategory = null; renderDirectory(search.value.trim().toLocaleLowerCase()); });
        header.createEl('strong', { text: selectedCategory });
      } else header.createEl('strong', { text: 'Результаты поиска по всем категориям' });
      header.createEl('small', { text: `${matching.length} элементов` });
      if (!matching.length) { results.createEl('p', { cls: 'esds-empty', text: 'Палитры не найдены.' }); return; }
      const grid = results.createDiv({ cls: 'esds-template-card-list esds-catalog-palette-grid' });
      let rendered = 0;
      const appendBatch = () => {
        const next = matching.slice(rendered, rendered + this.catalogPageSize);
        next.forEach(item => this.renderPaletteCard(grid, item, matching));
        rendered += next.length;
        const old = results.querySelector('.esds-catalog-more'); if (old) old.remove();
        if (rendered < matching.length) {
          const more = results.createEl('button', { cls: 'esds-button esds-btn-quiet esds-catalog-more', text: `Показать ещё · ${matching.length - rendered}`, attr: { type: 'button' } });
          more.addEventListener('click', appendBatch);
        }
      };
      appendBatch();
    };
    const runSearch = () => {
      this.paletteSearchText = search.value;
      renderDirectory(search.value.trim().toLocaleLowerCase());
    };
    search.addEventListener('input', () => {
      if (this._catalogSearchTimer) window.clearTimeout(this._catalogSearchTimer);
      this._catalogSearchTimer = window.setTimeout(() => { this._catalogSearchTimer = null; runSearch(); }, 250);
    });
    renderDirectory(search.value.trim().toLocaleLowerCase());
  }
  renderPaletteCard(parent, p, visibleItems = null) {
    const selected = p.id === this.selectedPalette.id;
    const bg = this.findBackground(p.defaultBackground) || this.selectedBackground || BACKGROUNDS[0];
    const block = this.findBlockStyle(p.defaultBlocks) || BUILTIN_BLOCK_STYLES[0];
    // div not button — Android WebView clips nested content inside <button>
    const card = parent.createDiv({
      cls: `esds-template-card esds-palette-template-card${selected ? ' is-selected' : ''}`,
      attr: { role: 'button', tabindex: '0', 'aria-pressed': selected ? 'true' : 'false', 'aria-label': `${p.name}${selected ? ', выбрана' : ''}` }
    });
    const heading = card.createDiv({ cls: 'esds-template-card-heading' });
    heading.createEl('strong', { text: p.name });
    if (selected) heading.createSpan({ cls: 'esds-template-check is-visible', text: '✓' });
    const tools = heading.createDiv({ cls: 'esds-card-manage-tools' });
    const favorite = tools.createEl('button', { cls: 'esds-icon-btn esds-item-favorite-button', text: this.isItemFavorite('palette', p.id) ? '★' : '☆', attr: { type: 'button', title: this.isItemFavorite('palette', p.id) ? 'Убрать из избранных элементов' : 'В избранные элементы' } });
    favorite.addEventListener('click', event => { event.stopPropagation(); this.toggleItemFavorite('palette', p); });
    if ((this.plugin.userData.palettes || []).some(item => item.id === p.id)) {
      const menu = tools.createEl('button', { cls: 'esds-icon-btn esds-more-btn', text: '⋯', attr: { type: 'button', title: 'Действия с палитрой' } });
      menu.addEventListener('click', (event) => { event.stopPropagation(); this.openPaletteMenu(p, menu); });
    }

    const live = card.createDiv({
      cls: `esds-palette-rich-sample esds-preview esds-inline-theme ${p.id} esds-palette-${p.id} ${bg.id} esds-frames-from-palette`
    });
    this.setPreviewTheme(live, p, bg, block);

    this.renderPaletteCardThumbnail(live);

    const activate = () => {
      const categoryItems = this.allPalettes().filter(item => (item.category || 'Стандартные') === (p.category || 'Стандартные'));
      const previewItems = visibleItems && visibleItems.length ? visibleItems : (categoryItems.length ? categoryItems : this.allPalettes());
      this.openLibraryItemPreview('palette', p, previewItems);
    };
    card.addEventListener('click', event => { if (event.target.closest('button')) return; activate(); });
    card.addEventListener('keydown', (e) => { if (e.target !== card) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
  }
  renderPaletteCardThumbnail(container) {
    // Catalogue cards show a compact sample; the full block/table composition is reserved for the detail modal.
    const sample = container.createDiv({ cls: 'esds-rich-sample esds-palette-thumbnail' });
    sample.createEl('div', { cls: 'esds-rich-title', text: 'Образец оформления' });
    sample.createEl('div', { cls: 'esds-role st-fo', text: 'Иностранный термин' });
    sample.createEl('div', { cls: 'esds-role st-tr', text: 'Перевод или значение' });
    sample.createEl('p', { cls: 'st-te', text: 'Ключевое понятие' });
    this.makeCallout(sample, 'important', 'Важно', 'Главная мысль материала.');
  }
  renderPaletteRichSampleContent(live) {
    const sample = live.createDiv({ cls: 'esds-rich-sample' });
    sample.createEl('div', { cls: 'esds-rich-title', text: 'Образец оформления' });
    sample.createEl('div', { cls: 'esds-role st-fo', text: 'Foreign word · مصطلح · Begriff' });
    sample.createEl('div', { cls: 'esds-role st-pr', text: 'Произношение / транскрипция' });
    sample.createEl('div', { cls: 'esds-role st-tr', text: 'Перевод или значение понятия' });
    const articleSample = sample.createDiv({ cls: 'esds-article-sample' });
    articleSample.createEl('h3', { text: 'Краткий конспект' });
    const termLine = articleSample.createEl('p');
    termLine.createEl('span', { cls: 'st-te', text: 'Термин' });
    termLine.appendText(' — ');
    termLine.createEl('span', { cls: 'st-de', text: 'краткое определение' });
    articleSample.createEl('p', { cls: 'st-mi', text: 'Главная мысль и смысловой акцент.' });
    articleSample.createEl('p', { cls: 'st-nu', text: 'Показатель: 3,5%' });
    articleSample.createEl('blockquote', { text: 'Короткая цитата или важная выдержка из источника.' });
    const table = articleSample.createEl('table', { cls: 'esds-preview-table' });
    const thead = table.createEl('thead').createEl('tr');
    thead.createEl('th', { text: 'Понятие' }); thead.createEl('th', { text: 'Значение' });
    const tbody = table.createEl('tbody');
    const row = tbody.createEl('tr');
    row.createEl('td', { text: 'Пример' }); row.createEl('td', { text: 'Образец данных' });
    articleSample.createEl('hr');
    this.renderBlockGallery(sample, ['rule', 'example', 'important', 'tip', 'warning', 'question']);
  }
  openPaletteMenu(palette, anchorEl) {
    this.openItemMenu(anchorEl, [
      ['✎ Редактировать', '', () => new PaletteBuilderModal(this.app, this, palette).open()],
      ['⧉ Дублировать', '', async () => {
        const copy = clone(palette); copy.id = `user-${slugify(copy.name)}-${Date.now().toString(36).slice(-4)}`; copy.name = `${palette.name} (копия)`; copy.category = palette.category || 'Мои палитры'; copy.createdAt = new Date().toISOString(); copy.updatedAt = copy.createdAt; copy.source = 'user';
        this.plugin.userData.palettes.push(copy); await this.plugin.saveUserLibrary(); this.plugin.refreshGeneratedStyles(); this.render(); new Notice(`Создана копия «${copy.name}».`);
      }],
      ['⇩ Экспорт', '', async () => { const previous = this.selectedPalette; this.selectedPalette = palette; await this.exportItem('palette'); this.selectedPalette = previous; }],
      ['✕ Удалить', 'esds-menu-danger', async () => {
        if (!confirm(`Удалить палитру «${palette.name}»?`)) return;
        this.plugin.userData.palettes = this.plugin.userData.palettes.filter(item => item.id !== palette.id);
        this.plugin.userData.favoriteItems = (this.plugin.userData.favoriteItems || []).filter(item => !(item.kind === 'palette' && item.id === palette.id));
        if (this.selectedPalette.id === palette.id) this.selectPalette(PALETTES[0]); else this.render();
        await this.plugin.saveUserLibrary(); this.plugin.refreshGeneratedStyles(); new Notice('Палитра удалена.');
      }]
    ]);
  }
  openItemMenu(anchorEl, items) {
    const existing = document.querySelector('.esds-style-menu-popover'); if (existing) existing.remove();
    const pop = document.body.createDiv({ cls: 'esds-style-menu-popover' });
    const rect = anchorEl.getBoundingClientRect();
    pop.style.position = 'fixed'; pop.style.top = `${Math.min(rect.bottom + 4, window.innerHeight - 190)}px`;
    pop.style.left = `${Math.max(8, Math.min(rect.left - 90, window.innerWidth - 190))}px`; pop.style.zIndex = '10000';
    items.forEach(([label, cls, action]) => {
      const btn = pop.createEl('button', { cls: `esds-menu-item ${cls || ''}`, text: label, attr: { type: 'button' } });
      btn.addEventListener('click', async () => { pop.remove(); await action(); });
    });
    const close = (event) => { if (!pop.contains(event.target) && event.target !== anchorEl) { pop.remove(); document.removeEventListener('pointerdown', close, true); } };
    setTimeout(() => document.addEventListener('pointerdown', close, true), 0);
  }
  renderBackgroundSection(parent) {
    parent.createEl('p', { cls: 'esds-section-note', text: 'Фон выбирается отдельно, но автоматически сочетается с цветами активной палитры. Сначала выбери папку-категорию, затем открой карточку для просмотра и применения.' });
    const toolbar = parent.createDiv({ cls: 'esds-block-toolbar' });
    const createBtn = toolbar.createEl('button', { cls: 'esds-button esds-btn-lime', text: '＋ Создать фон', attr: { type: 'button' } });
    createBtn.addEventListener('click', () => new BackgroundBuilderModal(this.app, this).open());
    const catBtn = toolbar.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Категории…', attr: { type: 'button' } });
    catBtn.addEventListener('click', () => this.openCategoryManager('backgrounds'));
    if (this.backgroundOverridden && this.selectedPalette && this.selectedPalette.defaultBackground) {
      const resetBg = toolbar.createEl('button', {
        cls: 'esds-button esds-btn-amber',
        text: '↺ Фон палитры',
        attr: { type: 'button', title: 'Вернуть фон, рекомендуемый выбранной палитрой' }
      });
      resetBg.addEventListener('click', () => {
        const bg = this.findBackground(this.selectedPalette.defaultBackground);
        if (bg) {
          this.selectBackground(bg, false);
          this.backgroundOverridden = false;
          this.render();
          new Notice(`Фон возвращён к рекомендуемому: ${bg.label || bg.name || bg.id}`);
        }
      });
    }
    const search = parent.createEl('input', { cls: 'esds-text-input esds-bg-search', attr: { type: 'search', placeholder: 'Поиск по всем фонам…' } });
    search.value = this.searchText || '';
    this.addSortSelect(parent, 'backgrounds');
    const directory = parent.createDiv({ cls: 'esds-catalog-directory' });
    const results = parent.createDiv({ cls: 'esds-background-grid esds-background-template-grid esds-catalog-results' });
    const all = this.sortItems(this.allBackgrounds(), this.sortModes.backgrounds);
    const categories = this.getCategories('backgrounds');
    const groupNames = [...new Set([...categories.map(c => c.name), ...all.map(bg => bg.group || bg.category || 'Мои фоны')])];
    const render = () => {
      directory.empty(); results.empty();
      const query = (search.value || '').trim().toLocaleLowerCase();
      this.searchText = search.value;
      const selected = this.backgroundCategory;
      if (!query && !selected) {
        const heading = directory.createDiv({ cls: 'esds-catalog-directory-heading' });
        heading.createEl('strong', { text: 'Категории фонов' });
        heading.createEl('small', { text: `${all.length} фонов · ${groupNames.length} категорий` });
        const grid = directory.createDiv({ cls: 'esds-catalog-folder-grid' });
        groupNames.forEach(name => {
          const meta = categories.find(c => c.name === name) || {};
          const items = all.filter(bg => (bg.group || bg.category || 'Мои фоны') === name);
          const folder = grid.createDiv({ cls: 'esds-catalog-folder', attr: { role: 'button', tabindex: '0', 'aria-label': `Открыть ${name}, ${items.length} фонов` } });
          const visual = folder.createDiv({ cls: 'esds-catalog-folder-visual esds-catalog-folder-visual-background' });
          ['var(--background-secondary)', 'var(--background-primary-alt)', 'var(--interactive-accent)', 'var(--background-modifier-border)'].forEach(color => {
            const swatch = visual.createSpan({ cls: 'esds-catalog-folder-swatch' }); swatch.style.backgroundColor = color;
          });
          const info = folder.createDiv({ cls: 'esds-catalog-folder-info' });
          info.createEl('strong', { text: name });
          info.createEl('small', { text: meta.description || 'Варианты фона для заметок со светлой и тёмной адаптацией.' });
          const footer = folder.createDiv({ cls: 'esds-catalog-folder-footer' });
          footer.createSpan({ text: `${items.length} фонов` }); footer.createSpan({ text: 'Открыть ›' });
          const open = () => { this.backgroundCategory = name; render(); };
          folder.addEventListener('click', open);
          folder.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        });
        return;
      }
      const filtered = all.filter(bg => {
        const name = String(bg.label || bg.name || '').toLocaleLowerCase();
        const group = bg.group || bg.category || 'Мои фоны';
        return (!selected || !!query || group === selected) && (!query || `${name} ${group}`.toLocaleLowerCase().includes(query));
      });
      const header = results.createDiv({ cls: 'esds-catalog-results-heading' });
      if (selected && !query) {
        const back = header.createEl('button', { cls: 'esds-button esds-btn-quiet', text: '‹ Все категории', attr: { type: 'button' } });
        back.addEventListener('click', () => { this.backgroundCategory = null; render(); });
        header.createEl('strong', { text: selected });
      } else header.createEl('strong', { text: 'Результаты поиска по всем фонам' });
      header.createEl('small', { text: `${filtered.length} элементов` });
      if (!filtered.length) { results.createEl('p', { cls: 'esds-empty', text: 'Фоны не найдены.' }); return; }
      let rendered = 0;
      const appendBatch = () => {
        const batch = filtered.slice(rendered, rendered + this.catalogPageSize);
        batch.forEach(bg => {
          const isSelected = this.selectedBackground.id === bg.id;
          const card = results.createDiv({ cls: `esds-bg-card esds-background-template-card${isSelected ? ' is-selected' : ''}`, attr: { role: 'button', tabindex: '0', 'aria-pressed': isSelected ? 'true' : 'false', 'aria-label': `${bg.label || bg.name}${isSelected ? ', выбран' : ''}` } });
          const thumb = card.createDiv({ cls: `esds-bg-thumb esds-preview esds-background-live-preview ${this.selectedPalette.id} esds-palette-${this.selectedPalette.id} ${bg.id} esds-frames-from-palette` });
          this.setPreviewTheme(thumb, this.selectedPalette, bg, this.selectedBlocks);
          this.renderBackgroundSampleNote(thumb);
          const info = card.createDiv({ cls: 'esds-bg-template-info' });
          info.createEl('span', { text: bg.label || bg.name });
          if (bg.group) info.createEl('small', { text: bg.group });
          if (isSelected) info.createSpan({ cls: 'esds-card-check esds-bg-check', text: '✓', attr: { 'aria-label': 'Выбранный фон' } });
          const favorite = info.createEl('button', { cls: 'esds-icon-btn esds-item-favorite-button', text: this.isItemFavorite('background', bg.id) ? '★' : '☆', attr: { type: 'button', title: this.isItemFavorite('background', bg.id) ? 'Убрать из избранных элементов' : 'В избранные элементы' } });
          favorite.addEventListener('click', event => { event.stopPropagation(); this.toggleItemFavorite('background', bg); });
          if ((this.plugin.userData.backgrounds || []).some(item => item.id === bg.id)) {
            const menu = info.createEl('button', { cls: 'esds-icon-btn esds-more-btn esds-background-manage-menu', text: '⋯', attr: { type: 'button', title: 'Действия с фоном' } });
            menu.addEventListener('click', event => { event.stopPropagation(); this.openBackgroundMenu(bg, menu); });
          }
          const openPreview = () => this.openLibraryItemPreview('background', bg, filtered);
          card.addEventListener('click', event => { if (!event.target.closest('button')) openPreview(); });
          card.addEventListener('keydown', event => { if (event.target !== card) return; if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPreview(); } });
        });
        rendered += batch.length;
        const old = results.querySelector('.esds-catalog-more'); if (old) old.remove();
        if (rendered < filtered.length) {
          const more = results.createEl('button', { cls: 'esds-button esds-btn-quiet esds-catalog-more', text: `Показать ещё · ${filtered.length - rendered}`, attr: { type: 'button' } });
          more.addEventListener('click', appendBatch);
        }
      };
      appendBatch();
    };
    search.addEventListener('input', () => {
      if (this._catalogSearchTimer) window.clearTimeout(this._catalogSearchTimer);
      this._catalogSearchTimer = window.setTimeout(() => { this._catalogSearchTimer = null; render(); }, 250);
    });
    render();
  }
  openBackgroundMenu(background, anchorEl) {
    this.openItemMenu(anchorEl, [
      ['✎ Редактировать', '', () => new BackgroundBuilderModal(this.app, this, background).open()],
      ['⧉ Дублировать', '', async () => {
        const copy = { ...clone(background), id: `bg-custom-${slugify(background.name || background.label)}-${Date.now().toString(36).slice(-4)}`, name: `${background.name || background.label} (копия)`, label: `${background.label || background.name} (копия)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), source: 'user' };
        this.plugin.userData.backgrounds.push(copy); await this.plugin.saveUserLibrary(); this.plugin.refreshGeneratedStyles(); this.render(); new Notice(`Создана копия «${copy.label}».`);
      }],
      ['⇩ Экспорт', '', async () => { const previous = this.selectedBackground; this.selectedBackground = background; await this.exportItem('background'); this.selectedBackground = previous; }],
      ['✕ Удалить', 'esds-menu-danger', async () => {
        if (!confirm(`Удалить фон «${background.label || background.name}»?`)) return;
        this.plugin.userData.backgrounds = this.plugin.userData.backgrounds.filter(item => item.id !== background.id);
        this.plugin.userData.favoriteItems = (this.plugin.userData.favoriteItems || []).filter(item => !(item.kind === 'background' && item.id === background.id));
        if (this.selectedBackground.id === background.id) this.selectBackground(BACKGROUNDS[0]); else this.render();
        await this.plugin.saveUserLibrary(); this.plugin.refreshGeneratedStyles(); new Notice('Фон удалён.');
      }]
    ]);
  }
  renderBackgroundSample(container) {
    const sample = container.createDiv({ cls: 'esds-background-sample' });
    sample.createEl('strong', { cls: 'st-te', text: 'Основное понятие' });
    sample.createEl('span', { cls: 'st-de', text: 'Краткое определение' });
    sample.createEl('span', { cls: 'st-tr', text: 'Перевод или пояснение' });
    const line = sample.createDiv({ cls: 'esds-background-sample-line' });
    line.style.background = 'var(--esds-heading, var(--text-accent))';
  }
  renderBlocksSection(parent) {
    parent.createEl('p', { cls: 'esds-section-note', text: 'Выбери готовый шаблон оформления блоков. Для точной настройки рамок, толщины, прозрачности и цветов открой настройки текущей заметки.' });

    const toolbar = parent.createDiv({ cls: 'esds-block-toolbar esds-note-style-toolbar' });
    const noteStyleBtn = toolbar.createEl('button', { cls: 'esds-button esds-btn-quiet esds-note-style-launch', text: 'Настройки для этой заметки', attr: { type: 'button' } });
    noteStyleBtn.addEventListener('click', () => {
      const file = this.app.workspace.getActiveFile();
      if (!file) { new Notice('Сначала открой заметку, для которой нужно настроить оформление.'); return; }
      new NoteBlockStyleModal(this.app, this.plugin, this, file).open();
    });

    const search = parent.createEl('input', { cls: 'esds-text-input esds-block-style-search', attr: { type: 'search', placeholder: 'Поиск шаблона блоков…' } });
    search.value = this.blockSearchText || '';
    this.addSortSelect(parent, 'blockStyles');

    const allStyles = this.sortItems(this.allBlockStyles(), this.sortModes.blockStyles);
    const categories = this.getCategories('blockStyles');
    const list = parent.createDiv({ cls: 'esds-block-template-list' });
    const byCategory = new Map();
    allStyles.forEach(style => {
      const catName = style.category || 'Мои стили';
      if (!byCategory.has(catName)) byCategory.set(catName, []);
      byCategory.get(catName).push(style);
    });
    const orderedNames = [];
    categories.forEach(category => { if (byCategory.has(category.name)) orderedNames.push(category.name); });
    byCategory.forEach((_, name) => { if (!orderedNames.includes(name)) orderedNames.push(name); });

    orderedNames.forEach(catName => {
      const styles = byCategory.get(catName) || [];
      const group = list.createDiv({ cls: 'esds-block-template-group' });
      const categoryHeading = group.createDiv({ cls: 'esds-block-style-divider' });
      categoryHeading.createSpan({ cls: 'esds-block-style-name', text: catName });
      styles.forEach(block => {
        const itemGroup = group.createDiv({ cls: 'esds-block-style-item' });
        const itemHeading = itemGroup.createDiv({ cls: 'esds-block-style-divider' });
        itemHeading.createSpan({ cls: 'esds-block-style-name', text: block.name });
        const favorite = itemHeading.createEl('button', { cls: 'esds-icon-btn esds-item-favorite-button', text: this.isItemFavorite('blockStyle', block.id) ? '★' : '☆', attr: { type: 'button', title: this.isItemFavorite('blockStyle', block.id) ? 'Убрать из избранного' : 'В избранное' } });
        favorite.addEventListener('click', event => { event.stopPropagation(); this.toggleItemFavorite('blockStyle', block); });
        const isSelected = this.selectedBlocks && this.selectedBlocks.id === block.id;
        const card = itemGroup.createDiv({
          cls: `esds-block-template-card${isSelected ? ' is-selected' : ''}`,
          attr: { role: 'button', tabindex: '0', 'aria-pressed': isSelected ? 'true' : 'false', 'aria-label': `Выбрать шаблон «${block.name}»` }
        });
        if (isSelected) card.createSpan({ cls: 'esds-card-selected-badge', text: '✓' });
        const preview = card.createDiv({
          cls: `esds-block-style-preview esds-preview esds-inline-theme ${this.selectedPalette.id} esds-palette-${this.selectedPalette.id} ${this.selectedBackground.id} esds-blocks-${block.id}`
        });
        this.setPreviewTheme(preview, this.selectedPalette, this.selectedBackground, block);
        this.renderBlockGallery(preview, block.previewCallouts || ['rule', 'example', 'important', 'tip', 'practice', 'success']);
        const activate = () => this.activateBlockStyle(block, true);
        card.addEventListener('click', activate);
        card.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
        });
      });
    });

    const filterCards = () => {
      const query = (search.value || '').trim().toLowerCase();
      this.blockSearchText = search.value;
      let visible = 0;
      list.querySelectorAll('.esds-block-template-card').forEach(card => {
        const show = !query || card.textContent.toLowerCase().includes(query);
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      list.querySelectorAll('.esds-block-style-item').forEach(item => {
        const card = item.querySelector('.esds-block-template-card');
        item.style.display = card && card.style.display !== 'none' ? '' : 'none';
      });
      list.querySelectorAll('.esds-block-template-group').forEach(group => {
        const items = Array.from(group.querySelectorAll(':scope > .esds-block-style-item'));
        group.style.display = items.some(item => item.style.display !== 'none') ? '' : 'none';
      });
      let empty = list.querySelector('.esds-search-empty');
      if (!visible && query) {
        if (!empty) empty = list.createEl('p', { cls: 'esds-empty esds-search-empty', text: 'Шаблоны не найдены.' });
      } else if (empty) empty.remove();
    };
    search.addEventListener('input', filterCards);
    if (search.value) filterCards();
  }

  async reorderBlockStyle(id, direction) {
    const list = this.plugin.userData.blockStyles || [];
    // Work on sorted view within same category
    const style = list.find(s => s.id === id);
    if (!style) return;
    const cat = style.category || 'Мои стили';
    const sameCat = list.filter(s => (s.category || 'Мои стили') === cat).sort((a, b) => (a.order || 0) - (b.order || 0));
    const idx = sameCat.findIndex(s => s.id === id);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= sameCat.length) return;
    const other = sameCat[targetIdx];
    const tmp = style.order != null ? style.order : idx;
    style.order = other.order != null ? other.order : targetIdx;
    other.order = tmp;
    await this.plugin.saveUserLibrary();
    this.render();
  }

  openBlockStyleMenu(block, anchorEl) {
    const existing = document.querySelector('.esds-style-menu-popover');
    if (existing) existing.remove();

    const pop = document.body.createDiv({ cls: 'esds-style-menu-popover' });
    const rect = anchorEl.getBoundingClientRect();
    pop.style.position = 'fixed';
    pop.style.top = `${Math.min(rect.bottom + 4, window.innerHeight - 180)}px`;
    pop.style.left = `${Math.max(8, Math.min(rect.left - 60, window.innerWidth - 190))}px`;
    pop.style.zIndex = '10000';

    const addItem = (text, cls, fn) => {
      const btn = pop.createEl('button', { cls: `esds-menu-item ${cls || ''}`, text, attr: { type: 'button' } });
      btn.addEventListener('click', () => { pop.remove(); fn(); });
    };

    addItem('⧉ Дублировать', '', async () => {
      const copy = normalizeBlockStyle({
        ...clone(block),
        id: undefined,
        name: `${block.name} (копия)`,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        source: 'user',
        order: (block.order || 50) + 1
      });
      this.plugin.userData.blockStyles.push(copy);
      await this.plugin.saveUserLibrary();
      this.plugin.refreshGeneratedStyles();
      this.render();
      new Notice(`Создана копия «${copy.name}».`);
    });
    addItem('⇩ Экспорт', '', async () => {
      const prev = this.selectedBlocks;
      this.selectedBlocks = block;
      await this.exportItem('blockStyle');
      this.selectedBlocks = prev;
    });
    addItem('✕ Удалить', 'esds-menu-danger', async () => {
      if (!confirm(`Удалить стиль «${block.name}»?`)) return;
      this.plugin.userData.blockStyles = (this.plugin.userData.blockStyles || []).filter(s => s.id !== block.id);
      this.plugin.userData.favoriteItems = (this.plugin.userData.favoriteItems || []).filter(item => !(item.kind === 'blockStyle' && item.id === block.id));
      if (this.selectedBlocks && this.selectedBlocks.id === block.id) this.selectedBlocks = BUILTIN_BLOCK_STYLES[0];
      if (this.plugin.userData.activeBlockStyleId === block.id) this.plugin.userData.activeBlockStyleId = this.selectedBlocks.id;
      await this.plugin.saveUserLibrary();
      this.plugin.refreshGeneratedStyles();
      this.render();
      new Notice('Стиль удалён.');
    });

    const close = (ev) => {
      if (!pop.contains(ev.target) && ev.target !== anchorEl) {
        pop.remove();
        document.removeEventListener('pointerdown', close, true);
      }
    };
    setTimeout(() => document.addEventListener('pointerdown', close, true), 0);
  }

  openCategoryManager(kind) {
    new CategoryManagerModal(this.app, this, kind).open();
  }
  selectPalette(p, rerender = true) {
    this.selectedPalette = p;
    this.selectedBackground = this.findBackground(p.defaultBackground) || this.selectedBackground || BACKGROUNDS[0];
    // Always switch block geometry/spacing to this palette's authored default.
    // This prevents a previous palette's block design from leaking into the new one.
    this.selectedBlocks = this.getPreferredBlockStyle(p);
    this.frameSource = 'palette';
    this.backgroundOverridden = false;
    this.activeView = 'studio'; this.activeSection = 'palette'; if (rerender) this.render();
  }
  selectBackground(bg, rerender = true) {
    this.selectedBackground = bg;
    this.backgroundOverridden = bg.id !== this.selectedPalette.defaultBackground;
    this.activeView = 'studio'; this.activeSection = 'background'; if (rerender) this.render();
  }
  openPreview() { new PreviewModal(this.app, this).open(); }
  randomize() {
    const palettes = this.allPalettes(); const p = palettes[Math.floor(Math.random()*palettes.length)];
    this.selectedPalette = p; this.selectedBackground = this.findBackground(p.defaultBackground) || this.selectedBackground || BACKGROUNDS[0];
    this.selectedBlocks = this.getPreferredBlockStyle(p);
    this.frameSource = 'palette'; this.backgroundOverridden = false; this.activeView = 'studio'; this.render();
  }
  resetDraft() {
    this.selectedPalette = PALETTES[0]; this.selectedBackground = this.findBackground(PALETTES[0].defaultBackground) || BACKGROUNDS[0];
    this.selectedBlocks = this.findBlockStyle(PALETTES[0].defaultBlocks) || BUILTIN_BLOCK_STYLES[0];
    this.selectedProfile = CONTENT_PROFILES[0];
    this.frameSource = 'palette';
    this.backgroundOverridden = false; this.activeView = 'studio'; this.render();
  }
  loadCombo(combo) {
    const p = this.findPalette(combo.paletteId) || PALETTES[0]; this.selectedPalette = p;
    this.selectedBackground = this.findBackground(combo.backgroundId) || this.findBackground(p.defaultBackground) || BACKGROUNDS[0];
    this.selectedBlocks = this.findBlockStyle(combo.blocksId) || this.findBlockStyle(p.defaultBlocks) || BUILTIN_BLOCK_STYLES[0];
    this.frameSource = 'palette';
    this.backgroundOverridden = this.selectedBackground.id !== p.defaultBackground; this.activeView = 'studio'; this.render(); this.openPreview();
  }
  setPreviewTheme(container, palette, background, block, modeOverride = null) {
    container.addClass('esds-inline-theme');
    container.addClass('esds-frames-from-palette');
    container.addClass(palette.id);
    container.addClass(`esds-palette-${palette.id}`);
    if (background && background.id) container.addClass(background.id);
    if (block && block.id) container.addClass(`esds-blocks-${block.id}`);
    // The palette chooses its own default block preset automatically. The preset supplies
    // base density/spacing while calloutFrames and palette variables supply the authored theme.
    // No separate block-style choice is required in the normal workflow.
    const darkMode = modeOverride ? modeOverride === 'dark' : document.body.classList.contains('theme-dark');
    if (darkMode) {
      container.addClass('esds-preview-dark-mode');
      container.removeClass('esds-preview-light-mode');
    } else {
      container.removeClass('esds-preview-dark-mode');
      if (modeOverride === 'light') container.addClass('esds-preview-light-mode');
      else container.removeClass('esds-preview-light-mode');
    }
    const roles = darkMode && palette.dark ? palette.dark : palette.roles;
    if (roles) {
      ROLE_KEYS.forEach(key => {
        if (roles[key]) container.style.setProperty(`--esds-${key}`, roles[key]);
      });
    }
    const callouts = darkMode && palette.darkCallouts ? palette.darkCallouts : palette.callouts;
    if (callouts) {
      CALLOUT_KEYS.forEach(key => {
        if (callouts[key]) container.style.setProperty(`--esds-callout-${key}`, rgbValue(callouts[key]));
      });
    }
    const mapPairs = darkMode
      ? [['darkCalloutFills', null, 'fill'], ['darkCalloutTexts', null, 'text'], ['darkCalloutBorders', null, 'border']]
      : [['calloutFills', null, 'fill'], ['calloutTexts', null, 'text'], ['calloutBorders', null, 'border']];
    mapPairs.forEach(([primary, fallback, kind]) => {
      const values = palette[primary] || (fallback ? palette[fallback] : null) || {};
      CALLOUT_KEYS.forEach(key => {
        if (isValidPaletteColor(values[key])) container.style.setProperty(`--esds-callout-${kind}-${key}`, rgbValue(values[key]));
      });
    });
    if (background && background.source === 'user') {
      const bgValue = darkMode ? (background.dark || background.light) : background.light;
      if (bgValue) container.style.setProperty('--note-background', bgValue);
      const fg = darkMode ? background.darkTextColor : background.textColor;
      if (fg) container.style.setProperty('--esds-bg-fg', fg);
    } else if (background) {
      // built-in backgrounds rely on CSS classes; ensure readable text
      container.style.setProperty('--esds-ink', roles && roles.ink ? roles.ink : '');
    }
  }
  renderMiniNote(container, includeCallouts = true) {
    const sample = container.createDiv({ cls: 'esds-sample-note esds-inline-sample-note' });
    sample.createEl('span', { cls: 'esds-kicker', text: 'UNIVERSAL NOTE' });
    sample.createEl('h2', { text: 'Ключевое понятие' });
    const roles = sample.createDiv({ cls: 'esds-inline-role-list' });
    roles.createEl('p', { cls: 'esds-role st-fo', text: 'مصطلح · Foreign term' });
    roles.createEl('p', { cls: 'esds-role st-pr', text: 'Произношение / транскрипция' });
    roles.createEl('p', { cls: 'esds-role st-tr', text: 'Перевод или краткое значение' });
    const grammar = sample.createDiv({ cls: 'esds-preview-grammar' });
    grammar.createEl('strong', { cls: 'st-te', text: 'Ключевой термин или понятие' });
    grammar.createEl('span', { cls: 'st-de', text: 'Краткое пояснение смысла.' });
    if (includeCallouts) this.renderBlockGallery(sample);
  }
  renderBackgroundSampleNote(container) {
    const sample = container.createDiv({ cls: 'esds-background-sample' });
    sample.createEl('strong', { cls: 'st-te', text: 'Основное понятие' });
    sample.createEl('span', { cls: 'st-de', text: 'Краткое определение' });
    sample.createEl('span', { cls: 'st-tr', text: 'Перевод или пояснение' });
    const line = sample.createDiv({ cls: 'esds-background-sample-line' });
    line.style.background = 'var(--esds-heading, var(--text-accent))';
  }
  renderBlockGallery(container, calloutKeys) {
    const grid = container.createDiv({ cls: 'esds-example-grid esds-inline-example-grid esds-block-gallery-large' });
    const allExamples = {
      rule: ['rule', 'Правило', 'Сформулируй основной принцип.'],
      example: ['example', 'Пример', 'Короткий пример применения понятия.'],
      important: ['important', 'Важно', 'Главная мысль, которую стоит запомнить.'],
      tip: ['tip', 'Совет', 'Практическая рекомендация по теме.'],
      practice: ['practice', 'Практика', 'Примени изученный принцип.'],
      success: ['success', 'Результат', 'Ожидаемый или достигнутый результат.'],
      warning: ['warning', 'Предупреждение', 'Обрати внимание на ограничение или риск.'],
      question: ['question', 'Вопрос', 'Вопрос для проверки понимания.'],
      info: ['info', 'Информация', 'Дополнительная справочная информация.'],
      note: ['note', 'Заметка', 'Полезное дополнительное замечание.'],
      quote: ['quote', 'Цитата', 'Краткая выдержка из источника.'],
      abstract: ['abstract', 'Кратко', 'Сжатое изложение основной мысли.']
    };
    const keys = Array.isArray(calloutKeys) && calloutKeys.length
      ? calloutKeys
      : ['rule', 'example', 'important', 'tip', 'practice', 'success'];
    keys.forEach(key => {
      const example = allExamples[key] || [key, key, '…'];
      this.makeCallout(grid, example[0], example[1], example[2]);
    });
  }
  renderPreview(container) {
    this.setPreviewTheme(container, this.selectedPalette, this.selectedBackground, this.selectedBlocks);
    this.renderMiniNote(container, true);
  }
  makeCallout(parent, type, title, body) {
    const box = parent.createDiv({ cls: `esds-demo-callout esds-callout-${type}` });
    box.createEl('strong', { text: title });
    box.createEl('p', { text: body });
  }
  getSelectedClasses() {
    return ['esds-note', `esds-palette-${this.selectedPalette.id}`, this.selectedBackground.id, `esds-blocks-${this.selectedBlocks.id}`, 'esds-frames-from-palette'];
  }
  isOwnedClass(name) {
    return name === 'esds-note' || name === NEUTRAL_CALLOUTS_CLASS || name.startsWith('esds-palette-') || name.startsWith('esds-blocks-') || name.startsWith('esds-profile-') || name === 'esds-frames-from-palette' ||
      BUILTIN_BG_IDS.has(name) || (this.plugin.userData.backgrounds || []).some(bg => bg.id === name);
  }
  async applySelected() {
    const file = this.app.workspace.getActiveFile();
    if (!file) { new Notice('Сначала открой заметку.'); return false; }
    try {
      const selected = this.getSelectedClasses();
      await this.app.fileManager.processFrontMatter(file, fm => {
        const currentClasses = normalizeClasses(fm.cssclasses);
        const retained = currentClasses.filter(name => !this.isOwnedClass(name));
        fm.cssclasses = [...new Set([...retained, ...selected])];
      });
      this.plugin.setCalloutStylesDisabledForFile(file, false);
      this.plugin.userData.activeBlockStyleId = this.selectedBlocks.id;
      this.plugin.userData.frameSource = 'palette';
      this.frameSource = 'palette';
      await this.plugin.saveUserLibrary();
      await this.recordRecent();
      new Notice('Палитра применена: ' + this.selectedPalette.name + '. Геометрия рамок взята из палитры.');
      return true;
    } catch (error) {
      console.error('English Study Design Studio:', error);
      new Notice('Не удалось изменить cssclasses. Проверь доступ к заметке.');
      return false;
    }
  }

  async recordRecent() {
    const combo = this.currentCombo();
    this.plugin.userData.recent = [combo, ...this.plugin.userData.recent.filter(x => x.key !== combo.key)].slice(0, 10);
    await this.plugin.saveUserLibrary();
  }
  currentCombo() {
    const bgName = this.selectedBackground.label || this.selectedBackground.name;
    return { key: `${this.selectedPalette.id}|${this.selectedBackground.id}|${this.selectedBlocks.id}|palette`, label: `${this.selectedPalette.name} · ${bgName}`, paletteId: this.selectedPalette.id, backgroundId: this.selectedBackground.id, blocksId: this.selectedBlocks.id, frameSource: 'palette' };
  }
  isFavorite() {
    const combo = this.currentCombo();
    return (this.plugin.userData.favorites || []).some(item => item.key === combo.key);
  }
  async addFavorite() {
    const combo = this.currentCombo();
    if (this.isFavorite()) return false;
    this.plugin.userData.favorites.unshift(combo);
    await this.plugin.saveUserLibrary();
    new Notice('Сочетание добавлено в избранное.');
    return true;
  }
  async copyClassNames() {
    const text = this.getSelectedClasses().join(' ');
    try { await navigator.clipboard.writeText(text); new Notice('CSS-классы скопированы.'); }
    catch (error) { console.error(error); new Notice('Не удалось открыть буфер обмена. Используй «Применить».'); }
  }
  async copyProperties() {
    const text = `cssclasses:\n${this.getSelectedClasses().map(item => `  - ${item}`).join('\n')}`;
    try { await navigator.clipboard.writeText(text); new Notice('Блок свойств скопирован.'); }
    catch (error) { console.error(error); new Notice('Не удалось открыть буфер обмена. Используй «Применить».'); }
  }
  async removeDesign() {
    // A single vault.process call updates Properties and the Markdown body
    // together. Promise.resolve().then() assigns the lock before work begins,
    // preventing fast repeated taps from opening a second operation.
    if (this._removeDesignPromise) return this._removeDesignPromise;
    const file = this.app.workspace.getActiveFile();
    if (!file) { new Notice('Сначала открой заметку.'); return false; }

    const operation = Promise.resolve().then(async () => {
      try {
        // Disable Callout styling on the live view before touching the file.
        // This closes the window in which stale cssclasses can keep ESDS fill visible.
        this.plugin.setCalloutStylesDisabledForFile(file, true);
        await this.app.vault.process(file, content => {
          const withoutEsdsFrontmatter = stripEsdsClassesFromFrontmatter(
            content,
            name => this.isOwnedClass(name)
          );
          const markerPattern = new RegExp('<!--\\s*' + NOTE_STYLE_MARKER + ':[\\s\\S]*?-->\\s*\\r?\\n?');
          const withoutMarker = withoutEsdsFrontmatter.replace(markerPattern, '');
          // Callout syntax, Markdown structure, HTML wrappers and text remain;
          // only ESDS/study classes are removed (fenced code blocks are guarded).
          return stripEsdsClassesFromNoteContent(withoutMarker);
        });

        // The file now has neither the local-style marker nor its ESDS classes.
        // Drop the cached local CSS directly; do not reread stale metadata.
        this.plugin.noteStyleCache?.delete(file.path);
        this.plugin.updateNoteStyleCss();
        this.plugin.setCalloutStylesDisabledForFile(file, true);

        // Obsidian may leave cssclasses-derived tokens (especially esds-note)
        // on the live Markdown view after the file has changed. Since the
        // plugin's Callout rules are scoped through that root class, remove
        // only ESDS-owned tokens from views displaying this exact file.
        const isOwned = name => this.isOwnedClass(name);
        stripEsdsClassesFromOpenViews(this.app, file, isOwned);

        // A metadata-driven rerender can occur just after vault.process().
        // Repeat the narrowly-scoped DOM cleanup once to catch that late pass.
        window.setTimeout(() => {
          try { stripEsdsClassesFromOpenViews(this.app, file, isOwned); }
          catch (error) { console.warn('ESDS: delayed view cleanup skipped.', error); }
        }, 180);

        new Notice('Оформление ESDS удалено. Свойства заметки сохранены, Callout-блоки используют оформление темы Obsidian.');
        return true;
      } catch (error) {
        console.error('English Study Design Studio: remove formatting failed', error);
        new Notice('Не удалось полностью удалить оформление. Свойства заметки не удалены; проверь консоль Obsidian.');
        return false;
      }
    });

    this._removeDesignPromise = operation;
    try {
      return await operation;
    } finally {
      if (this._removeDesignPromise === operation) this._removeDesignPromise = null;
    }
  }


  async choosePaletteCategory(options = {}) {
    const supplied = (options.categories || this.getCategories('palettes') || []).slice();
    const categoryMap = new Map();
    supplied.forEach(item => { if (item && item.name) categoryMap.set(item.name.toLocaleLowerCase(), item); });
    this.allPalettes().forEach(item => {
      const name = String(item.category || 'Мои палитры').trim();
      if (name && !categoryMap.has(name.toLocaleLowerCase())) categoryMap.set(name.toLocaleLowerCase(), { name });
    });
    const categories = [...categoryMap.values()];
    const counts = new Map();
    this.allPalettes().forEach(item => { const name = String(item.category || 'Мои палитры'); counts.set(name, (counts.get(name) || 0) + 1); });
    const suggested = String(options.suggestedName || '').trim();
    const match = categories.find(item => item.name.toLocaleLowerCase() === suggested.toLocaleLowerCase());
    return await new Promise(resolve => {
      let result = null, completed = false;
      const modal = new class extends Modal {
        constructor(app) { super(app); this.mode = match ? 'existing' : 'new'; this.selected = match ? match.name : ''; this.newName = suggested; }
        finish(value) { if (completed) return; completed = true; result = value; this.close(); }
        onOpen() { this.modalEl.addClass('esds-category-picker-modal'); this.contentEl.addClass('esds-category-picker'); this.renderPicker(); }
        onClose() { this.contentEl.empty(); resolve(result); }
        renderPicker() {
          const root = this.contentEl; root.empty();
          const head = root.createDiv({ cls: 'esds-category-picker-header' });
          head.createEl('h2', { text: options.title || 'Выберите категорию' });
          head.createEl('p', { text: options.description || 'Выберите существующую категорию или создайте новую.' });
          if (options.summary) { const summary = root.createDiv({ cls: 'esds-category-picker-summary' }); summary.textContent = options.summary; }
          const modes = root.createDiv({ cls: 'esds-category-picker-modes' });
          const existingBtn = modes.createEl('button', { cls: 'esds-button esds-btn-quiet' + (this.mode === 'existing' ? ' is-active' : ''), text: 'Существующая категория', attr: { type: 'button' } });
          const newBtn = modes.createEl('button', { cls: 'esds-button esds-btn-quiet' + (this.mode === 'new' ? ' is-active' : ''), text: 'Новая категория', attr: { type: 'button' } });
          existingBtn.addEventListener('click', () => { this.mode = 'existing'; if (!this.selected && categories.length) this.selected = categories[0].name; this.renderPicker(); });
          newBtn.addEventListener('click', () => { this.mode = 'new'; this.renderPicker(); });
          if (this.mode === 'existing') {
            const list = root.createDiv({ cls: 'esds-category-picker-list' });
            if (!categories.length) list.createDiv({ cls: 'esds-category-picker-empty', text: 'Нет существующих категорий. Создайте новую.' });
            categories.forEach(category => {
              const selected = this.selected === category.name;
              const row = list.createEl('button', { cls: 'esds-category-picker-row' + (selected ? ' is-selected' : ''), attr: { type: 'button', 'aria-pressed': selected ? 'true' : 'false' } });
              row.createSpan({ cls: 'esds-category-picker-icon', text: '▰' });
              const labels = row.createDiv({ cls: 'esds-category-picker-labels' });
              labels.createEl('strong', { text: category.name });
              labels.createEl('small', { text: (counts.get(category.name) || 0) + ' палитр' });
              row.createSpan({ cls: 'esds-category-picker-check', text: selected ? '✓' : '' });
              row.addEventListener('click', () => { this.selected = category.name; this.renderPicker(); });
            });
          } else {
            const field = root.createDiv({ cls: 'esds-category-picker-new' });
            field.createEl('label', { text: 'Название новой категории' });
            const input = field.createEl('input', { cls: 'esds-text-input', attr: { type: 'text', maxlength: '100', placeholder: 'Введите название категории' } });
            input.value = this.newName || '';
            input.addEventListener('input', () => { this.newName = input.value; confirm.disabled = !String(this.newName || '').trim(); });
            field.createEl('small', { text: 'Название автоматически взято из файла. Его можно изменить.' });
            input.focus();
          }
          const actions = root.createDiv({ cls: 'esds-category-picker-actions' });
          const cancel = actions.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Отмена', attr: { type: 'button' } });
          cancel.addEventListener('click', () => this.finish(null));
          const confirm = actions.createEl('button', { cls: 'esds-button esds-primary esds-btn-teal', text: this.mode === 'existing' ? 'Выбрать категорию' : 'Создать категорию', attr: { type: 'button' } });
          confirm.disabled = this.mode === 'existing' ? !this.selected : !String(this.newName || '').trim();
          confirm.addEventListener('click', () => {
            if (this.mode === 'existing') { this.finish({ mode: 'existing', name: this.selected }); return; }
            const name = String(this.newName || '').trim().slice(0, 100);
            if (!name) return;
            const duplicate = categories.find(item => item.name.toLocaleLowerCase() === name.toLocaleLowerCase());
            if (duplicate) {
              this.mode = 'existing'; this.selected = duplicate.name;
              new Notice('Такая категория уже существует. Выберите её или измените название новой категории.');
              this.renderPicker(); return;
            }
            this.finish({ mode: 'new', name });
          });
        }
      }(this.app);
      modal.open();
    });
  }
  async ensurePaletteCategory(name) {
    const clean = String(name || '').trim().slice(0, 100);
    if (!clean) throw new Error('Не задано название категории.');
    this.plugin.userData.categories = this.plugin.userData.categories || {};
    const categories = this.plugin.userData.categories.palettes || [];
    const existing = categories.find(item => String(item.name || '').toLocaleLowerCase() === clean.toLocaleLowerCase());
    if (existing) return existing.name;
    const baseId = slugify(clean) || 'palette-category';
    let id = baseId, suffix = 2;
    while (categories.some(item => item.id === id)) id = baseId + '-' + suffix++;
    this.plugin.userData.categories.palettes = [...categories, { id, name: clean, order: categories.length + 10, protected: false }];
    const saved = await this.plugin.saveUserLibrary();
    if (saved === false) throw new Error('Не удалось сохранить категорию палитр.');
    return clean;
  }
  async readPaletteZipEntries(buffer) {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    let eocd = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
      if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('ZIP-архив не распознан: отсутствует каталог ZIP.');
    const count = view.getUint16(eocd + 10, true);
    const directoryOffset = view.getUint32(eocd + 16, true);
    const entries = [];
    let offset = directoryOffset;
    for (let n = 0; n < count; n++) {
      if (view.getUint32(offset, true) !== 0x02014b50) throw new Error('Повреждён центральный каталог ZIP.');
      const method = view.getUint16(offset + 10, true);
      const compressedSize = view.getUint32(offset + 20, true);
      const uncompressedSize = view.getUint32(offset + 24, true);
      const nameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const localOffset = view.getUint32(offset + 42, true);
      const name = new TextDecoder().decode(bytes.slice(offset + 46, offset + 46 + nameLength));
      offset += 46 + nameLength + extraLength + commentLength;
      if (!name.toLowerCase().endsWith('.json') || name.endsWith('/')) continue;
      if (view.getUint32(localOffset, true) !== 0x04034b50) continue;
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(dataStart, dataStart + compressedSize);
      let data;
      if (method === 0) data = compressed;
      else if (method === 8) {
        if (typeof DecompressionStream === 'undefined') throw new Error('На этом WebView нет ZIP-дефлятора. Обнови Android System WebView и повтори импорт.');
        let stream;
        try { stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw')); }
        catch (error) { throw new Error('WebView не поддерживает распаковку DEFLATE в ZIP.'); }
        data = new Uint8Array(await new Response(stream).arrayBuffer());
      } else continue;
      if (uncompressedSize && data.length !== uncompressedSize) throw new Error(`Размер JSON ${name} после распаковки не совпал.`);
      entries.push({ name, text: new TextDecoder().decode(data) });
    }
    return entries;
  }

  async pickPaletteZip(defaultCategory = null) {
    const input = this.contentEl.createEl('input', { attr: { type: 'file', accept: '.zip,application/zip' } });
    input.style.display = 'none';
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      if (!file) { input.remove(); return; }
      try {
        const fileBase = String(file.name || '').replace(/\.zip$/i, '').trim() || 'Импортированная коллекция';
        const entries = await this.readPaletteZipEntries(await file.arrayBuffer());
        const candidates = [], errors = [];
        let manifestName = '';
        for (const entry of entries) {
          try {
            const parsed = JSON.parse(entry.text);
            if (entry.name.split('/').pop().toLowerCase() === 'collection-manifest.json') {
              if (parsed && parsed.type === 'esds-palette-collection' && typeof parsed.name === 'string') manifestName = parsed.name.trim();
              continue;
            }
            const raw = parsed && parsed.palette ? parsed.palette : parsed;
            if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('в файле отсутствует объект палитры');
            if (!raw.name) throw new Error('у палитры отсутствует название');
            if (!raw.roles || typeof raw.roles !== 'object' || !ROLE_KEYS.every(key => isHexColor(raw.roles[key]))) throw new Error('неполные или неверные цветовые роли палитры ESDS');
            const schema = Number(parsed.schemaVersion || 1);
            if (!Number.isInteger(schema) || schema < 1 || schema > 4) throw new Error('версия палитры не поддерживается');
            candidates.push({ data: parsed, palette: raw });
          } catch (error) { errors.push(entry.name + ': ' + (error.message || 'ошибка JSON')); }
        }
        if (!candidates.length) throw new Error('В ZIP не найдено корректных JSON-палитр ESDS.');
        const choice = await this.choosePaletteCategory({
          title: 'Импорт ZIP-коллекции',
          description: 'Выберите, куда добавить палитры из архива.',
          summary: 'Найдено палитр: ' + candidates.length + (errors.length ? ' · ошибок JSON: ' + errors.length : ''),
          suggestedName: manifestName || fileBase || defaultCategory || '',
          categories: this.getCategories('palettes')
        });
        if (!choice) return;
        const existing = this.allPalettes();
        const ids = new Set(existing.map(item => String(item.id || '').toLowerCase()));
        const names = new Set(existing.map(item => String(item.name || '').trim().toLowerCase()));
        const unique = []; let skipped = 0;
        candidates.forEach(item => {
          const id = String(item.palette.id || '').toLowerCase(), name = String(item.palette.name || '').trim().toLowerCase();
          if ((id && ids.has(id)) || (name && names.has(name))) { skipped++; return; }
          if (id) ids.add(id); if (name) names.add(name); unique.push(item);
        });
        if (!unique.length) { new Notice('Все ' + skipped + ' палитр уже есть в библиотеке.'); return; }
        if (!confirm('Добавить ' + unique.length + ' палитр в категорию «' + choice.name + '»? Дубликаты будут пропущены (' + skipped + ').')) return;
        const before = clone(this.plugin.userData);
        try {
          const destination = await this.ensurePaletteCategory(choice.name);
          for (const item of unique) {
            const payload = clone(item.data), palette = payload.palette || payload;
            palette.category = destination; payload.palette = palette;
            await this.importJson('palette', payload);
          }
          new Notice('ZIP импортирован: добавлено ' + unique.length + ', дубликатов пропущено ' + skipped + ', ошибок JSON ' + errors.length + '.');
          if (errors.length) console.warn('ESDS ZIP import: invalid JSON entries', errors);
          this.paletteCategory = destination; this.activeView = 'studio'; this.activeSection = 'palette'; this.render();
        } catch (error) {
          this.plugin.userData = before; await this.plugin.saveUserLibrary(); this.plugin.refreshGeneratedStyles(); throw error;
        }
      } catch (error) {
        console.error('ESDS ZIP import failed:', error);
        new Notice('ZIP импорт не выполнен: ' + (error.message || 'неизвестная ошибка'));
      } finally { input.remove(); }
    });
    input.click();
  }
  async exportPaletteCategoryZip(categoryName = null) {
    const all = this.allPalettes();
    if (!all.length) { new Notice('В библиотеке пока нет пользовательских палитр для экспорта.'); return; }
    const selectedIds = await new Promise(resolve => {
      let completed = false;
      const selected = new Set(all
        .filter(item => !categoryName || (item.category || 'Мои палитры') === categoryName)
        .map(item => item.id));
      const modal = new class extends Modal {
        constructor(app) { super(app); }
        finish(value) { if (completed) return; completed = true; this.close(); resolve(value); }
        onOpen() { this.modalEl.addClass('esds-zip-export-modal'); this.contentEl.addClass('esds-zip-export-content'); this.renderPicker(); }
        onClose() { this.contentEl.empty(); if (!completed) { completed = true; resolve(null); } }
        renderPicker() {
          const root = this.contentEl; root.empty();
          root.createEl('h2', { text: 'Экспорт палитр в ZIP' });
          root.createEl('p', { text: 'Отметь отдельные палитры или нажми «Выбрать всё». Все отмеченные палитры попадут в один ZIP-файл.' });
          const toolbar = root.createDiv({ cls: 'esds-zip-export-toolbar' });
          const count = toolbar.createEl('span', { cls: 'esds-zip-export-count' });
          const updateCount = () => { count.textContent = 'Выбрано: ' + selected.size + ' из ' + all.length; };
          const selectAll = toolbar.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Выбрать всё', attr: { type: 'button' } });
          selectAll.addEventListener('click', () => { all.forEach(item => selected.add(item.id)); this.renderPicker(); });
          const clear = toolbar.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Снять выбор', attr: { type: 'button' } });
          clear.addEventListener('click', () => { selected.clear(); this.renderPicker(); });
          updateCount();
          const list = root.createDiv({ cls: 'esds-zip-export-list' });
          const groups = new Map();
          all.forEach(item => {
            const category = item.category || 'Мои палитры';
            if (!groups.has(category)) groups.set(category, []);
            groups.get(category).push(item);
          });
          [...groups.entries()].forEach(([category, items]) => {
            const section = list.createDiv({ cls: 'esds-zip-export-group' });
            section.createEl('strong', { text: category });
            items.forEach(item => {
              const row = section.createEl('label', { cls: 'esds-zip-export-row' + (selected.has(item.id) ? ' is-selected' : '') });
              const checkbox = row.createEl('input', { attr: { type: 'checkbox' } });
              checkbox.checked = selected.has(item.id);
              const label = row.createSpan({ cls: 'esds-zip-export-label', text: item.name || item.id });
              checkbox.addEventListener('change', () => { if (checkbox.checked) selected.add(item.id); else selected.delete(item.id); row.classList.toggle('is-selected', checkbox.checked); updateCount(); });
            });
          });
          const actions = root.createDiv({ cls: 'esds-zip-export-actions' });
          const cancel = actions.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Отмена', attr: { type: 'button' } });
          cancel.addEventListener('click', () => this.finish(null));
          const exportBtn = actions.createEl('button', { cls: 'esds-button esds-primary esds-btn-teal', text: 'Экспортировать выбранные', attr: { type: 'button' } });
          exportBtn.disabled = selected.size === 0;
          exportBtn.addEventListener('click', () => this.finish([...selected]));
        }
      }(this.app);
      modal.open();
    });
    if (!selectedIds || !selectedIds.length) return;
    const selectedSet = new Set(selectedIds);
    const items = all.filter(item => selectedSet.has(item.id));
    if (!items.length) { new Notice('Не выбраны палитры для экспорта.'); return; }
    const categories = [...new Set(items.map(item => item.category || 'Мои палитры'))];
    const encoder = new TextEncoder();
    const files = items.map((item, index) => ({
      name: `${String(index + 1).padStart(3, '0')}-${slugify(item.category || 'palette')}-${slugify(item.name || 'palette')}.json`,
      data: encoder.encode(JSON.stringify({ schemaVersion: 4, type: 'esds-palette', palette: item }, null, 2))
    }));
    files.push({ name: 'collection-manifest.json', data: encoder.encode(JSON.stringify({
      type: 'esds-palette-collection', name: categories.length === 1 ? categories[0] : 'Выбранные палитры',
      categories, exportedAt: new Date().toISOString(), paletteCount: items.length
    }, null, 2)) });
    const crc32 = data => {
      let crc = -1;
      for (const byte of data) { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); }
      return (crc ^ -1) >>> 0;
    };
    const chunks = [], central = []; let offset = 0;
    const push16 = (arr, value) => { arr.push(value & 255, (value >>> 8) & 255); };
    const push32 = (arr, value) => { arr.push(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255); };
    for (const file of files) {
      const name = encoder.encode(file.name), data = file.data, crc = crc32(data);
      const local = []; push32(local, 0x04034b50); push16(local, 20); push16(local, 0); push16(local, 0); push16(local, 0); push16(local, 0); push32(local, crc); push32(local, data.length); push32(local, data.length); push16(local, name.length); push16(local, 0);
      chunks.push(new Uint8Array([...local, ...name, ...data]));
      const c = []; push32(c, 0x02014b50); push16(c, 20); push16(c, 20); push16(c, 0); push16(c, 0); push16(c, 0); push16(c, 0); push32(c, crc); push32(c, data.length); push32(c, data.length); push16(c, name.length); push16(c, 0); push16(c, 0); push16(c, 0); push16(c, 0); push32(c, 0); push32(c, offset);
      central.push(new Uint8Array([...c, ...name])); offset += local.length + name.length + data.length;
    }
    const centralLength = central.reduce((sum, chunk) => sum + chunk.length, 0);
    const end = []; push32(end, 0x06054b50); push16(end, 0); push16(end, 0); push16(end, files.length); push16(end, files.length); push32(end, centralLength); push32(end, offset); push16(end, 0);
    const archive = new Uint8Array(offset + centralLength + end.length); let cursor = 0;
    for (const chunk of [...chunks, ...central, new Uint8Array(end)]) { archive.set(chunk, cursor); cursor += chunk.length; }
    const adapter = this.app.vault.adapter, folder = 'ESDS Exports';
    if (!(await adapter.exists(folder))) await adapter.mkdir(folder);
    const fileName = `palettes-${items.length}-${Date.now()}.zip`;
    const path = `${folder}/${fileName}`;
    await adapter.writeBinary(path, archive.buffer);
    new Notice(`ZIP сохранён: ${path} · палитр: ${items.length}`);
  }
  pickJson(kind) {
    const input = this.contentEl.createEl('input', { attr: { type: 'file', accept: '.json,.esds-theme.json,application/json', ...(kind === 'palette' ? { multiple: 'multiple' } : {}) } });
    input.style.display = 'none';
    input.addEventListener('change', async () => {
      const files = input.files ? Array.from(input.files) : [];
      if (!files.length) { input.remove(); return; }
      try {
        if (kind === 'palette') {
          const parsedItems = [], errors = [];
          for (const file of files) {
            try {
              const data = JSON.parse(await file.text());
              const palette = data && data.palette ? data.palette : data;
              if (!palette || typeof palette !== 'object' || Array.isArray(palette) || !palette.name) throw new Error('в JSON отсутствует название палитры');
              if (!palette.roles || !ROLE_KEYS.every(key => isHexColor(palette.roles[key]))) throw new Error('неполные или неверные цветовые роли палитры ESDS');
              const schema = Number(data.schemaVersion || 1);
              if (!Number.isInteger(schema) || schema < 1 || schema > 4) throw new Error('версия формата палитры не поддерживается');
              parsedItems.push({ data, palette, fileName: file.name });
            } catch (error) { errors.push(file.name + ': ' + (error.message || 'ошибка JSON')); }
          }
          if (!parsedItems.length) throw new Error('Не найдено корректных JSON-палитр ESDS. ' + errors.slice(0, 3).join('; '));
          const suggested = parsedItems.length === 1
            ? String(parsedItems[0].palette.category || parsedItems[0].palette.name).trim()
            : 'Импортированные палитры';
          const choice = await this.choosePaletteCategory({
            title: parsedItems.length === 1 ? 'Импорт одной палитры' : 'Импорт нескольких палитр',
            description: 'Выберите существующую категорию или создайте новую.',
            summary: 'Корректных палитр: ' + parsedItems.length + (errors.length ? ' · пропущено файлов: ' + errors.length : ''),
            suggestedName: suggested,
            categories: this.getCategories('palettes')
          });
          if (!choice) return;
          const existing = this.allPalettes();
          const ids = new Set(existing.map(item => String(item.id || '').toLowerCase()));
          const names = new Set(existing.map(item => String(item.name || '').trim().toLowerCase()));
          const unique = []; let skipped = 0;
          parsedItems.forEach(item => {
            const id = String(item.palette.id || '').toLowerCase(), name = String(item.palette.name || '').trim().toLowerCase();
            if ((id && ids.has(id)) || (name && names.has(name))) { skipped++; return; }
            if (id) ids.add(id); if (name) names.add(name); unique.push(item);
          });
          if (!unique.length) { new Notice('Все выбранные палитры уже есть в библиотеке.'); return; }
          if (!confirm('Добавить ' + unique.length + ' палитр в категорию «' + choice.name + '»? Дубликаты будут пропущены (' + skipped + ').')) return;
          const before = clone(this.plugin.userData);
          try {
            const destination = await this.ensurePaletteCategory(choice.name);
            for (const item of unique) {
              const payload = clone(item.data), palette = payload.palette || payload;
              palette.category = destination;
              if (payload.palette) payload.palette = palette;
              else payload.category = destination;
              await this.importJson('palette', payload);
            }
            new Notice('Импорт завершён: добавлено ' + unique.length + ', дубликатов пропущено ' + skipped + ', ошибок файлов ' + errors.length + '.');
            if (errors.length) console.warn('ESDS multi-file import: skipped files', errors);
            this.paletteCategory = destination; this.activeView = 'studio'; this.activeSection = 'palette'; this.render();
          } catch (error) {
            this.plugin.userData = before; await this.plugin.saveUserLibrary(); this.plugin.refreshGeneratedStyles(); throw error;
          }
          return;
        }
        const data = JSON.parse(await files[0].text());
        await this.importJson(kind, data);
      } catch (error) {
        console.error('ESDS import failed:', error);
        new Notice(error && error.message ? `Импорт не выполнен: ${error.message}` : 'Не удалось импортировать файл. Проверь формат JSON.');
      } finally { input.remove(); }
    });
    input.click();
  }
  async exportThemePack() {
    try {
      const palette = clone(this.selectedPalette);
      const background = clone(this.selectedBackground);
      const blockStyle = clone(normalizeBlockStyle(this.selectedBlocks));
      // Store the currently selected pairing, not merely the palette's old defaults.
      palette.defaultBackground = background.id;
      palette.defaultBlocks = blockStyle.id;
      const pack = {
        schemaVersion: THEME_PACK_SCHEMA_VERSION,
        type: 'esds-theme-pack',
        plugin: 'english-study-design-studio',
        exportedAt: new Date().toISOString(),
        name: `${palette.name} — дизайнерский набор`,
        description: 'Полный набор: цветовая палитра, фон заметки и оформление информационных блоков.',
        frameSource: 'palette',
        items: { palette, background, blockStyle }
      };
      const adapter = this.app.vault.adapter;
      const folder = 'ESDS Exports';
      if (!(await adapter.exists(folder))) await adapter.mkdir(folder);
      const fileName = `${slugify(palette.name || 'design-pack')}-${Date.now()}.esds-theme.json`;
      const path = `${folder}/${fileName}`;
      await adapter.write(path, JSON.stringify(pack, null, 2));
      new Notice(`Дизайнерский набор сохранён: ${path}`);
    } catch (error) {
      console.error('ESDS theme pack export failed:', error);
      new Notice('Не удалось экспортировать дизайнерский набор.');
    }
  }
  async importThemePack(input) {
    const pack = input && input.themePack ? input.themePack : input;
    if (!pack || typeof pack !== 'object' || Array.isArray(pack) || pack.type !== 'esds-theme-pack') {
      throw new Error('Это не файл дизайнерского набора ESDS.');
    }
    const schemaVersion = Number(pack.schemaVersion || 1);
    if (!Number.isInteger(schemaVersion) || schemaVersion < 1 || schemaVersion > THEME_PACK_SCHEMA_VERSION) {
      throw new Error('Версия дизайнерского набора не поддерживается.');
    }
    const items = pack.items && typeof pack.items === 'object' ? pack.items : pack;
    const rawPalette = items.palette;
    const rawBackground = items.background;
    const rawBlockStyle = items.blockStyle;
    if (!rawPalette || !rawBackground || !rawBlockStyle) {
      throw new Error('В наборе должны быть палитра, фон и стиль блоков.');
    }
    const roles = rawPalette.roles && typeof rawPalette.roles === 'object' ? rawPalette.roles : {};
    if (!rawPalette.name || !ROLE_KEYS.every(key => isHexColor(roles[key]))) {
      throw new Error('Палитра содержит неполные или недопустимые цветовые роли.');
    }
    const bgLight = rawBackground.light;
    const bgDark = rawBackground.dark || bgLight;
    if (!(rawBackground.name || rawBackground.label) || !safeCssBackground(bgLight) || !safeCssBackground(bgDark)) {
      throw new Error('Фон содержит недопустимое описание или CSS-значение.');
    }
    if (!rawBlockStyle.name && !rawBlockStyle.id) throw new Error('В наборе отсутствует название стиля блоков.');

    const uniqueName = (requested, allNames) => {
      const base = String(requested || 'Новый дизайн').trim().slice(0, 100) || 'Новый дизайн';
      if (!allNames.some(name => name.toLowerCase() === base.toLowerCase())) return base;
      let index = 2;
      let next = `${base} (${index})`;
      while (allNames.some(name => name.toLowerCase() === next.toLowerCase())) next = `${base} (${++index})`;
      return next;
    };
    const uniqueId = (prefix, name, occupied) => {
      const base = `${prefix}${slugify(name) || 'design'}`;
      let id = base;
      let index = 2;
      while (occupied.has(id)) id = `${base}-${index++}`;
      occupied.add(id);
      return id;
    };
    const now = new Date().toISOString();
    const paletteNames = this.allPalettes().map(item => item.name || '');
    const bgNames = this.allBackgrounds().map(item => item.name || item.label || '');
    const blockNames = this.allBlockStyles().map(item => item.name || '');
    const paletteName = uniqueName(rawPalette.name, paletteNames);
    const backgroundName = uniqueName(rawBackground.name || rawBackground.label, bgNames);
    const blockName = uniqueName(rawBlockStyle.name || 'Стиль блоков', blockNames);
    const paletteIds = new Set(this.allPalettes().map(item => item.id));
    const backgroundIds = new Set(this.allBackgrounds().map(item => item.id));
    const blockIds = new Set(this.allBlockStyles().map(item => item.id));
    const paletteId = uniqueId('user-', paletteName, paletteIds);
    const backgroundId = uniqueId('bg-custom-', backgroundName, backgroundIds);
    const blockStyleId = uniqueId('user-blocks-', blockName, blockIds);

    const background = {
      id: backgroundId,
      name: backgroundName,
      label: backgroundName,
      group: String(rawBackground.group || rawBackground.category || 'Мои фоны').slice(0, 80),
      light: bgLight,
      dark: bgDark,
      textColor: isHexColor(rawBackground.textColor) ? colorToHex(rawBackground.textColor) : '#302d31',
      darkTextColor: isHexColor(rawBackground.darkTextColor) ? colorToHex(rawBackground.darkTextColor) : '#e9eaf0',
      source: 'user', createdAt: now, updatedAt: now
    };
    const blockStyle = normalizeBlockStyle({ ...rawBlockStyle, id: blockStyleId, name: blockName, category: String(rawBlockStyle.category || 'Мои стили').slice(0, 80), source: 'user', createdAt: now, updatedAt: now });
    const cleanColorMap = (source, fallback) => Object.fromEntries(CALLOUT_KEYS.map(key => {
      const value = source && source[key];
      if (isHexColor(value)) return [key, colorToHex(value)];
      if (Array.isArray(value) && value.length === 3 && value.every(n => Number.isFinite(n) && n >= 0 && n <= 255)) return [key, value.map(n => Math.round(n))];
      return fallback && fallback[key] ? [key, clone(fallback[key])] : null;
    }).filter(Boolean));
    const palette = {
      id: paletteId,
      name: paletteName,
      mood: String(rawPalette.mood || 'Пользовательская дизайнерская палитра').slice(0, 120),
      description: String(rawPalette.description || pack.description || 'Импортированный дизайнерский набор.').slice(0, 500),
      category: String(rawPalette.category || 'Мои палитры').slice(0, 80),
      source: 'user',
      defaultBackground: backgroundId,
      defaultBlocks: blockStyleId,
      roles: Object.fromEntries(ROLE_KEYS.map(key => [key, colorToHex(roles[key])])),
      dark: Object.fromEntries(ROLE_KEYS.map(key => [key, colorToHex(isHexColor(rawPalette.dark && rawPalette.dark[key]) ? rawPalette.dark[key] : roles[key])])),
      callouts: cleanColorMap(rawPalette.callouts, PALETTES[0].callouts),
      darkCallouts: cleanColorMap(rawPalette.darkCallouts, rawPalette.callouts || PALETTES[0].callouts),
      calloutFrames: rawPalette.calloutFrames && typeof rawPalette.calloutFrames === 'object' ? Object.fromEntries(CALLOUT_KEYS.map(key => { const frame = rawPalette.calloutFrames[key]; return frame && BLOCK_FRAME_PRESET_KEYS.includes(frame.preset) ? [key, { preset: frame.preset, width: Math.max(0, Math.min(8, Number.isFinite(Number(frame.width)) ? Number(frame.width) : 1.5)), radius: Math.max(0, Math.min(32, Number.isFinite(Number(frame.radius)) ? Number(frame.radius) : 10)) }] : null; }).filter(Boolean)) : undefined,
      ...Object.fromEntries(['calloutFills','calloutTexts','calloutBorders','darkCalloutFills','darkCalloutTexts','darkCalloutBorders'].map(mapName => {
        const source = rawPalette[mapName];
        if (!source || typeof source !== 'object' || Array.isArray(source)) return [mapName, undefined];
        return [mapName, cleanColorMap(source, null)];
      }).filter(([, value]) => value && Object.keys(value).length)),
      swatches: Array.isArray(rawPalette.swatches) ? rawPalette.swatches.filter(isHexColor).slice(0, 8).map(colorToHex) : ROLE_KEYS.slice(0, 5).map(key => colorToHex(roles[key])),
      createdAt: now, updatedAt: now
    };

    const previousLibrary = this.plugin.userData;
    this.plugin.userData = {
      ...previousLibrary,
      palettes: [...(previousLibrary.palettes || []), palette],
      backgrounds: [...(previousLibrary.backgrounds || []), background],
      blockStyles: [...(previousLibrary.blockStyles || []), blockStyle],
      activeBlockStyleId: blockStyleId,
      frameSource: 'palette'
    };
    const saved = await this.plugin.saveUserLibrary();
    if (saved === false) {
      this.plugin.userData = previousLibrary;
      throw new Error('Не удалось сохранить библиотеку. Импорт отменён, исходная библиотека восстановлена.');
    }
    this.plugin.refreshGeneratedStyles();
    this.selectedPalette = palette;
    this.selectedBackground = background;
    this.selectedBlocks = blockStyle;
    this.frameSource = 'palette';
    this.backgroundOverridden = false;
    this.activeView = 'studio';
    this.activeSection = 'palette';
    this.render();
    new Notice(`Набор «${palette.name}» импортирован: палитра, фон и стиль блоков связаны между собой.`);
  }
  async importJson(kind, data) {
    if (kind === 'themePack') return this.importThemePack(data);
    let previousBlockStyles = null;
    let importedBlockStyle = false;
    if (kind === 'library') {
      let source = data && data.library ? data.library : data;
      if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Library structure is invalid');
      if (Number(source.schemaVersion || 1) > LIBRARY_SCHEMA) throw new Error('Library version is newer than this plugin');
      source = { ...source, palettes: Array.isArray(source.palettes) ? source.palettes : [], backgrounds: Array.isArray(source.backgrounds) ? source.backgrounds : [], blockStyles: Array.isArray(source.blockStyles) ? source.blockStyles : [] };
      if (!confirm('Заменить текущую библиотеку импортируемой? Перед заменой желательно сохранить резервную копию.')) return;
      const restored = ensureLibraryShape(source);
      const unique = (items, prefix) => {
        const used = new Set();
        return items.map((item, index) => {
          const copy = clone(item);
          let id = String(copy.id || `${prefix}-${index + 1}`);
          if (used.has(id)) id = `${id}-${Date.now().toString(36)}-${index}`;
          used.add(id); copy.id = id; copy.source = 'user'; return copy;
        });
      };
      restored.palettes = unique(restored.palettes, 'user-palette').filter(p => p.name && p.roles && ROLE_KEYS.every(key => isHexColor(p.roles[key]))).map(p => {
        if (!/^user-[a-z0-9-]+$/.test(p.id)) p.id = `user-${slugify(p.name)}-${Date.now().toString(36).slice(-4)}`;
        p.source = 'user'; return p;
      });
      restored.backgrounds = unique(restored.backgrounds, 'bg-custom').filter(bg => (bg.name || bg.label) && safeCssBackground(bg.light) && safeCssBackground(bg.dark || bg.light)).map(bg => {
        if (!/^bg-custom-[a-z0-9-]+$/.test(bg.id)) bg.id = `bg-custom-${slugify(bg.name || bg.label)}-${Date.now().toString(36).slice(-4)}`;
        bg.source = 'user'; return bg;
      });
      restored.blockStyles = unique(restored.blockStyles, 'user-blocks').filter(style => style && (style.name || style.id)).map(style => normalizeBlockStyle({ ...style, source: 'user' }));
      restored.favoriteItems = (restored.favoriteItems || []).filter(entry => {
        if (!entry || !['palette', 'background', 'blockStyle'].includes(entry.kind)) return false;
        if (entry.kind === 'palette') return restored.palettes.some(item => item.id === entry.id) || PALETTES.some(item => item.id === entry.id);
        if (entry.kind === 'background') return restored.backgrounds.some(item => item.id === entry.id) || BACKGROUNDS.some(item => item.id === entry.id);
        return restored.blockStyles.some(item => item.id === entry.id) || BUILTIN_BLOCK_STYLES.some(item => item.id === entry.id);
      });
      restored.palettes.forEach(p => {
        if (!restored.backgrounds.some(bg => bg.id === p.defaultBackground) && !BACKGROUNDS.some(bg => bg.id === p.defaultBackground)) p.defaultBackground = BACKGROUNDS[0].id;
        if (!restored.blockStyles.some(b => b.id === p.defaultBlocks) && !BUILTIN_BLOCK_STYLES.some(b => b.id === p.defaultBlocks)) p.defaultBlocks = BUILTIN_BLOCK_STYLES[0].id;
      });
      this.plugin.userData = restored;
      await this.plugin.saveUserLibrary();
      this.plugin.refreshGeneratedStyles();
      this.selectedPalette = this.findPalette(restored.palettes[0]?.id) || PALETTES[0];
      this.selectedBackground = this.findBackground(this.selectedPalette.defaultBackground) || BACKGROUNDS[0];
      this.selectedBlocks = this.getPreferredBlockStyle(this.selectedPalette);
      this.backgroundOverridden = false;
      this.activeView = 'studio'; this.activeSection = 'palette'; this.render();
      new Notice('Библиотека восстановлена из файла.');
      return;
    }
    if (kind === 'palette') {
      const paletteSchemaVersion = Number(data.schemaVersion || 1);
      if (!Number.isInteger(paletteSchemaVersion) || paletteSchemaVersion < 1 || paletteSchemaVersion > 4) throw new Error('Версия формата палитры не поддерживается.');
      let p = data.palette || data;
      const roles = p.roles || {};
      if (!p.name || !ROLE_KEYS.every(key => isHexColor(roles[key]))) throw new Error('Palette roles are missing or invalid');
      const palette = clone(p); palette.id = `user-${slugify(p.name)}-${Date.now().toString(36).slice(-4)}`; palette.createdAt = new Date().toISOString(); palette.updatedAt = palette.createdAt; palette.source = 'user';
      palette.defaultBackground = this.findBackground(p.defaultBackground)?.id || this.selectedBackground.id;
      palette.defaultBlocks = this.findBlockStyle(p.defaultBlocks) ? p.defaultBlocks : this.selectedBlocks.id;
      palette.dark = Object.fromEntries(ROLE_KEYS.map(key => [key, isHexColor(palette.dark && palette.dark[key]) ? palette.dark[key] : palette.roles[key]]));
      palette.callouts = palette.callouts || clone(PALETTES[0].callouts);
      palette.darkCallouts = palette.darkCallouts || clone(palette.callouts);
      ['calloutFills','calloutTexts','calloutBorders','darkCalloutFills','darkCalloutTexts','darkCalloutBorders'].forEach(mapName => {
        const source = palette[mapName];
        if (!source || typeof source !== 'object' || Array.isArray(source)) { delete palette[mapName]; return; }
        const clean = Object.fromEntries(CALLOUT_KEYS.map(key => [key, source[key]]).filter(([, value]) => isValidPaletteColor(value)));
        if (Object.keys(clean).length) palette[mapName] = clean; else delete palette[mapName];
      });
      if (palette.calloutFrames && typeof palette.calloutFrames === 'object' && !Array.isArray(palette.calloutFrames)) {
        const cleanFrames = {};
        CALLOUT_KEYS.forEach(key => {
          const frame = palette.calloutFrames[key];
          if (!frame || !BLOCK_FRAME_PRESET_KEYS.includes(frame.preset)) return;
          cleanFrames[key] = { preset: frame.preset, width: Math.max(0, Math.min(8, Number.isFinite(Number(frame.width)) ? Number(frame.width) : 1.5)), radius: Math.max(0, Math.min(32, Number.isFinite(Number(frame.radius)) ? Number(frame.radius) : 10)) };
        });
        if (Object.keys(cleanFrames).length) palette.calloutFrames = cleanFrames; else delete palette.calloutFrames;
      } else delete palette.calloutFrames;
      palette.swatches = palette.swatches || ROLE_KEYS.slice(0,5).map(k => palette.roles[k]);
      if (p.category) palette.category = p.category;
      this.plugin.userData.palettes.push(palette); this.plugin.refreshGeneratedStyles();
      this.selectedPalette = palette; this.selectedBackground = this.findBackground(palette.defaultBackground) || this.selectedBackground; this.backgroundOverridden = false;
    } else if (kind === 'background') {
      const b = data.background || data;
      if (!b.name && !b.label) throw new Error('Background name is required');
      if (!safeCssBackground(b.light) || !safeCssBackground(b.dark || b.light)) throw new Error('Unsafe or invalid CSS background');
      const label = b.name || b.label;
      const group = b.group || b.category || 'Мои фоны';
      const importedAt = new Date().toISOString();
      const bg = { ...b, id: `bg-custom-${slugify(label)}-${Date.now().toString(36).slice(-4)}`, name: label, label, group, createdAt: importedAt, updatedAt: importedAt, source: 'user', dark: b.dark || b.light, textColor: isHexColor(b.textColor) ? b.textColor : '#302d31', darkTextColor: isHexColor(b.darkTextColor) ? b.darkTextColor : '#e9eaf0' };
      this.plugin.userData.backgrounds.push(bg); this.plugin.refreshGeneratedStyles(); this.selectedBackground = bg; this.backgroundOverridden = true;
    } else if (kind === 'blockStyle' || kind === 'blocks') {
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Файл стиля блоков должен содержать JSON-объект.');
      }
      if (data.type && data.type !== 'esds-block-style') {
        throw new Error('Это не файл стиля блоков ESDS.');
      }
      if (data.schemaVersion != null) {
        const schemaVersion = Number(data.schemaVersion);
        if (!Number.isInteger(schemaVersion) || schemaVersion < 1 || schemaVersion > 2) {
          throw new Error('Версия формата стиля блоков не поддерживается.');
        }
      }
      const raw = data.blockStyle || data.style || (data.type === 'esds-block-style' ? null : data);
      if (!raw || typeof raw !== 'object' || Array.isArray(raw) || !(raw.name || raw.id)) {
        throw new Error('В файле отсутствует корректный стиль блоков.');
      }
      const styleName = String(raw.name || raw.id).trim().slice(0, 120) || 'Импортированный стиль';
      const occupiedIds = new Set([
        ...BUILTIN_BLOCK_STYLES.map(item => item.id),
        ...(this.plugin.userData.blockStyles || []).map(item => item.id)
      ].filter(Boolean));
      const idBase = `user-blocks-${slugify(styleName) || 'imported'}`;
      let id = idBase;
      let suffix = 2;
      while (occupiedIds.has(id)) id = `${idBase}-${suffix++}`;
      const importedAt = new Date().toISOString();
      const style = normalizeBlockStyle({
        ...raw,
        id,
        name: styleName,
        category: String(raw.category || 'Мои стили').slice(0, 80),
        source: 'user',
        createdAt: importedAt,
        updatedAt: importedAt
      });
      // Import adds a new item only. It never replaces the library or silently
      // makes the imported style active.
      previousBlockStyles = this.plugin.userData.blockStyles || [];
      this.plugin.userData.blockStyles = [...previousBlockStyles, style];
      importedBlockStyle = true;
    } else {
      throw new Error('Unknown import kind');
    }
    const saved = await this.plugin.saveUserLibrary();
    if (saved === false) {
      if (importedBlockStyle) {
        this.plugin.userData.blockStyles = previousBlockStyles;
        this.plugin.refreshGeneratedStyles();
      }
      throw new Error('Не удалось сохранить библиотеку. Импорт отменён, прежние элементы сохранены.');
    }
    this.plugin.refreshGeneratedStyles();
    this.activeView = 'studio';
    this.activeSection = kind === 'palette' ? 'palette' : (kind === 'background' ? 'background' : 'blocks');
    this.render();
    new Notice(kind === 'blockStyle' || kind === 'blocks' ? 'Стиль блоков добавлен в библиотеку. Выбери его карточку, чтобы сделать основным.' : 'Оформление импортировано и добавлено в библиотеку.');
  }
  async exportItem(kind) {
    let item, payload;
    if (kind === 'palette') {
      item = this.selectedPalette;
      payload = { schemaVersion: 3, type: 'esds-palette', palette: item };
    } else if (kind === 'background') {
      item = this.selectedBackground;
      payload = { schemaVersion: 2, type: 'esds-background', background: item };
    } else {
      item = this.selectedBlocks;
      payload = { schemaVersion: 2, type: 'esds-block-style', blockStyle: item };
    }
    try {
      const adapter = this.app.vault.adapter;
      const folder = 'ESDS Exports';
      if (!(await adapter.exists(folder))) await adapter.mkdir(folder);
      const fileName = `${slugify(item.name || item.label || item.id)}-${Date.now()}.json`;
      const path = `${folder}/${fileName}`;
      await adapter.write(path, JSON.stringify(payload, null, 2));
      new Notice(`Экспорт сохранён в хранилище: ${path}`);
    } catch (error) { console.error(error); new Notice('Не удалось сохранить JSON-файл экспорта.'); }
  }
}


class NoteBlockStyleModal extends Modal {
  constructor(app, plugin, studio, file) {
    super(app);
    this.plugin = plugin;
    this.studio = studio;
    this.file = file;
    this.draft = normalizeLocalNoteStyle({ id: makeNoteStyleId(), base: 'soft', frameSource: 'palette' });
    this.hadStyle = false;
    this.themeMode = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
    this.activeCallout = null;
  }

  async onOpen() {
    this.modalEl.addClass('esds-builder-modal');
    this.modalEl.addClass('esds-note-style-modal');
    this.contentEl.addClass('esds-builder-content');
    this.contentEl.addClass('esds-note-style-content');
    try {
      const content = await this.app.vault.cachedRead(this.file);
      const saved = decodeNoteStyleMarker(content);
      if (saved) {
        const normalized = normalizeLocalNoteStyle(saved, saved.id);
        if (normalized) { this.draft = normalized; this.hadStyle = true; }
      }
    } catch (error) {
      console.warn('ESDS could not read local note styling:', error);
    }
    this.renderSafely();
  }

  onClose() { this.contentEl.empty(); }

  renderSafely() {
    try { this.render(); return true; }
    catch (error) {
      console.error('ESDS note style editor failed:', error);
      this.contentEl.empty();
      const box = this.contentEl.createDiv({ cls: 'esds-builder-error' });
      box.createEl('h3', { text: 'Не удалось открыть настройки этой заметки' });
      box.createEl('p', { text: 'Настройки не были изменены. Закрой окно и попробуй открыть его ещё раз.' });
      const close = box.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Закрыть', attr: { type: 'button' } });
      close.addEventListener('click', () => this.close());
      return false;
    }
  }

  scopeKey() { return this.activeCallout || 'all'; }

  getCurrentProps() {
    const mode = this.themeMode;
    const base = this.draft.style[mode] || {};
    if (!this.activeCallout) return base;
    const props = mergeStyleProps(base, (this.draft.calloutOverrides[this.activeCallout] || {})[mode] || {});
    if (this.draft.frameSource === 'palette') {
      const frame = (this.studio.selectedPalette.calloutFrames || {})[this.activeCallout] || { width: 1.5, radius: 10 };
      props.borderWidth = Number.isFinite(Number(frame.width)) ? Number(frame.width) : 1.5;
      props.borderRadius = Number.isFinite(Number(frame.radius)) ? Number(frame.radius) : 10;
    }
    return props;
  }

  setProp(key, value) {
    const mode = this.themeMode;
    if (!this.activeCallout) {
      this.draft.style[mode][key] = value;
      // "Всем" means every callout, including callouts that already have
      // individual overrides for this property. Otherwise their old opacity
      // or border values mask the new shared slider value.
      CALLOUT_KEYS.forEach(type => {
        const override = this.draft.calloutOverrides[type] && this.draft.calloutOverrides[type][mode];
        if (override && Object.prototype.hasOwnProperty.call(override, key)) override[key] = value;
      });
      return;
    }
    if (!this.draft.calloutOverrides[this.activeCallout]) this.draft.calloutOverrides[this.activeCallout] = { light: {}, dark: {} };
    if (!this.draft.calloutOverrides[this.activeCallout][mode]) this.draft.calloutOverrides[this.activeCallout][mode] = {};
    this.draft.calloutOverrides[this.activeCallout][mode][key] = value;
  }

  getCurrentBorder() {
    const mode = this.themeMode;
    if (!this.activeCallout) return normalizeNoteBorder(this.draft.border[mode], null);
    return normalizeNoteBorder(
      (this.draft.borderOverrides[this.activeCallout] || {})[mode],
      this.draft.border[mode]
    );
  }

  getBorderForType(type, mode = this.themeMode) {
    if (this.draft.frameSource === 'palette') {
      const frame = (this.studio.selectedPalette.calloutFrames || {})[type] || { preset: 'classic', width: 1.5, radius: 10 };
      const preset = NOTE_STYLE_FRAME_PRESETS[frame.preset] || NOTE_STYLE_FRAME_PRESETS.classic;
      return { style: preset.style, sides: clone(preset.sides), width: Number.isFinite(Number(frame.width)) ? Number(frame.width) : 1.5, radius: Number.isFinite(Number(frame.radius)) ? Number(frame.radius) : 10 };
    }
    const border = normalizeNoteBorder(
      (this.draft.borderOverrides[type] || {})[mode],
      this.draft.border[mode]
    );
    const props = mergeStyleProps(this.draft.style[mode], (this.draft.calloutOverrides[type] || {})[mode] || {});
    return { ...border, width: props.borderWidth, radius: props.borderRadius };
  }

  seedLocalBordersFromPalette() {
    const paletteFrames = this.studio.selectedPalette.calloutFrames || {};
    CALLOUT_KEYS.forEach(type => {
      const frame = paletteFrames[type] || { preset: 'classic', width: 1.5, radius: 10 };
      const preset = NOTE_STYLE_FRAME_PRESETS[frame.preset] || NOTE_STYLE_FRAME_PRESETS.classic;
      const border = { style: preset.style, sides: clone(preset.sides) };
      if (!this.draft.borderOverrides[type]) this.draft.borderOverrides[type] = { light: clone(border), dark: clone(border) };
      if (!this.draft.calloutOverrides[type]) this.draft.calloutOverrides[type] = { light: {}, dark: {} };
      ['light', 'dark'].forEach(mode => {
        if (!this.draft.calloutOverrides[type][mode]) this.draft.calloutOverrides[type][mode] = {};
        if (this.draft.calloutOverrides[type][mode].borderWidth == null) this.draft.calloutOverrides[type][mode].borderWidth = Math.max(0, Math.min(8, Number.isFinite(Number(frame.width)) ? Number(frame.width) : 1.5));
        if (this.draft.calloutOverrides[type][mode].borderRadius == null) this.draft.calloutOverrides[type][mode].borderRadius = Math.max(0, Math.min(24, Number.isFinite(Number(frame.radius)) ? Number(frame.radius) : 10));
      });
    });
  }

  setCurrentBorder(key, value) {
    const mode = this.themeMode;
    if (key === 'preset') {
      const preset = NOTE_STYLE_FRAME_PRESETS[value];
      if (!preset) return;
      this.draft.frameSource = 'local';
      if (!this.activeCallout) {
        this.draft.border[mode] = { style: preset.style, sides: clone(preset.sides) };
        CALLOUT_KEYS.forEach(type => {
          if (this.draft.borderOverrides[type]) delete this.draft.borderOverrides[type][mode];
          if (this.draft.calloutOverrides[type] && this.draft.calloutOverrides[type][mode]) {
            delete this.draft.calloutOverrides[type][mode].borderWidth;
            delete this.draft.calloutOverrides[type][mode].borderRadius;
          }
        });
      } else {
        if (!this.draft.borderOverrides[this.activeCallout]) this.draft.borderOverrides[this.activeCallout] = { light: null, dark: null };
        this.draft.borderOverrides[this.activeCallout][mode] = { style: preset.style, sides: clone(preset.sides) };
      }
    }
  }

  setCurrentBorderSide(side, checked) {
    if (!['top', 'right', 'bottom', 'left'].includes(side)) return;
    const mode = this.themeMode;
    this.draft.frameSource = 'local';
    const applySide = target => {
      const border = normalizeNoteBorder(target, null);
      border.sides[side] = !!checked;
      if (!Object.values(border.sides).some(Boolean)) border.style = 'none';
      else if (border.style === 'none') border.style = 'solid';
      return border;
    };
    if (!this.activeCallout) {
      this.draft.border[mode] = applySide(this.draft.border[mode]);
      CALLOUT_KEYS.forEach(type => {
        if (this.draft.borderOverrides[type]) delete this.draft.borderOverrides[type][mode];
        if (this.draft.calloutOverrides[type] && this.draft.calloutOverrides[type][mode]) {
          delete this.draft.calloutOverrides[type][mode].borderWidth;
          delete this.draft.calloutOverrides[type][mode].borderRadius;
        }
      });
    } else {
      if (!this.draft.borderOverrides[this.activeCallout]) this.draft.borderOverrides[this.activeCallout] = { light: null, dark: null };
      const current = this.draft.borderOverrides[this.activeCallout][mode] || this.draft.border[mode];
      this.draft.borderOverrides[this.activeCallout][mode] = applySide(current);
    }
  }

  getCurrentColors() {
    const modeColors = this.draft.colors[this.themeMode] || {};
    if (!this.activeCallout) return modeColors.all || {};
    return { ...(modeColors.all || {}), ...(modeColors[this.activeCallout] || {}) };
  }

  getColorsForType(type, mode = this.themeMode) {
    const byMode = this.draft.colors[mode] || {};
    return { ...(byMode.all || {}), ...(byMode[type] || {}) };
  }

  setCurrentColor(key, value) {
    const mode = this.themeMode;
    if (!this.draft.colors[mode]) this.draft.colors[mode] = {};
    if (!this.draft.colors[mode][this.scopeKey()]) this.draft.colors[mode][this.scopeKey()] = {};
    if (value) this.draft.colors[mode][this.scopeKey()][key] = colorToHex(value);
    else delete this.draft.colors[mode][this.scopeKey()][key];
  }

  paletteColor(type, kind = 'text') {
    const palette = this.studio.selectedPalette || PALETTES[0];
    const dark = this.themeMode === 'dark';
    const base = dark ? (palette.darkCallouts || palette.callouts) : palette.callouts;
    const mapName = dark
      ? ({ fill: 'darkCalloutFills', text: 'darkCalloutTexts', border: 'darkCalloutBorders' }[kind])
      : ({ fill: 'calloutFills', text: 'calloutTexts', border: 'calloutBorders' }[kind]);
    const map = mapName && palette[mapName];
    return colorToHex((map && isValidPaletteColor(map[type]) ? map[type] : null) || (base && base[type]) || '#5a7dc8');
  }

  updatePreview(preview) {
    if (!preview) return;
    const mode = this.themeMode;
    preview.querySelectorAll('.esds-demo-callout').forEach(node => {
      const type = Array.from(node.classList).find(cls => cls.startsWith('esds-callout-'))?.replace('esds-callout-', '');
      if (!type || !CALLOUT_KEYS.includes(type)) return;
      const props = mergeStyleProps(this.draft.style[mode], (this.draft.calloutOverrides[type] || {})[mode] || {});
      const border = this.getBorderForType(type, mode);
      const custom = this.getColorsForType(type, mode);
      const fillColor = custom.fillColor || this.paletteColor(type, 'fill');
      const borderColor = custom.borderColor || this.paletteColor(type, 'border');
      const textColor = custom.textColor || this.paletteColor(type, 'text');
      const widths = ['top', 'right', 'bottom', 'left'].map(side => border.style !== 'none' && border.sides[side] ? `${border.width}px` : '0px').join(' ');
      node.style.setProperty('background-color', `rgba(${rgbValue(fillColor)}, ${props.backgroundOpacity})`, 'important');
      node.style.setProperty('border-color', `rgba(${rgbValue(borderColor)}, ${props.borderOpacity})`, 'important');
      node.style.setProperty('border-style', border.style, 'important');
      node.style.setProperty('border-width', widths, 'important');
      node.style.setProperty('border-radius', `${border.radius}px`, 'important');
      node.style.setProperty('padding', `${props.paddingY}px ${props.paddingX}px`, 'important');
      node.style.setProperty('box-shadow', 'none', 'important');
      node.style.setProperty('color', textColor, 'important');
      const title = node.querySelector('strong');
      const content = node.querySelector('p');
      if (title) {
        title.style.setProperty('color', textColor, 'important');
        title.style.setProperty('font-size', `${props.titleSize}px`, 'important');
        title.style.setProperty('font-weight', String(props.titleWeight), 'important');
        title.style.setProperty('margin-bottom', `${props.gap}px`, 'important');
      }
      if (content) { content.style.setProperty('color', textColor, 'important'); content.style.setProperty('font-size', `${props.bodySize}px`, 'important'); }
    });
  }

  createRangeControl(parent, label, key, min, max, step, scale = 1, suffix = '', disabled = false, invert = false) {
    const row = parent.createDiv({ cls: `esds-note-style-range${disabled ? ' is-disabled' : ''}` });
    const top = row.createDiv({ cls: 'esds-note-style-range-top' });
    top.createEl('label', { text: label });
    const value = top.createEl('output', { cls: 'esds-note-style-range-value' });

    // Do not put `disabled: undefined` in Obsidian's attr map. Some DOM helper
    // implementations stringify it as disabled="undefined", which disables
    // every range input even when the control is intended to be enabled.
    const attrs = { type: 'range', min: String(min), max: String(max), step: String(step) };
    if (disabled) attrs.disabled = true;
    const input = row.createEl('input', { cls: 'esds-note-style-range-input', attr: attrs });
    input.disabled = Boolean(disabled);
    input.setAttribute('aria-label', label);

    const props = this.getCurrentProps();
    const initial = Number(props[key] ?? min / scale);
    const displayInitial = invert ? (1 - initial) * scale : initial * scale;
    input.value = String(Math.max(min, Math.min(max, displayInitial)));
    const format = number => `${Number(number).toFixed((String(step).split('.')[1] || '').length)}${suffix}`;
    value.textContent = format(input.value);

    let lastAppliedValue = String(input.value);
    const applyValue = () => {
      if (input.disabled) return;
      const numericValue = Number(input.value);
      if (!Number.isFinite(numericValue)) return;
      const boundedValue = Math.max(min, Math.min(max, numericValue));
      if (boundedValue !== numericValue) input.value = String(boundedValue);
      const currentValue = String(input.value);
      value.textContent = format(currentValue);
      // Mobile WebViews may emit the final `change` without a useful stream of
      // `input` events. Process both, but avoid applying the same value twice.
      if (currentValue === lastAppliedValue) return;
      lastAppliedValue = currentValue;

      const displayed = Number(currentValue) / scale;
      const next = invert ? 1 - displayed : displayed;
      const needsLocalFrame = (key === 'borderWidth' || key === 'borderRadius') && this.draft.frameSource !== 'local';
      if (needsLocalFrame) {
        this.seedLocalBordersFromPalette();
        this.draft.frameSource = 'local';
      }
      this.setProp(key, next);
      if (needsLocalFrame) {
        if (this.frameSourceSelect) this.frameSourceSelect.value = 'local';
        if (this.frameSourceHint) this.frameSourceHint.textContent = 'Геометрия рамок настраивается здесь отдельно для каждого типа блока.';
      }
      this.updatePreview(this.preview);
    };
    input.addEventListener('input', applyValue);
    input.addEventListener('change', applyValue);
    return row;
  }

  renderColorControls(parent) {
    const section = parent.createDiv({ cls: 'esds-note-style-color-section' });
    section.createEl('strong', { text: 'Цвета блока' });
    [['fillColor', 'Цвет заливки', 'fill'], ['borderColor', 'Цвет обводки', 'border'], ['textColor', 'Цвет текста', 'text']].forEach(([key, label, kind]) => {
      const row = section.createDiv({ cls: 'esds-note-style-color-row' });
      row.createEl('label', { text: label });
      const color = row.createEl('input', { attr: { type: 'color', 'aria-label': label } });
      const existing = this.getCurrentColors()[key];
      color.value = existing || this.paletteColor(this.activeCallout || 'note', kind);
      color.disabled = !existing;
      const source = row.createEl('select', { cls: 'esds-select esds-note-style-color-source' });
      source.createEl('option', { text: 'Из палитры', attr: { value: 'palette' } });
      source.createEl('option', { text: 'Свой цвет', attr: { value: 'custom' } });
      source.value = existing ? 'custom' : 'palette';
      source.addEventListener('change', () => {
        if (source.value === 'custom') {
          color.disabled = false;
          this.setCurrentColor(key, color.value);
        } else {
          color.disabled = true;
          this.setCurrentColor(key, null);
        }
        this.updatePreview(this.preview);
      });
      color.addEventListener('input', () => {
        this.setCurrentColor(key, color.value);
        this.updatePreview(this.preview);
      });
    });
  }

  render() {
    const root = this.contentEl;
    root.empty();
    const header = root.createDiv({ cls: 'esds-header esds-builder-header' });
    const back = header.createEl('button', { cls: 'esds-button esds-btn-quiet esds-back-button esds-builder-back-button', text: '‹ Назад', attr: { type: 'button' } });
    back.addEventListener('click', () => this.close());
    const heading = header.createDiv({ cls: 'esds-heading-wrap' });
    heading.createEl('h2', { text: 'Настройки для этой заметки' });
    heading.createEl('p', { text: this.file ? this.file.basename : 'Текущая заметка' });

    const body = root.createDiv({ cls: 'esds-builder-body esds-note-style-body' });
    const info = body.createDiv({ cls: 'esds-note-style-scope-info' });
    info.createEl('strong', { text: 'Только эта заметка' });
    info.createEl('p', { text: 'Все изменения сохраняются внутри этой заметки. Общая библиотека, data.json и другие заметки не изменяются.' });

    const themeToggle = body.createDiv({ cls: 'esds-theme-toggle' });
    const lightBtn = themeToggle.createEl('button', { cls: `esds-button ${this.themeMode === 'light' ? 'esds-primary' : 'esds-btn-quiet'}`, text: 'Светлая тема', attr: { type: 'button' } });
    const darkBtn = themeToggle.createEl('button', { cls: `esds-button ${this.themeMode === 'dark' ? 'esds-primary' : 'esds-btn-quiet'}`, text: 'Тёмная тема', attr: { type: 'button' } });
    lightBtn.addEventListener('click', () => { this.themeMode = 'light'; this.renderSafely(); });
    darkBtn.addEventListener('click', () => { this.themeMode = 'dark'; this.renderSafely(); });
    const copyBtn = themeToggle.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Копировать в другую тему', attr: { type: 'button' } });
    copyBtn.addEventListener('click', () => {
      const from = this.themeMode;
      const to = from === 'light' ? 'dark' : 'light';
      if (this.activeCallout) {
        if (!this.draft.calloutOverrides[this.activeCallout]) this.draft.calloutOverrides[this.activeCallout] = { light: {}, dark: {} };
        this.draft.calloutOverrides[this.activeCallout][to] = clone(this.draft.calloutOverrides[this.activeCallout][from] || {});
        if (!this.draft.borderOverrides[this.activeCallout]) this.draft.borderOverrides[this.activeCallout] = { light: null, dark: null };
        this.draft.borderOverrides[this.activeCallout][to] = clone(this.draft.borderOverrides[this.activeCallout][from] || this.draft.border[from]);
        if (!this.draft.colors[to]) this.draft.colors[to] = {};
        if (this.draft.colors[from][this.activeCallout]) this.draft.colors[to][this.activeCallout] = clone(this.draft.colors[from][this.activeCallout]);
      } else {
        this.draft.style[to] = clone(this.draft.style[from]);
        this.draft.border[to] = clone(this.draft.border[from]);
        if (!this.draft.colors[to]) this.draft.colors[to] = {};
        if (this.draft.colors[from].all) this.draft.colors[to].all = clone(this.draft.colors[from].all);
      }
      new Notice('Настройки скопированы в другую тему.');
      this.renderSafely();
    });

    const sourceSection = body.createDiv({ cls: 'esds-note-style-source-section' });
    sourceSection.createEl('label', { text: 'Источник геометрии рамок' });
    const sourceSelect = sourceSection.createEl('select', { cls: 'esds-select' });
    sourceSelect.createEl('option', { text: 'Из выбранной палитры', attr: { value: 'palette' } });
    sourceSelect.createEl('option', { text: 'Индивидуально для этой заметки', attr: { value: 'local' } });
    sourceSelect.value = this.draft.frameSource;
    const sourceHint = sourceSection.createEl('small', { cls: 'esds-note-style-source-hint', text: this.draft.frameSource === 'palette'
      ? 'Тип линии и стороны берутся из палитры. Изменение толщины или скругления ниже автоматически создаст локальное переопределение.'
      : 'Геометрия рамок настраивается здесь отдельно для каждого типа блока.' });
    this.frameSourceSelect = sourceSelect;
    this.frameSourceHint = sourceHint;
    sourceSelect.addEventListener('change', () => {
      if (sourceSelect.value === 'local' && this.draft.frameSource !== 'local') this.seedLocalBordersFromPalette();
      this.draft.frameSource = sourceSelect.value === 'local' ? 'local' : 'palette';
      this.renderSafely();
    });

    body.createEl('label', { text: 'Для каких блоков менять параметры' });
    const targets = body.createDiv({ cls: 'esds-callout-target-row' });
    const allBtn = targets.createEl('button', { cls: `esds-button ${!this.activeCallout ? 'esds-primary' : 'esds-btn-quiet'}`, text: 'Всем', attr: { type: 'button' } });
    allBtn.addEventListener('click', () => { this.activeCallout = null; this.renderSafely(); });
    CALLOUTS.forEach(([key, label]) => {
      const button = targets.createEl('button', { cls: `esds-button ${this.activeCallout === key ? 'esds-primary' : 'esds-btn-quiet'}`, text: label, attr: { type: 'button' } });
      button.addEventListener('click', () => { this.activeCallout = key; this.renderSafely(); });
    });
    if (this.activeCallout) {
      const copyAll = body.createEl('button', { cls: 'esds-button esds-btn-quiet esds-note-style-copy-all', text: 'Применить параметры этого блока ко всем', attr: { type: 'button' } });
      copyAll.addEventListener('click', () => {
        const source = this.activeCallout;
        CALLOUT_KEYS.forEach(type => {
          if (type === source) return;
          this.draft.calloutOverrides[type] = clone(this.draft.calloutOverrides[source] || { light: {}, dark: {} });
          this.draft.borderOverrides[type] = clone(this.draft.borderOverrides[source] || { light: null, dark: null });
          ['light', 'dark'].forEach(mode => {
            const sourceColors = (this.draft.colors[mode] || {})[source];
            if (!this.draft.colors[mode]) this.draft.colors[mode] = {};
            if (sourceColors) this.draft.colors[mode][type] = clone(sourceColors);
            else delete this.draft.colors[mode][type];
          });
        });
        new Notice('Настройки скопированы на остальные блоки.');
        this.renderSafely();
      });
    }

    if (this.draft.frameSource === 'local') {
      const frameSection = body.createDiv({ cls: 'esds-note-style-frame-section' });
      const frameHeading = frameSection.createDiv({ cls: 'esds-note-style-frame-heading' });
      frameHeading.createEl('label', { text: 'Вид обрамления' });
      const resetFrame = frameHeading.createEl('button', { cls: 'esds-button esds-btn-quiet esds-note-style-reset-frame', text: 'Сбросить', attr: { type: 'button', title: 'Вернуть рамку, заданную палитрой' } });
      const frameGrid = frameSection.createDiv({ cls: 'esds-frame-presets' });
      const selectedId = getNoteStyleFramePresetId(this.getCurrentBorder());
      NOTE_STYLE_FRAME_PRESET_LABELS.forEach(([id, label]) => {
        const button = frameGrid.createEl('button', {
          cls: `esds-frame-preset${selectedId === id ? ' is-selected' : ''}`,
          attr: { type: 'button', 'data-preset': id, 'aria-pressed': selectedId === id ? 'true' : 'false' }
        });
        button.createDiv({ cls: `esds-frame-preset-sample esds-frame-preset-sample--${id}` });
        button.createSpan({ cls: 'esds-frame-preset-name', text: label });
        button.addEventListener('click', () => { this.setCurrentBorder('preset', id); this.renderSafely(); });
      });
      resetFrame.addEventListener('click', () => {
        if (this.activeCallout) {
          const type = this.activeCallout;
          const frame = (this.studio.selectedPalette.calloutFrames || {})[type] || { preset: 'classic', width: 1.5, radius: 10 };
          const preset = NOTE_STYLE_FRAME_PRESETS[frame.preset] || NOTE_STYLE_FRAME_PRESETS.classic;
          this.draft.borderOverrides[type] = { light: { style: preset.style, sides: clone(preset.sides) }, dark: { style: preset.style, sides: clone(preset.sides) } };
          if (!this.draft.calloutOverrides[type]) this.draft.calloutOverrides[type] = { light: {}, dark: {} };
          ['light', 'dark'].forEach(mode => {
            this.draft.calloutOverrides[type][mode].borderWidth = Number.isFinite(Number(frame.width)) ? Number(frame.width) : 1.5;
            this.draft.calloutOverrides[type][mode].borderRadius = Number.isFinite(Number(frame.radius)) ? Number(frame.radius) : 10;
          });
        } else {
          this.draft.frameSource = 'palette';
          this.draft.border = { light: normalizeNoteBorder(null, null), dark: normalizeNoteBorder(null, null) };
          this.draft.borderOverrides = {};
        }
        this.renderSafely();
      });
      const sideTitle = frameSection.createEl('p', { cls: 'esds-note-style-subheading', text: 'Отображаемые стороны' });
      const sides = frameSection.createDiv({ cls: 'esds-note-style-sides' });
      const border = this.getCurrentBorder();
      [['top', 'Сверху'], ['right', 'Справа'], ['bottom', 'Снизу'], ['left', 'Слева']].forEach(([side, label]) => {
        const item = sides.createEl('label', { cls: 'esds-note-style-side' });
        const checkbox = item.createEl('input', { attr: { type: 'checkbox' } });
        checkbox.checked = !!border.sides[side];
        item.createSpan({ text: label });
        checkbox.addEventListener('change', () => { this.setCurrentBorderSide(side, checkbox.checked); this.updatePreview(this.preview); });
      });
    }

    const controls = body.createDiv({ cls: 'esds-note-style-settings-section' });
    controls.createEl('strong', { text: 'Толщина, прозрачность и отступы' });
    controls.createEl('small', { cls: 'esds-note-style-help', text: 'Для прозрачности: 0% — полностью непрозрачно, 100% — полностью прозрачно. Текст блока остаётся непрозрачным.' });
    this.createRangeControl(controls, 'Прозрачность заливки', 'backgroundOpacity', 0, 100, 1, 100, '%', false, true);
    this.createRangeControl(controls, 'Прозрачность обводки', 'borderOpacity', 0, 100, 1, 100, '%', false, true);
    this.createRangeControl(controls, 'Толщина рамки', 'borderWidth', 0, 8, 0.25, 1, ' px');
    this.createRangeControl(controls, 'Скругление углов', 'borderRadius', 0, 24, 1, 1, ' px');
    this.createRangeControl(controls, 'Внутренний отступ сверху и снизу', 'paddingY', 4, 24, 1, 1, ' px');
    this.createRangeControl(controls, 'Внутренний отступ слева и справа', 'paddingX', 4, 28, 1, 1, ' px');
    this.createRangeControl(controls, 'Расстояние между заголовком и текстом', 'gap', 0, 20, 1, 1, ' px');
    this.createRangeControl(controls, 'Размер заголовка', 'titleSize', 10, 20, 0.5, 1, ' px');
    this.createRangeControl(controls, 'Размер текста', 'bodySize', 10, 18, 0.5, 1, ' px');
    this.renderColorControls(body);

    const previewWrap = body.createDiv({ cls: 'esds-block-builder-preview esds-note-style-preview-wrap' });
    previewWrap.createEl('strong', { text: 'Предпросмотр' });
    const preview = previewWrap.createDiv({ cls: `esds-preview esds-template-live-preview ${this.studio.selectedPalette.id} esds-palette-${this.studio.selectedPalette.id} ${this.studio.selectedBackground.id} esds-frames-from-palette` });
    this.studio.setPreviewTheme(preview, this.studio.selectedPalette, this.studio.selectedBackground, this.studio.selectedBlocks);
    this.studio.renderBlockGallery(preview, CALLOUTS.map(([key]) => key));
    this.preview = preview;
    this.updatePreview(preview);

    const actions = root.createDiv({ cls: 'esds-preview-actions esds-note-style-actions' });
    const reset = actions.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Сбросить локальные настройки', attr: { type: 'button' } });
    reset.addEventListener('click', () => {
      if (this.activeCallout) {
        delete this.draft.calloutOverrides[this.activeCallout];
        delete this.draft.borderOverrides[this.activeCallout];
        ['light', 'dark'].forEach(mode => { if (this.draft.colors[mode]) delete this.draft.colors[mode][this.activeCallout]; });
      } else {
        const base = BUILTIN_BLOCK_STYLES.find(item => item.id === 'soft') || BUILTIN_BLOCK_STYLES[0];
        this.draft.base = base.id;
        this.draft.style = { light: clone(base.style.light), dark: clone(base.style.dark) };
        this.draft.calloutOverrides = {};
        this.draft.border = { light: normalizeNoteBorder(null, null), dark: normalizeNoteBorder(null, null) };
        this.draft.borderOverrides = {};
        this.draft.colors = { light: {}, dark: {} };
        this.draft.frameSource = 'palette';
      }
      this.renderSafely();
    });
    const cancel = actions.createEl('button', { cls: 'esds-button esds-btn-quiet', text: 'Отмена', attr: { type: 'button' } });
    cancel.addEventListener('click', () => this.close());
    const apply = actions.createEl('button', { cls: 'esds-button esds-primary esds-btn-teal', text: 'Применить к этой заметке', attr: { type: 'button' } });
    apply.addEventListener('click', async () => {
      if (!this.file || !this.app.vault.getAbstractFileByPath(this.file.path)) {
        new Notice('Исходная заметка больше недоступна. Настройки не сохранены.');
        return;
      }
      apply.disabled = true;
      try {
        const currentId = safeNoteStyleId(this.draft.id) || makeNoteStyleId();
        const currentClass = `${NOTE_STYLE_CLASS_PREFIX}${currentId}`;
        const duplicateId = this.app.vault.getMarkdownFiles().some(noteFile => {
          if (noteFile.path === this.file.path) return false;
          const classes = normalizeClasses(this.app.metadataCache.getFileCache(noteFile)?.frontmatter?.cssclasses);
          return classes.includes(currentClass);
        });
        if (duplicateId) this.draft.id = makeNoteStyleId();
        const payload = normalizeLocalNoteStyle(this.draft, this.draft.id);
        if (!payload) throw new Error('Invalid local note style ID');
        await this.app.fileManager.processFrontMatter(this.file, frontmatter => {
          const classes = normalizeClasses(frontmatter.cssclasses);
          if (!classes.includes('esds-note')) classes.push('esds-note');
          const localClass = `${NOTE_STYLE_CLASS_PREFIX}${payload.id}`;
          const withoutOldLocal = classes.filter(name => !name.startsWith(NOTE_STYLE_CLASS_PREFIX) && name !== 'esds-frames-from-palette');
          if (!withoutOldLocal.includes(localClass)) withoutOldLocal.push(localClass);
          if (payload.frameSource === 'palette') withoutOldLocal.push('esds-frames-from-palette');
          frontmatter.cssclasses = [...new Set(withoutOldLocal)];
        });
        this.plugin.setCalloutStylesDisabledForFile(this.file, false);
        await this.app.vault.process(this.file, content => upsertNoteStyleMarker(content, payload));
        await this.plugin.refreshNoteStyles(this.file);
        new Notice(`Оформление применено только к заметке «${this.file.basename}».`);
        this.close();
      } catch (error) {
        console.error('ESDS local note style save failed:', error);
        new Notice('Не удалось сохранить оформление в эту заметку. Другие данные не изменены.');
        apply.disabled = false;
      }
    });
  }
}

module.exports = class EnglishStudyDesignStudio extends Plugin {
  async onload() {
    this.userData = ensureLibraryShape(null);
    await this.loadUserLibrary();
    this._refreshGeneratedStylesNow();
    this._generatedStylesTimer = null;
    this.noteStyleCache = new Map();
    this.disabledCalloutFilePaths = new Set();
    this.calloutDomObserver = null;
    this.registerEvent(this.app.metadataCache.on('changed', file => this.refreshNoteStyles(file)));
    this.registerEvent(this.app.vault.on('modify', file => {
      if (file && file.extension === 'md') this.refreshNoteStyles(file);
    }));
    this.registerEvent(this.app.vault.on('delete', file => {
      if (file && file.path) this.noteStyleCache.delete(file.path);
      this.updateNoteStyleCss();
    }));
    this.registerEvent(this.app.vault.on('rename', (file, oldPath) => {
      if (oldPath) this.noteStyleCache.delete(oldPath);
      if (file && file.extension === 'md') this.refreshNoteStyles(file);
      else this.updateNoteStyleCss();
    }));
    this.app.workspace.onLayoutReady(() => this.refreshNoteStyles());
    this.addRibbonIcon('palette', 'English Study Design Studio', () => this.openStudio());
    this.addCommand({ id: 'open-design-studio', name: 'Open English Study Design Studio', callback: () => this.openStudio() });
    this.addCommand({ id: 'export-user-library', name: 'Export English Study Design Studio library', callback: () => this.exportLibrary() });
  }
  onunload() {
    if (this._generatedStylesTimer) {
      window.clearTimeout(this._generatedStylesTimer);
      this._generatedStylesTimer = null;
    }
    if (this._calloutRefreshFrame !== null && this._calloutRefreshFrame !== undefined) {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this._calloutRefreshFrame);
      else window.clearTimeout(this._calloutRefreshFrame);
      this._calloutRefreshFrame = null;
    }
    if (this.calloutDomObserver) {
      this.calloutDomObserver.disconnect();
      this.calloutDomObserver = null;
    }
    this.disabledCalloutFilePaths?.clear();
    if (this.generatedStyle) this.generatedStyle.remove();
    if (this.noteStylesStyle) this.noteStylesStyle.remove();
    const localStyleNode = document.getElementById('esds-note-local-styles');
    if (localStyleNode) localStyleNode.remove();
  }
  collectCalloutViewRoots(view) {
    const found = new Set();
    const candidates = [view && view.containerEl, view && view.contentEl,
      view && view.previewMode && view.previewMode.containerEl,
      view && view.editor && view.editor.containerEl];
    candidates.forEach(node => {
      if (!node) return;
      if (typeof node.matches === 'function' && node.matches('.markdown-preview-view, .markdown-source-view')) found.add(node);
      if (typeof node.querySelectorAll === 'function') {
        node.querySelectorAll('.markdown-preview-view, .markdown-source-view').forEach(el => found.add(el));
      }
    });
    return found;
  }
  refreshDisabledCalloutViews() {
    if (!this.disabledCalloutFilePaths || !this.disabledCalloutFilePaths.size) return;
    const leaves = this.app.workspace.getLeavesOfType('markdown') || [];
    const openPaths = new Set();
    leaves.forEach(leaf => {
      const view = leaf && leaf.view;
      if (!view || !view.file) return;
      openPaths.add(view.file.path);
      if (!this.disabledCalloutFilePaths.has(view.file.path)) return;
      this.collectCalloutViewRoots(view).forEach(root => {
        if (root.getAttribute(CALLOUTS_DISABLED_ATTRIBUTE) !== 'true') {
          root.setAttribute(CALLOUTS_DISABLED_ATTRIBUTE, 'true');
        }
      });
    });
    // A closed note no longer needs a live-DOM opt-out. Its file already has
    // its ESDS classes removed, so a future fresh view will use the theme.
    this.disabledCalloutFilePaths.forEach(path => {
      if (!openPaths.has(path)) this.disabledCalloutFilePaths.delete(path);
    });
    if (!this.disabledCalloutFilePaths.size && this.calloutDomObserver) {
      this.calloutDomObserver.disconnect();
      this.calloutDomObserver = null;
    }
  }
  setCalloutStylesDisabledForFile(file, disabled) {
    if (!file || !file.path || !this.app.workspace || typeof this.app.workspace.getLeavesOfType !== 'function') return 0;
    if (!this.disabledCalloutFilePaths) this.disabledCalloutFilePaths = new Set();
    if (disabled) this.disabledCalloutFilePaths.add(file.path);
    else this.disabledCalloutFilePaths.delete(file.path);

    let changed = 0;
    const leaves = this.app.workspace.getLeavesOfType('markdown') || [];
    leaves.forEach(leaf => {
      const view = leaf && leaf.view;
      if (!view || !view.file || view.file.path !== file.path) return;
      this.collectCalloutViewRoots(view).forEach(root => {
        if (disabled) {
          if (root.getAttribute(CALLOUTS_DISABLED_ATTRIBUTE) !== 'true') {
            root.setAttribute(CALLOUTS_DISABLED_ATTRIBUTE, 'true');
            changed += 1;
          }
        } else if (root.hasAttribute(CALLOUTS_DISABLED_ATTRIBUTE)) {
          root.removeAttribute(CALLOUTS_DISABLED_ATTRIBUTE);
          changed += 1;
        }
      });
    });

    // Watch the workspace only while at least one note has had its ESDS Callout
    // styling removed. This catches replacement Reading/Live Preview roots and
    // applies the opt-out to newly created views of the same note. Attribute
    // changes are not observed, so setting the marker cannot cause a loop.
    const workspaceRoot = this.app.workspace && this.app.workspace.containerEl;
    if (disabled && !this.calloutDomObserver && typeof MutationObserver !== 'undefined' && workspaceRoot) {
      this.calloutDomObserver = new MutationObserver(() => {
        if (this._calloutRefreshFrame) return;
        const schedule = typeof requestAnimationFrame === 'function'
          ? requestAnimationFrame
          : callback => window.setTimeout(callback, 16);
        this._calloutRefreshFrame = schedule(() => {
          this._calloutRefreshFrame = null;
          this.refreshDisabledCalloutViews();
        });
      });
      // Obsidian may restore cssclasses on an existing Markdown root without
      // replacing the node. Watch class changes only; our marker is not observed.
      this.calloutDomObserver.observe(workspaceRoot, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['class']
      });
    } else if (!this.disabledCalloutFilePaths.size && this.calloutDomObserver) {
      this.calloutDomObserver.disconnect();
      this.calloutDomObserver = null;
    }
    return changed;
  }
  async loadUserLibrary() {
    try {
      // Obsidian stores this file in .obsidian/plugins/<plugin-id>/data.json.
      const stored = await this.loadData();
      const adapter = this.app.vault.adapter;
      let legacy = null;

      // Read the old custom file only if it already exists. Never create its folder.
      if (await adapter.exists(LEGACY_LIBRARY_PATH)) {
        try {
          const parsed = JSON.parse(await adapter.read(LEGACY_LIBRARY_PATH));
          if (parsed && typeof parsed === 'object') legacy = parsed;
        } catch (migrationError) {
          console.warn('ESDS legacy library could not be parsed:', migrationError);
        }
      }

      const hasStoredItems = stored && typeof stored === 'object' && (
        (typeof stored.activeBlockStyleId === 'string' && stored.activeBlockStyleId.length > 0) ||
        ['palettes', 'backgrounds', 'blockStyles', 'favorites', 'favoriteItems', 'recent', 'contentProfiles']
          .some(key => Array.isArray(stored[key]) && stored[key].length > 0) ||
        ['palettes', 'backgrounds', 'blockStyles'].some(kind => {
          const categories = stored.categories && stored.categories[kind];
          const builtins = DEFAULT_CATEGORIES[kind] || [];
          return Array.isArray(categories) && categories.some(category =>
            category && !builtins.some(item => item.id === category.id && item.name === category.name)
          );
        })
      );

      // Existing native data takes priority. Otherwise migrate the older library once.
      if (hasStoredItems) {
        this.userData = ensureLibraryShape(stored);
      } else if (legacy) {
        this.userData = ensureLibraryShape(legacy);
        await this.saveData(this.userData);
        // Migration is committed to data.json. Remove the old file afterwards,
        // then remove the legacy directory only if it is empty.
        try {
          await adapter.remove(LEGACY_LIBRARY_PATH);
          const legacyFolder = '.obsidian/english-study-design-studio';
          const remaining = await adapter.list(legacyFolder);
          if (!remaining.files.length && !remaining.folders.length) {
            await adapter.rmdir(legacyFolder, false);
          }
        } catch (cleanupError) {
          console.warn('ESDS old library cleanup skipped:', cleanupError);
        }
      } else {
        this.userData = ensureLibraryShape(stored || null);
      }
    } catch (error) {
      console.error('ESDS library load:', error);
      new Notice('Не удалось прочитать пользовательскую библиотеку.');
      this.userData = ensureLibraryShape(null);
    }
  }
  async saveUserLibrary() {
    try {
      this.userData = ensureLibraryShape(this.userData);
      await this.saveData(this.userData);
      return true;
    } catch (error) {
      console.error('ESDS library save:', error);
      new Notice('Не удалось сохранить пользовательскую библиотеку.');
      return false;
    }
  }
  refreshGeneratedStyles() {
    // Coalesce bursts of library CRUD into one generated-CSS rebuild.
    if (this._generatedStylesTimer) window.clearTimeout(this._generatedStylesTimer);
    this._generatedStylesTimer = window.setTimeout(() => {
      this._generatedStylesTimer = null;
      this._refreshGeneratedStylesNow();
    }, 32);
  }
  _refreshGeneratedStylesNow() {
    // User-generated CSS is optional. Avoid adding an empty style node for a fresh library.
    let style = this.generatedStyle;
    if (!style || !style.isConnected) {
      style = document.getElementById('esds-generated-user-styles');
    }
    const palettes = [...PALETTES.map(makePaletteCss), ...(this.userData.palettes || [])
      .filter(p => p && /^user-[a-z0-9-]+$/.test(p.id || '') && p.roles && ROLE_KEYS.every(k => isHexColor(p.roles[k])))
      .map(makePaletteCss)].join('\n');
    const backgrounds = (this.userData.backgrounds || [])
      .filter(bg => bg && /^bg-custom-[a-z0-9-]+$/.test(bg.id || '') && safeCssBackground(bg.light) && safeCssBackground(bg.dark || bg.light))
      .map(bg => {
        const light = bg.light;
        const dark = bg.dark || bg.light;
        const fg = isHexColor(bg.textColor) ? bg.textColor : '#302d31';
        const darkFg = isHexColor(bg.darkTextColor) ? bg.darkTextColor : '#e9eaf0';
        return `.markdown-preview-view.esds-note.${bg.id},.markdown-source-view.esds-note.${bg.id}{--note-background:${light};--esds-bg-fg:${fg};}\nbody.theme-dark .markdown-preview-view.esds-note.${bg.id},body.theme-dark .markdown-source-view.esds-note.${bg.id}{--note-background:${dark};--esds-bg-fg:${darkFg};}\n.esds-preview.${bg.id}{--note-background:${light};}\nbody.theme-dark .esds-preview.${bg.id}{--note-background:${dark};}\n.markdown-preview-view.esds-note.${bg.id},.markdown-source-view.esds-note.${bg.id}{color:var(--esds-bg-fg);--text-normal:var(--esds-bg-fg);}\n.markdown-preview-view.esds-note.${bg.id} h1,.markdown-preview-view.esds-note.${bg.id} h2,.markdown-preview-view.esds-note.${bg.id} h3,.markdown-preview-view.esds-note.${bg.id} h4,.markdown-preview-view.esds-note.${bg.id} h5,.markdown-preview-view.esds-note.${bg.id} h6{color:var(--esds-heading,var(--esds-bg-fg));}`;
      }).join('\n');
    const blockStyles = (this.userData.blockStyles || [])
      .map(normalizeBlockStyle)
      .map(makeBlockStyleCss)
      .join('\n');
    const generatedCss = [palettes, backgrounds, blockStyles].filter(Boolean).join('\n');
    if (!generatedCss) {
      if (style) style.remove();
      this.generatedStyle = null;
      return;
    }
    if (!style) {
      style = document.createElement('style');
      style.id = 'esds-generated-user-styles';
    }
    if (style.textContent !== generatedCss) style.textContent = generatedCss;
    if (!style.isConnected) document.head.appendChild(style);
    this.generatedStyle = style;
  }
  async refreshNoteStyles(file = null) {
    try {
      if (!this.noteStyleCache) this.noteStyleCache = new Map();
      if (file) {
        if (file.extension !== 'md') return;
        try {
          const content = await this.app.vault.cachedRead(file);
          const saved = decodeNoteStyleMarker(content);
          const config = saved ? normalizeLocalNoteStyle(saved, saved.id) : null;
          const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter || {};
          const classes = normalizeClasses(frontmatter.cssclasses);
          const localClass = config ? `${NOTE_STYLE_CLASS_PREFIX}${config.id}` : '';
          if (config && classes.includes('esds-note') && classes.includes(localClass)) {
            this.noteStyleCache.set(file.path, config);
          } else {
            this.noteStyleCache.delete(file.path);
          }
        } catch (readError) {
          this.noteStyleCache.delete(file.path);
          console.warn('ESDS local note style read failed:', readError);
        }
      } else {
        this.noteStyleCache.clear();
        const files = this.app.vault.getMarkdownFiles().filter(noteFile => {
          const frontmatter = this.app.metadataCache.getFileCache(noteFile)?.frontmatter || {};
          return normalizeClasses(frontmatter.cssclasses).includes('esds-note');
        });
        // Scan sequentially to keep memory use predictable on Android devices.
        for (const noteFile of files) {
          try {
            const content = await this.app.vault.cachedRead(noteFile);
            const saved = decodeNoteStyleMarker(content);
            const config = saved ? normalizeLocalNoteStyle(saved, saved.id) : null;
            if (!config) continue;
            const frontmatter = this.app.metadataCache.getFileCache(noteFile)?.frontmatter || {};
            const classes = normalizeClasses(frontmatter.cssclasses);
            const localClass = `${NOTE_STYLE_CLASS_PREFIX}${config.id}`;
            if (classes.includes(localClass)) this.noteStyleCache.set(noteFile.path, config);
          } catch (readError) {
            console.warn('ESDS local note style scan skipped:', noteFile.path, readError);
          }
        }
      }
      this.updateNoteStyleCss();
    } catch (error) {
      console.error('ESDS local note styles refresh failed:', error);
    }
  }
  updateNoteStyleCss() {
    const rules = [...(this.noteStyleCache || new Map()).values()].map(makeLocalNoteStyleCss).filter(Boolean);
    const css = rules.join('\n');
    let style = this.noteStylesStyle;
    if (!style || !style.isConnected) style = document.getElementById('esds-note-local-styles');
    if (!css) {
      if (style) style.remove();
      this.noteStylesStyle = null;
      return;
    }
    if (!style) {
      style = document.createElement('style');
      style.id = 'esds-note-local-styles';
    }
    if (style.textContent !== css) style.textContent = css;
    if (!style.isConnected) document.head.appendChild(style);
    this.noteStylesStyle = style;
  }
  openStudio() { new DesignStudioModal(this.app, this).open(); }
  async exportLibrary() {
    try {
      const adapter = this.app.vault.adapter;
      const folder = 'ESDS Exports';
      if (!(await adapter.exists(folder))) await adapter.mkdir(folder);
      await adapter.write(`${folder}/user-library-backup-${Date.now()}.json`, JSON.stringify(this.userData, null, 2));
      new Notice('Резервная копия пользовательской библиотеки сохранена в папке `ESDS Exports`.');
    } catch (error) {
      console.error(error);
      new Notice('Не удалось создать резервную копию библиотеки.');
    }
  }
};
