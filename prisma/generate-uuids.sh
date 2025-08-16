#!/usr/bin/env bash

# Why: Quickly produce a requested number of PostgreSQL-compatible UUID v4 values
# for manual insertion. Keeps output simple (newline-delimited) so it
# can be piped or pasted directly into SQL INSERT value lists.

set -euo pipefail

print_usage() {
	echo "Usage: $0 <count>" >&2
	echo "  <count>  Positive integer number of UUIDs to generate" >&2
}

if [[ ${1-} == "-h" || ${1-} == "--help" || $# -ne 1 ]]; then
	if [[ $# -ne 1 ]]; then
		[[ $# -eq 0 ]] || echo "Error: exactly one argument expected" >&2
	fi
	print_usage
	exit 1
fi

COUNT="$1"
if ! [[ "$COUNT" =~ ^[0-9]+$ ]] || [[ "$COUNT" -le 0 ]]; then
	echo "Error: count must be a positive integer" >&2
	exit 2
fi

# Choose a generator; prefer uuidgen if present for clarity; fallback to openssl.
have_uuidgen=0
command -v uuidgen >/dev/null 2>&1 && have_uuidgen=1

gen_uuid() {
	if [[ $have_uuidgen -eq 1 ]]; then
		uuidgen | tr 'A-Z' 'a-z'
	else
		# openssl fallback: 16 random bytes -> format as UUID v4 (set version & variant bits)
		# Rationale: Ensures correct version and variant even without uuidgen.
		local hex
		hex=$(openssl rand -hex 16) || return 1
		# Bytes: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
		local time_low=${hex:0:8}
		local time_mid=${hex:8:4}
		local time_hi_and_version=${hex:12:4}
		local clock_seq_hi_and_reserved=${hex:16:2}
		local clock_seq_low=${hex:18:2}
		local node=${hex:20:12}
		# Set version (4) in time_hi_and_version high nibble
		time_hi_and_version=$(printf '%x%s' $((0x${time_hi_and_version:0:1} & 0x0 | 0x4)) ${time_hi_and_version:1:3})
		# Set variant (10xx) in clock_seq_hi_and_reserved high bits
		clock_seq_hi_and_reserved=$(printf '%x' $(((0x$clock_seq_hi_and_reserved & 0x3f) | 0x80)))
		printf '%s-%s-%s-%s%s-%s\n' "$time_low" "$time_mid" "$time_hi_and_version" "$clock_seq_hi_and_reserved" "$clock_seq_low" "$node"
	fi
}

for ((i=0; i<COUNT; i++)); do
	gen_uuid || { echo "Error generating UUID" >&2; exit 3; }
done

exit 0
