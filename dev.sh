#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT/.run"
LOG_DIR="$ROOT/logs"
BACKEND_PID="$RUN_DIR/backend.pid"
FRONTEND_PID="$RUN_DIR/frontend.pid"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
STARTED_BY_SCRIPT=0

# on_exit: if this script started services in foreground mode, stop them on exit
on_exit(){
  if [ "$STARTED_BY_SCRIPT" -eq 1 ]; then
    echo "\nShutting down services started by this script..."
    stop
  fi
}
trap on_exit EXIT INT TERM

usage(){
  cat <<EOF
Usage: $0 <start|stop|restart|status>

Commands:
  start    Create venv (if missing), install backend deps, start backend and frontend
  stop     Stop backend and frontend started by this script
  restart  Stop then start
  status   Show running status and PID files

Logs: $LOG_DIR
PID files: $RUN_DIR
EOF
}

ensure_dirs(){
  mkdir -p "$RUN_DIR" "$LOG_DIR"
}

start(){
  ensure_dirs
  # cleanup stale pid files
  if [ -f "$BACKEND_PID" ]; then
    bp=$(cat "$BACKEND_PID")
    if ! kill -0 $bp 2>/dev/null; then
      echo "Found stale backend pid-file (pid $bp). Removing."
      rm -f "$BACKEND_PID"
    fi
  fi
  if [ -f "$FRONTEND_PID" ]; then
    fp=$(cat "$FRONTEND_PID")
    if ! kill -0 $fp 2>/dev/null; then
      echo "Found stale frontend pid-file (pid $fp). Removing."
      rm -f "$FRONTEND_PID"
      # try to remove stale next dev lock if present
      if [ -f "$ROOT/src/frontend_dovydive/.next/dev/lock" ]; then
        echo "Removing stale Next.js dev lock file"
        rm -f "$ROOT/src/frontend_dovydive/.next/dev/lock" || true
      fi
    fi
  fi

  # Backend: ensure venv and requirements
  if [ ! -d "$ROOT/.venv" ]; then
    echo "Creating Python venv at $ROOT/.venv"
    python3 -m venv "$ROOT/.venv"
  fi

  echo "Installing backend requirements (quiet)..."
  "$ROOT/.venv/bin/python" -m pip install --upgrade pip setuptools wheel >/dev/null 2>&1 || true
  "$ROOT/.venv/bin/python" -m pip install -r "$ROOT/requirements-backend.txt" >/dev/null 2>&1 || true

  # check if port 8000 is free
  if ss -ltnp 2>/dev/null | grep -q ":8000 "; then
    echo "Port 8000 appears in use; skipping backend start to avoid conflict. See $BACKEND_LOG for details."
  else
    if [ -f "$BACKEND_PID" ] && kill -0 "$(cat "$BACKEND_PID")" 2>/dev/null; then
      echo "Backend already running (pid $(cat "$BACKEND_PID"))."
    else
      echo "Starting backend (uvicorn) -> $BACKEND_LOG"
      nohup "$ROOT/.venv/bin/python" -m uvicorn src.backend.app.api.main:app --reload --host 127.0.0.1 --port 8000 >"$BACKEND_LOG" 2>&1 &
      echo $! > "$BACKEND_PID"
      sleep 0.4
    fi
  fi

  # Frontend: install and start Next.js dev
  if ! command -v npm >/dev/null 2>&1; then
    echo "npm not found in PATH. Please install Node.js/npm to run frontend." >&2
  else
    pushd "$ROOT/src/frontend_dovydive" >/dev/null
    if [ ! -d node_modules ]; then
      echo "Installing frontend npm dependencies (this may take a moment)..."
      npm install --silent
    fi
    if [ -f "$FRONTEND_PID" ] && kill -0 "$(cat "$FRONTEND_PID")" 2>/dev/null; then
      echo "Frontend already running (pid $(cat "$FRONTEND_PID"))."
    else
      # ensure .next dev folder exists and remove stale lock if any (handled above for stale pid)
      mkdir -p "$ROOT/src/frontend_dovydive/.next/dev" 2>/dev/null || true
      echo "Starting frontend (next dev) -> $FRONTEND_LOG"
      nohup npm run dev >"$FRONTEND_LOG" 2>&1 &
      echo $! > "$FRONTEND_PID"
      sleep 0.4
    fi
    popd >/dev/null
  fi

  echo "Started. Backend: http://127.0.0.1:8000  Frontend: http://localhost:3000"
  echo "Backend log: $BACKEND_LOG"
  echo "Frontend log: $FRONTEND_LOG"
}

stop(){
  echo "Stopping services..."
  if [ -f "$FRONTEND_PID" ]; then
    pid=$(cat "$FRONTEND_PID")
    echo "Killing frontend pid $pid"
    kill $pid 2>/dev/null || true
    rm -f "$FRONTEND_PID"
  fi
  if [ -f "$BACKEND_PID" ]; then
    pid=$(cat "$BACKEND_PID")
    echo "Killing backend pid $pid"
    kill $pid 2>/dev/null || true
    rm -f "$BACKEND_PID"
  fi
  echo "Stopped. Logs remain in $LOG_DIR"
}

status(){
  echo "Status:"
  if [ -f "$BACKEND_PID" ]; then
    bp=$(cat "$BACKEND_PID")
    if kill -0 $bp 2>/dev/null; then
      echo " backend running (pid $bp)"
    else
      echo " backend pid-file exists but process not running (pid $bp)"
    fi
  else
    echo " backend not running"
  fi

  if [ -f "$FRONTEND_PID" ]; then
    fp=$(cat "$FRONTEND_PID")
    if kill -0 $fp 2>/dev/null; then
      echo " frontend running (pid $fp)"
    else
      echo " frontend pid-file exists but process not running (pid $fp)"
    fi
  else
    echo " frontend not running"
  fi
}

tail_logs(){
  # ensure log files exist so tail doesn't exit
  touch "$BACKEND_LOG" "$FRONTEND_LOG"
  echo "Tailing logs (backend then frontend). Press Ctrl+C to stop and shut down services started by this script."
  # Use -F so tail follows renamed/recreated files
  tail -n +1 -F "$BACKEND_LOG" "$FRONTEND_LOG"
}

case ${1:-} in
  start)
    # behave like previous start: start in background and exit
    start
    ;;
  "")
    # default: start and then run logs in foreground; when interrupted, services will be stopped
    STARTED_BY_SCRIPT=1
    start
    tail_logs
    ;;
  stop)
    stop
    ;;
  restart)
    stop
    start
    ;;
  status)
    status
    ;;
  *)
    usage
    exit 1
    ;;
esac
