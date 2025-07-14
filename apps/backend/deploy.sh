#!/bin/bash

# Build and deploy script for the backend
cd apps/backend
npm install
npm run build
npm start
