import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event))
})

async function handleRequest(event) {

	const url = new URL(event.request.url);

	// Serve the HTML page on a specific path, e.g., '/form'
	if (url.pathname === "/") {
		const html = `<!DOCTYPE html>
		<html lang="en">
		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>PDF Generator</title>
		<style>

		  body, html {
			margin: 0;
			padding: 0;
			height: 100%;
			overflow: hidden;
			font-family: Arial, sans-serif;
		  }
		  .container {
			display: flex;
			height: 100%;
		  }
		  .button-container {
			display: flex;
			flex-direction: column;
			justify-content: start;
			padding: 10px;
			box-sizing: border-box;
		  }
		  .button-container input,
		  .button-container button {
			margin-bottom: 10px;
			font-size: 26px;
			padding: 20px;
		  }
		  button {
			background-color: #4CAF50;
			color: white;
			border: none;
			cursor: pointer;
			border-radius: 5px;
		  }
		  button:hover {
			background-color: #45a049;
		  }
		  #pdfFrame {
			flex-grow: 1;
		  }
		</style>
		</head>
		<body>
		<script type="text/javascript" src="libs/png_support/zlib.js"></script>
<script type="text/javascript" src="libs/png_support/png.js"></script>
<script type="text/javascript" src="jspdf.plugin.addimage.js"></script>
<script type="text/javascript" src="jspdf.plugin.png_support.js"></script>
<script type="text/javascript" src="jspdf.js"></script>
		<div class="container">
		  <div class="button-container">
		  <h1>Valuation Report</h1>
<h4>powered by ShowKase</h4>
			<input type="text" id="companyName" placeholder="Enter Company Name">
			<input type="text" id="imageUrl" placeholder="Enter Img Name">
			<button id="updatePdf">Update PDF</button>
			<button id="generatePermalink">Generate Permalink</button>
			<p id="permalink" style="word-wrap: break-word;"></p>
		  </div>
		  <iframe id="pdfFrame" src="/pdf?company=Initial Company"></iframe>
		</div>
		<script>
		  document.getElementById('updatePdf').addEventListener('click', () => {
			const companyName = document.getElementById('companyName').value;
			const newSrc = '/pdf?company=' + encodeURIComponent(companyName) + '&imageUrl=' + encodeURIComponent(imageUrl);
			document.getElementById('pdfFrame').src = newSrc;
		  });
		  
		  document.getElementById('generatePermalink').addEventListener('click', () => {
			const companyName = document.getElementById('companyName').value;
			const permalink = window.location.origin + '/pdf?company=' + encodeURIComponent(companyName);
			document.getElementById('permalink').innerText = 'Permalink: ' + permalink;
		  });
		</script>
		</body>
</html>`;


		return new Response(html, { headers: { 'Content-Type': 'text/html' } });
	}
	else if (url.pathname === "/pdf") {
		const doc = new jsPDF({
			orientation: 'p',
			format: 'a4',
		})

		const pageWidth = doc.internal.pageSize.width
		const ppi = 3

		const now = new Date()
		const dateToday =
			now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear()

		const t = {}
		const searchParams = new URL(event.request.url).searchParams
		const textParams = [
			'bedrooms',
			'bathrooms',
			'city',
			'state',
			'price',
			'sqFoot',
			'appreciation_curr',
			'appreciation_infl',
			'depreciation',
			'property_taxes',
			'mortgage',
			'total',
			'masks'
		]
		textParams.forEach(param => (t[param] = searchParams.get(param) || ''))

		const docText = (x, y, text) => {
			if (x > 0) return doc.text(x, y, text)
			return doc.text(pageWidth + x, y, text, null, null, 'right')
		}

		const getLines = (text, start, end) =>
			text
				.replace(/\\n/g, '\n')
				.split('\n')
				.slice(start, end)
		
		doc.setFont('helvetica', 'bold')
		doc.setFontSize(20)
		docText(20, 24, "ShowKase Valuation Report")

		doc.setFont('helvetica', 'normal')
		doc.setFontSize(10)
		doc.setLineHeightFactor(1.3)
		docText(20, 30, dateToday)

		doc.setLineWidth(0.333)

		doc.setFontSize(14)
		doc.setFont('helvetica', 'bold')
		docText(20, 50, "Form Inputs")
		doc.line(20, 52, pageWidth - 20, 52)
		doc.setFont('helvetica', 'normal')
		docText(20, 60, "# of Beds: " + getLines(t.bedrooms || '1'))
		docText(100, 60, "# of Baths: " + getLines(t.bathrooms || '1'))
		docText(20, 67, "City: " + getLines(t.city || 'NA'))
		docText(100, 67, "State: " + getLines(t.state || 'NA'))
		docText(20, 74, "Current valuation: $" + getLines(t.price || '1'))
		docText(100, 74, "Square footage: " + getLines(t.sqFoot || '1') + "sqft.")

		doc.setFontSize(14)
		doc.setFont('helvetica', 'bold')
		docText(20, 90, "Damage Detected in Uploaded Image ")
		doc.line(20, 92, pageWidth - 20, 92)
		doc.setFont('helvetica', 'normal')

		let im = t.masks
		im = im.replace(/\$/g, '+')
		let imm = 'data:image/jpeg;base64,'+im
		doc.addImage(imm, 'JPEG', pageWidth/2 - 30, 96, 60, 40)
		
		doc.setFontSize(14)
		doc.setFont('helvetica', 'bold')
		docText(20, 143, "Predicted Future Valuations")
		doc.line(20, 145, pageWidth - 20, 145)
		doc.setFont('helvetica', 'normal')

		const formatter = (s) => {
			var vals = s.split(',')
			vals = vals.slice(0, 5)
			return vals.map((val) => ('$ '+val))
		}

		doc.setFontSize(12)
		doc.setFont('helvetica', 'normal')

		autoTable(doc, {
			head: [['Measure', '2024', '2025', '2026', '2027', '2028']],
			body: [['Appreciation in property'].concat(formatter(t.appreciation_curr)),
				['Appreciation (adjusted for inflation)'].concat(formatter(t.appreciation_infl)),
				['Depreciation of value'].concat(formatter(t.depreciation)),
				['Total change in assets'].concat(formatter(t.total))
			],
			startY: 150,
		})

		const formatTotal = amount => {
			let str = (amount + '').replace(/[^0-9\.\,]/g, '')
			let num = parseFloat(str, 10)
			if (Math.floor(num) === num) return num + ''
			return num.toFixed(2)
		}
	
		const output = doc.output('arraybuffer')

		const headers = new Headers()
		headers.set('Content-Type', ' application/pdf')

		return new Response(output, { headers })
	}

}