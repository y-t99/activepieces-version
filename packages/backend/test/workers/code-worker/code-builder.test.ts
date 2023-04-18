import {codeBuilder} from "../../../src/workers/code-worker/code-builder";
import SandboxManager, {Sandbox} from "../../../src/workers/sandbox";

const fs = require("fs");

describe('Code Builder', () => {

    test('Build Code Successfully', async () => {
        jest
            .spyOn(SandboxManager.prototype, 'obtainSandbox')
            .mockImplementation(() => new Sandbox(1));
        let resourceFile = fs.readFileSync('test/resources/simple-code.zip');
        let bundledJs = await codeBuilder.build(resourceFile);
        expect(bundledJs.toString("utf-8")).toEqual('module.exports={code:async e=>!0};');
    });

    test('Build Code with Compilation Error', async () => {
        jest
            .spyOn(SandboxManager.prototype, 'obtainSandbox')
            .mockImplementation(() => new Sandbox(2));
        let resourceFile = fs.readFileSync('test/resources/compilation-error.zip');
        let bundledJs = await codeBuilder.build(resourceFile);
        expect(bundledJs.toString("utf-8")).toMatch(/(1 error)/);
    });

})