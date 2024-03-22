const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();

app.get('/generate-pdf', (req, res) => {
    let doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sample.pdf');

    doc.pipe(res);
    doc.text('Hello World!', 50, 50);
    doc.end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

/*npm install express pdfkit*/