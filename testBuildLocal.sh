#!/bin/bash
npm run build
cd dist;
ws -p 8080 --spa index.html