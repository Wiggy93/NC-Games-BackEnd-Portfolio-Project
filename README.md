## .env

.env scripts are within the .gitignore so are not within this repos public environment variables. 

Devs must add 2 .env files named .env.development and .env.test respectively to allow connection to their respective local database. 

These should have the scripts PGDATABASE=nc_games and PGDATABASE=nc_games_test respectively

This in turn requires Dotenv as a dependency installed.
