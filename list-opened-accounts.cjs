const fs = require('fs');
const dotenv = fs.readFileSync('/Users/charliedeist/Root/OpenEd Vault/.env', 'utf8');
const key = dotenv.split('\n').find(l => l.startsWith('GETLATE_API_KEY=')).split('=')[1].trim();
const PROFILE = '69612bd52bf2e80219c9bf06';

(async () => {
  const res = await fetch(`https://getlate.dev/api/v1/accounts?profileId=${PROFILE}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const j = await res.json();
  console.log(`Accounts for OpenEd profile (${PROFILE}):`);
  for (const a of j.accounts || []) {
    console.log(`  platform=${a.platform.padEnd(10)} id=${a._id}  @${a.username || a.displayName}  active=${a.isActive}`);
  }
})().catch(e => { console.error(e); process.exit(1); });
