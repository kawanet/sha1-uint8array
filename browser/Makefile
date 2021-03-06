#!/usr/bin/env bash -c make

all: dist test

dist: ../dist/sha1-uint8array.min.js

../dist/sha1-uint8array.min.js: ../build/bundle.js
	../node_modules/.bin/terser -c -m --mangle-props "regex=/^_/" --ecma 5 -o $@ $<

../build/bundle.js: ../build/lib/sha1-uint8array.js
	echo 'var SHA1 = ("undefined" !== typeof exports ? exports : {});' > $@
	echo '!(function(exports) {' >> $@
	cat $< >> $@
	echo '})(SHA1)' >> $@
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@

# ES5
test-es5: dist ../build/lib/sha1-uint8array.js
	../node_modules/.bin/browserify --list ../build/test/*.js \
		-t [ browserify-sed 's#(require\("(?:../)+)("\))#$$1../browser/import$$2#' ] \
		-t [ browserify-sed 's#(require\("(?:../)+)(package.json"\))#$$1../$$2#' ] | sort
	../node_modules/.bin/browserify -o ../build/test.js ../build/test/*.js \
		-t [ browserify-sed 's#(require\("(?:../)+)("\))#$$1../browser/import$$2#' ] \
		-t [ browserify-sed 's#(require\("(?:../)+)(package.json"\))#$$1../$$2#' ]

../build/lib/sha1-uint8array.js: ../lib/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ../browser

# ES2018
test: dist ../lib/sha1-uint8array.js
	../node_modules/.bin/browserify --list ../test/*.js \
		-t [ browserify-sed 's#(require\("(?:../)+)("\))#$$1browser/import$$2#' ] | sort
	../node_modules/.bin/browserify -o ../build/test.js ../test/*.js \
		-t [ browserify-sed 's#(require\("(?:../)+)("\))#$$1browser/import$$2#' ]

../lib/sha1-uint8array.js: ../lib/*.ts ../test/*.ts
	../node_modules/.bin/tsc -p ..

clean:
	/bin/rm -fr ../build ../dist/*.js ../lib/*.js ../test/*.js

sizes:
	wc -c ../dist/sha1-uint8array.min.js
	../node_modules/.bin/browserify ../node_modules/hash.js/lib/hash.js | ../node_modules/.bin/terser -c -m | wc -c
	wc -c ../node_modules/jssha/dist/sha1.js
	cat ../node_modules/crypto-js/*.js | ../node_modules/.bin/terser -c -m | wc -c
	wc -c ../node_modules/jshashes/hashes.min.js
	../node_modules/.bin/browserify ../node_modules/sha.js/sha1.js | ../node_modules/.bin/terser -c -m | wc -c
	../node_modules/.bin/browserify ../node_modules/create-hash/browser.js | ../node_modules/.bin/terser -c -m | wc -c
	cat ../node_modules/tiny-sha1/dist/tiny-sha1.js | ../node_modules/.bin/terser -c -m | wc -c

.PHONY: all clean test
