buildDir = .
entry = $(buildDir)/main.mjs
allDependencies = $(filter-out $(wildcard **/*.d.*ts), $(wildcard **/*.*ts))

build: $(entry)

.PHONY: dev

$(entry): $(allDependencies)
	npx tsc --build;

dev: $(entry)
	node $(entry);

clean:
	npx tsc --build --clean;