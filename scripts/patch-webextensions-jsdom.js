const fs = require("fs");
const path = require("path");

const nycHelperPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "webextensions-jsdom",
  "src",
  "nyc.js"
);

if (!fs.existsSync(nycHelperPath)) {
  process.exit(0);
}

const replacements = [
  {
    from: [
      "    await execFile(process.execPath, [",
      "      './node_modules/.bin/nyc',",
      "      'instrument',",
      "      sourcePath,",
      "      '>',",
      "      instrumentCachePath",
      "    ], {",
      "      cwd: process.cwd(),",
      "      env: process.env,",
      "      shell: true",
      "    });"
    ].join("\n"),
    to: [
      "    const { stdout } = await execFile(process.execPath, [",
      "      path.join(process.cwd(), 'node_modules', 'nyc', 'bin', 'nyc.js'),",
      "      'instrument',",
      "      sourcePath",
      "    ], {",
      "      cwd: process.cwd(),",
      "      env: process.env,",
      "      maxBuffer: 100 * 1024 * 1024",
      "    });",
      "    await writeFile(instrumentCachePath, stdout, 'utf8');"
    ].join("\n")
  },
  {
    from: "      const scriptPath = script.src ? script.src.replace(/^file:\\/\\//, '') : script;",
    to: [
      "      let scriptPath = script.src ? decodeURIComponent(script.src.replace(/^file:\\/\\//, '')) : script;",
      "      if (/^\\/[a-zA-Z]:/.test(scriptPath)) {",
      "        scriptPath = scriptPath.slice(1);",
      "      }"
    ].join("\n")
  }
];

let source = fs.readFileSync(nycHelperPath, "utf8");
const usesCrlf = source.includes("\r\n");

if (usesCrlf) {
  source = source.replace(/\r\n/g, "\n");
}

let patched = false;
for (const replacement of replacements) {
  if (source.includes(replacement.from)) {
    source = source.replace(replacement.from, replacement.to);
    patched = true;
  }
}

if (!patched) {
  process.exit(0);
}

fs.writeFileSync(nycHelperPath, usesCrlf ? source.replace(/\n/g, "\r\n") : source);
console.log("Patched webextensions-jsdom coverage helper for Windows paths");
