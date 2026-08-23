# "buffer" module is required as a devDependency to build sha.js.
.DELETE_ON_ERROR:

ALL := \
	lib/@noble/hashes/legacy.js \
	lib/@noble/hashes/utils.js \
	lib/crypto-js/index.js \
	lib/hash.js/lib/hash/sha/1.js \
	lib/jssha/dist/sha1.js \
	lib/node-forge/lib/sha1.js \
	lib/sha.js/sha1.js \

MINJS_DST := ../../dist/sha1-uint8array.min.js

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
	--failAfterWarnings --format iife $< -o $@

lib/%.min.js: lib/%.js
	../../node_modules/.bin/terser $< -o $@ -c -m
	@ls -l $< $@

# The figures the README compatibility table quotes, in KB.
sizes: $(MINJS_DST) $(ALL:.js=.min.js)
	@for f in $^; do \
		printf '  %3dKB  %s\n' "$$(( ($$(wc -c < $$f) + 512) / 1024 ))" "$$f"; \
	done

$(MINJS_DST):
	$(MAKE) -C ../../builder smoke-minjs

####

clean:
	/bin/rm -fr lib

.PHONY: all clean sizes
