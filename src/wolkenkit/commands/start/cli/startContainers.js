'use strict';

const difference = require('lodash/difference'),
      remove = require('lodash/remove');

const docker = require('../../../../docker'),
      sleep = require('../../../../sleep');

const startContainers = async function ({
  configuration,
  dangerouslyExposeHttpPorts,
  debug,
  persistData,
  sharedKey
}, progress) {
  if (!configuration) {
    throw new Error('Configuration is missing.');
  }
  if (dangerouslyExposeHttpPorts === undefined) {
    throw new Error('Dangerously expose http ports is missing.');
  }
  if (debug === undefined) {
    throw new Error('Debug is missing.');
  }
  if (persistData === undefined) {
    throw new Error('Persist data is missing.');
  }
  if (!sharedKey) {
    throw new Error('Shared key is missing.');
  }
  if (!progress) {
    throw new Error('Progress is missing.');
  }

  const containers = await configuration.containers({
    dangerouslyExposeHttpPorts,
    debug,
    persistData,
    sharedKey
  });

  const numberOfContainers = containers.length;
  const started = [];

  let err;

  while (started.length < numberOfContainers && !err) {
    const nextContainerToStart = containers.find(container => {
      const dependsOn = container.dependsOn || [];
      const startedContainerNames = started.map(startedContainer => startedContainer.name);

      return difference(dependsOn, startedContainerNames).length === 0;
    });

    if (nextContainerToStart) {
      remove(containers, container => container.name === nextContainerToStart.name);

      /* eslint-disable no-loop-func */
      (async () => {
        try {
          await docker.startContainer({ configuration, container: nextContainerToStart });

          started.push(nextContainerToStart);
          progress({ message: `Started ${nextContainerToStart.name} (${started.length}/${numberOfContainers}).`, type: 'info' });
        } catch (ex) {
          err = ex;
        }
      })();
      /* eslint-enable no-loop-func */
    }

    await sleep(50);
  }

  if (err) {
    throw err;
  }
};

module.exports = startContainers;
