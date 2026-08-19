ALL := \
	crypto_js.js \
	hash_js_lib_hash_sha_1.js \
	jssha_dist_sha1.js \
	noble_hashes_legacy.js \
	noble_hashes_utils.js \
	node_forge_lib_sha1.js \
	sha_js_sha1.js \

####

all: $(ALL)

crypto_js.js: ../../node_modules/crypto-js/index.js
	../../node_modules/.bin/rollup --name crypto_js \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@
	@printf "=> "; ../../node_modules/.bin/terser -c -m < $@ | wc -c

hash_js_lib_hash_sha_1.js: ../../node_modules/hash.js/lib/hash/sha/1.js
	../../node_modules/.bin/rollup --name hash_js_lib_hash_sha_1 \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@
	@printf "=> "; ../../node_modules/.bin/terser -c -m < $@ | wc -c

jssha_dist_sha1.js: ../../node_modules/jssha/dist/sha1.js
	../../node_modules/.bin/rollup --name jssha_dist_sha1 \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@
	@printf "=> "; ../../node_modules/.bin/terser -c -m < $@ | wc -c

noble_hashes_legacy.js: ../../node_modules/@noble/hashes/legacy.js
	../../node_modules/.bin/rollup --name noble_hashes_legacy \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@
	@printf "=> "; ../../node_modules/.bin/terser -c -m < $@ | wc -c

noble_hashes_utils.js: ../../node_modules/@noble/hashes/utils.js
	../../node_modules/.bin/rollup --name noble_hashes_utils \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@
	@printf "=> "; ../../node_modules/.bin/terser -c -m < $@ | wc -c

node_forge_lib_sha1.js: ../../node_modules/node-forge/lib/sha1.js
	../../node_modules/.bin/rollup --name node_forge_lib_sha1 \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@
	@printf "=> "; ../../node_modules/.bin/terser -c -m < $@ | wc -c

sha_js_sha1.js: ../../node_modules/sha.js/sha1.js
	../../node_modules/.bin/rollup --name sha_js_sha1 \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@
	@printf "=> "; ../../node_modules/.bin/terser -c -m < $@ | wc -c

####

clean:
	/bin/rm -fr $(ALL)

.PHONY: all clean
