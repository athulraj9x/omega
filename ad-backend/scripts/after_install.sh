#!/bin/bash

# Change Working Directory
cd /home/ubuntu/api_bet/supreme-data

# Check if the application is running on port 80
PID=$(sudo lsof -t -i :80)

if [ -n "$PID" ]; then
    echo "Application is running on port 80 with PID: $PID. Killing the process..."
    sudo kill -9 $PID
    echo "Process killed successfully."
else
    echo "Application is not running on port 80."
fi
