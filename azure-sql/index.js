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
const task_1 = require("vsts-task-lib/task");
const axios_1 = require("axios");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //variable
            const token = task_1.getVariable('system.AccessToken');
            //Inputs
            const subId = task_1.getInput('azureSubscriptionEndpoint', true);
            const group = task_1.getInput('resourceGroupName', true);
            const server = task_1.getInput('azSqlServerName', true);
            const props = task_1.getInput('propertiesInput', true);
            const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/providers/Microsoft.Sql/servers/${server}?api-version=2019-06-01-preview`;
            yield axios_1.default.patch(url, props, { headers: { Authorization: 'Bearer ' + token } });
            task_1.setResult(task_1.TaskResult.Succeeded, '', true);
        }
        catch (err) {
            task_1.setResult(task_1.TaskResult.Failed, err.message);
        }
    });
}
run();
