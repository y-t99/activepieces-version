import {
  createTrigger,
  TriggerStrategy,
} from '../../../framework/trigger/trigger';
import { httpClient } from '../../../common/http/core/http-client';
import { HttpRequest } from '../../../common/http/core/http-request';
import { HttpMethod } from '../../../common/http/core/http-method';
import { AuthenticationType } from '../../../common/authentication/core/authentication-type';
import { Property } from '../../../framework/property/prop.model';
import { githubCommon } from '../common';

export const githubNewRepoEvent = createTrigger({
  name: 'new_repo_event',
  displayName: 'New Repository Event',
  description: 'Triggers when there is a new event on the repository',
  props: {
    authentication: githubCommon.authentication,
    repository: githubCommon.repositoryDropdown,
    events: Property.Dropdown({
      displayName: 'Event',
      description: 'List of repository events',
      required: true,
      refreshers: [],
      options: async (request) => {
        return {
          disabled: false,
          options: [
            {
              label: 'New star',
              value: ['star'],
            },
          ],
        };
      },
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    const { repo, owner } = context.propsValue['repository']!;
    const request: HttpRequest<any> = {
      method: HttpMethod.POST,
      url: `${githubCommon.baseUrl}/repos/${owner}/${repo}/hooks`,
      body: {
        owner: owner,
        repo: repo,
        active: true,
        events: context.propsValue['events'],
        config: {
          url: context.webhookUrl,
          content_type: 'json',
          insecure_ssl: '0',
        },
      },
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: context.propsValue['authentication']!['access_token'],
      },
      queryParams: {},
    };
    let webhook = await httpClient.sendRequest<{ id: string }>(request);
    await context.store?.save<WebhookInformation>('_trigger', {
      webhookId: webhook.id,
      owner: owner,
      repo: repo,
    });
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>('_trigger');
    if (response !== null && response !== undefined) {
      const request: HttpRequest<never> = {
        method: HttpMethod.DELETE,
        url: `${githubCommon.baseUrl}/repos/${response.owner}/${response.repo}/hooks/${response.webhookId}`,
        authentication: {
          type: AuthenticationType.BEARER_TOKEN,
          token: context.propsValue['authentication']!['access_token'],
        },
      };
      await httpClient.sendRequest(request);
    }
  },
  async run(context) {
    if (isVerficationCall(context.payload)) {
      return [];
    }
    return [context.payload];
  },
});

function isVerficationCall(payload: Record<string, any>) {
  return payload['zen'] !== undefined;
}

interface WebhookInformation {
  webhookId: string;
  repo: string;
  owner: string;
}
