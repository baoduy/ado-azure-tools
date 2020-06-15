import { TaskResult, getInput, getVariable, setResult } from 'vsts-task-lib/task';

import axios from 'axios';

export interface ReplacePattern {
  from: string;
  to: string;
}

async function run() {
  try {
    //variable
    const token = getVariable('system.AccessToken');
    //Inputs
    const subId = getInput('azureSubscriptionEndpoint', true);
    const group = getInput('resourceGroupName', true);
    const server = getInput('azSqlServerName', true);
    const props = getInput('propertiesInput', true);

    const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/providers/Microsoft.Sql/servers/${server}?api-version=2019-06-01-preview`;

    await axios.patch(url, props, { headers: { Authorization: 'Bearer ' + token } });

    setResult(TaskResult.Succeeded, '', true);
  } catch (err) {
    setResult(TaskResult.Failed, err.message);
  }
}

run();
