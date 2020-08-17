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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Inputs
            const sv = task.getInput('azureSubscriptionEndpoint', true);
            const subId = task.getEndpointDataParameter(sv, 'subscriptionId', false);
            // console.log('AzServiceId', sv);
            // console.log('SubId', subId);
            const group = task.getInput('resourceGroupName', true);
            const streamJobName = task.getInput('azStreamJobName', true);
            const action = task.getInput('action', true).toLowerCase();
            const endpoint = task.getEndpointAuthorization(sv, false);
            const auth = yield msRestNodeAuth.loginWithServicePrincipalSecret(endpoint.parameters['serviceprincipalid'], endpoint.parameters['serviceprincipalkey'], endpoint.parameters['tenantid']);
            const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/providers/Microsoft.StreamAnalytics/streamingjobs/${streamJobName}/${action}?api-version=2015-10-01`;
            console.log('endpoint', url);
            const token = yield auth.getToken();
            const res = yield axios_1.default.post(url, {}, { headers: { Authorization: 'Bearer ' + token.accessToken } });
            console.log(res);
            task.setResult(task.TaskResult.Succeeded, '', true);
        }
        catch (err) {
            console.log(`Failed to send req: ${JSON.stringify(err)}`);
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
run();
