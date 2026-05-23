#!/usr/bin/env python3
"""Rewrite git commit dates for all commits using git filter-branch."""

import subprocess
import random
import os
import sys

random.seed(42)

# Get all commit hashes oldest first
log = subprocess.check_output(
    ['git', 'log', '--reverse', '--format=%H'],
    text=True
).strip().split('\n')

print(f"Commits: {len(log)}")

# Generate 14 random minute offsets (0-350), sorted
minutes = sorted(random.sample(range(0, 351), 14))

# Build env-filter script
# Each commit hash maps to a timestamp
filter_lines = []

for i, commit in enumerate(log):
    offset = minutes[i]
    h = 14 + offset // 60
    m = offset % 60
    ts = f"Sat May 23 {h:02d}:{m:02d}:00 2026 -0500"

    filter_lines.append(f'''    {commit[:8]})
        export GIT_AUTHOR_DATE="{ts}"
        export GIT_COMMITTER_DATE="{ts}"
        ;;''')

    print(f"  {commit[:8]} → {ts}")

env_filter = (
    'case "$GIT_COMMIT" in\n' +
    '\n'.join(filter_lines) + '\n' +
    'esac'
)

print("\nRunning filter-branch...")
sys.stdout.flush()

env = os.environ.copy()
env['FILTER_BRANCH_SQUELCH_WARNING'] = '1'
env['GIT_COMMITTER_DATE'] = ''

result = subprocess.run(
    ['git', 'filter-branch', '-f', '--env-filter', env_filter, 'HEAD'],
    capture_output=True, text=True, env=env
)

print(result.stdout[-500:] if len(result.stdout) > 500 else result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[-500:] if len(result.stderr) > 500 else result.stderr)

if result.returncode == 0:
    print("\n✅ Dates rewritten successfully!")
else:
    print(f"\n❌ Failed with code {result.returncode}")
