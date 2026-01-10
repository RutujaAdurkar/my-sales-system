const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const buildPath = path.join(__dirname, "build", "static", "js");

if (!fs.existsSync(buildPath)) {
  console.log("Build folder not found");
  process.exit(0);
}

fs.readdirSync(buildPath).forEach(file => {
  if (file.endsWith(".js")) {
    const filePath = path.join(buildPath, file);
    const code = fs.readFileSync(filePath, "utf8");

    const result = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      debugProtectionInterval: true,
      disableConsoleOutput: true,
      selfDefending: true,
      stringArrayEncoding: ["base64"],
      stringArrayShuffle: true
    });

    fs.writeFileSync(filePath, result.getObfuscatedCode());
    console.log("Encrypted:", file);
  }
});
