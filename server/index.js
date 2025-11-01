const express = require('express');
const cors = require('cors');
const multer = require('multer');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const InspectModule = require('docxtemplater/js/inspect-module');
const lodash = require('lodash'); // Although not used directly, it might be a peer dependency.

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

const docxtemplaterOptions = {
    delimiters: {
        start: '{{',
        end: '}}'
    }
};

app.post('/api/extract-placeholders', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const zip = new PizZip(req.file.buffer);
        const iModule = new InspectModule();
        const doc = new Docxtemplater(zip, { ...docxtemplaterOptions, modules: [iModule] });
        const tags = iModule.getAllTags();
        const placeholders = Object.keys(tags);

        res.json({ placeholders });
    } catch (error) {
        console.error(error);
        const errorData = error.properties ? { id: error.properties.id, explanation: error.properties.explanation, error: error.message } : { error: 'An unknown error occurred' };
        res.status(500).json(errorData);
    }
});

app.post('/api/generate-document', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const zip = new PizZip(req.file.buffer);
        const doc = new Docxtemplater(zip, docxtemplaterOptions);

        const data = JSON.parse(req.body.data);

        doc.render(data);

        const outputBuffer = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE',
        });

        res.setHeader('Content-Disposition', 'attachment; filename=output.docx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(outputBuffer);

    } catch (error) {
        console.error(error);
        const errorData = error.properties ? { id: error.properties.id, explanation: error.properties.explanation, error: error.message } : { error: 'An unknown error occurred' };
        res.status(500).json(errorData);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
