"use strict"

let pg = require('pg');

const pgConnectionString = process.env.FORTIS_POSTGRES_CONNECTION_STRING;

function postgresClientWrapper(connectionString, operation, callback) {
    let client = new pg.Client(connectionString);

    client.connect(err => {
        if (err) return callback({}, err);

        operation(client, (err, results) => {
            client.end();
            callback(err, results);
        });
    });
}

if(!pgConnectionString){
    throw new Error("STORAGE_CONNECTION_STRING is undefined error");
}

module.exports = function(query, callback){
    postgresClientWrapper(JSON.parse(pgConnectionString), (client, wrapperCallback) => {
                client.query(query, (err, results) => {
                    if (err) return wrapperCallback(err, {});

                    return wrapperCallback(null, results);
                });
            }, callback);
};