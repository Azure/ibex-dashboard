const fs = require('fs');
const path = require('path');
const resourceFieldProvider = require('./resourceFieldProvider');

function getResourceFileNameById(dir, id, overwrite) {
  let files = fs.readdirSync(dir) || [];

  // Make sure the array only contains files
  files = files.filter(fileName => fs.statSync(path.join(dir, fileName)).isFile());
  if (!files || files.length === 0) {
    return null;
  }

  let dashboardFile = null;
  files.every(fileName => {
    const filePath = path.join(dir, fileName);
    if (isValidFile(filePath)) {
      let dashboardId = undefined;
      if (overwrite === true) {
        dashboardId = path.parse(fileName).name;
        if (dashboardId.endsWith('.private')) {
          dashboardId = path.parse(dashboardId).name;
        }
      } else {
        const fileContents = getFileContents(filePath);
        dashboardId = resourceFieldProvider.getField('id', fileContents);
      }
      if (dashboardId && dashboardId === id) {
        dashboardFile = fileName;
        return false;
      }
    }
    return true;
  });

  return dashboardFile;
}

function isValidFile(filePath) {
  const stats = fs.statSync(filePath);
  return stats.isFile() && (filePath.endsWith('.js') || filePath.endsWith('.ts'));
}

function getFileContents(filePath) {
  let contents = fs.readFileSync(filePath, 'utf8');
  return filePath.endsWith(".ts")
    ? "return " + contents.slice(contents.indexOf("/*return*/ {") + 10)
    : contents;
}

module.exports = {
  getResourceFileNameById,
  isValidFile,
  getFileContents
}