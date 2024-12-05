function isDuplicate(existingData, url) {
  return existingData.some((entry) => entry.result.url === url);
}

module.exports = { isDuplicate };
