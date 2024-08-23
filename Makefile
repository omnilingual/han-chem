buildDir=.
entry=$(buildDir)/main.mjs

dev: $(entry)
	node $(entry);

build: clean $(entry)

$(entry):
	npx tsc --build;

clean:
	npx tsc --build --clean;

.PHONY: dev