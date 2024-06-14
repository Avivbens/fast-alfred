#!/usr/bin/env bash

function has_node() {
    command -v node >/dev/null 2>&1
}

if has_node; then
    node "$@"
else
    echo $'{"items":[{"title": "Couldn\'t find the `node` binary", "subtitle": "Make sure Node.js installed (HomeBrew recommended)", "icon": {"path": "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns"}}]}'
fi
