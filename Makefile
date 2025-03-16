SHELL:=/bin/bash

buildDir = ./
entryFile = $(buildDir)main.mjs

daemonStarter=pm2

entry:
	@echo "No command given.";

build:
	npx tsc --build;

clean:
	npx tsc --build --clean;

dev: $(entryFile)
	node $(entryFile);

start:
	mode=production $(daemonStarter) start $(buildDir)$(entryFile);

stop:
	$(daemonStarter) stop $(buildDir)$(entryFile);

show:
	$(daemonStarter) list;

.PHONY: build