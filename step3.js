const fs = require('fs');
const axios = require('axios');

function processFile(path, callback) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err}`);
      process.exit(1);
    }
    callback(data);
  });
}

async function processUrl(url, callback) {
  try {
    const resp = await axios.get(url);
    callback(resp.data);
  } catch (err) {
    console.error(`Error fetching ${url}:\n  ${err}`);
    process.exit(1);
  }
}

function display(data) {
  console.log(data);
}

function writeToFile(filename, data) {
  fs.writeFile(filename, data, 'utf8', (err) => {
    if (err) {
      console.error(`Couldn't write ${filename}:\n  ${err}`);
      process.exit(1);
    }
  });
}

const args = process.argv.slice(2);

if (args[0] === '--out') {
  const [_, filename, input] = args;

  const callback = data => writeToFile(filename, data);

  if (input.startsWith('http://') || input.startsWith('https://')) {
    processUrl(input, callback);
  } else {
    processFile(input, callback);
  }

} else {
  const [input] = args;

  if (input.startsWith('http://') || input.startsWith('https://')) {
    processUrl(input, display);
  } else {
    processFile(input, display);
  }
}
