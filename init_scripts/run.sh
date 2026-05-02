#!/bin/bash
cd "$(dirname "$0")/.."

python3 -m http.server 8080 &
SERVER_PID=$!

case "$(uname -s)" in
    Darwin*)  open http://localhost:8080 ;;
    *)        xdg-open http://localhost:8080 ;;
esac

trap "kill $SERVER_PID 2>/dev/null" EXIT
wait $SERVER_PID
