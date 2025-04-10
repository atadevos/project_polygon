const nodeVersion = process.version;

if (parseInt(nodeVersion.split('.')[0].replace('v', ''), 10) < 18) {
  console.error('Node.js version 18 or higher is required');
  process.exit(1);
} else {
  console.log(`Node.js version ${nodeVersion} is valid.`);
}