//IMPLEMENTING NEXTJS SERVER WITH API ROUTES
import path from "path"
import fs from "fs"

const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile); //add to update db.json after successful PUT operation
const delay = (ms) => new Promise((resolve) => {setTimeout(resolve, ms)});

export default async function handler(req, res) {

    //pull out parameters from req
    const method = req?.method;
    const id = parseInt(req?.query.id);
    const recordFromBody = req?.body;
    const jsonFile = path.resolve("./", "db.json");

    //create a case for each method we want to carry out
    switch (method) {
        case "POST": 
            await postMethod();
            break;
        case "PUT":
            await putMethod();
            break;
        case "DELETE":
            await deleteMethod();
            break;
        default:
            res.status(501).send(`Method ${method} not implemented`);
            console.log(`Method ${method} not implemented`);
    }


    async function putMethod() {
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (!speakers) {
                res.status(404).send("Error: Request failed with status code 404");
            } else {
                //find the one record that needs updating and update it then write the file back
                const newSpeakersArray = speakers.map((rec)=> {
                    //from the specific speaker id only, replace the record with the one sent back from the request
                    return rec.id == id ? recordFromBody : rec; 
                });
                //write new update back to file system
                writeFile(jsonFile, JSON.stringify({ speakers: newSpeakersArray }, null, 2));
                res.setHeader("Content-Type", "application/json");
                //replace what we send back to client with record from body as new update
                res.status(200).send(JSON.stringify(recordFromBody, null, 2));
                console.log(`PUT /api/speakers/${id} status: 200`);
            }
        } catch (e) {
            //return 500 unexpected error
            res.status(500).send(`PUT /api/speakers/${id} status: 500 unexpected error`)
            console.log(`PUT /api/speakers/${id} status: 200`, e);
        }
    }

    async function postMethod() {
        //to add new speaker
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (!speakers) {
                res.status(404).send("Error: Request failed with status code 404");
            } else {
                //create a new id for the speaker, using reduce(), run through the existing speakers, find the highest id and add 1
                const newId = speakers.reduce((accumulator, currentValue)=> {
                    const idCurrent = parseInt(currentValue.id);
                    return idCurrent > accumulator ? idCurrent : accumulator;
                }, 0) + 1;

                //pass all the field of the speaker passed into the request using the spread operator and assign the new id to it
                const newSpeakerRec = { ...recordFromBody, id: newId.toString()};

                //append new speaker record to the front of existing speaker list
                const newSpeakersArray = [newSpeakerRec, ...speakers];
                writeFile(jsonFile, JSON.stringify({ speakers: newSpeakersArray }, null, 2));
                res.setHeader("Content-Type", "application/json");
                //replace what we send back to client with new speaker record
                res.status(200).send(JSON.stringify(newSpeakerRec, null, 2));
                console.log(`POST /api/speakers/${id} status: 200`);
            }
        } catch (e) {
            //return 500 unexpected error
            res.status(500).send(`POST /api/speakers/${id} status: 500 unexpected error`)
            console.log(`POST /api/speakers/${id} status: 200`, e);
        }
    }

    async function deleteMethod() {
        try {
            const readFileData = await readFile(jsonFile);
            await delay(1000);
            const speakers = JSON.parse(readFileData).speakers;
            if (!speakers) {
                res.status(404).send("Error: Request failed with status code 404");
            } else {
                //find the one record that needs to be deleted using filter()
                const newSpeakersArray = speakers.filter((rec)=> {
                    //from the specific speaker id only, delete the id
                    return rec.id != id;
                });
                //write new update back to file system
                writeFile(jsonFile, JSON.stringify({ speakers: newSpeakersArray }, null, 2));
                res.setHeader("Content-Type", "application/json");
                //use the find method to return what we deleted from the original array
                res.status(200).send(JSON.stringify(speakers.find(rec => rec.id == id), null, 2));
                console.log(`DELETE /api/speakers/${id} status: 200`);
            }
        } catch (e) {
            //return 500 unexpected error
            res.status(500).send(`DELETE /api/speakers/${id} status: 500 unexpected error`)
            console.log(`DELETE /api/speakers/${id} status: 200`, e);
        }
    }
}