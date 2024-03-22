export default `<!doctype html>
<html>

<body>

    <button id="generatePdfButton">Generate PDF</button>

    <script>
        document.getElementById('generatePdfButton').addEventListener('click', async () => {
            // Fetch the PDF from the server
            const response = await fetch('https://your-server.com/generate-pdf');

            // Get the PDF data
            const pdfData = await response.blob();

            // Create a link element
            const link = document.createElement('a');

            // Create a URL for the PDF data
            link.href = URL.createObjectURL(pdfData);

            // Set the download attribute
            link.download = 'sample.pdf';

            // Append the link to the body
            document.body.appendChild(link);

            // Simulate a click to download the PDF
            link.click();

            // Remove the link after downloading
            document.body.removeChild(link);
        });
    </script>

</body>

</html>`