#!/bin/sh
set -eu

export PORT="${PORT:-80}"

cat > /usr/share/nginx/html/env.js <<EOF
window._env_ = {
  REACT_APP_API_URL: "${REACT_APP_API_URL:-http://localhost:8083/api}"
};
EOF
