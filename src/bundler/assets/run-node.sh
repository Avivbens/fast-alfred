#!/usr/bin/env bash

function has_node() {
    command -v node >/dev/null 2>&1
}

function run_node() {
    local script="$1"
    shift

    # An inherited flag would send node to wait on a stdin nobody writes
    unset fast_alfred_args_stdin

    if [ "$#" -eq 0 ]; then
        node "$script"
        return
    fi

    # Endpoint security agents kill `node` when long text sits on its command line, so the arguments travel over stdin
    printf '%s\0' "$@" | fast_alfred_args_stdin=1 node "$script"
}

if has_node; then
    run_node "$@"
else
    echo $'{"items":[{"title": "Couldn\'t find the `node` binary", "subtitle": "Make sure Node.js installed (HomeBrew recommended)", "icon": {"path": "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns"}}]}'
fi
