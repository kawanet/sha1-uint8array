ALL := \
	noble_hashes_legacy.js \

####

all: $(ALL)

noble_hashes_legacy.js: ../../node_modules/@noble/hashes/legacy.js
	../../node_modules/.bin/rollup --name noble_hashes_legacy \
	-p 'node-resolve={browser:true,preferBuiltins:false}' \
	-p 'commonjs' \
	--format iife $< -o $@
	@ls -l $@

####

clean:
	/bin/rm -fr $(ALL)

.PHONY: all clean
