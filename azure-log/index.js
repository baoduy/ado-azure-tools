"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const msRestNodeAuth = require("@azure/ms-rest-nodeauth");
const task = require("vsts-task-lib/task");
const axios_1 = require("axios");
const dayjs = require("dayjs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //variable
            //Inputs
            const sv = task.getInput('azureSubscriptionEndpoint', true);
            const subId = task.getEndpointDataParameter(sv, 'subscriptionId', false);
            // console.log('AzServiceId', sv);
            // console.log('SubId', subId);
            const group = task.getInput('resourceGroupName', true);
            const logName = task.getInput('azLogWPName', true);
            const table = task.getInput('azLogTbName', true);
            const duration = task.getInput('azLogWPDuration', true);
            let date = '';
            switch (duration) {
                case '1Month':
                    date = new dayjs.Dayjs().add(-1, 'month').format('YYYY-MM-DD');
                    break;
                case '1Week':
                    date = new dayjs.Dayjs().add(-1, 'week').format('YYYY-MM-DD');
                    break;
                case '1Day':
                default:
                    date = new dayjs.Dayjs().add(-1, 'day').format('YYYY-MM-DD');
                    break;
            }
            const endpoint = task.getEndpointAuthorization(sv, false);
            const auth = yield msRestNodeAuth.loginWithServicePrincipalSecret(endpoint.parameters['serviceprincipalid'], endpoint.parameters['serviceprincipalkey'], endpoint.parameters['tenantid']);
            const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/providers/Microsoft.OperationalInsights/workspaces/${logName}/purge?api-version=2020-08-01`;
            console.log('endpoint', url);
            const token = yield auth.getToken();
            yield axios_1.default.patch(url, {
                table,
                filters: [
                    {
                        column: 'TimeGenerated',
                        operator: '<=',
                        value: date,
                    },
                ],
            }, {
                headers: { Authorization: 'Bearer ' + token.accessToken },
            });
            // console.log(' endpoint.scheme', endpoint.scheme);
            // console.log(' endpoint.parameters', endpoint.parameters);
            // const client = new SqlManagementClient(auth, subId);
            // await client.servers.update(group, server, JSON.parse(props));
            task.setResult(task.TaskResult.Succeeded, '', true);
        }
        catch (err) {
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
run();
