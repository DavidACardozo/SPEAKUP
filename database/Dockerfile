FROM mongo:8.2.6

# Dump de speakup_db (solo categorias y quizzes, sin usuarios) que se restaura
# la primera vez que arranca el contenedor (con /data/db vacío).
COPY seed/speakup_db.archive.gz /seed/speakup_db.archive.gz
COPY restore-speakup.sh /docker-entrypoint-initdb.d/restore-speakup.sh
