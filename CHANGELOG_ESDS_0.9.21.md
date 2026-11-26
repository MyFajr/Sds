# ESDS 0.9.21 — Palette collections

## Added
- Import a collection of ESDS palette JSON files from one ZIP archive.
- Choose an existing destination category or create a category automatically from the ZIP filename.
- When opened from a palette category, use that category as the suggested import destination.
- Add imported palettes to the existing library without replacing the library.
- Skip palettes already present by ID or normalized name.
- Export all palettes in a category to a ZIP archive, including a collection manifest.
- Added ZIP import/export actions to the palette toolbar and library tools.

## Safety
- ZIP import validates palette JSON and supported schema versions before adding.
- Existing palette entries are not overwritten.
- Full library restore remains a separate replacement workflow.

## Verification
- JavaScript syntax was checked after editing.
- Android WebView ZIP DEFLATE support still requires runtime verification. The importer reports a clear message if `DecompressionStream('deflate-raw')` is unavailable.
