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
const task = require("vsts-task-lib/task");
const axios_1 = require("axios");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //variable
            const token = task.getVariable('system.AccessToken');
            //Inputs
            const sv = task.getInput('azureSubscriptionEndpoint', true);
            const subId = task.getEndpointDataParameter(sv, 'SubscriptionId', true);
            const group = task.getInput('resourceGroupName', true);
            const server = task.getInput('azSqlServerName', true);
            const props = task.getInput('propertiesInput', true);
            const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/providers/Microsoft.Sql/servers/${server}?api-version=2019-06-01-preview`;
            console.log('endpoint', url);
            yield axios_1.default.patch(url, props, { headers: { Authorization: 'Bearer ' + token } });
            task.setResult(task.TaskResult.Succeeded, '', true);
        }
        catch (err) {
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
run();
