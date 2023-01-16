const PORT = parseInt(process.env.PORT || '3000');
const express = require('express')
const cryptoJS = require('crypto-js');
const {Driver, getCredentialsFromEnv, TypedValues} = require('ydb-sdk');
const {response} = require("express");
const authService = getCredentialsFromEnv();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/monument', async (req, res) => {
    const monuments = await getMonuments();
    console.log(monuments);
    return res.json({ 'monuments': monuments });
})

app.post('/monument', async (req, res) => {
    console.log('Form request:', req.body);
    const gender = req.body['gender'];
    const name = req.body['name'];
    const text = `Здесь ${gender === 'm' ? 'был' : 'была'} ${name}`;
    console.log(gender, name, text);
    await upsertMonument(gender, name, text);
    return res.json({'monument': text});
})

async function getMonuments() {
    const driver = new Driver({endpoint: endpoint, database: database, authService: authService});
    if (!await driver.ready(10000)) {
        process.exit(1);
    }
    const result = await driver.tableClient.withSession(async (session) => {
        const query = `SELECT monument_text FROM monuments`;
        const preparedQuery = await session.prepareQuery(query);
        const {resultSets} = await session.executeQuery(preparedQuery);
        return resultSets[0].rows;
    });
    await driver.destroy();
    return result;
}

async function upsertMonument(gender, name, monument_text) {
    const id = cryptoJS.SHA256(cryptoJS.enc.Hex.parse(Date.now().toString() + name)).toString().slice(0, 16);
    console.log(`ID: ${id}`);
    const driver = new Driver({endpoint: endpoint, database: database, authService: authService});
    if (!await driver.ready(10000)) {
        process.exit(1);
    }
    const result = await driver.tableClient.withSession(async (session) => {
        const query =
            `DECLARE $id AS UTF8;
            DECLARE $gender AS UTF8;
            DECLARE $name AS UTF8;
            DECLARE $monument_text as UTF8;
            UPSERT INTO monuments (id, gender, name, monument_text) VALUES ($id, $gender, $name, $monument_text)`;
        const preparedQuery = await session.prepareQuery(query);
        return await session.executeQuery(preparedQuery, {
            '$id': TypedValues.utf8(id),
            '$gender': TypedValues.utf8(gender),
            '$name': TypedValues.utf8(name),
            '$monument_text': TypedValues.utf8(monument_text)
        });
    });
    await driver.destroy();
    return result;
}

app.listen(PORT, () => {
    console.log(`App listening at port ${PORT}`);
});