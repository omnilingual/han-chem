#!/usr/bin/env bash
# 漢鑒服务管理：pidfile 放 /tmp（与 nohup 进程同生命周期），pgrep 兜底。
set -euo pipefail

cd "$(dirname "$(readlink -f "$0")")/.."   # 切到 ~/han-chem

NAME="hanchem"
PIDDIR="/tmp/${NAME}"
PIDFILE="${PIDDIR}/prod.pid"
LOGFILE="${PIDDIR}/prod.log"
PROC_RE="^node main\.mjs"

mkdir -p "$PIDDIR"

find_pid() {
	local p
	if [ -f "$PIDFILE" ]; then
		p="$(cat "$PIDFILE" 2>/dev/null || true)"
		if [ -n "$p" ] && kill -0 "$p" 2>/dev/null; then
			echo "$p"; return 0
		fi
	fi
	pgrep -f "$PROC_RE" | head -1 || true
}

start() {
	local p; p="$(find_pid)"
	if [ -n "$p" ]; then echo "already running (pid $p)"; return 0; fi
	nohup env mode=production node main.mjs >>"$LOGFILE" 2>&1 &
	echo $! > "$PIDFILE"
	echo "started (pid $!)"
}

stop() {
	local p; p="$(find_pid)"
	if [ -z "$p" ]; then echo "not running"; rm -f "$PIDFILE"; return 0; fi
	kill "$p" 2>/dev/null || true
	for _ in $(seq 1 20); do kill -0 "$p" 2>/dev/null || break; sleep 0.2; done
	rm -f "$PIDFILE"
	echo "stopped (was pid $p)"
}

restart() { stop; sleep 1; start; }

status() {
	local p; p="$(find_pid)"
	if [ -n "$p" ]; then echo "running (pid $p)"; else echo "not running"; fi
}

case "${1:-status}" in
	start)   start ;;
	stop)    stop ;;
	restart) restart ;;
	status)  status ;;
	*) echo "usage: $0 {start|stop|restart|status}"; exit 2 ;;
esac
