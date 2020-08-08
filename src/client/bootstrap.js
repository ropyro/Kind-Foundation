const config = require('config');
const { fetchRemoteConfig, configureProxy } = require('@deity/falcon-client/src/bootstrap/configureServer');

export default async () => {
  const redirects = {
    payment: {
      success: '/checkout/confirmation',
      failure: '/checkout/failure',
      cancel: '/cart'
    }
  };
  const serverUrl = config.graphqlUrl || config.apolloClient.httpLink.uri;
  const serverConfig = await fetchRemoteConfig(serverUrl);

  return {
    config: { ...config },
    // onServerCreated: server => { console.log('created'); },
    // onServerInitialized: server => { console.log('initialized'); },
    // onServerStarted: server => { console.log('started'); }
    onRouterCreated: async router => configureProxy(router, serverUrl, serverConfig.endpoints, redirects)
  };
};
