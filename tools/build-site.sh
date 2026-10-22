#!/bin/sh
# Deploy folder banao: sirf web app ki files → site/ (Cloudflare yahi upload karta hai).
# wrangler.jsonc "build.command" isse chalata hai — local `wrangler deploy` aur Cloudflare Git builds dono mein.
set -e
cd "$(dirname "$0")/.."
rm -rf site
mkdir -p site/audio site/img
cp index.html style.css manifest.webmanifest sw.js icon.svg icon-192.png icon-512.png *.js site/
rm -f site/validate.js site/boot-test.js
cp audio/*.mp3 site/audio/
cp img/*.jpg img/*.png site/img/
echo "site/: $(find site -type f | wc -l) files, $(du -sh site | cut -f1)"
