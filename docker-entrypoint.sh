#!/bin/sh
set -e

echo "VITE_DEW_QR_API_URL at runtime: $VITE_DEW_QR_API_URL"

# Write runtime env variables to env.js
cat <<EOF > /usr/share/nginx/html/env.js
window.DEW_QR_API_URL="${VITE_DEW_QR_API_URL:-http://localhost:8080}";
EOF

exec "$@"
