import * as msRestNodeAuth from '@azure/ms-rest-nodeauth';
import * as task from 'vsts-task-lib/task';

import { SqlManagementClient } from '@azure/arm-sql';
import axios from 'axios';

export interface ReplacePattern {
  from: string;
  to: string;
}

async function run() {
  try {
    //variable

    //Inputs
    const sv = task.getInput('azureSubscriptionEndpoint', true);
    const subId = task.getEndpointDataParameter(sv, 'subscriptionId', false);

    console.log('AzServiceId', sv);
    console.log('SubId', subId);

    const group = task.getInput('resourceGroupName', true);
    const server = task.getInput('azSqlServerName', true);
    const props = JSON.parse(task.getInput('propertiesInput', true));
    console.log('properties', props);

    const endpoint = task.getEndpointAuthorization(sv, false);
    const auth = await msRestNodeAuth.loginWithServicePrincipalSecret(
      endpoint.parameters['serviceprincipalid'],
      endpoint.parameters['serviceprincipalkey'],
      endpoint.parameters['tenantid']
    );

    const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/providers/Microsoft.Sql/servers/${server}?api-version=2019-06-01-preview`;
    console.log('endpoint', url);

    const token = await auth.getToken();
    await axios.patch(url, props, { headers: { Authorization: 'Bearer ' + token.accessToken } });

    // console.log(' endpoint.scheme', endpoint.scheme);
    // console.log(' endpoint.parameters', endpoint.parameters);

    // const client = new SqlManagementClient(auth, subId);
    // await client.servers.update(group, server, JSON.parse(props));

    task.setResult(task.TaskResult.Succeeded, '', true);
  } catch (err) {
    task.setResult(task.TaskResult.Failed, err.message);
  }
}

run();
