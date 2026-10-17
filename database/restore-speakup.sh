#!/bin/bash
set -e
echo "Restaurando speakup_db desde /seed/speakup_db.archive.gz"
mongorestore --archive=/seed/speakup_db.archive.gz --gzip --drop
