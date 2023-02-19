#!/usr/bin/env bash -c make

ALL=\
	lib/sha1-uint8array.js \
	dist/sha1-uint8array.min.js \
	build/test.js \

all: $(ALL)

dist/sha1-uint8array.min.js: build/bundle.js
	@mkdir -p dist
	node_modules/.bin/terser -c -m --mangle-props "regex=/^_/" --ecma 5 -o $@ $<

build/bundle.js: build/es5/sha1-uint8array.js
	echo 'var SHA1 = ("undefined" !== typeof exports ? exports : {});' > $@
	echo '!(function(exports) {' >> $@
	cat $< >> $@
	echo '})(SHA1)' >> $@
	perl -i -pe 's#^("use strict"|Object.defineProperty|exports.*= void 0)#// $$&#' $@

build/es5/%.js: lib/%.ts
	node_modules/.bin/tsc -p tsconfig-es5.json

build/test.js: all
	node_modules/.bin/browserify --list test/*.js \
		-t [ browserify-sed 's#(require\("(?:../)+)("\))#$$1browser/import$$2#' ] | grep -v node_modules/ | sort
	node_modules/.bin/browserify -o $@ test/*.js \
		-t [ browserify-sed 's#(require\("(?:../)+)("\))#$$1browser/import$$2#' ]

lib/%.js: lib/%.ts
	node_modules/.bin/tsc -p tsconfig.json

clean:
	/bin/rm -fr build dist/*.js lib/*.js test/*.js

sizes:
	wc -c dist/sha1-uint8array.min.js
	node_modules/.bin/browserify node_modules/hash.js/lib/hash.js | node_modules/.bin/terser -c -m | wc -c
	wc -c node_modules/jssha/dist/sha1.js
	cat node_modules/crypto-js/*.js | node_modules/.bin/terser -c -m | wc -c
	wc -c node_modules/jshashes/hashes.min.js
	node_modules/.bin/browserify node_modules/sha.js/sha1.js | node_modules/.bin/terser -c -m | wc -c
	node_modules/.bin/browserify node_modules/create-hash/browser.js | node_modules/.bin/terser -c -m | wc -c
	cat node_modules/tiny-sha1/dist/tiny-sha1.js | node_modules/.bin/terser -c -m | wc -c

test: all
	node_modules/.bin/mocha test/*.js
	node -e 'console.log(require("./dist/sha1-uint8array.min.js").createHash().digest("hex"))'

.PHONY: all clean test
