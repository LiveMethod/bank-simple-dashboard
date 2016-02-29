# bank-simple-dashboard
Scrapes and stores banksimple transaction history, extends it with custom data, gives a front end for visualizing and updating txn data

# Getting Started (OSX)
Clone this repo `git clone GIT_URL DESTINATION_NAME`

enter the folder `cd DESTINATION_NAME`

install w/ `npm i`

open 2 terminal windows in the project dir

in window 1, run `mongod`
  - if it complains, run `auxwww | grep mongod` to find old instances
  - kill them with `kill -9 XXXXX` where XXXXXX is the process ID of an old instance
  - when the old instances are dead, try `mongod` again

in window 2, run `nodemon`.
  - you should get a confirmation that mongoose connected

View at localhost:3000