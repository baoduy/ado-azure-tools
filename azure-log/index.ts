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
    //Inputs
    const sv = task.getInput('azureSubscriptionEndpoint', true);
    const subId = task.getEndpointDataParameter(sv, 'subscriptionId', false);

    const group = task.getInput('resourceGroupName', true);
    const logName = task.getInput('azLogWPName', true);
    const table = task.getInput('azLogTbName', true);
    const duration = task.getInput('azLogWPDuration', true);

    let date = '';

    switch (duration) {
      case '1Month':
        date = dayjs().add(-1, 'month').format('YYYY-MM-DD');
        break;
      case '1Week':
        date = dayjs().add(-1, 'week').format('YYYY-MM-DD');
        break;
      case '1Day':
      default:
        date = dayjs().add(-1, 'day').format('YYYY-MM-DD');
        break;
    }

    const endpoint = task.getEndpointAuthorization(sv, false);
    const auth = await msRestNodeAuth.loginWithServicePrincipalSecret(
      endpoint.parameters['serviceprincipalid'],
      endpoint.parameters['serviceprincipalkey'],
      endpoint.parameters['tenantid']
    );

    const url = `https://management.azure.com/subscriptions/${subId}/resourceGroups/${group}/providers/Microsoft.OperationalInsights/workspaces/${logName}/purge?api-version=2020-08-01`;

    const token = await auth.getToken();

    console.log('posting the request:', { url, date });

    await axios.post(
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

    task.setResult(task.TaskResult.Succeeded, '', true);
  } catch (err) {
    console.log('Error:', err);
    task.setResult(task.TaskResult.Failed, err.message);
  }
}

run();
