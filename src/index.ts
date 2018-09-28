import { Application } from 'probot';

const rp = require('request-promise');

interface ZenhubPipeline {
  id: string;
  issues: Array<{
    estimate?: { value: number };
    is_epic: boolean;
    issue_number: number;
    position?: number;
  }>;
  name: string;
}

interface GithubLabel {
  color: string;
  default: boolean;
  id: number;
  name: string;
  node_id: string;
  url: string;
}

function getPipelineMatchingAddedLabel(label: GithubLabel, pipelines: ZenhubPipeline[]): ZenhubPipeline | undefined {
  return pipelines.find((p) => p.name.toLocaleLowerCase() === label.name.toLocaleLowerCase());
}

const token = process.env.ZH_TOKEN;

export = (app: Application) => {
  app.log('Old Labellin\' Magoo, ready to automate!');

  if (token === undefined || !token) {
    throw new Error('A ZH_TOKEN must be supplied, see this link for more info https://github.com/ZenHubIO/API#authentication');
  }

  /**
   * Any newly labeled issue should be moved to the
   * ZenHub pipeline with the same name (case insensitive)
   */
  app.on('issues.labeled', async context => {
    const { pipelines } = await rp({
      method: 'GET',
      uri: `https://api.zenhub.io/p1/repositories/${context.payload.repository.id}/board`,
      headers: {
        'X-Authentication-Token': token,
      },
      json: true, // Automatically parses the JSON string in the response
    });

    const newPipeline = getPipelineMatchingAddedLabel(context.payload.label, pipelines);

    if (newPipeline === undefined) {
      context.log('Found no matching pipeline for label', context.payload.label.name);

      return;
    }

    const options = {
      method: 'POST',
      uri: `https://api.zenhub.io/p1/repositories/${context.payload.repository.id}/issues/${context.payload.issue.number}/moves`,
      headers: {
        'X-Authentication-Token': token,
      },
      body: {
        pipeline_id: newPipeline.id,
        position: 'bottom',
      },
      json: true, // Automatically stringifies the body to JSON
    };

    await rp(options);
  })
}
