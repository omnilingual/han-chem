SHELL:=/bin/bash

# ---- 本地构建 ----
buildDir=./
entryFile=$(buildDir)main.mjs

build:
	npx tsc --build;

clean:
	npx tsc --build --clean;

dev:
	mode=dev node $(entryFile);

# ---- 发布（逻辑在 deploy/deploy.sh，Makefile 只做薄封装） ----
deploy:
	bash deploy/deploy.sh deploy

deploy-sync:
	bash deploy/deploy.sh sync

svc-status:
	bash deploy/deploy.sh status

svc-restart:
	bash deploy/deploy.sh restart

svc-start:
	bash deploy/deploy.sh start

svc-stop:
	bash deploy/deploy.sh stop

.PHONY: build clean dev deploy deploy-sync svc-status svc-restart svc-start svc-stop
