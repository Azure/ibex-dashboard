
function downloadBlob(data: string, mimeType: string, filename: string) {
  const blob = new Blob([data], {
    type: mimeType
  });
  var el = document.createElement('a');
  el.setAttribute('href', window.URL.createObjectURL(blob));
  el.setAttribute('download', filename);
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}

export { downloadBlob };