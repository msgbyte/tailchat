#!/usr/bin/env sh
set -eu
# "linux/amd64" -> "amd64"
ARCH=${TARGETPLATFORM:6}
wget -O /boilerplate.zip $LINK$ARCH-node16.zip
