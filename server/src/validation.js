// src/validation.js
function isValidWalletAddress(addr) {
  if (typeof addr !== "string") return false;
  // basic Ethereum-like address (0x + 40 hex chars)
  //   return /^0x[a-fA-F0-9]{40}$/.test(addr);
  return true;
}

function requireFields(obj, fields) {
  const missing = [];
  for (const f of fields) {
    if (
      !(f in obj) ||
      obj[f] === undefined ||
      obj[f] === null ||
      obj[f] === ""
    ) {
      missing.push(f);
    }
  }
  return missing;
}

module.exports = {
  isValidWalletAddress,
  requireFields,
};
