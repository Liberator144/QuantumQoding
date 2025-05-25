#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  # Prints a debug message prefixed with "husky (debug) -" if debugging is enabled.
  #
  # Arguments:
  #
  # * Message to display as a debug log.
  #
  # Outputs:
  #
  # * Writes the debug message to STDOUT if the HUSKY_DEBUG environment variable is set to "1".
  #
  # Example:
  #
  # ```bash
  # export HUSKY_DEBUG=1
  # debug "Starting pre-commit hook"
  # # Output: husky (debug) - Starting pre-commit hook
  # ```
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exitCode="$?"

  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  exit $exitCode
fi
