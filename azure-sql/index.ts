import * as task from 'vsts-task-lib/task';

import axios from 'axios';

export interface ReplacePattern {
  from: string;
  to: string;
}

async function run() {
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

    await axios.patch(url, props, { headers: { Authorization: 'Bearer ' + token } });

    task.setResult(task.TaskResult.Succeeded, '', true);
  } catch (err) {
    task.setResult(task.TaskResult.Failed, err.message);
  }
}

run();
