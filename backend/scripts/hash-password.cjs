/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require('bcrypt');

const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: node scripts/hash-password.cjs <plain-password>');
  process.exit(1);
}

bcrypt.hash(pwd, 12).then((hash) => {
  console.log(hash);
});
