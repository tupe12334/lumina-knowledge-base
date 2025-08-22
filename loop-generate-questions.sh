#!/bin/bash

echo "Starting continuous question generation loop..."
echo "Press Ctrl+C to stop"

counter=1
while true; do
    echo "========================================="
    echo "Running iteration $counter at $(date)"
    echo "========================================="
    
    pnpm generate-questions-claude
    
    echo "Iteration $counter completed at $(date)"
    echo "Waiting 5 seconds before next iteration..."
    sleep 5
    
    ((counter++))
done