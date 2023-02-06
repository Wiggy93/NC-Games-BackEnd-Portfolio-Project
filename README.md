# NC-Games

An API to interact with a database containing a host of information on reviews, users and comments.


## Install

Clone the repo:

    $ git clone https://github.com/Wiggy93/NC-Games-BackEnd-Portfolio-Project.git


Installation if done using the npm install command to install all dependencies

$ npm install

Altenatively to install core dependecies individually:

    $ npm install express

    $ npm install dotenv
    
    $ npm install pg-format

    $ npm install cors


Check the minimum dependency requirements for full running. 

For further development work, jest and supertest are recommended to utilise the tests already built. 

    $ npm install -dev jest

    $ npm install -dev jest-sorted

    $ npm install -dev jest-extended

    $ npm install supertest -dev

If jest-sorted is used, note "jest-sorted" requires adding to "setupFilesAfterEnv" within "jest" in the package.json. e.g.

    {

        "jest" : {

            "setupFilesAfterEnv": [

                "jest-extended/all",

                "jest-sorted"

                ]
            } 
     }


## Set-up database and start

To initiate the databases within PSQL, run:

    $ npm run setup-dbs

To seed the database with test and development data, run:

    $ npm run seed

To seed the database with production data, run:

    $ npm run seed-prod

To start listening for commands, run:

    $ npm run start


## Run Tests

To run all available tests, jest, jest-sorted, jest-extended and supertest are required (see installation section for more detatils.)

In addition, husky is a git hook that ensures all available tests pass prior to commiting changes to your repo. Whilst not necessary to run this code, it is useful for any further work. Install with:

    $npm install husky -dev


## Hosted at

https://games-reviews-and-comments.onrender.com/api

Use appropriate endpoints listed in endpoints.json file to interact with api.



## .env

.env scripts are within the .gitignore so are not within this repos public environment variables. 

Devs must add 2 .env files named .env.development and .env.test respectively to allow connection to their respective local database. 

These should have the scripts PGDATABASE=nc_games and PGDATABASE=nc_games_test respectively

This in turn requires Dotenv as a dependency installed.


### minimum dependency requirements
Node.js : v19.1.0
PostgreSQL : v14.6

See dependecies and devDependencies list for futher information on libraries used.

Credit to **sgromkov** on gitHub for isValidJSON test used.