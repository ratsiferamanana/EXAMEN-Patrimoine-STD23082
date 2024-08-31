// eslint-disable-next-line no-undef
const express = require('express');
// eslint-disable-next-line no-undef
const cors = require('cors');
// eslint-disable-next-line no-undef
const bodyParser = require('body-parser');
// eslint-disable-next-line no-undef
const fs = require('fs');
// eslint-disable-next-line no-undef
const path = require('path');
// eslint-disable-next-line no-undef
const { v4: uuidv4 } = require('uuid'); // Importation de uuid

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// eslint-disable-next-line no-undef
const dataFilePath = path.join(__dirname, 'data.json');

const readData = () => JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
const writeData = (data) => fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

// Récupérer toutes les possessions
app.get('/possessions', (req, res) => {
    const data = readData();
    res.json(data[1].data.possessions);
});

// Ajouter une nouvelle possession
app.post('/possessions', (req, res) => {
    const newPossession = {
        ...req.body,
        id: uuidv4() // Générer un ID unique
    };
    const data = readData();
    data[1].data.possessions.push(newPossession);
    writeData(data);
    res.status(201).json(newPossession);
});

// Mettre à jour une possession existante
app.put('/possessions/:id', (req, res) => {
    const { id } = req.params;
    const updatedPossession = req.body;
    const data = readData();
    const index = data[1].data.possessions.findIndex((p) => p.id === id);
    if (index !== -1) {
        data[1].data.possessions[index] = updatedPossession;
        writeData(data);
        res.json(updatedPossession);
    } else {
        res.status(404).json({ message: 'Possession not found' });
    }
});

// Supprimer une possession existante
app.delete('/possessions/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const index = data[1].data.possessions.findIndex((p) => p.id === id);
    if (index !== -1) {
        data[1].data.possessions.splice(index, 1);
        writeData(data);
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'Possession not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
