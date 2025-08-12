@echo off
echo Setting up PostgreSQL database...
echo.
echo Make sure PostgreSQL is running and you know the postgres user password
echo.
pause

psql -U postgres -c "CREATE DATABASE digital_art_portal;"
psql -U postgres -d digital_art_portal -f database.sql

echo.
echo Database setup complete!
pause