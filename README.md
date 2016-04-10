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

# Notes

## GET /notes/
  Get all notes

## GET /notes/array
  Takes array of transaction UUIDs as an array, gets all notes that match.

## POST /notes/
  Create or update a single note

## GET /notes/:TRANSACTION_UUID
  Gets a single note for a given transactionn UUID

## PUT /notes/:TRANSACTION_UUID
  Updates a single note for a given transaction UUID

## DELETE /notes/:TRANSACTION_UUID
  Delete a single note for a given transaction UUID

# Transactions

## GET /transactions/
  Get all transactions

## POST /transactions/
  Create or update a single transaction

## GET /transactions/:TRANSACTION_UUID
  Get a single transaction for a given transaction UUID

## PUT /transactions/:TRANSACTION_UUID
  Update a single transaction for a given transaction UUID

## DELETE /transactions/:TRANSACTION_UUID
  Delete a single transaction for a given transaction UUID

# Scraper

## GET /scrape/
  Logs in with credentials from secrets and downloads all TXNS from bank
  .simple.com