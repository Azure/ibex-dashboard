const fs = require('fs');
const path = require('path');
const resourceFieldProvider = require('./resourceFieldProvider');

const { MultiRegExp2 } = require('./multiRegExp2');

function getResourceFileNameById(dir, id, overwrite, mask) {
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
        const fileContents = getFileContents(filePath, mask);
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

function maskString(contents, unmask, maskRequirements, keyName, maskStart, maskEnd) {

  let maskingStart = maskStart || '';
  let maskingEnd = maskEnd || '';
  let currentObject = maskRequirements || resourceFieldProvider.MASKING_REQUIREMENTS;
  let prefix = keyName || '';
  let result = null;

  if (prefix) {
    maskingStart += '"?' + prefix + '"?[^]*?:[^]*?';
  }

  switch (currentObject.type) {
    case 'object':
      maskingStart += '{[^]*?';
      maskingEnd = '[^]*?}' + maskingEnd;
      break;
    case 'array':
      maskingStart += '\[[^]*?';
      maskingEnd = '[^]*?\]' + maskingEnd;
      break;
    case 'string':
      maskingStart += '"';
      maskingEnd = '"' + maskingEnd;

      if (!unmask) {
        let baseRegex = new RegExp(maskingStart + '(.*?)' + maskingEnd, 'gi');
        let advcRegex = new MultiRegExp2(baseRegex);
        let matching = advcRegex.execForAllGroups(contents);

        if (!matching) { return null; }

        contents = contents.substr(0, matching[1].start) + currentObject.mask + contents.substr(matching[1].end)
        return contents;
      } else {
        let baseRegex = new RegExp(maskingStart + '(.*?)' + maskingEnd, 'gi');
        let advcRegex = new MultiRegExp2(baseRegex);
        let matching = advcRegex.execForAllGroups(contents);

        if (!matching || matching[1].match !== currentObject.mask) { return null; }

        let unmaskRegex = new RegExp(maskingStart + '(.*?)' + maskingEnd, 'gi');
        let unadvcRegex = new MultiRegExp2(baseRegex);
        let unmaskMatching = unadvcRegex.execForAllGroups(unmask);

        contents = contents.substr(0, matching[1].start) + unmaskMatching[1].match + contents.substr(matching[1].end)
        return contents;
      }
  }

  let maskedContent = contents;
  let replaced = false;
  for (let key in currentObject.mask) {
    result = maskString(maskedContent, unmask, currentObject.mask[key], key, maskingStart, maskingEnd);
    if (result) {
      maskedContent = result;
      replaced = true;
    }
  }

  return replaced ? maskedContent : null;
}

function maskFileContent(contents) {
  return maskString(contents);
}

function unmaskFileContent(contents, filePath) {
  var unmaskContent = getFileContents(filePath, false);
  return maskString(contents, unmaskContent);
}

function getFileContents(filePath, mask) {
  let contents = fs.readFileSync(filePath, 'utf8');

  // mask connection
  if (mask !== false) {
    let tryMask = maskFileContent(contents);
    if (tryMask) {
      contents = tryMask;
    }
  }

  return filePath.endsWith(".ts")
    ? "return " + contents.slice(contents.indexOf("/*return*/ {") + 10)
    : contents;
}

module.exports = {
  getResourceFileNameById,
  isValidFile,
  getFileContents,
  unmaskFileContent
}