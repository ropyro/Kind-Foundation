(function () {
  'use strict';

  try{self['workbox:core:4.3.1']&&_();}catch(e){}// eslint-disable-line

  /*
    Copyright 2019 Google LLC
    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  const logger = (() => {
    let inGroup = false;

    const methodToColorMap = {
      debug: `#7f8c8d`, // Gray
      log: `#2ecc71`, // Green
      warn: `#f39c12`, // Yellow
      error: `#c0392b`, // Red
      groupCollapsed: `#3498db`, // Blue
      groupEnd: null, // No colored prefix on groupEnd
    };

    const print = function(method, args) {
      if (method === 'groupCollapsed') {
        // Safari doesn't print all console.groupCollapsed() arguments:
        // https://bugs.webkit.org/show_bug.cgi?id=182754
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          console[method](...args);
          return;
        }
      }

      const styles = [
        `background: ${methodToColorMap[method]}`,
        `border-radius: 0.5em`,
        `color: white`,
        `font-weight: bold`,
        `padding: 2px 0.5em`,
      ];

      // When in a group, the workbox prefix is not displayed.
      const logPrefix = inGroup ? [] : ['%cworkbox', styles.join(';')];

      console[method](...logPrefix, ...args);

      if (method === 'groupCollapsed') {
        inGroup = true;
      }
      if (method === 'groupEnd') {
        inGroup = false;
      }
    };

    const api = {};
    for (const method of Object.keys(methodToColorMap)) {
      api[method] = (...args) => {
        print(method, args);
      };
    }

    return api;
  })();

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  const messages = {
    'invalid-value': ({paramName, validValueDescription, value}) => {
      if (!paramName || !validValueDescription) {
        throw new Error(`Unexpected input to 'invalid-value' error.`);
      }
      return `The '${paramName}' parameter was given a value with an ` +
        `unexpected value. ${validValueDescription} Received a value of ` +
        `${JSON.stringify(value)}.`;
    },

    'not-in-sw': ({moduleName}) => {
      if (!moduleName) {
        throw new Error(`Unexpected input to 'not-in-sw' error.`);
      }
      return `The '${moduleName}' must be used in a service worker.`;
    },

    'not-an-array': ({moduleName, className, funcName, paramName}) => {
      if (!moduleName || !className || !funcName || !paramName) {
        throw new Error(`Unexpected input to 'not-an-array' error.`);
      }
      return `The parameter '${paramName}' passed into ` +
        `'${moduleName}.${className}.${funcName}()' must be an array.`;
    },

    'incorrect-type': ({expectedType, paramName, moduleName, className,
      funcName}) => {
      if (!expectedType || !paramName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'incorrect-type' error.`);
      }
      return `The parameter '${paramName}' passed into ` +
        `'${moduleName}.${className ? (className + '.') : ''}` +
        `${funcName}()' must be of type ${expectedType}.`;
    },

    'incorrect-class': ({expectedClass, paramName, moduleName, className,
      funcName, isReturnValueProblem}) => {
      if (!expectedClass || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'incorrect-class' error.`);
      }

      if (isReturnValueProblem) {
        return `The return value from ` +
          `'${moduleName}.${className ? (className + '.') : ''}${funcName}()' ` +
          `must be an instance of class ${expectedClass.name}.`;
      }

      return `The parameter '${paramName}' passed into ` +
        `'${moduleName}.${className ? (className + '.') : ''}${funcName}()' ` +
        `must be an instance of class ${expectedClass.name}.`;
    },

    'missing-a-method': ({expectedMethod, paramName, moduleName, className,
      funcName}) => {
      if (!expectedMethod || !paramName || !moduleName || !className
          || !funcName) {
        throw new Error(`Unexpected input to 'missing-a-method' error.`);
      }
      return `${moduleName}.${className}.${funcName}() expected the ` +
        `'${paramName}' parameter to expose a '${expectedMethod}' method.`;
    },

    'add-to-cache-list-unexpected-type': ({entry}) => {
      return `An unexpected entry was passed to ` +
      `'workbox-precaching.PrecacheController.addToCacheList()' The entry ` +
      `'${JSON.stringify(entry)}' isn't supported. You must supply an array of ` +
      `strings with one or more characters, objects with a url property or ` +
      `Request objects.`;
    },

    'add-to-cache-list-conflicting-entries': ({firstEntry, secondEntry}) => {
      if (!firstEntry || !secondEntry) {
        throw new Error(`Unexpected input to ` +
          `'add-to-cache-list-duplicate-entries' error.`);
      }

      return `Two of the entries passed to ` +
        `'workbox-precaching.PrecacheController.addToCacheList()' had the URL ` +
        `${firstEntry._entryId} but different revision details. Workbox is ` +
        `is unable to cache and version the asset correctly. Please remove one ` +
        `of the entries.`;
    },

    'plugin-error-request-will-fetch': ({thrownError}) => {
      if (!thrownError) {
        throw new Error(`Unexpected input to ` +
          `'plugin-error-request-will-fetch', error.`);
      }

      return `An error was thrown by a plugins 'requestWillFetch()' method. ` +
        `The thrown error message was: '${thrownError.message}'.`;
    },

    'invalid-cache-name': ({cacheNameId, value}) => {
      if (!cacheNameId) {
        throw new Error(
            `Expected a 'cacheNameId' for error 'invalid-cache-name'`);
      }

      return `You must provide a name containing at least one character for ` +
        `setCacheDeatils({${cacheNameId}: '...'}). Received a value of ` +
        `'${JSON.stringify(value)}'`;
    },

    'unregister-route-but-not-found-with-method': ({method}) => {
      if (!method) {
        throw new Error(`Unexpected input to ` +
          `'unregister-route-but-not-found-with-method' error.`);
      }

      return `The route you're trying to unregister was not  previously ` +
        `registered for the method type '${method}'.`;
    },

    'unregister-route-route-not-registered': () => {
      return `The route you're trying to unregister was not previously ` +
        `registered.`;
    },

    'queue-replay-failed': ({name}) => {
      return `Replaying the background sync queue '${name}' failed.`;
    },

    'duplicate-queue-name': ({name}) => {
      return `The Queue name '${name}' is already being used. ` +
          `All instances of backgroundSync.Queue must be given unique names.`;
    },

    'expired-test-without-max-age': ({methodName, paramName}) => {
      return `The '${methodName}()' method can only be used when the ` +
        `'${paramName}' is used in the constructor.`;
    },

    'unsupported-route-type': ({moduleName, className, funcName, paramName}) => {
      return `The supplied '${paramName}' parameter was an unsupported type. ` +
        `Please check the docs for ${moduleName}.${className}.${funcName} for ` +
        `valid input types.`;
    },

    'not-array-of-class': ({value, expectedClass,
      moduleName, className, funcName, paramName}) => {
      return `The supplied '${paramName}' parameter must be an array of ` +
        `'${expectedClass}' objects. Received '${JSON.stringify(value)},'. ` +
        `Please check the call to ${moduleName}.${className}.${funcName}() ` +
        `to fix the issue.`;
    },

    'max-entries-or-age-required': ({moduleName, className, funcName}) => {
      return `You must define either config.maxEntries or config.maxAgeSeconds` +
        `in ${moduleName}.${className}.${funcName}`;
    },

    'statuses-or-headers-required': ({moduleName, className, funcName}) => {
      return `You must define either config.statuses or config.headers` +
        `in ${moduleName}.${className}.${funcName}`;
    },

    'invalid-string': ({moduleName, className, funcName, paramName}) => {
      if (!paramName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'invalid-string' error.`);
      }
      return `When using strings, the '${paramName}' parameter must start with ` +
        `'http' (for cross-origin matches) or '/' (for same-origin matches). ` +
        `Please see the docs for ${moduleName}.${funcName}() for ` +
        `more info.`;
    },

    'channel-name-required': () => {
      return `You must provide a channelName to construct a ` +
      `BroadcastCacheUpdate instance.`;
    },

    'invalid-responses-are-same-args': () => {
      return `The arguments passed into responsesAreSame() appear to be ` +
        `invalid. Please ensure valid Responses are used.`;
    },

    'expire-custom-caches-only': () => {
      return `You must provide a 'cacheName' property when using the ` +
        `expiration plugin with a runtime caching strategy.`;
    },

    'unit-must-be-bytes': ({normalizedRangeHeader}) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
      }
      return `The 'unit' portion of the Range header must be set to 'bytes'. ` +
        `The Range header provided was "${normalizedRangeHeader}"`;
    },

    'single-range-only': ({normalizedRangeHeader}) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'single-range-only' error.`);
      }
      return `Multiple ranges are not supported. Please use a  single start ` +
        `value, and optional end value. The Range header provided was ` +
        `"${normalizedRangeHeader}"`;
    },

    'invalid-range-values': ({normalizedRangeHeader}) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'invalid-range-values' error.`);
      }
      return `The Range header is missing both start and end values. At least ` +
        `one of those values is needed. The Range header provided was ` +
        `"${normalizedRangeHeader}"`;
    },

    'no-range-header': () => {
      return `No Range header was found in the Request provided.`;
    },

    'range-not-satisfiable': ({size, start, end}) => {
      return `The start (${start}) and end (${end}) values in the Range are ` +
        `not satisfiable by the cached response, which is ${size} bytes.`;
    },

    'attempt-to-cache-non-get-request': ({url, method}) => {
      return `Unable to cache '${url}' because it is a '${method}' request and ` +
        `only 'GET' requests can be cached.`;
    },

    'cache-put-with-no-response': ({url}) => {
      return `There was an attempt to cache '${url}' but the response was not ` +
        `defined.`;
    },

    'no-response': ({url, error}) => {
      let message = `The strategy could not generate a response for '${url}'.`;
      if (error) {
        message += ` The underlying error is ${error}.`;
      }
      return message;
    },

    'bad-precaching-response': ({url, status}) => {
      return `The precaching request for '${url}' failed with an HTTP ` +
        `status of ${status}.`;
    },
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  const generatorFunction = (code, ...args) => {
    const message = messages[code];
    if (!message) {
      throw new Error(`Unable to find message for code '${code}'.`);
    }

    return message(...args);
  };

  const messageGenerator = generatorFunction;

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * Workbox errors should be thrown with this class.
   * This allows use to ensure the type easily in tests,
   * helps developers identify errors from workbox
   * easily and allows use to optimise error
   * messages correctly.
   *
   * @private
   */
  class WorkboxError extends Error {
    /**
     *
     * @param {string} errorCode The error code that
     * identifies this particular error.
     * @param {Object=} details Any relevant arguments
     * that will help developers identify issues should
     * be added as a key on the context object.
     */
    constructor(errorCode, details) {
      let message = messageGenerator(errorCode, details);

      super(message);

      this.name = errorCode;
      this.details = details;
    }
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
   * This method returns true if the current context is a service worker.
   */
  const isSWEnv = (moduleName) => {
    if (!('ServiceWorkerGlobalScope' in self)) {
      throw new WorkboxError('not-in-sw', {moduleName});
    }
  };

  /*
   * This method throws if the supplied value is not an array.
   * The destructed values are required to produce a meaningful error for users.
   * The destructed and restructured object is so it's clear what is
   * needed.
   */
  const isArray = (value, {moduleName, className, funcName, paramName}) => {
    if (!Array.isArray(value)) {
      throw new WorkboxError('not-an-array', {
        moduleName,
        className,
        funcName,
        paramName,
      });
    }
  };

  const hasMethod = (object, expectedMethod,
      {moduleName, className, funcName, paramName}) => {
    const type = typeof object[expectedMethod];
    if (type !== 'function') {
      throw new WorkboxError('missing-a-method', {paramName, expectedMethod,
        moduleName, className, funcName});
    }
  };

  const isType = (object, expectedType,
      {moduleName, className, funcName, paramName}) => {
    if (typeof object !== expectedType) {
      throw new WorkboxError('incorrect-type', {paramName, expectedType,
        moduleName, className, funcName});
    }
  };

  const isInstance = (object, expectedClass,
      {moduleName, className, funcName,
        paramName, isReturnValueProblem}) => {
    if (!(object instanceof expectedClass)) {
      throw new WorkboxError('incorrect-class', {paramName, expectedClass,
        moduleName, className, funcName, isReturnValueProblem});
    }
  };

  const isOneOf = (value, validValues, {paramName}) => {
    if (!validValues.includes(value)) {
      throw new WorkboxError('invalid-value', {
        paramName,
        value,
        validValueDescription: `Valid values are ${JSON.stringify(validValues)}.`,
      });
    }
  };

  const isArrayOfClass = (value, expectedClass,
      {moduleName, className, funcName, paramName}) => {
    const error = new WorkboxError('not-array-of-class', {
      value, expectedClass,
      moduleName, className, funcName, paramName,
    });
    if (!Array.isArray(value)) {
      throw error;
    }

    for (let item of value) {
      if (!(item instanceof expectedClass)) {
        throw error;
      }
    }
  };

  const finalAssertExports = {
    hasMethod,
    isArray,
    isInstance,
    isOneOf,
    isSWEnv,
    isType,
    isArrayOfClass,
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  // Callbacks to be executed whenever there's a quota error.
  const quotaErrorCallbacks = new Set();

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  const _cacheNameDetails = {
    googleAnalytics: 'googleAnalytics',
    precache: 'precache-v2',
    prefix: 'workbox',
    runtime: 'runtime',
    suffix: self.registration.scope,
  };

  const _createCacheName = (cacheName) => {
    return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix]
        .filter((value) => value.length > 0)
        .join('-');
  };

  const cacheNames = {
    updateDetails: (details) => {
      Object.keys(_cacheNameDetails).forEach((key) => {
        if (typeof details[key] !== 'undefined') {
          _cacheNameDetails[key] = details[key];
        }
      });
    },
    getGoogleAnalyticsName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
    },
    getPrecacheName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.precache);
    },
    getPrefix: () => {
      return _cacheNameDetails.prefix;
    },
    getRuntimeName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.runtime);
    },
    getSuffix: () => {
      return _cacheNameDetails.suffix;
    },
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  const getFriendlyURL = (url) => {
    const urlObj = new URL(url, location);
    if (urlObj.origin === location.origin) {
      return urlObj.pathname;
    }
    return urlObj.href;
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  /**
   * Runs all of the callback functions, one at a time sequentially, in the order
   * in which they were registered.
   *
   * @memberof workbox.core
   * @private
   */
  async function executeQuotaErrorCallbacks() {
    {
      logger.log(`About to run ${quotaErrorCallbacks.size} ` +
          `callbacks to clean up caches.`);
    }

    for (const callback of quotaErrorCallbacks) {
      await callback();
      {
        logger.log(callback, 'is complete.');
      }
    }

    {
      logger.log('Finished running callbacks.');
    }
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  const pluginEvents = {
    CACHE_DID_UPDATE: 'cacheDidUpdate',
    CACHE_KEY_WILL_BE_USED: 'cacheKeyWillBeUsed',
    CACHE_WILL_UPDATE: 'cacheWillUpdate',
    CACHED_RESPONSE_WILL_BE_USED: 'cachedResponseWillBeUsed',
    FETCH_DID_FAIL: 'fetchDidFail',
    FETCH_DID_SUCCEED: 'fetchDidSucceed',
    REQUEST_WILL_FETCH: 'requestWillFetch',
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  const pluginUtils = {
    filter: (plugins, callbackName) => {
      return plugins.filter((plugin) => callbackName in plugin);
    },
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  /**
   * Wrapper around cache.put().
   *
   * Will call `cacheDidUpdate` on plugins if the cache was updated, using
   * `matchOptions` when determining what the old entry is.
   *
   * @param {Object} options
   * @param {string} options.cacheName
   * @param {Request} options.request
   * @param {Response} options.response
   * @param {Event} [options.event]
   * @param {Array<Object>} [options.plugins=[]]
   * @param {Object} [options.matchOptions]
   *
   * @private
   * @memberof module:workbox-core
   */
  const putWrapper = async ({
    cacheName,
    request,
    response,
    event,
    plugins = [],
    matchOptions,
  } = {}) => {
    {
      if (request.method && request.method !== 'GET') {
        throw new WorkboxError('attempt-to-cache-non-get-request', {
          url: getFriendlyURL(request.url),
          method: request.method,
        });
      }
    }

    const effectiveRequest = await _getEffectiveRequest({
      plugins, request, mode: 'write'});

    if (!response) {
      {
        logger.error(`Cannot cache non-existent response for ` +
          `'${getFriendlyURL(effectiveRequest.url)}'.`);
      }

      throw new WorkboxError('cache-put-with-no-response', {
        url: getFriendlyURL(effectiveRequest.url),
      });
    }

    let responseToCache = await _isResponseSafeToCache({
      event,
      plugins,
      response,
      request: effectiveRequest,
    });

    if (!responseToCache) {
      {
        logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' will ` +
        `not be cached.`, responseToCache);
      }
      return;
    }

    const cache = await caches.open(cacheName);

    const updatePlugins = pluginUtils.filter(
        plugins, pluginEvents.CACHE_DID_UPDATE);

    let oldResponse = updatePlugins.length > 0 ?
        await matchWrapper({cacheName, matchOptions, request: effectiveRequest}) :
        null;

    {
      logger.debug(`Updating the '${cacheName}' cache with a new Response for ` +
        `${getFriendlyURL(effectiveRequest.url)}.`);
    }

    try {
      await cache.put(effectiveRequest, responseToCache);
    } catch (error) {
      // See https://developer.mozilla.org/en-US/docs/Web/API/DOMException#exception-QuotaExceededError
      if (error.name === 'QuotaExceededError') {
        await executeQuotaErrorCallbacks();
      }
      throw error;
    }

    for (let plugin of updatePlugins) {
      await plugin[pluginEvents.CACHE_DID_UPDATE].call(plugin, {
        cacheName,
        event,
        oldResponse,
        newResponse: responseToCache,
        request: effectiveRequest,
      });
    }
  };

  /**
   * This is a wrapper around cache.match().
   *
   * @param {Object} options
   * @param {string} options.cacheName Name of the cache to match against.
   * @param {Request} options.request The Request that will be used to look up
   *     cache entries.
   * @param {Event} [options.event] The event that propted the action.
   * @param {Object} [options.matchOptions] Options passed to cache.match().
   * @param {Array<Object>} [options.plugins=[]] Array of plugins.
   * @return {Response} A cached response if available.
   *
   * @private
   * @memberof module:workbox-core
   */
  const matchWrapper = async ({
    cacheName,
    request,
    event,
    matchOptions,
    plugins = [],
  }) => {
    const cache = await caches.open(cacheName);

    const effectiveRequest = await _getEffectiveRequest({
      plugins, request, mode: 'read'});

    let cachedResponse = await cache.match(effectiveRequest, matchOptions);
    {
      if (cachedResponse) {
        logger.debug(`Found a cached response in '${cacheName}'.`);
      } else {
        logger.debug(`No cached response found in '${cacheName}'.`);
      }
    }

    for (const plugin of plugins) {
      if (pluginEvents.CACHED_RESPONSE_WILL_BE_USED in plugin) {
        cachedResponse = await plugin[pluginEvents.CACHED_RESPONSE_WILL_BE_USED]
            .call(plugin, {
              cacheName,
              event,
              matchOptions,
              cachedResponse,
              request: effectiveRequest,
            });
        {
          if (cachedResponse) {
            finalAssertExports.isInstance(cachedResponse, Response, {
              moduleName: 'Plugin',
              funcName: pluginEvents.CACHED_RESPONSE_WILL_BE_USED,
              isReturnValueProblem: true,
            });
          }
        }
      }
    }

    return cachedResponse;
  };

  /**
   * This method will call cacheWillUpdate on the available plugins (or use
   * status === 200) to determine if the Response is safe and valid to cache.
   *
   * @param {Object} options
   * @param {Request} options.request
   * @param {Response} options.response
   * @param {Event} [options.event]
   * @param {Array<Object>} [options.plugins=[]]
   * @return {Promise<Response>}
   *
   * @private
   * @memberof module:workbox-core
   */
  const _isResponseSafeToCache = async ({request, response, event, plugins}) => {
    let responseToCache = response;
    let pluginsUsed = false;
    for (let plugin of plugins) {
      if (pluginEvents.CACHE_WILL_UPDATE in plugin) {
        pluginsUsed = true;
        responseToCache = await plugin[pluginEvents.CACHE_WILL_UPDATE]
            .call(plugin, {
              request,
              response: responseToCache,
              event,
            });

        {
          if (responseToCache) {
            finalAssertExports.isInstance(responseToCache, Response, {
              moduleName: 'Plugin',
              funcName: pluginEvents.CACHE_WILL_UPDATE,
              isReturnValueProblem: true,
            });
          }
        }

        if (!responseToCache) {
          break;
        }
      }
    }

    if (!pluginsUsed) {
      {
        if (!responseToCache.status === 200) {
          if (responseToCache.status === 0) {
            logger.warn(`The response for '${request.url}' is an opaque ` +
              `response. The caching strategy that you're using will not ` +
              `cache opaque responses by default.`);
          } else {
            logger.debug(`The response for '${request.url}' returned ` +
            `a status code of '${response.status}' and won't be cached as a ` +
            `result.`);
          }
        }
      }
      responseToCache = responseToCache.status === 200 ? responseToCache : null;
    }

    return responseToCache ? responseToCache : null;
  };

  /**
   * Checks the list of plugins for the cacheKeyWillBeUsed callback, and
   * executes any of those callbacks found in sequence. The final `Request` object
   * returned by the last plugin is treated as the cache key for cache reads
   * and/or writes.
   *
   * @param {Object} options
   * @param {Request} options.request
   * @param {string} options.mode
   * @param {Array<Object>} [options.plugins=[]]
   * @return {Promise<Request>}
   *
   * @private
   * @memberof module:workbox-core
   */
  const _getEffectiveRequest = async ({request, mode, plugins}) => {
    const cacheKeyWillBeUsedPlugins = pluginUtils.filter(
        plugins, pluginEvents.CACHE_KEY_WILL_BE_USED);

    let effectiveRequest = request;
    for (const plugin of cacheKeyWillBeUsedPlugins) {
      effectiveRequest = await plugin[pluginEvents.CACHE_KEY_WILL_BE_USED].call(
          plugin, {mode, request: effectiveRequest});

      if (typeof effectiveRequest === 'string') {
        effectiveRequest = new Request(effectiveRequest);
      }

      {
        finalAssertExports.isInstance(effectiveRequest, Request, {
          moduleName: 'Plugin',
          funcName: pluginEvents.CACHE_KEY_WILL_BE_USED,
          isReturnValueProblem: true,
        });
      }
    }

    return effectiveRequest;
  };

  const cacheWrapper = {
    put: putWrapper,
    match: matchWrapper,
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  /**
   * A class that wraps common IndexedDB functionality in a promise-based API.
   * It exposes all the underlying power and functionality of IndexedDB, but
   * wraps the most commonly used features in a way that's much simpler to use.
   *
   * @private
   */
  class DBWrapper {
    /**
     * @param {string} name
     * @param {number} version
     * @param {Object=} [callback]
     * @param {!Function} [callbacks.onupgradeneeded]
     * @param {!Function} [callbacks.onversionchange] Defaults to
     *     DBWrapper.prototype._onversionchange when not specified.
     * @private
     */
    constructor(name, version, {
      onupgradeneeded,
      onversionchange = this._onversionchange,
    } = {}) {
      this._name = name;
      this._version = version;
      this._onupgradeneeded = onupgradeneeded;
      this._onversionchange = onversionchange;

      // If this is null, it means the database isn't open.
      this._db = null;
    }

    /**
     * Returns the IDBDatabase instance (not normally needed).
     *
     * @private
     */
    get db() {
      return this._db;
    }

    /**
     * Opens a connected to an IDBDatabase, invokes any onupgradedneeded
     * callback, and added an onversionchange callback to the database.
     *
     * @return {IDBDatabase}
     * @private
     */
    async open() {
      if (this._db) return;

      this._db = await new Promise((resolve, reject) => {
        // This flag is flipped to true if the timeout callback runs prior
        // to the request failing or succeeding. Note: we use a timeout instead
        // of an onblocked handler since there are cases where onblocked will
        // never never run. A timeout better handles all possible scenarios:
        // https://github.com/w3c/IndexedDB/issues/223
        let openRequestTimedOut = false;
        setTimeout(() => {
          openRequestTimedOut = true;
          reject(new Error('The open request was blocked and timed out'));
        }, this.OPEN_TIMEOUT);

        const openRequest = indexedDB.open(this._name, this._version);
        openRequest.onerror = () => reject(openRequest.error);
        openRequest.onupgradeneeded = (evt) => {
          if (openRequestTimedOut) {
            openRequest.transaction.abort();
            evt.target.result.close();
          } else if (this._onupgradeneeded) {
            this._onupgradeneeded(evt);
          }
        };
        openRequest.onsuccess = ({target}) => {
          const db = target.result;
          if (openRequestTimedOut) {
            db.close();
          } else {
            db.onversionchange = this._onversionchange.bind(this);
            resolve(db);
          }
        };
      });

      return this;
    }

    /**
     * Polyfills the native `getKey()` method. Note, this is overridden at
     * runtime if the browser supports the native method.
     *
     * @param {string} storeName
     * @param {*} query
     * @return {Array}
     * @private
     */
    async getKey(storeName, query) {
      return (await this.getAllKeys(storeName, query, 1))[0];
    }

    /**
     * Polyfills the native `getAll()` method. Note, this is overridden at
     * runtime if the browser supports the native method.
     *
     * @param {string} storeName
     * @param {*} query
     * @param {number} count
     * @return {Array}
     * @private
     */
    async getAll(storeName, query, count) {
      return await this.getAllMatching(storeName, {query, count});
    }


    /**
     * Polyfills the native `getAllKeys()` method. Note, this is overridden at
     * runtime if the browser supports the native method.
     *
     * @param {string} storeName
     * @param {*} query
     * @param {number} count
     * @return {Array}
     * @private
     */
    async getAllKeys(storeName, query, count) {
      return (await this.getAllMatching(
          storeName, {query, count, includeKeys: true})).map(({key}) => key);
    }

    /**
     * Supports flexible lookup in an object store by specifying an index,
     * query, direction, and count. This method returns an array of objects
     * with the signature .
     *
     * @param {string} storeName
     * @param {Object} [opts]
     * @param {string} [opts.index] The index to use (if specified).
     * @param {*} [opts.query]
     * @param {IDBCursorDirection} [opts.direction]
     * @param {number} [opts.count] The max number of results to return.
     * @param {boolean} [opts.includeKeys] When true, the structure of the
     *     returned objects is changed from an array of values to an array of
     *     objects in the form {key, primaryKey, value}.
     * @return {Array}
     * @private
     */
    async getAllMatching(storeName, {
      index,
      query = null, // IE errors if query === `undefined`.
      direction = 'next',
      count,
      includeKeys,
    } = {}) {
      return await this.transaction([storeName], 'readonly', (txn, done) => {
        const store = txn.objectStore(storeName);
        const target = index ? store.index(index) : store;
        const results = [];

        target.openCursor(query, direction).onsuccess = ({target}) => {
          const cursor = target.result;
          if (cursor) {
            const {primaryKey, key, value} = cursor;
            results.push(includeKeys ? {primaryKey, key, value} : value);
            if (count && results.length >= count) {
              done(results);
            } else {
              cursor.continue();
            }
          } else {
            done(results);
          }
        };
      });
    }

    /**
     * Accepts a list of stores, a transaction type, and a callback and
     * performs a transaction. A promise is returned that resolves to whatever
     * value the callback chooses. The callback holds all the transaction logic
     * and is invoked with two arguments:
     *   1. The IDBTransaction object
     *   2. A `done` function, that's used to resolve the promise when
     *      when the transaction is done, if passed a value, the promise is
     *      resolved to that value.
     *
     * @param {Array<string>} storeNames An array of object store names
     *     involved in the transaction.
     * @param {string} type Can be `readonly` or `readwrite`.
     * @param {!Function} callback
     * @return {*} The result of the transaction ran by the callback.
     * @private
     */
    async transaction(storeNames, type, callback) {
      await this.open();
      return await new Promise((resolve, reject) => {
        const txn = this._db.transaction(storeNames, type);
        txn.onabort = ({target}) => reject(target.error);
        txn.oncomplete = () => resolve();

        callback(txn, (value) => resolve(value));
      });
    }

    /**
     * Delegates async to a native IDBObjectStore method.
     *
     * @param {string} method The method name.
     * @param {string} storeName The object store name.
     * @param {string} type Can be `readonly` or `readwrite`.
     * @param {...*} args The list of args to pass to the native method.
     * @return {*} The result of the transaction.
     * @private
     */
    async _call(method, storeName, type, ...args) {
      const callback = (txn, done) => {
        txn.objectStore(storeName)[method](...args).onsuccess = ({target}) => {
          done(target.result);
        };
      };

      return await this.transaction([storeName], type, callback);
    }

    /**
     * The default onversionchange handler, which closes the database so other
     * connections can open without being blocked.
     *
     * @private
     */
    _onversionchange() {
      this.close();
    }

    /**
     * Closes the connection opened by `DBWrapper.open()`. Generally this method
     * doesn't need to be called since:
     *   1. It's usually better to keep a connection open since opening
     *      a new connection is somewhat slow.
     *   2. Connections are automatically closed when the reference is
     *      garbage collected.
     * The primary use case for needing to close a connection is when another
     * reference (typically in another tab) needs to upgrade it and would be
     * blocked by the current, open connection.
     *
     * @private
     */
    close() {
      if (this._db) {
        this._db.close();
        this._db = null;
      }
    }
  }

  // Exposed to let users modify the default timeout on a per-instance
  // or global basis.
  DBWrapper.prototype.OPEN_TIMEOUT = 2000;

  // Wrap native IDBObjectStore methods according to their mode.
  const methodsToWrap = {
    'readonly': ['get', 'count', 'getKey', 'getAll', 'getAllKeys'],
    'readwrite': ['add', 'put', 'clear', 'delete'],
  };
  for (const [mode, methods] of Object.entries(methodsToWrap)) {
    for (const method of methods) {
      if (method in IDBObjectStore.prototype) {
        // Don't use arrow functions here since we're outside of the class.
        DBWrapper.prototype[method] = async function(storeName, ...args) {
          return await this._call(method, storeName, mode, ...args);
        };
      }
    }
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * Wrapper around the fetch API.
   *
   * Will call requestWillFetch on available plugins.
   *
   * @param {Object} options
   * @param {Request|string} options.request
   * @param {Object} [options.fetchOptions]
   * @param {Event} [options.event]
   * @param {Array<Object>} [options.plugins=[]]
   * @return {Promise<Response>}
   *
   * @private
   * @memberof module:workbox-core
   */
  const wrappedFetch = async ({
    request,
    fetchOptions,
    event,
    plugins = []}) => {
    // We *should* be able to call `await event.preloadResponse` even if it's
    // undefined, but for some reason, doing so leads to errors in our Node unit
    // tests. To work around that, explicitly check preloadResponse's value first.
    if (event && event.preloadResponse) {
      const possiblePreloadResponse = await event.preloadResponse;
      if (possiblePreloadResponse) {
        {
          logger.log(`Using a preloaded navigation response for ` +
            `'${getFriendlyURL(request.url)}'`);
        }
        return possiblePreloadResponse;
      }
    }

    if (typeof request === 'string') {
      request = new Request(request);
    }

    {
      finalAssertExports.isInstance(request, Request, {
        paramName: request,
        expectedClass: 'Request',
        moduleName: 'workbox-core',
        className: 'fetchWrapper',
        funcName: 'wrappedFetch',
      });
    }

    const failedFetchPlugins = pluginUtils.filter(
        plugins, pluginEvents.FETCH_DID_FAIL);

    // If there is a fetchDidFail plugin, we need to save a clone of the
    // original request before it's either modified by a requestWillFetch
    // plugin or before the original request's body is consumed via fetch().
    const originalRequest = failedFetchPlugins.length > 0 ?
      request.clone() : null;

    try {
      for (let plugin of plugins) {
        if (pluginEvents.REQUEST_WILL_FETCH in plugin) {
          request = await plugin[pluginEvents.REQUEST_WILL_FETCH].call(plugin, {
            request: request.clone(),
            event,
          });

          {
            if (request) {
              finalAssertExports.isInstance(request, Request, {
                moduleName: 'Plugin',
                funcName: pluginEvents.CACHED_RESPONSE_WILL_BE_USED,
                isReturnValueProblem: true,
              });
            }
          }
        }
      }
    } catch (err) {
      throw new WorkboxError('plugin-error-request-will-fetch', {
        thrownError: err,
      });
    }

    // The request can be altered by plugins with `requestWillFetch` making
    // the original request (Most likely from a `fetch` event) to be different
    // to the Request we make. Pass both to `fetchDidFail` to aid debugging.
    let pluginFilteredRequest = request.clone();

    try {
      let fetchResponse;

      // See https://github.com/GoogleChrome/workbox/issues/1796
      if (request.mode === 'navigate') {
        fetchResponse = await fetch(request);
      } else {
        fetchResponse = await fetch(request, fetchOptions);
      }

      {
        logger.debug(`Network request for `+
        `'${getFriendlyURL(request.url)}' returned a response with ` +
        `status '${fetchResponse.status}'.`);
      }

      for (const plugin of plugins) {
        if (pluginEvents.FETCH_DID_SUCCEED in plugin) {
          fetchResponse = await plugin[pluginEvents.FETCH_DID_SUCCEED]
              .call(plugin, {
                event,
                request: pluginFilteredRequest,
                response: fetchResponse,
              });

          {
            if (fetchResponse) {
              finalAssertExports.isInstance(fetchResponse, Response, {
                moduleName: 'Plugin',
                funcName: pluginEvents.FETCH_DID_SUCCEED,
                isReturnValueProblem: true,
              });
            }
          }
        }
      }

      return fetchResponse;
    } catch (error) {
      {
        logger.error(`Network request for `+
        `'${getFriendlyURL(request.url)}' threw an error.`, error);
      }

      for (const plugin of failedFetchPlugins) {
        await plugin[pluginEvents.FETCH_DID_FAIL].call(plugin, {
          error,
          event,
          originalRequest: originalRequest.clone(),
          request: pluginFilteredRequest.clone(),
        });
      }

      throw error;
    }
  };

  const fetchWrapper = {
    fetch: wrappedFetch,
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  /**
   * Get the current cache names and prefix/suffix used by Workbox.
   *
   * `cacheNames.precache` is used for precached assets,
   * `cacheNames.googleAnalytics` is used by `workbox-google-analytics` to
   * store `analytics.js`, and `cacheNames.runtime` is used for everything else.
   *
   * `cacheNames.prefix` can be used to retrieve just the current prefix value.
   * `cacheNames.suffix` can be used to retrieve just the current suffix value.
   *
   * @return {Object} An object with `precache`, `runtime`, `prefix`, and
   *     `googleAnalytics` properties.
   *
   * @alias workbox.core.cacheNames
   */
  const cacheNames$1 = {
    get googleAnalytics() {
      return cacheNames.getGoogleAnalyticsName();
    },
    get precache() {
      return cacheNames.getPrecacheName();
    },
    get prefix() {
      return cacheNames.getPrefix();
    },
    get runtime() {
      return cacheNames.getRuntimeName();
    },
    get suffix() {
      return cacheNames.getSuffix();
    },
  };

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  /**
   * Modifies the default cache names used by the Workbox packages.
   * Cache names are generated as `<prefix>-<Cache Name>-<suffix>`.
   *
   * @param {Object} details
   * @param {Object} [details.prefix] The string to add to the beginning of
   *     the precache and runtime cache names.
   * @param {Object} [details.suffix] The string to add to the end of
   *     the precache and runtime cache names.
   * @param {Object} [details.precache] The cache name to use for precache
   *     caching.
   * @param {Object} [details.runtime] The cache name to use for runtime caching.
   * @param {Object} [details.googleAnalytics] The cache name to use for
   *     `workbox-google-analytics` caching.
   *
   * @alias workbox.core.setCacheNameDetails
   */
  const setCacheNameDetails = (details) => {
    {
      Object.keys(details).forEach((key) => {
        finalAssertExports.isType(details[key], 'string', {
          moduleName: 'workbox-core',
          funcName: 'setCacheNameDetails',
          paramName: `details.${key}`,
        });
      });

      if ('precache' in details && details.precache.length === 0) {
        throw new WorkboxError('invalid-cache-name', {
          cacheNameId: 'precache',
          value: details.precache,
        });
      }

      if ('runtime' in details && details.runtime.length === 0) {
        throw new WorkboxError('invalid-cache-name', {
          cacheNameId: 'runtime',
          value: details.runtime,
        });
      }

      if ('googleAnalytics' in details && details.googleAnalytics.length === 0) {
        throw new WorkboxError('invalid-cache-name', {
          cacheNameId: 'googleAnalytics',
          value: details.googleAnalytics,
        });
      }
    }

    cacheNames.updateDetails(details);
  };

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  // Give our version strings something to hang off of.
  try {
    self.workbox.v = self.workbox.v || {};
  } catch (errer) {
    // NOOP
  }

  try{self['workbox:routing:4.3.1']&&_();}catch(e){}// eslint-disable-line

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * The default HTTP method, 'GET', used when there's no specific method
   * configured for a route.
   *
   * @type {string}
   *
   * @private
   */
  const defaultMethod = 'GET';

  /**
   * The list of valid HTTP methods associated with requests that could be routed.
   *
   * @type {Array<string>}
   *
   * @private
   */
  const validMethods = [
    'DELETE',
    'GET',
    'HEAD',
    'PATCH',
    'POST',
    'PUT',
  ];

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * @param {function()|Object} handler Either a function, or an object with a
   * 'handle' method.
   * @return {Object} An object with a handle method.
   *
   * @private
   */
  const normalizeHandler = (handler) => {
    if (handler && typeof handler === 'object') {
      {
        finalAssertExports.hasMethod(handler, 'handle', {
          moduleName: 'workbox-routing',
          className: 'Route',
          funcName: 'constructor',
          paramName: 'handler',
        });
      }
      return handler;
    } else {
      {
        finalAssertExports.isType(handler, 'function', {
          moduleName: 'workbox-routing',
          className: 'Route',
          funcName: 'constructor',
          paramName: 'handler',
        });
      }
      return {handle: handler};
    }
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * A `Route` consists of a pair of callback functions, "match" and "handler".
   * The "match" callback determine if a route should be used to "handle" a
   * request by returning a non-falsy value if it can. The "handler" callback
   * is called when there is a match and should return a Promise that resolves
   * to a `Response`.
   *
   * @memberof workbox.routing
   */
  class Route {
    /**
     * Constructor for Route class.
     *
     * @param {workbox.routing.Route~matchCallback} match
     * A callback function that determines whether the route matches a given
     * `fetch` event by returning a non-falsy value.
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resolving to a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */
    constructor(match, handler, method) {
      {
        finalAssertExports.isType(match, 'function', {
          moduleName: 'workbox-routing',
          className: 'Route',
          funcName: 'constructor',
          paramName: 'match',
        });

        if (method) {
          finalAssertExports.isOneOf(method, validMethods, {paramName: 'method'});
        }
      }

      // These values are referenced directly by Router so cannot be
      // altered by minifification.
      this.handler = normalizeHandler(handler);
      this.match = match;
      this.method = method || defaultMethod;
    }
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * NavigationRoute makes it easy to create a [Route]{@link
   * workbox.routing.Route} that matches for browser
   * [navigation requests]{@link https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests}.
   *
   * It will only match incoming Requests whose
   * [`mode`]{@link https://fetch.spec.whatwg.org/#concept-request-mode}
   * is set to `navigate`.
   *
   * You can optionally only apply this route to a subset of navigation requests
   * by using one or both of the `blacklist` and `whitelist` parameters.
   *
   * @memberof workbox.routing
   * @extends workbox.routing.Route
   */
  class NavigationRoute extends Route {
    /**
     * If both `blacklist` and `whiltelist` are provided, the `blacklist` will
     * take precedence and the request will not match this route.
     *
     * The regular expressions in `whitelist` and `blacklist`
     * are matched against the concatenated
     * [`pathname`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname}
     * and [`search`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search}
     * portions of the requested URL.
     *
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {Object} options
     * @param {Array<RegExp>} [options.blacklist] If any of these patterns match,
     * the route will not handle the request (even if a whitelist RegExp matches).
     * @param {Array<RegExp>} [options.whitelist=[/./]] If any of these patterns
     * match the URL's pathname and search parameter, the route will handle the
     * request (assuming the blacklist doesn't match).
     */
    constructor(handler, {whitelist = [/./], blacklist = []} = {}) {
      {
        finalAssertExports.isArrayOfClass(whitelist, RegExp, {
          moduleName: 'workbox-routing',
          className: 'NavigationRoute',
          funcName: 'constructor',
          paramName: 'options.whitelist',
        });
        finalAssertExports.isArrayOfClass(blacklist, RegExp, {
          moduleName: 'workbox-routing',
          className: 'NavigationRoute',
          funcName: 'constructor',
          paramName: 'options.blacklist',
        });
      }

      super((options) => this._match(options), handler);

      this._whitelist = whitelist;
      this._blacklist = blacklist;
    }

    /**
     * Routes match handler.
     *
     * @param {Object} options
     * @param {URL} options.url
     * @param {Request} options.request
     * @return {boolean}
     *
     * @private
     */
    _match({url, request}) {
      if (request.mode !== 'navigate') {
        return false;
      }

      const pathnameAndSearch = url.pathname + url.search;

      for (const regExp of this._blacklist) {
        if (regExp.test(pathnameAndSearch)) {
          {
            logger.log(`The navigation route is not being used, since the ` +
                `URL matches this blacklist pattern: ${regExp}`);
          }
          return false;
        }
      }

      if (this._whitelist.some((regExp) => regExp.test(pathnameAndSearch))) {
        {
          logger.debug(`The navigation route is being used.`);
        }
        return true;
      }

      {
        logger.log(`The navigation route is not being used, since the URL ` +
            `being navigated to doesn't match the whitelist.`);
      }
      return false;
    }
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * The Router can be used to process a FetchEvent through one or more
   * [Routes]{@link workbox.routing.Route} responding  with a Request if
   * a matching route exists.
   *
   * If no route matches a given a request, the Router will use a "default"
   * handler if one is defined.
   *
   * Should the matching Route throw an error, the Router will use a "catch"
   * handler if one is defined to gracefully deal with issues and respond with a
   * Request.
   *
   * If a request matches multiple routes, the **earliest** registered route will
   * be used to respond to the request.
   *
   * @memberof workbox.routing
   */
  class Router {
    /**
     * Initializes a new Router.
     */
    constructor() {
      this._routes = new Map();
    }

    /**
     * @return {Map<string, Array<workbox.routing.Route>>} routes A `Map` of HTTP
     * method name ('GET', etc.) to an array of all the corresponding `Route`
     * instances that are registered.
     */
    get routes() {
      return this._routes;
    }

    /**
     * Adds a fetch event listener to respond to events when a route matches
     * the event's request.
     */
    addFetchListener() {
      self.addEventListener('fetch', (event) => {
        const {request} = event;
        const responsePromise = this.handleRequest({request, event});
        if (responsePromise) {
          event.respondWith(responsePromise);
        }
      });
    }

    /**
     * Adds a message event listener for URLs to cache from the window.
     * This is useful to cache resources loaded on the page prior to when the
     * service worker started controlling it.
     *
     * The format of the message data sent from the window should be as follows.
     * Where the `urlsToCache` array may consist of URL strings or an array of
     * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
     *
     * ```
     * {
     *   type: 'CACHE_URLS',
     *   payload: {
     *     urlsToCache: [
     *       './script1.js',
     *       './script2.js',
     *       ['./script3.js', {mode: 'no-cors'}],
     *     ],
     *   },
     * }
     * ```
     */
    addCacheListener() {
      self.addEventListener('message', async (event) => {
        if (event.data && event.data.type === 'CACHE_URLS') {
          const {payload} = event.data;

          {
            logger.debug(`Caching URLs from the window`, payload.urlsToCache);
          }

          const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
            if (typeof entry === 'string') {
              entry = [entry];
            }

            const request = new Request(...entry);
            return this.handleRequest({request});
          }));

          event.waitUntil(requestPromises);

          // If a MessageChannel was used, reply to the message on success.
          if (event.ports && event.ports[0]) {
            await requestPromises;
            event.ports[0].postMessage(true);
          }
        }
      });
    }

    /**
     * Apply the routing rules to a FetchEvent object to get a Response from an
     * appropriate Route's handler.
     *
     * @param {Object} options
     * @param {Request} options.request The request to handle (this is usually
     *     from a fetch event, but it does not have to be).
     * @param {FetchEvent} [options.event] The event that triggered the request,
     *     if applicable.
     * @return {Promise<Response>|undefined} A promise is returned if a
     *     registered route can handle the request. If there is no matching
     *     route and there's no `defaultHandler`, `undefined` is returned.
     */
    handleRequest({request, event}) {
      {
        finalAssertExports.isInstance(request, Request, {
          moduleName: 'workbox-routing',
          className: 'Router',
          funcName: 'handleRequest',
          paramName: 'options.request',
        });
      }

      const url = new URL(request.url, location);
      if (!url.protocol.startsWith('http')) {
        {
          logger.debug(
              `Workbox Router only supports URLs that start with 'http'.`);
        }
        return;
      }

      let {params, route} = this.findMatchingRoute({url, request, event});
      let handler = route && route.handler;

      let debugMessages = [];
      {
        if (handler) {
          debugMessages.push([
            `Found a route to handle this request:`, route,
          ]);

          if (params) {
            debugMessages.push([
              `Passing the following params to the route's handler:`, params,
            ]);
          }
        }
      }

      // If we don't have a handler because there was no matching route, then
      // fall back to defaultHandler if that's defined.
      if (!handler && this._defaultHandler) {
        {
          debugMessages.push(`Failed to find a matching route. Falling ` +
            `back to the default handler.`);

          // This is used for debugging in logs in the case of an error.
          route = '[Default Handler]';
        }
        handler = this._defaultHandler;
      }

      if (!handler) {
        {
          // No handler so Workbox will do nothing. If logs is set of debug
          // i.e. verbose, we should print out this information.
          logger.debug(`No route found for: ${getFriendlyURL(url)}`);
        }
        return;
      }

      {
        // We have a handler, meaning Workbox is going to handle the route.
        // print the routing details to the console.
        logger.groupCollapsed(`Router is responding to: ${getFriendlyURL(url)}`);
        debugMessages.forEach((msg) => {
          if (Array.isArray(msg)) {
            logger.log(...msg);
          } else {
            logger.log(msg);
          }
        });

        // The Request and Response objects contains a great deal of information,
        // hide it under a group in case developers want to see it.
        logger.groupCollapsed(`View request details here.`);
        logger.log(request);
        logger.groupEnd();

        logger.groupEnd();
      }

      // Wrap in try and catch in case the handle method throws a synchronous
      // error. It should still callback to the catch handler.
      let responsePromise;
      try {
        responsePromise = handler.handle({url, request, event, params});
      } catch (err) {
        responsePromise = Promise.reject(err);
      }

      if (responsePromise && this._catchHandler) {
        responsePromise = responsePromise.catch((err) => {
          {
            // Still include URL here as it will be async from the console group
            // and may not make sense without the URL
            logger.groupCollapsed(`Error thrown when responding to: ` +
              ` ${getFriendlyURL(url)}. Falling back to Catch Handler.`);
            logger.error(`Error thrown by:`, route);
            logger.error(err);
            logger.groupEnd();
          }
          return this._catchHandler.handle({url, event, err});
        });
      }

      return responsePromise;
    }

    /**
     * Checks a request and URL (and optionally an event) against the list of
     * registered routes, and if there's a match, returns the corresponding
     * route along with any params generated by the match.
     *
     * @param {Object} options
     * @param {URL} options.url
     * @param {Request} options.request The request to match.
     * @param {FetchEvent} [options.event] The corresponding event (unless N/A).
     * @return {Object} An object with `route` and `params` properties.
     *     They are populated if a matching route was found or `undefined`
     *     otherwise.
     */
    findMatchingRoute({url, request, event}) {
      {
        finalAssertExports.isInstance(url, URL, {
          moduleName: 'workbox-routing',
          className: 'Router',
          funcName: 'findMatchingRoute',
          paramName: 'options.url',
        });
        finalAssertExports.isInstance(request, Request, {
          moduleName: 'workbox-routing',
          className: 'Router',
          funcName: 'findMatchingRoute',
          paramName: 'options.request',
        });
      }

      const routes = this._routes.get(request.method) || [];
      for (const route of routes) {
        let params;
        let matchResult = route.match({url, request, event});
        if (matchResult) {
          if (Array.isArray(matchResult) && matchResult.length > 0) {
            // Instead of passing an empty array in as params, use undefined.
            params = matchResult;
          } else if ((matchResult.constructor === Object &&
              Object.keys(matchResult).length > 0)) {
            // Instead of passing an empty object in as params, use undefined.
            params = matchResult;
          }

          // Return early if have a match.
          return {route, params};
        }
      }
      // If no match was found above, return and empty object.
      return {};
    }

    /**
     * Define a default `handler` that's called when no routes explicitly
     * match the incoming request.
     *
     * Without a default handler, unmatched requests will go against the
     * network as if there were no service worker present.
     *
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     */
    setDefaultHandler(handler) {
      this._defaultHandler = normalizeHandler(handler);
    }

    /**
     * If a Route throws an error while handling a request, this `handler`
     * will be called and given a chance to provide a response.
     *
     * @param {workbox.routing.Route~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     */
    setCatchHandler(handler) {
      this._catchHandler = normalizeHandler(handler);
    }

    /**
     * Registers a route with the router.
     *
     * @param {workbox.routing.Route} route The route to register.
     */
    registerRoute(route) {
      {
        finalAssertExports.isType(route, 'object', {
          moduleName: 'workbox-routing',
          className: 'Router',
          funcName: 'registerRoute',
          paramName: 'route',
        });

        finalAssertExports.hasMethod(route, 'match', {
          moduleName: 'workbox-routing',
          className: 'Router',
          funcName: 'registerRoute',
          paramName: 'route',
        });

        finalAssertExports.isType(route.handler, 'object', {
          moduleName: 'workbox-routing',
          className: 'Router',
          funcName: 'registerRoute',
          paramName: 'route',
        });

        finalAssertExports.hasMethod(route.handler, 'handle', {
          moduleName: 'workbox-routing',
          className: 'Router',
          funcName: 'registerRoute',
          paramName: 'route.handler',
        });

        finalAssertExports.isType(route.method, 'string', {
          moduleName: 'workbox-routing',
          className: 'Router',
          funcName: 'registerRoute',
          paramName: 'route.method',
        });
      }

      if (!this._routes.has(route.method)) {
        this._routes.set(route.method, []);
      }

      // Give precedence to all of the earlier routes by adding this additional
      // route to the end of the array.
      this._routes.get(route.method).push(route);
    }

    /**
     * Unregisters a route with the router.
     *
     * @param {workbox.routing.Route} route The route to unregister.
     */
    unregisterRoute(route) {
      if (!this._routes.has(route.method)) {
        throw new WorkboxError(
            'unregister-route-but-not-found-with-method', {
              method: route.method,
            }
        );
      }

      const routeIndex = this._routes.get(route.method).indexOf(route);
      if (routeIndex > -1) {
        this._routes.get(route.method).splice(routeIndex, 1);
      } else {
        throw new WorkboxError('unregister-route-route-not-registered');
      }
    }
  }

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  {
    finalAssertExports.isSWEnv('workbox-routing');
  }

  try{self['workbox:precaching:4.3.1']&&_();}catch(e){}// eslint-disable-line

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * @param {Response} response
   * @return {Response}
   *
   * @private
   * @memberof module:workbox-precaching
   */
  async function cleanRedirect(response) {
    const clonedResponse = response.clone();

    // Not all browsers support the Response.body stream, so fall back
    // to reading the entire body into memory as a blob.
    const bodyPromise = 'body' in clonedResponse ?
      Promise.resolve(clonedResponse.body) :
      clonedResponse.blob();

    const body = await bodyPromise;

    // new Response() is happy when passed either a stream or a Blob.
    return new Response(body, {
      headers: clonedResponse.headers,
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
    });
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  // Name of the search parameter used to store revision info.
  const REVISION_SEARCH_PARAM = '__WB_REVISION__';

  /**
   * Converts a manifest entry into a versioned URL suitable for precaching.
   *
   * @param {Object} entry
   * @return {string} A URL with versioning info.
   *
   * @private
   * @memberof module:workbox-precaching
   */
  function createCacheKey(entry) {
    if (!entry) {
      throw new WorkboxError('add-to-cache-list-unexpected-type', {entry});
    }

    // If a precache manifest entry is a string, it's assumed to be a versioned
    // URL, like '/app.abcd1234.js'. Return as-is.
    if (typeof entry === 'string') {
      const urlObject = new URL(entry, location);
      return {
        cacheKey: urlObject.href,
        url: urlObject.href,
      };
    }

    const {revision, url} = entry;
    if (!url) {
      throw new WorkboxError('add-to-cache-list-unexpected-type', {entry});
    }

    // If there's just a URL and no revision, then it's also assumed to be a
    // versioned URL.
    if (!revision) {
      const urlObject = new URL(url, location);
      return {
        cacheKey: urlObject.href,
        url: urlObject.href,
      };
    }

    // Otherwise, construct a properly versioned URL using the custom Workbox
    // search parameter along with the revision info.
    const originalURL = new URL(url, location);
    const cacheKeyURL = new URL(url, location);
    cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
    return {
      cacheKey: cacheKeyURL.href,
      url: originalURL.href,
    };
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  const logGroup = (groupTitle, deletedURLs) => {
    logger.groupCollapsed(groupTitle);

    for (const url of deletedURLs) {
      logger.log(url);
    }

    logger.groupEnd();
  };

  /**
   * @param {Array<string>} deletedURLs
   *
   * @private
   * @memberof module:workbox-precaching
   */
  function printCleanupDetails(deletedURLs) {
    const deletionCount = deletedURLs.length;
    if (deletionCount > 0) {
      logger.groupCollapsed(`During precaching cleanup, ` +
          `${deletionCount} cached ` +
          `request${deletionCount === 1 ? ' was' : 's were'} deleted.`);
      logGroup('Deleted Cache Requests', deletedURLs);
      logger.groupEnd();
    }
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /**
   * @param {string} groupTitle
   * @param {Array<string>} urls
   *
   * @private
   */
  function _nestedGroup(groupTitle, urls) {
    if (urls.length === 0) {
      return;
    }

    logger.groupCollapsed(groupTitle);

    for (const url of urls) {
      logger.log(url);
    }

    logger.groupEnd();
  }

  /**
   * @param {Array<string>} urlsToPrecache
   * @param {Array<string>} urlsAlreadyPrecached
   *
   * @private
   * @memberof module:workbox-precaching
   */
  function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
    const precachedCount = urlsToPrecache.length;
    const alreadyPrecachedCount = urlsAlreadyPrecached.length;

    if (precachedCount || alreadyPrecachedCount) {
      let message =
          `Precaching ${precachedCount} file${precachedCount === 1 ? '' : 's'}.`;

      if (alreadyPrecachedCount > 0) {
        message += ` ${alreadyPrecachedCount} ` +
          `file${alreadyPrecachedCount === 1 ? ' is' : 's are'} already cached.`;
      }

      logger.groupCollapsed(message);

      _nestedGroup(`View newly precached URLs.`, urlsToPrecache);
      _nestedGroup(`View previously precached URLs.`, urlsAlreadyPrecached);
      logger.groupEnd();
    }
  }

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  /**
   * Performs efficient precaching of assets.
   *
   * @memberof module:workbox-precaching
   */
  class PrecacheController {
    /**
     * Create a new PrecacheController.
     *
     * @param {string} [cacheName] An optional name for the cache, to override
     * the default precache name.
     */
    constructor(cacheName) {
      this._cacheName = cacheNames.getPrecacheName(cacheName);
      this._urlsToCacheKeys = new Map();
    }

    /**
     * This method will add items to the precache list, removing duplicates
     * and ensuring the information is valid.
     *
     * @param {
     * Array<module:workbox-precaching.PrecacheController.PrecacheEntry|string>
     * } entries Array of entries to precache.
     */
    addToCacheList(entries) {
      {
        finalAssertExports.isArray(entries, {
          moduleName: 'workbox-precaching',
          className: 'PrecacheController',
          funcName: 'addToCacheList',
          paramName: 'entries',
        });
      }

      for (const entry of entries) {
        const {cacheKey, url} = createCacheKey(entry);
        if (this._urlsToCacheKeys.has(url) &&
            this._urlsToCacheKeys.get(url) !== cacheKey) {
          throw new WorkboxError('add-to-cache-list-conflicting-entries', {
            firstEntry: this._urlsToCacheKeys.get(url),
            secondEntry: cacheKey,
          });
        }
        this._urlsToCacheKeys.set(url, cacheKey);
      }
    }

    /**
     * Precaches new and updated assets. Call this method from the service worker
     * install event.
     *
     * @param {Object} options
     * @param {Event} [options.event] The install event (if needed).
     * @param {Array<Object>} [options.plugins] Plugins to be used for fetching
     * and caching during install.
     * @return {Promise<workbox.precaching.InstallResult>}
     */
    async install({event, plugins} = {}) {
      {
        if (plugins) {
          finalAssertExports.isArray(plugins, {
            moduleName: 'workbox-precaching',
            className: 'PrecacheController',
            funcName: 'install',
            paramName: 'plugins',
          });
        }
      }

      const urlsToPrecache = [];
      const urlsAlreadyPrecached = [];

      const cache = await caches.open(this._cacheName);
      const alreadyCachedRequests = await cache.keys();
      const alreadyCachedURLs = new Set(alreadyCachedRequests.map(
          (request) => request.url));

      for (const cacheKey of this._urlsToCacheKeys.values()) {
        if (alreadyCachedURLs.has(cacheKey)) {
          urlsAlreadyPrecached.push(cacheKey);
        } else {
          urlsToPrecache.push(cacheKey);
        }
      }

      const precacheRequests = urlsToPrecache.map((url) => {
        return this._addURLToCache({event, plugins, url});
      });
      await Promise.all(precacheRequests);

      {
        printInstallDetails(urlsToPrecache, urlsAlreadyPrecached);
      }

      return {
        updatedURLs: urlsToPrecache,
        notUpdatedURLs: urlsAlreadyPrecached,
      };
    }

    /**
     * Deletes assets that are no longer present in the current precache manifest.
     * Call this method from the service worker activate event.
     *
     * @return {Promise<workbox.precaching.CleanupResult>}
     */
    async activate() {
      const cache = await caches.open(this._cacheName);
      const currentlyCachedRequests = await cache.keys();
      const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());

      const deletedURLs = [];
      for (const request of currentlyCachedRequests) {
        if (!expectedCacheKeys.has(request.url)) {
          await cache.delete(request);
          deletedURLs.push(request.url);
        }
      }

      {
        printCleanupDetails(deletedURLs);
      }

      return {deletedURLs};
    }

    /**
     * Requests the entry and saves it to the cache if the response is valid.
     * By default, any response with a status code of less than 400 (including
     * opaque responses) is considered valid.
     *
     * If you need to use custom criteria to determine what's valid and what
     * isn't, then pass in an item in `options.plugins` that implements the
     * `cacheWillUpdate()` lifecycle event.
     *
     * @private
     * @param {Object} options
     * @param {string} options.url The URL to fetch and cache.
     * @param {Event} [options.event] The install event (if passed).
     * @param {Array<Object>} [options.plugins] An array of plugins to apply to
     * fetch and caching.
     */
    async _addURLToCache({url, event, plugins}) {
      const request = new Request(url, {credentials: 'same-origin'});
      let response = await fetchWrapper.fetch({
        event,
        plugins,
        request,
      });

      // Allow developers to override the default logic about what is and isn't
      // valid by passing in a plugin implementing cacheWillUpdate(), e.g.
      // a workbox.cacheableResponse.Plugin instance.
      let cacheWillUpdateCallback;
      for (const plugin of (plugins || [])) {
        if ('cacheWillUpdate' in plugin) {
          cacheWillUpdateCallback = plugin.cacheWillUpdate.bind(plugin);
        }
      }

      const isValidResponse = cacheWillUpdateCallback ?
        // Use a callback if provided. It returns a truthy value if valid.
        cacheWillUpdateCallback({event, request, response}) :
        // Otherwise, default to considering any response status under 400 valid.
        // This includes, by default, considering opaque responses valid.
        response.status < 400;

      // Consider this a failure, leading to the `install` handler failing, if
      // we get back an invalid response.
      if (!isValidResponse) {
        throw new WorkboxError('bad-precaching-response', {
          url,
          status: response.status,
        });
      }

      if (response.redirected) {
        response = await cleanRedirect(response);
      }

      await cacheWrapper.put({
        event,
        plugins,
        request,
        response,
        cacheName: this._cacheName,
        matchOptions: {
          ignoreSearch: true,
        },
      });
    }

    /**
     * Returns a mapping of a precached URL to the corresponding cache key, taking
     * into account the revision information for the URL.
     *
     * @return {Map<string, string>} A URL to cache key mapping.
     */
    getURLsToCacheKeys() {
      return this._urlsToCacheKeys;
    }

    /**
     * Returns a list of all the URLs that have been precached by the current
     * service worker.
     *
     * @return {Array<string>} The precached URLs.
     */
    getCachedURLs() {
      return [...this._urlsToCacheKeys.keys()];
    }

    /**
     * Returns the cache key used for storing a given URL. If that URL is
     * unversioned, like `/index.html', then the cache key will be the original
     * URL with a search parameter appended to it.
     *
     * @param {string} url A URL whose cache key you want to look up.
     * @return {string} The versioned URL that corresponds to a cache key
     * for the original URL, or undefined if that URL isn't precached.
     */
    getCacheKeyForURL(url) {
      const urlObject = new URL(url, location);
      return this._urlsToCacheKeys.get(urlObject.href);
    }
  }

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  let precacheController;

  /**
   * @return {PrecacheController}
   * @private
   */
  const getOrCreatePrecacheController = () => {
    if (!precacheController) {
      precacheController = new PrecacheController();
    }
    return precacheController;
  };

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  /**
   * Takes in a URL, and returns the corresponding URL that could be used to
   * lookup the entry in the precache.
   *
   * If a relative URL is provided, the location of the service worker file will
   * be used as the base.
   *
   * For precached entries without revision information, the cache key will be the
   * same as the original URL.
   *
   * For precached entries with revision information, the cache key will be the
   * original URL with the addition of a query parameter used for keeping track of
   * the revision info.
   *
   * @param {string} url The URL whose cache key to look up.
   * @return {string} The cache key that corresponds to that URL.
   *
   * @alias workbox.precaching.getCacheKeyForURL
   */
  const getCacheKeyForURL$1 = (url) => {
    const precacheController = getOrCreatePrecacheController();
    return precacheController.getCacheKeyForURL(url);
  };

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2019 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */

  /*
    Copyright 2018 Google LLC

    Use of this source code is governed by an MIT-style
    license that can be found in the LICENSE file or at
    https://opensource.org/licenses/MIT.
  */


  {
    finalAssertExports.isSWEnv('workbox-precaching');
  }

  /* eslint no-restricted-globals: 0 */

  /**
   * `message` event handler
   * @param {Event} event event
   */
  function onMessage(event) {
    const { data } = event;

    if (data && data.type) {
      switch (data.type) {
        case 'SKIP_WAITING':
          self.skipWaiting();
          break;

        default:
          break;
      }
    }
  }

  self.addEventListener('message', onMessage);

  setCacheNameDetails({ prefix: '@deity' });

  const router = new Router();
  self.addEventListener('fetch', event => {
    const responsePromise = router.handleRequest(event);
    if (responsePromise) {
      event.respondWith(responsePromise);
    }
  });

  /**
   * Check if Service Worker is waiting for activation, but there is only one client
   * @returns {boolean} boolean
   */
  async function isWaitingWithOneClient() {
    const clients = await self.clients.matchAll();

    return self.registration.waiting && clients.length <= 1;
  }

  async function getFromCacheOrNetwork(request) {
    try {
      const response = await caches.match(request, { cacheName: cacheNames$1.precache });

      if (response) {
        return response;
      }

      // This shouldn't normally happen, but there are edge cases: https://github.com/GoogleChrome/workbox/issues/1441
      throw new Error(`The cache ${cacheNames$1.precache} did not have an entry for ${request}.`);
    } catch (error) {
      // If there's either a cache miss, or the caches.match() call threw
      // an exception, then attempt to fulfill the navigation request with
      // a response from the network rather than leaving the user with a
      // failed navigation.
      console.log(`Unable to respond to navigation request with cached response. Falling back to network.`, error);

      // This might still fail if the browser is offline...
      return fetch(request);
    }
  }

  router.registerRoute(
    new NavigationRoute(async ({ url }) => {
      if (await isWaitingWithOneClient()) {
        self.registration.waiting.postMessage({ type: 'SKIP_WAITING', payload: undefined });

        return new Response('', { headers: { Refresh: '0' } }); // refresh the tab by returning a blank response
      }

      {
        return fetch(url.href);
      }

      const cachedUrlKey = getCacheKeyForURL$1('app-shell');
      if (!cachedUrlKey) {
        return fetch(url.href);
      }

      return getFromCacheOrNetwork(cachedUrlKey);
    })
  );

  // re-exporting falcon-client service worker defaults

}());
//# sourceMappingURL=sw.js.map
