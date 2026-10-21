#!/usr/bin/env bash
# 漢鑒（Hanchem）本地发布驱动：in-place 编译，镜像同步，代码变更才重编译，任何变更都重启（数据启动时载入内存）。
# 需在仓库根目录运行（make deploy 已保证）。依赖 MSYS2 的 rsync/ssh。
set -euo pipefail

cd "$(dirname "$0")/.."   # 仓库根

HOST="nianyi@wangnianyi2001.com"
REMOTE="${HOST}:/home/nianyi/han-chem"
RSYNC="/c/msys64/usr/bin/rsync.exe"
SSH="/c/msys64/usr/bin/ssh.exe"
MARKER=".deploy-commit"
SYNC_DIRS="server core resources"
CODE_RE='^(server/src/|core/|main\.mts|tsconfig\.json|package(-lock)?\.json)'

sync_all() {
	echo ">> 同步入口 main.mjs"
	"$RSYNC" -e "$SSH" -az --delete main.mjs "$REMOTE/main.mjs"
	local d
	for d in $SYNC_DIRS; do
		echo ">> 同步 $d/"
		"$RSYNC" -e "$SSH" -az --delete "$d/" "$REMOTE/$d/"
	done
	echo ">> 同步 package 清单"
	"$RSYNC" -e "$SSH" -az package.json package-lock.json "$REMOTE/"
	echo ">> 同步服务脚本 deploy/"
	"$RSYNC" -e "$SSH" -az --delete deploy/ "$REMOTE/deploy/"
	"$SSH" "$HOST" "chmod +x ~/han-chem/deploy/run.sh && ln -sf ~/han-chem/deploy/run.sh ~/han-chem/run"
}

build() {
	echo ">> 本地编译（tsc，in-place）"
	npx tsc --build
}

do_deploy() {
	local prev changed
	prev="$(cat "$MARKER" 2>/dev/null || true)"
	if [ -z "$prev" ]; then
		prev="<首次部署>"
		changed="$(git ls-files)"
	else
		changed="$(git diff --name-only "$prev"...HEAD)"
	fi
	echo "== 相对 $prev 的变更 =="
	echo "$changed"

	if [ -z "$changed" ]; then
		echo ">> 无变更，跳过部署"
		git rev-parse HEAD > "$MARKER"
		return 0
	fi

	if echo "$changed" | grep -Eq "$CODE_RE"; then
		echo ">> 检测到代码变更：本地编译"
		build
	fi

	sync_all

	echo ">> 重启服务"
	"$SSH" "$HOST" "~/han-chem/run restart"

	git rev-parse HEAD > "$MARKER"
	echo ">> 已记录部署点 $(git rev-parse --short HEAD)"
}

svc() { "$SSH" "$HOST" "~/han-chem/run $1"; }

case "${1:-deploy}" in
	deploy)          do_deploy ;;
	sync)            sync_all ;;
	build)           build ;;
	status|restart|start|stop) svc "$1" ;;
	*) echo "usage: $0 {deploy|sync|build|status|restart|start|stop}"; exit 2 ;;
esac
