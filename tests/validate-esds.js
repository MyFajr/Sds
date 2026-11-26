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
assert.ok(!/^\\s*\\.st-lt\\s*\\{/m.test(css));
assert.ok(!/^\\s*(?:table|td|th)\\s*\\{/m.test(css));

const roleKeys = ['en','letter','ipa','translation','term','definition','focus','secondary','soft','heading','ink'];
const calloutKeys = ['rule','example','important','tip','warning','question','practice','success','info','note','quote','abstract'];
const dir = path.join(root, 'palettes/06-juicy-tropical');
const files = fs.readdirSync(dir).filter(name => /^\\d{2}_.*\\.json$/.test(name)).sort();
assert.equal(files.length, 25, 'expected exactly 25 tropical palette JSON files');
const names = [];
for (const file of files) {
  const payload = JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
  assert.equal(payload.schemaVersion, 4, file);
  assert.equal(payload.type, 'esds-palette', file);
  const p = payload.palette;
  names.push(p.name);
  for (const key of roleKeys) {
    assert.match(p.roles[key], /^#[0-9a-f]{6}$/i, file + ' roles.' + key);
    assert.match(p.dark[key], /^#[0-9a-f]{6}$/i, file + ' dark.' + key);
  }
  for (const key of calloutKeys) {
    assert.ok(p.callouts[key], file + ' callouts.' + key);
    assert.ok(p.darkCallouts[key], file + ' darkCallouts.' + key);
    assert.ok(p.calloutFrames[key], file + ' calloutFrames.' + key);
  }
  for (const mode of ['table','darkTable']) {
    assert.ok(p[mode].header && p[mode].body, file + ' ' + mode + ' header/body');
    assert.ok(Array.isArray(p[mode].columns), file + ' ' + mode + ' columns');
    assert.ok(p[mode].columns.length >= 3, file + ' ' + mode + ' three columns');
    for (const column of p[mode].columns) {
      assert.ok(Number.isInteger(column.index) && column.index >= 1 && column.index <= 20, file + ' column index');
      for (const key of ['background','text','headerBackground','headerText','accent','border']) {
        assert.match(column[key], /^#[0-9a-f]{6}$/i, file + ' column.' + key);
      }
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
