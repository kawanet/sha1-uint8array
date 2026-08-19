ALL := \
	crypto_js.js \
	hash_js_lib_hash_sha_1.js \
	noble_hashes_legacy.js \
	noble_hashes_utils.js \

####

all: $(ALL)

crypto_js.js: ../../node_modules/crypto-js/index.js
	../../node_modules/.bin/rollup --name crypto_js \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@

hash_js_lib_hash_sha_1.js: ../../node_modules/hash.js/lib/hash/sha/1.js
	../../node_modules/.bin/rollup --name hash_js_lib_hash_sha_1 \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@

noble_hashes_legacy.js: ../../node_modules/@noble/hashes/legacy.js
	../../node_modules/.bin/rollup --name noble_hashes_legacy \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@

noble_hashes_utils.js: ../../node_modules/@noble/hashes/utils.js
	../../node_modules/.bin/rollup --name noble_hashes_utils \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@

####

clean:
	/bin/rm -fr $(ALL)

.PHONY: all clean
