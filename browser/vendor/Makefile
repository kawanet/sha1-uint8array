ALL := \
	lib/@noble/hashes/legacy.js \
	lib/@noble/hashes/utils.js \
	lib/crypto-js/index.js \
	lib/hash.js/lib/hash/sha/1.js \
	lib/jssha/dist/sha1.js \
	lib/node-forge/lib/sha1.js \
	lib/sha.js/sha1.js \

####

# Derive rollup's --name from the target path: drop "@", turn "/", "-" and "."
# into "_". $* only has a value while a recipe runs, so this must be = not :=.
NAME = $(subst /,_,$(subst -,_,$(subst .,_,$(subst @,,$*))))

all: $(ALL)

lib/%.js: ../../node_modules/%.js
	@mkdir -p $(dir $@)
	../../node_modules/.bin/rollup --name $(NAME) \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@
	@printf "=> "; ../../node_modules/.bin/terser -c -m < $@ | wc -c

####

clean:
	/bin/rm -fr lib

.PHONY: all clean
