document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('requestsTable').getElementsByTagName('tbody')[0];

	if (tableBody) {
		// Function to clear the table
		function clearTable() {
			while (tableBody.rows.length > 0) {
				tableBody.deleteRow(0);
			}
		}

		// Listen for navigations and clear table
		chrome.devtools.network.onNavigated.addListener(clearTable);

		// Handle network requests and populate table
		chrome.devtools.network.onRequestFinished.addListener(request => {
			const cfStatus = request.response.headers.find(header => header.name.toLowerCase() === 'cf-cache-status');
			const statusClass = cfStatus ? cfStatus.value.replace(/\s+/g, '').toLowerCase() : 'na';
			const mimeType = request.response.content.mimeType;
			const url = request.request.url;
			const displayUrl = url.length > 40 ? '...' + url.substr(url.length - 40) : url;
			const extensionMatch = url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
			const fileExtension = extensionMatch ? extensionMatch[1] : 'Unknown';

			const row = tableBody.insertRow();
			const cellStatus = row.insertCell(0);
			const cellCF = row.insertCell(1);
			const cellUrl = row.insertCell(2);
			const cellMimeType = row.insertCell(3);
			const cellFileExt = row.insertCell(4);

			cellUrl.innerHTML = `<a href="${url}" target="_blank" title="${url}">${displayUrl}</a>`;
			cellStatus.textContent = request.response.status;
			cellCF.textContent = cfStatus ? cfStatus.value : 'N/A';
			cellCF.className = `cf-status ${statusClass}`;
			cellMimeType.textContent = mimeType;
			cellFileExt.textContent = fileExtension;
		});
	}
});
