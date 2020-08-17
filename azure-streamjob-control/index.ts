import * as msRestNodeAuth from '@azure/ms-rest-nodeauth';
import * as task from 'vsts-task-lib/task';
import axios from 'axios';

async function run() {
  try {
    //Inputs
    const sv = task.getInput('azureSubscriptionEndpoint', true);
    const subId = task.getEndpointDataParameter(sv, 'subscriptionId', false);

    // console.log('AzServiceId', sv);
    // console.log('SubId', subId);

    const group = task.getInput('resourceGroupName', true);
    const streamJobName = task.getInput('azStreamJobName', true);
    const action = task.getInput('action', true);

    const endpoint = task.getEndpointAuthorization(sv, false);
    const auth = await msRestNodeAuth.loginWithServicePrincipalSecret(
      endpoint.parameters['serviceprincipalid'],
      endpoint.parameters['serviceprincipalkey'],
      endpoint.parameters['tenantid'],
    );

    const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/
                    providers/Microsoft.StreamAnalytics/streamingjobs/${streamJobName}/${action}?api-version=2015-10-01`;

    console.log('endpoint', url);

    const token = await auth.getToken();
    await axios.post(
      url,
      {},
      { headers: { Authorization: 'Bearer ' + token.accessToken } },
    );

    task.setResult(task.TaskResult.Succeeded, '', true);
  } catch (err) {
    task.setResult(task.TaskResult.Failed, err.message);
  }
}

run();
