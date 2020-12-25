#!/usr/bin/env bash -c make

all: lib/sha1-uint8array.js dist/sha1-uint8array.min.js browser/test.js

dist/sha1-uint8array.min.js: browser/sha1-uint8array.js
	./node_modules/.bin/terser -c -m --mangle-props "regex=/^_/" --ecma 5 -o $@ $<

browser/sha1-uint8array.js: lib/sha1-uint8array.ts
	./node_modules/.bin/tsc -p browser
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@
	perl -i -pe 's#^#var createHash = (function(exports){# unless $$c++' $@
	echo 'return createHash;})(("undefined" !== typeof exports) && exports || this || {})' >> $@

browser/test.js: dist/sha1-uint8array.min.js
	./node_modules/.bin/browserify -o $@ test/*.js

lib/sha1-uint8array.js: lib/sha1-uint8array.ts
	./node_modules/.bin/tsc -p .

clean:
	/bin/rm -f dist/*.js browser/*.js
