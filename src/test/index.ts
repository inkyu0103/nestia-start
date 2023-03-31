import { DynamicExecutor } from "@nestia/e2e";

import api from "@ORGANIZATION/PROJECT-api";

import { Backend } from "../Backend";
import { Configuration } from "../Configuration";

async function main(): Promise<void> {
    // BACKEND SERVER
    const backend: Backend = new Backend();
    await backend.open();

    //----
    // CLINET CONNECTOR
    //----
    // DO TEST
    const connection: api.IConnection = {
        host: `http://127.0.0.1:${await Configuration.API_PORT()}`,
    };
    const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
        prefix: "test",
        parameters: () => [connection],
    })(__dirname + "/features");

    const failures: DynamicExecutor.IReport.IExecution[] =
        report.executions.filter((exec) => exec.error !== null);
    if (report.executions.length === 0) console.log("Success");
    else {
        for (const f of failures) console.log(f.error);
        process.exit(-1);
    }

    // TERMINATE
    process.exit(0);
}
main().catch((exp) => {
    console.log(exp);
    process.exit(-1);
});