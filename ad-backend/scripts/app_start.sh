#!/bin/bash
cd /home/ubuntu/api_bet/supreme-data

# Set up environment to include npm
export PATH="/root/.nvm/versions/node/v19.9.0/bin:$PATH"

# Start the application in the background
nohup npm start > /dev/null 2>&1 &
