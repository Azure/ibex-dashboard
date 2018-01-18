const fs = require('fs');
const path = require('path');
const resourceFieldProvider = require('./resourceFieldProvider');

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

function extractExpression(contents, expression, shouldReplace, mask) {
  let findExpression = expression.exec(contents);
  if (!findExpression || findExpression.length === 0) {
    return null;
  }

  if (shouldReplace) {
    return contents.replace(findExpression[0], findExpression[0].replace(findExpression[1], mask));
  }

  return findExpression[0];
}

function extractUnmaskExpression(contents, expression, shouldGetValue) {
  let findExpression = expression.exec(contents);
  if (!findExpression || findExpression.length === 0 || (shouldGetValue && findExpression.length <= 1)) {
    return null;
  }

  return shouldGetValue ? findExpression[1] : findExpression[0];
}

function maskString(contents, unmask, maskRequirements, keyName) {

  let maskRegexValue = null;
  let currentObject = maskRequirements || resourceFieldProvider.MASKING_REQUIREMENTS;
  let replacableObject = false;

  switch (currentObject.type) {
    case 'object':
      maskRegexValue = '\\s*"?' + keyName + '"?:\\s*{(.*)}';
      break;
    case 'array':
      maskRegexValue = '\\s*"?' + keyName + '"?:\\s*[(.*)]';
      break;
    case 'string':
      maskRegexValue = '\\s*"?' + keyName + '"?:\\s*"(.*)"';
      replacableObject = true;
      break;
  }

  // Focus searches only on relevant part from regex
  let toReplace = null;
  let toUnmask = null;
  if (maskRegexValue && unmask) {
    let maskRegex = new RegExp(maskRegexValue, 'gim');
    toUnmask = extractUnmaskExpression(unmask, maskRegex, replacableObject);
    if (!toUnmask) { return null; }
  }

  if (maskRegexValue) {
    let maskRegex = new RegExp(maskRegexValue, 'gim');
    let mask = unmask && toUnmask || currentObject.mask;
    toReplace = extractExpression(contents, maskRegex, replacableObject, mask);
    if (replacableObject) { return toReplace; }
    if (!toReplace) { return null; }
  }
  
  // Mask child objects
  let maskedContent = toReplace || contents;
  let unmakedContent = toUnmask || unmask;
  let shouldReplace = false;
  for (let key in currentObject.mask) {
    let result = maskString(maskedContent, unmakedContent, currentObject.mask[key], key);
    if (result) {
      maskedContent = result;
      shouldReplace = true;
    }
  }
  
  // Replace maskedContent in parent string...
  if (shouldReplace) {
    if (currentObject.type === 'root') {
      return maskedContent;
    }
    return contents.replace(toReplace, maskedContent);
  }

  // No replace has taken place
  return null;
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