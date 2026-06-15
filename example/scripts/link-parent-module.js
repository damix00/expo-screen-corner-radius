// Metro 0.84+ (Expo SDK 56) no longer resolves the parent package through
// `resolver.extraNodeModules` alone, so we symlink the library into the
// example's node_modules. This only runs for this private example app and is
// never published to npm.
const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '..', '..');
const link = path.resolve(__dirname, '..', 'node_modules', 'expo-screen-corner-radius');

// Remove an existing symlink (or stale entry) before relinking. Leave a real
// installed directory untouched so we never clobber unexpected contents.
const existing = fs.existsSync(link) ? fs.lstatSync(link) : null;
if (existing && existing.isSymbolicLink()) {
  fs.unlinkSync(link);
} else if (existing) {
  console.log('Skipping link: a non-symlink already exists at', link);
  process.exit(0);
}

fs.symlinkSync(target, link, 'dir');
console.log('Linked expo-screen-corner-radius ->', target);
