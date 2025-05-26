#!/bin/bash
# Wrapper: Forward to actual setup-simple script in docs/setup-protocol
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec "$SCRIPT_DIR/docs/setup-protocol/setup-simple.sh" "$@"