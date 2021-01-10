#!/usr/bin/env bash -c make

all: ../dist/sha1-uint8array.min.js ../build/test.js

../dist/sha1-uint8array.min.js: ../build/sha1-uint8array.browser.js
	../node_modules/.bin/terser -c -m --mangle-props "regex=/^_/" --ecma 5 -o $@ $<

../build/sha1-uint8array.browser.js: ../build/sha1-uint8array.js
	cp $< $@
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@
	perl -i -pe 's#^#var createHash = (function(exports){# unless $$c++' $@
	echo 'return createHash;})(("undefined" !== typeof exports) && exports || this || {})' >> $@

../build/sha1-uint8array.js: ../lib/*.ts
	../node_modules/.bin/tsc -p ../browser

../build/test.js: ../lib/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ..
	../node_modules/.bin/browserify -o $@ ../test/*.js

clean:
	/bin/rm -fr ../build dist/*.js

test: all
	open ../browser/test.html

.PHONY: all clean test
