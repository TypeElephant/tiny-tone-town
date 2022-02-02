#!/bin/bash

exit_code=0

# Validate
validenvs=(dev prod)

if [ ! $1 ]; then
  echo "Error: No environment provided"
  echo "Valid environments: ${validenvs[@]}"
  echo "Usage: bin/build.sh dev"
  exit 1
fi

case "${validenvs[@]}" in
  *$1*) ;;
  *)
    echo "Error: Invalid environment - '$1'"
    echo "Valid environments: ${validenvs[@]}"
    echo "Usage: bin/build.sh dev"
    exit 1
    ;;
esac

# Setup
echo "💻 Starting $1 build 💻"
rm -rf build
mkdir build
mkdir -p build/static/css
cp -r public/* build

# Build
echo "🔧 Creating $1 build 🔧"
case $1 in
  dev)
    npx tailwindcss -i ./src/index.css -o ./build/static/css/index.css
    node ./esbuild.js --minify=false --sourcemap=true
    ;;
  prod)
    npx tailwindcss -i ./src/index.css -o ./build/static/css/index.css --minify
    node ./esbuild.js --minify=true --sourcemap=false
    ;;
esac

exit_code=$?

echo "🚀 Finished $1 build 🚀"

