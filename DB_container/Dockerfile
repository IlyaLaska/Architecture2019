#COPY . .
#CMD ["psql", "architecture", "<", "dumpfile"]
FROM postgres
WORKDIR /db
COPY . .
#RUN psql -U postgres postgres < postgres_localhost-2019_12_17_01_03_20-dump.sql
EXPOSE 5432
#CMD ["psql -U postgres postgres < postgres_localhost-2019_12_17_01_03_20-dump.sql"]
#CMD ['node', 'route_guide_server.js']