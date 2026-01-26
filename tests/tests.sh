#!/bin/bash

REL_PATH=$(dirname "$0")
CURRENT_DIR=$(pwd)

if ! command -v pm2 &> /dev/null
then
  echo "pm2 is not installed or not in PATH"
  exit 1
fi

echo '######################'
echo '### Running tests! ###'
echo '######################'

echo '### Stopping previous test processes (if any)'
pm2 delete new-post-back-test 2>/dev/null || true
pm2 delete new-post-front-test 2>/dev/null || true

echo '### Backend'

cd ../back || exit 1

echo '### Running fixtures'
npm run seed:test

echo '### Running Backend server in test mode'
pm2 start "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" \
  --name "new-post-back-test" -- \
  -NoProfile -ExecutionPolicy Bypass -Command "npm run start:test"

echo '### Frontend'
cd ../front || exit 1

echo '### Running Frontend in test mode'
pm2 start "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" \
  --name "new-post-front-test" -- \
  -NoProfile -ExecutionPolicy Bypass -Command "npm run start:test"

while ! (echo > /dev/tcp/localhost/5183) 2>/dev/null; do
  sleep 0.1
done

echo '### Running tests'

cd '../tests' || exit 1

if [ -z "$1" ]; then
  # Если аргумент не передан, запускаем все тесты
  npx codeceptjs run --steps
else
  # Если передан аргумент, запускаем тесты с этим тегом
  npx codeceptjs run --steps --grep "$1"
fi

EXIT_CODE=$?

echo '### Stopping test processes'
pm2 delete new-post-back-test 2>/dev/null || true
pm2 delete new-post-front-test 2>/dev/null || true

exit ${EXIT_CODE}