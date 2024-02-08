#!/bin/sh
cd /d/MyLearning/myproject/blog-1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log
