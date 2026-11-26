const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const main = read('main.js');
const css = read('styles.css');
const manifest = JSON.parse(read('manifest.json'));
const versions = JSON.parse(read('versions.json'));
const paletteTemplate = JSON.parse(read('palette-template.json'));
const themePack = JSON.parse(read('theme-pack-template.json'));

assert.equal(manifest.version, '0.9.20');
assert.ok(versions['0.9.20']);
assert.equal(paletteTemplate.schemaVersion, 4);
assert.equal(themePack.items.palette.roles.letter.length, 7);
assert.equal(themePack.items.palette.dark.letter.length, 7);
assert.ok(main.includes('paletteSchemaVersion > 4'));
assert.ok(main.includes('payload = { schemaVersion: 4, type: \'esds-palette\', palette: item }'));
assert.ok(main.includes('LEGACY_ROLE_KEYS.every'));
assert.ok(main.includes("key === 'letter' ? roles.en : null"));
assert.ok(css.includes('var(--esds-letter'));
assert.ok(!/^\s*\.st-lt\s*\{/m.test(css));
assert.ok(!/^\s*(?:table|td|th)\s*\{/m.test(css));
assert.ok(css.includes('tr:not(:nth-child(even)) td:nth-child(1)'), 'column fills must preserve alternating row backgrounds');
assert.ok(css.includes('tr.is-selected td') && css.includes('!important'), 'selected row must override column fills');
assert.ok(css.includes('--esds-table-col-20-bg'), 'CSS must support up to 20 indexed columns');

const roleKeys = ['en','letter','ipa','translation','term','definition','focus','secondary','soft','heading','ink'];
const calloutKeys = ['rule','example','important','tip','warning','question','practice','success','info','note','quote','abstract'];
const contrastThresholds = { en:3, letter:3, ipa:4.5, translation:4.5, term:3, definition:4.5, focus:3, secondary:3, soft:4.5, heading:3, ink:4.5 };
const toHex = value => Array.isArray(value) ? '#' + value.map(v => Math.round(v).toString(16).padStart(2,'0')).join('') : value;
const luminance = value => {
  const rgb = (Array.isArray(value) ? value : [1,3,5].map(i => parseInt(value.slice(i,i+2),16))).map(v => v/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  return .2126*rgb[0] + .7152*rgb[1] + .0722*rgb[2];
};
const contrastRatio = (a,b) => { const x=luminance(a), y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
const dir = path.join(root, 'palettes/06-juicy-tropical');
const files = fs.readdirSync(dir).filter(name => /^\d{2}_.*\.json$/.test(name)).sort();
assert.equal(files.length, 25, 'expected exactly 25 tropical palette JSON files');
const backgroundSource = main.match(/const BACKGROUNDS = \[([\s\S]*?)\n\];/);
const blockSource = main.match(/const BUILTIN_BLOCK_STYLES = \[([\s\S]*?)\n\];/);
assert.ok(backgroundSource && blockSource, 'built-in background and block registries must exist');
const backgroundIds = new Set([...backgroundSource[1].matchAll(/id:\s*'([^']+)'/g)].map(match => match[1]));
const blockIds = new Set([...blockSource[1].matchAll(/id:\s*'([^']+)'/g)].map(match => match[1]));
const previewClasses = ['st-le','st-mi','st-ac','st-so','st-te','st-fo','st-lt','st-tr','st-pr','st-de','st-ex','st-im','st-wa','st-qu','st-su','st-co','st-sc','st-no','st-nu','st-qt','st-fa','st-ar','st-ct','st-ca','st-rs','st-da','st-pe','st-ev','st-td','st-ri'];
for (const className of previewClasses) assert.ok(main.includes(`['${className}'`), 'palette preview must include ' + className);
assert.ok(main.includes('this.renderBlockGallery(sample, CALLOUT_KEYS)'), 'palette preview must include all 12 Callout types');
assert.ok(main.includes("selectedRow.addClass('is-selected')"), 'palette preview must show selected table rows');
const names = [];
for (const file of files) {
  const payload = JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
  assert.equal(payload.schemaVersion, 4, file);
  assert.equal(payload.type, 'esds-palette', file);
  const p = payload.palette;
  names.push(p.name);
  assert.ok(backgroundIds.has(p.defaultBackground), file + ' default background must exist');
  assert.ok(blockIds.has(p.defaultBlocks), file + ' default block style must exist');
  for (const key of roleKeys) {
    assert.match(p.roles[key], /^#[0-9a-f]{6}$/i, file + ' roles.' + key);
    assert.match(p.dark[key], /^#[0-9a-f]{6}$/i, file + ' dark.' + key);
    assert.ok(contrastRatio(p.roles[key], '#FBF8F0') >= contrastThresholds[key] - 0.02, file + ' light contrast ' + key);
    assert.ok(contrastRatio(p.dark[key], '#202421') >= 4.5, file + ' dark contrast ' + key);
  }
  for (const key of calloutKeys) {
    assert.ok(p.callouts[key], file + ' callouts.' + key);
    assert.ok(p.darkCallouts[key], file + ' darkCallouts.' + key);
    assert.ok(p.calloutFrames[key], file + ' calloutFrames.' + key);
    assert.ok(contrastRatio(p.calloutTexts[key], p.calloutFills[key]) >= 4.5, file + ' Callout text/fill contrast ' + key);
    assert.ok(contrastRatio(p.darkCalloutTexts[key], p.darkCalloutFills[key]) >= 4.5, file + ' dark Callout text/fill contrast ' + key);
  }
  for (const mode of ['table','darkTable']) {
    assert.ok(p[mode].header && p[mode].body, file + ' ' + mode + ' header/body');
    const tableBg = mode === 'table' ? '#FFFFFF' : '#202421';
    assert.ok(contrastRatio(p[mode].header.text, p[mode].header.background) >= 4.5, file + ' ' + mode + ' header contrast');
    assert.ok(contrastRatio(p[mode].body.text, p[mode].body.background) >= 4.5, file + ' ' + mode + ' body contrast');
    assert.ok(contrastRatio(p[mode].body.text, p[mode].body.alternateBackground) >= 4.5, file + ' ' + mode + ' alternate row contrast');
    assert.ok(contrastRatio(p[mode].body.text, p[mode].body.selectedBackground) >= 4.5, file + ' ' + mode + ' selected row contrast');
    assert.ok(Array.isArray(p[mode].columns), file + ' ' + mode + ' columns');
    assert.ok(p[mode].columns.length >= 3, file + ' ' + mode + ' three columns');
    for (const column of p[mode].columns) {
      assert.ok(Number.isInteger(column.index) && column.index >= 1 && column.index <= 20, file + ' column index');
      for (const key of ['background','text','headerBackground','headerText','accent','border']) {
        assert.match(column[key], /^#[0-9a-f]{6}$/i, file + ' column.' + key);
      }
      assert.ok(contrastRatio(column.text, column.background) >= 4.5, file + ' column body contrast');
      assert.ok(contrastRatio(column.headerText, column.headerBackground) >= 4.5, file + ' column header contrast');
    }
  }
}
assert.equal(new Set(names).size, 25, 'palette names must be unique');
assert.deepEqual(names, [
'Mango Sunrise','Papaya Coral','Passion Bloom','Pineapple Cream','Guava Sorbet',
'Dragon Fruit','Coconut Lagoon','Banana Leaf','Papaya Sunset','Guava Coast',
'Mango Lassi','Tropical Rain','Hibiscus Punch','Coral Reef','Jungle Nectar',
'Monsoon Orchid','Citrus Canopy','Tamarind Spice','Aqua Papaya','Starfruit Glow',
'Tropical Dusk','Mango Noir','Flamingo Papaya','Emerald Island','Golden Maracuja'
]);

const helperMatch = main.match(/function normalizePaletteTable\(source\) \{[\s\S]*?(?=function makePaletteCss\()/);
assert.ok(helperMatch, 'palette table normalizer must exist');
const helpers = vm.runInNewContext(
  helperMatch[0] + ';({ normalizePaletteTable, paletteTableCss })',
  {
    TABLE_COLOR_KEYS: ['background','text','headerBackground','headerText','border','stripeBackground'],
    TABLE_COLUMN_COLOR_KEYS: ['background','text','headerBackground','headerText','border'],
    isValidPaletteColor: value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value),
    colorToHex: value => value
  }
);
const table = helpers.normalizePaletteTable({
  header:{background:'#ffffff',text:'#111111',accent:'#ff9900',border:'#dddddd'},
  body:{background:'#ffffff',text:'#222222',alternateBackground:'#f5f5f5'},
  columns:[{index:2,background:'#eeeeee',headerBackground:'#dddddd',accent:'#cc6600'}]
});
assert.equal(table.columns[0].index, 2);
const generated = helpers.paletteTableCss('.markdown-preview-view.esds-note.esds-palette-test', table);
assert.ok(generated.includes('--esds-table-header-bg:#ffffff;'));
assert.ok(generated.includes('--esds-table-col-2-accent:#cc6600;'));
assert.ok(!generated.includes('url('));
console.log('ESDS 0.9.20 validation passed: 25 palettes, light/dark roles, 12 callouts, indexed tables, CSS scoping.');
