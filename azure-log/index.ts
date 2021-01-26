import * as msRestNodeAuth from '@azure/ms-rest-nodeauth';
import * as task from 'vsts-task-lib/task';

import axios from 'axios';
import * as dayjs from 'dayjs';

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
    const auth = await msRestNodeAuth.loginWithServicePrincipalSecret(
      endpoint.parameters['serviceprincipalid'],
      endpoint.parameters['serviceprincipalkey'],
      endpoint.parameters['tenantid']
    );

    const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/providers/Microsoft.OperationalInsights/workspaces/${logName}/purge?api-version=2020-08-01`;
    console.log('endpoint', url);

    const token = await auth.getToken();

    await axios.patch(
      url,
      {
        table,
        filters: [
          {
            column: 'TimeGenerated',
            operator: '<=',
            value: date,
          },
        ],
      },
      {
        headers: { Authorization: 'Bearer ' + token.accessToken },
      }
    );

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
