#!/bin/bash
set -euo pipefail

echo "=== Cargolane verification ==="
echo "Running: node check.mjs"
node check.mjs
echo ""
echo "=== Verification complete ==="
