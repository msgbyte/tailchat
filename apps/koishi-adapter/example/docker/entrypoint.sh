#!/usr/bin/env sh
set -eu

chown -R root:root /koishi
if [ ! -e "/koishi/package.json" ]; then
  unzip -d /koishi /boilerplate.zip
  sed -i '1i host: 0.0.0.0' /koishi/koishi.yml
fi

exec "$@"
