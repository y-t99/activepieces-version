import decompress = require("decompress");
import { sandboxManager } from "../sandbox";

const { execSync } = require("child_process");
const fs = require("fs");

const webpackConfig: string =
  "const path = require('path');\n" +
  "module.exports = {\n" +
  "  target: 'node',\n" +
  "  externalsPresets: { node: true },\n" +
  "  entry: './index.js', // make sure this matches the main root of your code \n" +
  "  resolve: {\n" +
  "     preferRelative: true,\n" +
  "     extensions: ['.js']\n" +
  "  },\n" +
  "  output: {\n" +
  "    libraryTarget: 'commonjs2',\n" +
  "    path: path.join(__dirname, 'dist'), // this can be any path and directory you want\n" +
  "    filename: 'index.js',\n" +
  "  },\n" +
  "  optimization: {\n" +
  "    minimize: true, // enabling this reduces file size and readability\n" +
  "  },\n" +
  "};\n";

async function build(artifact: Buffer): Promise<Buffer> {
  const sandbox = sandboxManager.obtainSandbox();
  const buildPath = sandbox.getSandboxFolderPath();
  let bundledFile;
  try {
    console.log("Started Building in sandbox " + buildPath);

    await sandbox.cleanAndInit();

    await downloadFiles(artifact, buildPath);

    await execSync("npm --prefix " + buildPath + " install");
    await execSync("npm --prefix " + buildPath + " run build");

    const bundledFilePath = buildPath + "/dist/index.js";
    bundledFile = fs.readFileSync(bundledFilePath);
    console.log("Finished Building in sandbox " + buildPath);
  } catch (e) {
    const consoleError = e as { stdout: string };
    const invalidArtifactFile = fs
      .readFileSync("./resources/invalid-code.js")
      .toString("utf-8")
      .replace("${ERROR_MESSAGE}", JSON.stringify(consoleError.stdout.toString()).replace(/\"/g, '\\"'));
    bundledFile = Buffer.from(invalidArtifactFile, "utf-8");
  } finally {
    sandboxManager.returnSandbox(sandbox.boxId);
  }
  return bundledFile;
}

async function downloadFiles(artifact: Buffer, buildPath: string) {
  await decompress(artifact, buildPath, {});

  const packageJson = JSON.parse(fs.readFileSync(buildPath + "/package.json", { encoding: "utf8", flag: "r" }));
  if (packageJson.scripts === undefined) {
    packageJson.scripts = {};
  }
  packageJson.scripts.build = "webpack --mode production";
  fs.writeFileSync(buildPath + "/package.json", JSON.stringify(packageJson));
  fs.writeFileSync(buildPath + "/webpack.config.js", webpackConfig);
}

export const codeBuilder = {
  build,
};
