/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./resources/js/IndexController.js":
/*!*****************************************!*\
  !*** ./resources/js/IndexController.js ***!
  \*****************************************/
/***/ (() => {

var aspiria = angular.module('aspiria', ["ngRoute"]);
aspiria.controller("IndexController", function ($scope, $http, $compile, $location, $interval) {
  $scope.init = function () {};
});

/***/ }),

/***/ "./resources/js/angular.js":
/*!*********************************!*\
  !*** ./resources/js/angular.js ***!
  \*********************************/
/***/ (() => {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 AngularJS v1.7.8
 (c) 2010-2018 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (C) {
  'use strict';

  function re(a) {
    if (D(a)) w(a.objectMaxDepth) && (Wb.objectMaxDepth = Xb(a.objectMaxDepth) ? a.objectMaxDepth : NaN), w(a.urlErrorParamsEnabled) && Ga(a.urlErrorParamsEnabled) && (Wb.urlErrorParamsEnabled = a.urlErrorParamsEnabled);else return Wb;
  }

  function Xb(a) {
    return W(a) && 0 < a;
  }

  function F(a, b) {
    b = b || Error;
    return function () {
      var d = arguments[0],
          c;
      c = "[" + (a ? a + ":" : "") + d + "] http://errors.angularjs.org/1.7.8/" + (a ? a + "/" : "") + d;

      for (d = 1; d < arguments.length; d++) {
        c = c + (1 == d ? "?" : "&") + "p" + (d - 1) + "=";
        var e = encodeURIComponent,
            f;
        f = arguments[d];
        f = "function" == typeof f ? f.toString().replace(/ \{[\s\S]*$/, "") : "undefined" == typeof f ? "undefined" : "string" != typeof f ? JSON.stringify(f) : f;
        c += e(f);
      }

      return new b(c);
    };
  }

  function ya(a) {
    if (null == a || $a(a)) return !1;
    if (H(a) || A(a) || x && a instanceof x) return !0;
    var b = "length" in Object(a) && a.length;
    return W(b) && (0 <= b && b - 1 in a || "function" === typeof a.item);
  }

  function r(a, b, d) {
    var c, e;
    if (a) if (B(a)) for (c in a) {
      "prototype" !== c && "length" !== c && "name" !== c && a.hasOwnProperty(c) && b.call(d, a[c], c, a);
    } else if (H(a) || ya(a)) {
      var f = "object" !== _typeof(a);

      c = 0;

      for (e = a.length; c < e; c++) {
        (f || c in a) && b.call(d, a[c], c, a);
      }
    } else if (a.forEach && a.forEach !== r) a.forEach(b, d, a);else if (Nc(a)) for (c in a) {
      b.call(d, a[c], c, a);
    } else if ("function" === typeof a.hasOwnProperty) for (c in a) {
      a.hasOwnProperty(c) && b.call(d, a[c], c, a);
    } else for (c in a) {
      ta.call(a, c) && b.call(d, a[c], c, a);
    }
    return a;
  }

  function Oc(a, b, d) {
    for (var c = Object.keys(a).sort(), e = 0; e < c.length; e++) {
      b.call(d, a[c[e]], c[e]);
    }

    return c;
  }

  function Yb(a) {
    return function (b, d) {
      a(d, b);
    };
  }

  function se() {
    return ++pb;
  }

  function Zb(a, b, d) {
    for (var c = a.$$hashKey, e = 0, f = b.length; e < f; ++e) {
      var g = b[e];
      if (D(g) || B(g)) for (var k = Object.keys(g), h = 0, l = k.length; h < l; h++) {
        var m = k[h],
            p = g[m];
        d && D(p) ? ha(p) ? a[m] = new Date(p.valueOf()) : ab(p) ? a[m] = new RegExp(p) : p.nodeName ? a[m] = p.cloneNode(!0) : $b(p) ? a[m] = p.clone() : (D(a[m]) || (a[m] = H(p) ? [] : {}), Zb(a[m], [p], !0)) : a[m] = p;
      }
    }

    c ? a.$$hashKey = c : delete a.$$hashKey;
    return a;
  }

  function S(a) {
    return Zb(a, Ha.call(arguments, 1), !1);
  }

  function te(a) {
    return Zb(a, Ha.call(arguments, 1), !0);
  }

  function fa(a) {
    return parseInt(a, 10);
  }

  function ac(a, b) {
    return S(Object.create(a), b);
  }

  function E() {}

  function Ta(a) {
    return a;
  }

  function ia(a) {
    return function () {
      return a;
    };
  }

  function bc(a) {
    return B(a.toString) && a.toString !== la;
  }

  function z(a) {
    return "undefined" === typeof a;
  }

  function w(a) {
    return "undefined" !== typeof a;
  }

  function D(a) {
    return null !== a && "object" === _typeof(a);
  }

  function Nc(a) {
    return null !== a && "object" === _typeof(a) && !Pc(a);
  }

  function A(a) {
    return "string" === typeof a;
  }

  function W(a) {
    return "number" === typeof a;
  }

  function ha(a) {
    return "[object Date]" === la.call(a);
  }

  function H(a) {
    return Array.isArray(a) || a instanceof Array;
  }

  function cc(a) {
    switch (la.call(a)) {
      case "[object Error]":
        return !0;

      case "[object Exception]":
        return !0;

      case "[object DOMException]":
        return !0;

      default:
        return a instanceof Error;
    }
  }

  function B(a) {
    return "function" === typeof a;
  }

  function ab(a) {
    return "[object RegExp]" === la.call(a);
  }

  function $a(a) {
    return a && a.window === a;
  }

  function bb(a) {
    return a && a.$evalAsync && a.$watch;
  }

  function Ga(a) {
    return "boolean" === typeof a;
  }

  function ue(a) {
    return a && W(a.length) && ve.test(la.call(a));
  }

  function $b(a) {
    return !(!a || !(a.nodeName || a.prop && a.attr && a.find));
  }

  function we(a) {
    var b = {};
    a = a.split(",");
    var d;

    for (d = 0; d < a.length; d++) {
      b[a[d]] = !0;
    }

    return b;
  }

  function ua(a) {
    return K(a.nodeName || a[0] && a[0].nodeName);
  }

  function cb(a, b) {
    var d = a.indexOf(b);
    0 <= d && a.splice(d, 1);
    return d;
  }

  function Ia(a, b, d) {
    function c(a, b, c) {
      c--;
      if (0 > c) return "...";
      var d = b.$$hashKey,
          f;

      if (H(a)) {
        f = 0;

        for (var g = a.length; f < g; f++) {
          b.push(e(a[f], c));
        }
      } else if (Nc(a)) for (f in a) {
        b[f] = e(a[f], c);
      } else if (a && "function" === typeof a.hasOwnProperty) for (f in a) {
        a.hasOwnProperty(f) && (b[f] = e(a[f], c));
      } else for (f in a) {
        ta.call(a, f) && (b[f] = e(a[f], c));
      }

      d ? b.$$hashKey = d : delete b.$$hashKey;
      return b;
    }

    function e(a, b) {
      if (!D(a)) return a;
      var d = g.indexOf(a);
      if (-1 !== d) return k[d];
      if ($a(a) || bb(a)) throw pa("cpws");
      var d = !1,
          e = f(a);
      void 0 === e && (e = H(a) ? [] : Object.create(Pc(a)), d = !0);
      g.push(a);
      k.push(e);
      return d ? c(a, e, b) : e;
    }

    function f(a) {
      switch (la.call(a)) {
        case "[object Int8Array]":
        case "[object Int16Array]":
        case "[object Int32Array]":
        case "[object Float32Array]":
        case "[object Float64Array]":
        case "[object Uint8Array]":
        case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":
        case "[object Uint32Array]":
          return new a.constructor(e(a.buffer), a.byteOffset, a.length);

        case "[object ArrayBuffer]":
          if (!a.slice) {
            var b = new ArrayBuffer(a.byteLength);
            new Uint8Array(b).set(new Uint8Array(a));
            return b;
          }

          return a.slice(0);

        case "[object Boolean]":
        case "[object Number]":
        case "[object String]":
        case "[object Date]":
          return new a.constructor(a.valueOf());

        case "[object RegExp]":
          return b = new RegExp(a.source, a.toString().match(/[^/]*$/)[0]), b.lastIndex = a.lastIndex, b;

        case "[object Blob]":
          return new a.constructor([a], {
            type: a.type
          });
      }

      if (B(a.cloneNode)) return a.cloneNode(!0);
    }

    var g = [],
        k = [];
    d = Xb(d) ? d : NaN;

    if (b) {
      if (ue(b) || "[object ArrayBuffer]" === la.call(b)) throw pa("cpta");
      if (a === b) throw pa("cpi");
      H(b) ? b.length = 0 : r(b, function (a, c) {
        "$$hashKey" !== c && delete b[c];
      });
      g.push(a);
      k.push(b);
      return c(a, b, d);
    }

    return e(a, d);
  }

  function dc(a, b) {
    return a === b || a !== a && b !== b;
  }

  function va(a, b) {
    if (a === b) return !0;
    if (null === a || null === b) return !1;
    if (a !== a && b !== b) return !0;

    var d = _typeof(a),
        c;

    if (d === _typeof(b) && "object" === d) if (H(a)) {
      if (!H(b)) return !1;

      if ((d = a.length) === b.length) {
        for (c = 0; c < d; c++) {
          if (!va(a[c], b[c])) return !1;
        }

        return !0;
      }
    } else {
      if (ha(a)) return ha(b) ? dc(a.getTime(), b.getTime()) : !1;
      if (ab(a)) return ab(b) ? a.toString() === b.toString() : !1;
      if (bb(a) || bb(b) || $a(a) || $a(b) || H(b) || ha(b) || ab(b)) return !1;
      d = T();

      for (c in a) {
        if ("$" !== c.charAt(0) && !B(a[c])) {
          if (!va(a[c], b[c])) return !1;
          d[c] = !0;
        }
      }

      for (c in b) {
        if (!(c in d) && "$" !== c.charAt(0) && w(b[c]) && !B(b[c])) return !1;
      }

      return !0;
    }
    return !1;
  }

  function db(a, b, d) {
    return a.concat(Ha.call(b, d));
  }

  function Va(a, b) {
    var d = 2 < arguments.length ? Ha.call(arguments, 2) : [];
    return !B(b) || b instanceof RegExp ? b : d.length ? function () {
      return arguments.length ? b.apply(a, db(d, arguments, 0)) : b.apply(a, d);
    } : function () {
      return arguments.length ? b.apply(a, arguments) : b.call(a);
    };
  }

  function Qc(a, b) {
    var d = b;
    "string" === typeof a && "$" === a.charAt(0) && "$" === a.charAt(1) ? d = void 0 : $a(b) ? d = "$WINDOW" : b && C.document === b ? d = "$DOCUMENT" : bb(b) && (d = "$SCOPE");
    return d;
  }

  function eb(a, b) {
    if (!z(a)) return W(b) || (b = b ? 2 : null), JSON.stringify(a, Qc, b);
  }

  function Rc(a) {
    return A(a) ? JSON.parse(a) : a;
  }

  function ec(a, b) {
    a = a.replace(xe, "");
    var d = Date.parse("Jan 01, 1970 00:00:00 " + a) / 6E4;
    return X(d) ? b : d;
  }

  function Sc(a, b) {
    a = new Date(a.getTime());
    a.setMinutes(a.getMinutes() + b);
    return a;
  }

  function fc(a, b, d) {
    d = d ? -1 : 1;
    var c = a.getTimezoneOffset();
    b = ec(b, c);
    return Sc(a, d * (b - c));
  }

  function za(a) {
    a = x(a).clone().empty();
    var b = x("<div></div>").append(a).html();

    try {
      return a[0].nodeType === Pa ? K(b) : b.match(/^(<[^>]+>)/)[1].replace(/^<([\w-]+)/, function (a, b) {
        return "<" + K(b);
      });
    } catch (d) {
      return K(b);
    }
  }

  function Tc(a) {
    try {
      return decodeURIComponent(a);
    } catch (b) {}
  }

  function gc(a) {
    var b = {};
    r((a || "").split("&"), function (a) {
      var c, e, f;
      a && (e = a = a.replace(/\+/g, "%20"), c = a.indexOf("="), -1 !== c && (e = a.substring(0, c), f = a.substring(c + 1)), e = Tc(e), w(e) && (f = w(f) ? Tc(f) : !0, ta.call(b, e) ? H(b[e]) ? b[e].push(f) : b[e] = [b[e], f] : b[e] = f));
    });
    return b;
  }

  function ye(a) {
    var b = [];
    r(a, function (a, c) {
      H(a) ? r(a, function (a) {
        b.push(ba(c, !0) + (!0 === a ? "" : "=" + ba(a, !0)));
      }) : b.push(ba(c, !0) + (!0 === a ? "" : "=" + ba(a, !0)));
    });
    return b.length ? b.join("&") : "";
  }

  function hc(a) {
    return ba(a, !0).replace(/%26/gi, "&").replace(/%3D/gi, "=").replace(/%2B/gi, "+");
  }

  function ba(a, b) {
    return encodeURIComponent(a).replace(/%40/gi, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%3B/gi, ";").replace(/%20/g, b ? "%20" : "+");
  }

  function ze(a, b) {
    var d,
        c,
        e = Qa.length;

    for (c = 0; c < e; ++c) {
      if (d = Qa[c] + b, A(d = a.getAttribute(d))) return d;
    }

    return null;
  }

  function Ae(a, b) {
    var d,
        c,
        e = {};
    r(Qa, function (b) {
      b += "app";
      !d && a.hasAttribute && a.hasAttribute(b) && (d = a, c = a.getAttribute(b));
    });
    r(Qa, function (b) {
      b += "app";
      var e;
      !d && (e = a.querySelector("[" + b.replace(":", "\\:") + "]")) && (d = e, c = e.getAttribute(b));
    });
    d && (Be ? (e.strictDi = null !== ze(d, "strict-di"), b(d, c ? [c] : [], e)) : C.console.error("AngularJS: disabling automatic bootstrap. <script> protocol indicates an extension, document.location.href does not match."));
  }

  function Uc(a, b, d) {
    D(d) || (d = {});
    d = S({
      strictDi: !1
    }, d);

    var c = function c() {
      a = x(a);

      if (a.injector()) {
        var c = a[0] === C.document ? "document" : za(a);
        throw pa("btstrpd", c.replace(/</, "&lt;").replace(/>/, "&gt;"));
      }

      b = b || [];
      b.unshift(["$provide", function (b) {
        b.value("$rootElement", a);
      }]);
      d.debugInfoEnabled && b.push(["$compileProvider", function (a) {
        a.debugInfoEnabled(!0);
      }]);
      b.unshift("ng");
      c = fb(b, d.strictDi);
      c.invoke(["$rootScope", "$rootElement", "$compile", "$injector", function (a, b, c, d) {
        a.$apply(function () {
          b.data("$injector", d);
          c(b)(a);
        });
      }]);
      return c;
    },
        e = /^NG_ENABLE_DEBUG_INFO!/,
        f = /^NG_DEFER_BOOTSTRAP!/;

    C && e.test(C.name) && (d.debugInfoEnabled = !0, C.name = C.name.replace(e, ""));
    if (C && !f.test(C.name)) return c();
    C.name = C.name.replace(f, "");

    ca.resumeBootstrap = function (a) {
      r(a, function (a) {
        b.push(a);
      });
      return c();
    };

    B(ca.resumeDeferredBootstrap) && ca.resumeDeferredBootstrap();
  }

  function Ce() {
    C.name = "NG_ENABLE_DEBUG_INFO!" + C.name;
    C.location.reload();
  }

  function De(a) {
    a = ca.element(a).injector();
    if (!a) throw pa("test");
    return a.get("$$testability");
  }

  function Vc(a, b) {
    b = b || "_";
    return a.replace(Ee, function (a, c) {
      return (c ? b : "") + a.toLowerCase();
    });
  }

  function Fe() {
    var a;

    if (!Wc) {
      var b = qb();
      (rb = z(b) ? C.jQuery : b ? C[b] : void 0) && rb.fn.on ? (x = rb, S(rb.fn, {
        scope: Wa.scope,
        isolateScope: Wa.isolateScope,
        controller: Wa.controller,
        injector: Wa.injector,
        inheritedData: Wa.inheritedData
      })) : x = Y;
      a = x.cleanData;

      x.cleanData = function (b) {
        for (var c, e = 0, f; null != (f = b[e]); e++) {
          (c = (x._data(f) || {}).events) && c.$destroy && x(f).triggerHandler("$destroy");
        }

        a(b);
      };

      ca.element = x;
      Wc = !0;
    }
  }

  function gb(a, b, d) {
    if (!a) throw pa("areq", b || "?", d || "required");
    return a;
  }

  function sb(a, b, d) {
    d && H(a) && (a = a[a.length - 1]);
    gb(B(a), b, "not a function, got " + (a && "object" === _typeof(a) ? a.constructor.name || "Object" : _typeof(a)));
    return a;
  }

  function Ja(a, b) {
    if ("hasOwnProperty" === a) throw pa("badname", b);
  }

  function Ge(a, b, d) {
    if (!b) return a;
    b = b.split(".");

    for (var c, e = a, f = b.length, g = 0; g < f; g++) {
      c = b[g], a && (a = (e = a)[c]);
    }

    return !d && B(a) ? Va(e, a) : a;
  }

  function tb(a) {
    for (var b = a[0], d = a[a.length - 1], c, e = 1; b !== d && (b = b.nextSibling); e++) {
      if (c || a[e] !== b) c || (c = x(Ha.call(a, 0, e))), c.push(b);
    }

    return c || a;
  }

  function T() {
    return Object.create(null);
  }

  function ic(a) {
    if (null == a) return "";

    switch (_typeof(a)) {
      case "string":
        break;

      case "number":
        a = "" + a;
        break;

      default:
        a = !bc(a) || H(a) || ha(a) ? eb(a) : a.toString();
    }

    return a;
  }

  function He(a) {
    function b(a, b, c) {
      return a[b] || (a[b] = c());
    }

    var d = F("$injector"),
        c = F("ng");
    a = b(a, "angular", Object);
    a.$$minErr = a.$$minErr || F;
    return b(a, "module", function () {
      var a = {};
      return function (f, g, k) {
        var h = {};
        if ("hasOwnProperty" === f) throw c("badname", "module");
        g && a.hasOwnProperty(f) && (a[f] = null);
        return b(a, f, function () {
          function a(b, c, d, f) {
            f || (f = e);
            return function () {
              f[d || "push"]([b, c, arguments]);
              return t;
            };
          }

          function b(a, c, d) {
            d || (d = e);
            return function (b, e) {
              e && B(e) && (e.$$moduleName = f);
              d.push([a, c, arguments]);
              return t;
            };
          }

          if (!g) throw d("nomod", f);
          var e = [],
              n = [],
              s = [],
              G = a("$injector", "invoke", "push", n),
              t = {
            _invokeQueue: e,
            _configBlocks: n,
            _runBlocks: s,
            info: function info(a) {
              if (w(a)) {
                if (!D(a)) throw c("aobj", "value");
                h = a;
                return this;
              }

              return h;
            },
            requires: g,
            name: f,
            provider: b("$provide", "provider"),
            factory: b("$provide", "factory"),
            service: b("$provide", "service"),
            value: a("$provide", "value"),
            constant: a("$provide", "constant", "unshift"),
            decorator: b("$provide", "decorator", n),
            animation: b("$animateProvider", "register"),
            filter: b("$filterProvider", "register"),
            controller: b("$controllerProvider", "register"),
            directive: b("$compileProvider", "directive"),
            component: b("$compileProvider", "component"),
            config: G,
            run: function run(a) {
              s.push(a);
              return this;
            }
          };
          k && G(k);
          return t;
        });
      };
    });
  }

  function ja(a, b) {
    if (H(a)) {
      b = b || [];

      for (var d = 0, c = a.length; d < c; d++) {
        b[d] = a[d];
      }
    } else if (D(a)) for (d in b = b || {}, a) {
      if ("$" !== d.charAt(0) || "$" !== d.charAt(1)) b[d] = a[d];
    }

    return b || a;
  }

  function Ie(a, b) {
    var d = [];
    Xb(b) && (a = ca.copy(a, null, b));
    return JSON.stringify(a, function (a, b) {
      b = Qc(a, b);

      if (D(b)) {
        if (0 <= d.indexOf(b)) return "...";
        d.push(b);
      }

      return b;
    });
  }

  function Je(a) {
    S(a, {
      errorHandlingConfig: re,
      bootstrap: Uc,
      copy: Ia,
      extend: S,
      merge: te,
      equals: va,
      element: x,
      forEach: r,
      injector: fb,
      noop: E,
      bind: Va,
      toJson: eb,
      fromJson: Rc,
      identity: Ta,
      isUndefined: z,
      isDefined: w,
      isString: A,
      isFunction: B,
      isObject: D,
      isNumber: W,
      isElement: $b,
      isArray: H,
      version: Ke,
      isDate: ha,
      callbacks: {
        $$counter: 0
      },
      getTestability: De,
      reloadWithDebugInfo: Ce,
      $$minErr: F,
      $$csp: Aa,
      $$encodeUriSegment: hc,
      $$encodeUriQuery: ba,
      $$lowercase: K,
      $$stringify: ic,
      $$uppercase: ub
    });
    kc = He(C);
    kc("ng", ["ngLocale"], ["$provide", function (a) {
      a.provider({
        $$sanitizeUri: Le
      });
      a.provider("$compile", Xc).directive({
        a: Me,
        input: Yc,
        textarea: Yc,
        form: Ne,
        script: Oe,
        select: Pe,
        option: Qe,
        ngBind: Re,
        ngBindHtml: Se,
        ngBindTemplate: Te,
        ngClass: Ue,
        ngClassEven: Ve,
        ngClassOdd: We,
        ngCloak: Xe,
        ngController: Ye,
        ngForm: Ze,
        ngHide: $e,
        ngIf: af,
        ngInclude: bf,
        ngInit: cf,
        ngNonBindable: df,
        ngPluralize: ef,
        ngRef: ff,
        ngRepeat: gf,
        ngShow: hf,
        ngStyle: jf,
        ngSwitch: kf,
        ngSwitchWhen: lf,
        ngSwitchDefault: mf,
        ngOptions: nf,
        ngTransclude: of,
        ngModel: pf,
        ngList: qf,
        ngChange: rf,
        pattern: Zc,
        ngPattern: Zc,
        required: $c,
        ngRequired: $c,
        minlength: ad,
        ngMinlength: ad,
        maxlength: bd,
        ngMaxlength: bd,
        ngValue: sf,
        ngModelOptions: tf
      }).directive({
        ngInclude: uf,
        input: vf
      }).directive(vb).directive(cd);
      a.provider({
        $anchorScroll: wf,
        $animate: xf,
        $animateCss: yf,
        $$animateJs: zf,
        $$animateQueue: Af,
        $$AnimateRunner: Bf,
        $$animateAsyncRun: Cf,
        $browser: Df,
        $cacheFactory: Ef,
        $controller: Ff,
        $document: Gf,
        $$isDocumentHidden: Hf,
        $exceptionHandler: If,
        $filter: dd,
        $$forceReflow: Jf,
        $interpolate: Kf,
        $interval: Lf,
        $$intervalFactory: Mf,
        $http: Nf,
        $httpParamSerializer: Of,
        $httpParamSerializerJQLike: Pf,
        $httpBackend: Qf,
        $xhrFactory: Rf,
        $jsonpCallbacks: Sf,
        $location: Tf,
        $log: Uf,
        $parse: Vf,
        $rootScope: Wf,
        $q: Xf,
        $$q: Yf,
        $sce: Zf,
        $sceDelegate: $f,
        $sniffer: ag,
        $$taskTrackerFactory: bg,
        $templateCache: cg,
        $templateRequest: dg,
        $$testability: eg,
        $timeout: fg,
        $window: gg,
        $$rAF: hg,
        $$jqLite: ig,
        $$Map: jg,
        $$cookieReader: kg
      });
    }]).info({
      angularVersion: "1.7.8"
    });
  }

  function wb(a, b) {
    return b.toUpperCase();
  }

  function xb(a) {
    return a.replace(lg, wb);
  }

  function lc(a) {
    a = a.nodeType;
    return 1 === a || !a || 9 === a;
  }

  function ed(a, b) {
    var d,
        c,
        e = b.createDocumentFragment(),
        f = [];

    if (mc.test(a)) {
      d = e.appendChild(b.createElement("div"));
      c = (mg.exec(a) || ["", ""])[1].toLowerCase();
      c = oa[c] || oa._default;
      d.innerHTML = c[1] + a.replace(ng, "<$1></$2>") + c[2];

      for (c = c[0]; c--;) {
        d = d.lastChild;
      }

      f = db(f, d.childNodes);
      d = e.firstChild;
      d.textContent = "";
    } else f.push(b.createTextNode(a));

    e.textContent = "";
    e.innerHTML = "";
    r(f, function (a) {
      e.appendChild(a);
    });
    return e;
  }

  function Y(a) {
    if (a instanceof Y) return a;
    var b;
    A(a) && (a = U(a), b = !0);

    if (!(this instanceof Y)) {
      if (b && "<" !== a.charAt(0)) throw nc("nosel");
      return new Y(a);
    }

    if (b) {
      b = C.document;
      var d;
      a = (d = og.exec(a)) ? [b.createElement(d[1])] : (d = ed(a, b)) ? d.childNodes : [];
      oc(this, a);
    } else B(a) ? fd(a) : oc(this, a);
  }

  function pc(a) {
    return a.cloneNode(!0);
  }

  function yb(a, b) {
    !b && lc(a) && x.cleanData([a]);
    a.querySelectorAll && x.cleanData(a.querySelectorAll("*"));
  }

  function gd(a) {
    for (var b in a) {
      return !1;
    }

    return !0;
  }

  function hd(a) {
    var b = a.ng339,
        d = b && Ka[b],
        c = d && d.events,
        d = d && d.data;
    d && !gd(d) || c && !gd(c) || (delete Ka[b], a.ng339 = void 0);
  }

  function id(a, b, d, c) {
    if (w(c)) throw nc("offargs");
    var e = (c = zb(a)) && c.events,
        f = c && c.handle;

    if (f) {
      if (b) {
        var g = function g(b) {
          var c = e[b];
          w(d) && cb(c || [], d);
          w(d) && c && 0 < c.length || (a.removeEventListener(b, f), delete e[b]);
        };

        r(b.split(" "), function (a) {
          g(a);
          Ab[a] && g(Ab[a]);
        });
      } else for (b in e) {
        "$destroy" !== b && a.removeEventListener(b, f), delete e[b];
      }

      hd(a);
    }
  }

  function qc(a, b) {
    var d = a.ng339;
    if (d = d && Ka[d]) b ? delete d.data[b] : d.data = {}, hd(a);
  }

  function zb(a, b) {
    var d = a.ng339,
        d = d && Ka[d];
    b && !d && (a.ng339 = d = ++pg, d = Ka[d] = {
      events: {},
      data: {},
      handle: void 0
    });
    return d;
  }

  function rc(a, b, d) {
    if (lc(a)) {
      var c,
          e = w(d),
          f = !e && b && !D(b),
          g = !b;
      a = (a = zb(a, !f)) && a.data;
      if (e) a[xb(b)] = d;else {
        if (g) return a;
        if (f) return a && a[xb(b)];

        for (c in b) {
          a[xb(c)] = b[c];
        }
      }
    }
  }

  function Bb(a, b) {
    return a.getAttribute ? -1 < (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " ").indexOf(" " + b + " ") : !1;
  }

  function Cb(a, b) {
    if (b && a.setAttribute) {
      var d = (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " "),
          c = d;
      r(b.split(" "), function (a) {
        a = U(a);
        c = c.replace(" " + a + " ", " ");
      });
      c !== d && a.setAttribute("class", U(c));
    }
  }

  function Db(a, b) {
    if (b && a.setAttribute) {
      var d = (" " + (a.getAttribute("class") || "") + " ").replace(/[\n\t]/g, " "),
          c = d;
      r(b.split(" "), function (a) {
        a = U(a);
        -1 === c.indexOf(" " + a + " ") && (c += a + " ");
      });
      c !== d && a.setAttribute("class", U(c));
    }
  }

  function oc(a, b) {
    if (b) if (b.nodeType) a[a.length++] = b;else {
      var d = b.length;

      if ("number" === typeof d && b.window !== b) {
        if (d) for (var c = 0; c < d; c++) {
          a[a.length++] = b[c];
        }
      } else a[a.length++] = b;
    }
  }

  function jd(a, b) {
    return Eb(a, "$" + (b || "ngController") + "Controller");
  }

  function Eb(a, b, d) {
    9 === a.nodeType && (a = a.documentElement);

    for (b = H(b) ? b : [b]; a;) {
      for (var c = 0, e = b.length; c < e; c++) {
        if (w(d = x.data(a, b[c]))) return d;
      }

      a = a.parentNode || 11 === a.nodeType && a.host;
    }
  }

  function kd(a) {
    for (yb(a, !0); a.firstChild;) {
      a.removeChild(a.firstChild);
    }
  }

  function Fb(a, b) {
    b || yb(a);
    var d = a.parentNode;
    d && d.removeChild(a);
  }

  function qg(a, b) {
    b = b || C;
    if ("complete" === b.document.readyState) b.setTimeout(a);else x(b).on("load", a);
  }

  function fd(a) {
    function b() {
      C.document.removeEventListener("DOMContentLoaded", b);
      C.removeEventListener("load", b);
      a();
    }

    "complete" === C.document.readyState ? C.setTimeout(a) : (C.document.addEventListener("DOMContentLoaded", b), C.addEventListener("load", b));
  }

  function ld(a, b) {
    var d = Gb[b.toLowerCase()];
    return d && md[ua(a)] && d;
  }

  function rg(a, b) {
    var d = function d(c, _d) {
      c.isDefaultPrevented = function () {
        return c.defaultPrevented;
      };

      var f = b[_d || c.type],
          g = f ? f.length : 0;

      if (g) {
        if (z(c.immediatePropagationStopped)) {
          var k = c.stopImmediatePropagation;

          c.stopImmediatePropagation = function () {
            c.immediatePropagationStopped = !0;
            c.stopPropagation && c.stopPropagation();
            k && k.call(c);
          };
        }

        c.isImmediatePropagationStopped = function () {
          return !0 === c.immediatePropagationStopped;
        };

        var h = f.specialHandlerWrapper || sg;
        1 < g && (f = ja(f));

        for (var l = 0; l < g; l++) {
          c.isImmediatePropagationStopped() || h(a, c, f[l]);
        }
      }
    };

    d.elem = a;
    return d;
  }

  function sg(a, b, d) {
    d.call(a, b);
  }

  function tg(a, b, d) {
    var c = b.relatedTarget;
    c && (c === a || ug.call(a, c)) || d.call(a, b);
  }

  function ig() {
    this.$get = function () {
      return S(Y, {
        hasClass: function hasClass(a, b) {
          a.attr && (a = a[0]);
          return Bb(a, b);
        },
        addClass: function addClass(a, b) {
          a.attr && (a = a[0]);
          return Db(a, b);
        },
        removeClass: function removeClass(a, b) {
          a.attr && (a = a[0]);
          return Cb(a, b);
        }
      });
    };
  }

  function La(a, b) {
    var d = a && a.$$hashKey;
    if (d) return "function" === typeof d && (d = a.$$hashKey()), d;
    d = _typeof(a);
    return d = "function" === d || "object" === d && null !== a ? a.$$hashKey = d + ":" + (b || se)() : d + ":" + a;
  }

  function nd() {
    this._keys = [];
    this._values = [];
    this._lastKey = NaN;
    this._lastIndex = -1;
  }

  function od(a) {
    a = Function.prototype.toString.call(a).replace(vg, "");
    return a.match(wg) || a.match(xg);
  }

  function yg(a) {
    return (a = od(a)) ? "function(" + (a[1] || "").replace(/[\s\r\n]+/, " ") + ")" : "fn";
  }

  function fb(a, b) {
    function d(a) {
      return function (b, c) {
        if (D(b)) r(b, Yb(a));else return a(b, c);
      };
    }

    function c(a, b) {
      Ja(a, "service");
      if (B(b) || H(b)) b = n.instantiate(b);
      if (!b.$get) throw Ba("pget", a);
      return p[a + "Provider"] = b;
    }

    function e(a, b) {
      return function () {
        var c = t.invoke(b, this);
        if (z(c)) throw Ba("undef", a);
        return c;
      };
    }

    function f(a, b, d) {
      return c(a, {
        $get: !1 !== d ? e(a, b) : b
      });
    }

    function g(a) {
      gb(z(a) || H(a), "modulesToLoad", "not an array");
      var b = [],
          c;
      r(a, function (a) {
        function d(a) {
          var b, c;
          b = 0;

          for (c = a.length; b < c; b++) {
            var e = a[b],
                f = n.get(e[0]);
            f[e[1]].apply(f, e[2]);
          }
        }

        if (!m.get(a)) {
          m.set(a, !0);

          try {
            A(a) ? (c = kc(a), t.modules[a] = c, b = b.concat(g(c.requires)).concat(c._runBlocks), d(c._invokeQueue), d(c._configBlocks)) : B(a) ? b.push(n.invoke(a)) : H(a) ? b.push(n.invoke(a)) : sb(a, "module");
          } catch (e) {
            throw H(a) && (a = a[a.length - 1]), e.message && e.stack && -1 === e.stack.indexOf(e.message) && (e = e.message + "\n" + e.stack), Ba("modulerr", a, e.stack || e.message || e);
          }
        }
      });
      return b;
    }

    function k(a, c) {
      function d(b, e) {
        if (a.hasOwnProperty(b)) {
          if (a[b] === h) throw Ba("cdep", b + " <- " + l.join(" <- "));
          return a[b];
        }

        try {
          return l.unshift(b), a[b] = h, a[b] = c(b, e), a[b];
        } catch (f) {
          throw a[b] === h && delete a[b], f;
        } finally {
          l.shift();
        }
      }

      function e(a, c, f) {
        var g = [];
        a = fb.$$annotate(a, b, f);

        for (var h = 0, k = a.length; h < k; h++) {
          var l = a[h];
          if ("string" !== typeof l) throw Ba("itkn", l);
          g.push(c && c.hasOwnProperty(l) ? c[l] : d(l, f));
        }

        return g;
      }

      return {
        invoke: function invoke(a, b, c, d) {
          "string" === typeof c && (d = c, c = null);
          c = e(a, c, d);
          H(a) && (a = a[a.length - 1]);
          d = a;
          if (Ca || "function" !== typeof d) d = !1;else {
            var f = d.$$ngIsClass;
            Ga(f) || (f = d.$$ngIsClass = /^class\b/.test(Function.prototype.toString.call(d)));
            d = f;
          }
          return d ? (c.unshift(null), new (Function.prototype.bind.apply(a, c))()) : a.apply(b, c);
        },
        instantiate: function instantiate(a, b, c) {
          var d = H(a) ? a[a.length - 1] : a;
          a = e(a, b, c);
          a.unshift(null);
          return new (Function.prototype.bind.apply(d, a))();
        },
        get: d,
        annotate: fb.$$annotate,
        has: function has(b) {
          return p.hasOwnProperty(b + "Provider") || a.hasOwnProperty(b);
        }
      };
    }

    b = !0 === b;
    var h = {},
        l = [],
        m = new Hb(),
        p = {
      $provide: {
        provider: d(c),
        factory: d(f),
        service: d(function (a, b) {
          return f(a, ["$injector", function (a) {
            return a.instantiate(b);
          }]);
        }),
        value: d(function (a, b) {
          return f(a, ia(b), !1);
        }),
        constant: d(function (a, b) {
          Ja(a, "constant");
          p[a] = b;
          s[a] = b;
        }),
        decorator: function decorator(a, b) {
          var c = n.get(a + "Provider"),
              d = c.$get;

          c.$get = function () {
            var a = t.invoke(d, c);
            return t.invoke(b, null, {
              $delegate: a
            });
          };
        }
      }
    },
        n = p.$injector = k(p, function (a, b) {
      ca.isString(b) && l.push(b);
      throw Ba("unpr", l.join(" <- "));
    }),
        s = {},
        G = k(s, function (a, b) {
      var c = n.get(a + "Provider", b);
      return t.invoke(c.$get, c, void 0, a);
    }),
        t = G;
    p.$injectorProvider = {
      $get: ia(G)
    };
    t.modules = n.modules = T();
    var N = g(a),
        t = G.get("$injector");
    t.strictDi = b;
    r(N, function (a) {
      a && t.invoke(a);
    });

    t.loadNewModules = function (a) {
      r(g(a), function (a) {
        a && t.invoke(a);
      });
    };

    return t;
  }

  function wf() {
    var a = !0;

    this.disableAutoScrolling = function () {
      a = !1;
    };

    this.$get = ["$window", "$location", "$rootScope", function (b, d, c) {
      function e(a) {
        var b = null;
        Array.prototype.some.call(a, function (a) {
          if ("a" === ua(a)) return b = a, !0;
        });
        return b;
      }

      function f(a) {
        if (a) {
          a.scrollIntoView();
          var c;
          c = g.yOffset;
          B(c) ? c = c() : $b(c) ? (c = c[0], c = "fixed" !== b.getComputedStyle(c).position ? 0 : c.getBoundingClientRect().bottom) : W(c) || (c = 0);
          c && (a = a.getBoundingClientRect().top, b.scrollBy(0, a - c));
        } else b.scrollTo(0, 0);
      }

      function g(a) {
        a = A(a) ? a : W(a) ? a.toString() : d.hash();
        var b;
        a ? (b = k.getElementById(a)) ? f(b) : (b = e(k.getElementsByName(a))) ? f(b) : "top" === a && f(null) : f(null);
      }

      var k = b.document;
      a && c.$watch(function () {
        return d.hash();
      }, function (a, b) {
        a === b && "" === a || qg(function () {
          c.$evalAsync(g);
        });
      });
      return g;
    }];
  }

  function hb(a, b) {
    if (!a && !b) return "";
    if (!a) return b;
    if (!b) return a;
    H(a) && (a = a.join(" "));
    H(b) && (b = b.join(" "));
    return a + " " + b;
  }

  function zg(a) {
    A(a) && (a = a.split(" "));
    var b = T();
    r(a, function (a) {
      a.length && (b[a] = !0);
    });
    return b;
  }

  function ra(a) {
    return D(a) ? a : {};
  }

  function Ag(a, b, d, c, e) {
    function f() {
      qa = null;
      k();
    }

    function g() {
      t = y();
      t = z(t) ? null : t;
      va(t, P) && (t = P);
      N = P = t;
    }

    function k() {
      var a = N;
      g();
      if (v !== h.url() || a !== t) v = h.url(), N = t, r(J, function (a) {
        a(h.url(), t);
      });
    }

    var h = this,
        l = a.location,
        m = a.history,
        p = a.setTimeout,
        n = a.clearTimeout,
        s = {},
        G = e(d);
    h.isMock = !1;
    h.$$completeOutstandingRequest = G.completeTask;
    h.$$incOutstandingRequestCount = G.incTaskCount;
    h.notifyWhenNoOutstandingRequests = G.notifyWhenNoPendingTasks;
    var t,
        N,
        v = l.href,
        jc = b.find("base"),
        qa = null,
        y = c.history ? function () {
      try {
        return m.state;
      } catch (a) {}
    } : E;
    g();

    h.url = function (b, d, e) {
      z(e) && (e = null);
      l !== a.location && (l = a.location);
      m !== a.history && (m = a.history);

      if (b) {
        var f = N === e;
        b = ga(b).href;
        if (v === b && (!c.history || f)) return h;
        var k = v && Da(v) === Da(b);
        v = b;
        N = e;
        !c.history || k && f ? (k || (qa = b), d ? l.replace(b) : k ? (d = l, e = b, f = e.indexOf("#"), e = -1 === f ? "" : e.substr(f), d.hash = e) : l.href = b, l.href !== b && (qa = b)) : (m[d ? "replaceState" : "pushState"](e, "", b), g());
        qa && (qa = b);
        return h;
      }

      return (qa || l.href).replace(/#$/, "");
    };

    h.state = function () {
      return t;
    };

    var J = [],
        I = !1,
        P = null;

    h.onUrlChange = function (b) {
      if (!I) {
        if (c.history) x(a).on("popstate", f);
        x(a).on("hashchange", f);
        I = !0;
      }

      J.push(b);
      return b;
    };

    h.$$applicationDestroyed = function () {
      x(a).off("hashchange popstate", f);
    };

    h.$$checkUrlChange = k;

    h.baseHref = function () {
      var a = jc.attr("href");
      return a ? a.replace(/^(https?:)?\/\/[^/]*/, "") : "";
    };

    h.defer = function (a, b, c) {
      var d;
      b = b || 0;
      c = c || G.DEFAULT_TASK_TYPE;
      G.incTaskCount(c);
      d = p(function () {
        delete s[d];
        G.completeTask(a, c);
      }, b);
      s[d] = c;
      return d;
    };

    h.defer.cancel = function (a) {
      if (s.hasOwnProperty(a)) {
        var b = s[a];
        delete s[a];
        n(a);
        G.completeTask(E, b);
        return !0;
      }

      return !1;
    };
  }

  function Df() {
    this.$get = ["$window", "$log", "$sniffer", "$document", "$$taskTrackerFactory", function (a, b, d, c, e) {
      return new Ag(a, c, b, d, e);
    }];
  }

  function Ef() {
    this.$get = function () {
      function a(a, c) {
        function e(a) {
          a !== p && (n ? n === a && (n = a.n) : n = a, f(a.n, a.p), f(a, p), p = a, p.n = null);
        }

        function f(a, b) {
          a !== b && (a && (a.p = b), b && (b.n = a));
        }

        if (a in b) throw F("$cacheFactory")("iid", a);
        var g = 0,
            k = S({}, c, {
          id: a
        }),
            h = T(),
            l = c && c.capacity || Number.MAX_VALUE,
            m = T(),
            p = null,
            n = null;
        return b[a] = {
          put: function put(a, b) {
            if (!z(b)) {
              if (l < Number.MAX_VALUE) {
                var c = m[a] || (m[a] = {
                  key: a
                });
                e(c);
              }

              a in h || g++;
              h[a] = b;
              g > l && this.remove(n.key);
              return b;
            }
          },
          get: function get(a) {
            if (l < Number.MAX_VALUE) {
              var b = m[a];
              if (!b) return;
              e(b);
            }

            return h[a];
          },
          remove: function remove(a) {
            if (l < Number.MAX_VALUE) {
              var b = m[a];
              if (!b) return;
              b === p && (p = b.p);
              b === n && (n = b.n);
              f(b.n, b.p);
              delete m[a];
            }

            a in h && (delete h[a], g--);
          },
          removeAll: function removeAll() {
            h = T();
            g = 0;
            m = T();
            p = n = null;
          },
          destroy: function destroy() {
            m = k = h = null;
            delete b[a];
          },
          info: function info() {
            return S({}, k, {
              size: g
            });
          }
        };
      }

      var b = {};

      a.info = function () {
        var a = {};
        r(b, function (b, e) {
          a[e] = b.info();
        });
        return a;
      };

      a.get = function (a) {
        return b[a];
      };

      return a;
    };
  }

  function cg() {
    this.$get = ["$cacheFactory", function (a) {
      return a("templates");
    }];
  }

  function Xc(a, b) {
    function d(a, b, c) {
      var d = /^([@&]|[=<](\*?))(\??)\s*([\w$]*)$/,
          e = T();
      r(a, function (a, f) {
        a = a.trim();
        if (a in p) e[f] = p[a];else {
          var g = a.match(d);
          if (!g) throw $("iscp", b, f, a, c ? "controller bindings definition" : "isolate scope definition");
          e[f] = {
            mode: g[1][0],
            collection: "*" === g[2],
            optional: "?" === g[3],
            attrName: g[4] || f
          };
          g[4] && (p[a] = e[f]);
        }
      });
      return e;
    }

    function c(a) {
      var b = a.charAt(0);
      if (!b || b !== K(b)) throw $("baddir", a);
      if (a !== a.trim()) throw $("baddir", a);
    }

    function e(a) {
      var b = a.require || a.controller && a.name;
      !H(b) && D(b) && r(b, function (a, c) {
        var d = a.match(l);
        a.substring(d[0].length) || (b[c] = d[0] + c);
      });
      return b;
    }

    var f = {},
        g = /^\s*directive:\s*([\w-]+)\s+(.*)$/,
        k = /(([\w-]+)(?::([^;]+))?;?)/,
        h = we("ngSrc,ngSrcset,src,srcset"),
        l = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/,
        m = /^(on[a-z]+|formaction)$/,
        p = T();

    this.directive = function qa(b, d) {
      gb(b, "name");
      Ja(b, "directive");
      A(b) ? (c(b), gb(d, "directiveFactory"), f.hasOwnProperty(b) || (f[b] = [], a.factory(b + "Directive", ["$injector", "$exceptionHandler", function (a, c) {
        var d = [];
        r(f[b], function (f, g) {
          try {
            var h = a.invoke(f);
            B(h) ? h = {
              compile: ia(h)
            } : !h.compile && h.link && (h.compile = ia(h.link));
            h.priority = h.priority || 0;
            h.index = g;
            h.name = h.name || b;
            h.require = e(h);
            var k = h,
                l = h.restrict;
            if (l && (!A(l) || !/[EACM]/.test(l))) throw $("badrestrict", l, b);
            k.restrict = l || "EA";
            h.$$moduleName = f.$$moduleName;
            d.push(h);
          } catch (m) {
            c(m);
          }
        });
        return d;
      }])), f[b].push(d)) : r(b, Yb(qa));
      return this;
    };

    this.component = function y(a, b) {
      function c(a) {
        function e(b) {
          return B(b) || H(b) ? function (c, d) {
            return a.invoke(b, this, {
              $element: c,
              $attrs: d
            });
          } : b;
        }

        var f = b.template || b.templateUrl ? b.template : "",
            g = {
          controller: d,
          controllerAs: Bg(b.controller) || b.controllerAs || "$ctrl",
          template: e(f),
          templateUrl: e(b.templateUrl),
          transclude: b.transclude,
          scope: {},
          bindToController: b.bindings || {},
          restrict: "E",
          require: b.require
        };
        r(b, function (a, b) {
          "$" === b.charAt(0) && (g[b] = a);
        });
        return g;
      }

      if (!A(a)) return r(a, Yb(Va(this, y))), this;

      var d = b.controller || function () {};

      r(b, function (a, b) {
        "$" === b.charAt(0) && (c[b] = a, B(d) && (d[b] = a));
      });
      c.$inject = ["$injector"];
      return this.directive(a, c);
    };

    this.aHrefSanitizationWhitelist = function (a) {
      return w(a) ? (b.aHrefSanitizationWhitelist(a), this) : b.aHrefSanitizationWhitelist();
    };

    this.imgSrcSanitizationWhitelist = function (a) {
      return w(a) ? (b.imgSrcSanitizationWhitelist(a), this) : b.imgSrcSanitizationWhitelist();
    };

    var n = !0;

    this.debugInfoEnabled = function (a) {
      return w(a) ? (n = a, this) : n;
    };

    var s = !1;

    this.strictComponentBindingsEnabled = function (a) {
      return w(a) ? (s = a, this) : s;
    };

    var G = 10;

    this.onChangesTtl = function (a) {
      return arguments.length ? (G = a, this) : G;
    };

    var t = !0;

    this.commentDirectivesEnabled = function (a) {
      return arguments.length ? (t = a, this) : t;
    };

    var N = !0;

    this.cssClassDirectivesEnabled = function (a) {
      return arguments.length ? (N = a, this) : N;
    };

    var v = T();

    this.addPropertySecurityContext = function (a, b, c) {
      var d = a.toLowerCase() + "|" + b.toLowerCase();
      if (d in v && v[d] !== c) throw $("ctxoverride", a, b, v[d], c);
      v[d] = c;
      return this;
    };

    (function () {
      function a(b, c) {
        r(c, function (a) {
          v[a.toLowerCase()] = b;
        });
      }

      a(V.HTML, ["iframe|srcdoc", "*|innerHTML", "*|outerHTML"]);
      a(V.CSS, ["*|style"]);
      a(V.URL, "area|href area|ping a|href a|ping blockquote|cite body|background del|cite input|src ins|cite q|cite".split(" "));
      a(V.MEDIA_URL, "audio|src img|src img|srcset source|src source|srcset track|src video|src video|poster".split(" "));
      a(V.RESOURCE_URL, "*|formAction applet|code applet|codebase base|href embed|src frame|src form|action head|profile html|manifest iframe|src link|href media|src object|codebase object|data script|src".split(" "));
    })();

    this.$get = ["$injector", "$interpolate", "$exceptionHandler", "$templateRequest", "$parse", "$controller", "$rootScope", "$sce", "$animate", function (a, b, c, e, p, M, L, u, R) {
      function q() {
        try {
          if (! --Ja) throw Ua = void 0, $("infchng", G);
          L.$apply(function () {
            for (var a = 0, b = Ua.length; a < b; ++a) {
              try {
                Ua[a]();
              } catch (d) {
                c(d);
              }
            }

            Ua = void 0;
          });
        } finally {
          Ja++;
        }
      }

      function ma(a, b) {
        if (!a) return a;
        if (!A(a)) throw $("srcset", b, a.toString());

        for (var c = "", d = U(a), e = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/, e = /\s/.test(d) ? e : /(,)/, d = d.split(e), e = Math.floor(d.length / 2), f = 0; f < e; f++) {
          var g = 2 * f,
              c = c + u.getTrustedMediaUrl(U(d[g])),
              c = c + (" " + U(d[g + 1]));
        }

        d = U(d[2 * f]).split(/\s/);
        c += u.getTrustedMediaUrl(U(d[0]));
        2 === d.length && (c += " " + U(d[1]));
        return c;
      }

      function w(a, b) {
        if (b) {
          var c = Object.keys(b),
              d,
              e,
              f;
          d = 0;

          for (e = c.length; d < e; d++) {
            f = c[d], this[f] = b[f];
          }
        } else this.$attr = {};

        this.$$element = a;
      }

      function O(a, b, c) {
        Fa.innerHTML = "<span " + b + ">";
        b = Fa.firstChild.attributes;
        var d = b[0];
        b.removeNamedItem(d.name);
        d.value = c;
        a.attributes.setNamedItem(d);
      }

      function sa(a, b) {
        try {
          a.addClass(b);
        } catch (c) {}
      }

      function da(a, b, c, d, e) {
        a instanceof x || (a = x(a));
        var f = Xa(a, b, a, c, d, e);
        da.$$addScopeClass(a);
        var g = null;
        return function (b, c, d) {
          if (!a) throw $("multilink");
          gb(b, "scope");
          e && e.needsNewScope && (b = b.$parent.$new());
          d = d || {};
          var h = d.parentBoundTranscludeFn,
              k = d.transcludeControllers;
          d = d.futureParentElement;
          h && h.$$boundTransclude && (h = h.$$boundTransclude);
          g || (g = (d = d && d[0]) ? "foreignobject" !== ua(d) && la.call(d).match(/SVG/) ? "svg" : "html" : "html");
          d = "html" !== g ? x(ja(g, x("<div></div>").append(a).html())) : c ? Wa.clone.call(a) : a;
          if (k) for (var l in k) {
            d.data("$" + l + "Controller", k[l].instance);
          }
          da.$$addScopeInfo(d, b);
          c && c(d, b);
          f && f(b, d, d, h);
          c || (a = f = null);
          return d;
        };
      }

      function Xa(a, b, c, d, e, f) {
        function g(a, c, d, e) {
          var f, k, l, m, p, I, t;
          if (n) for (t = Array(c.length), m = 0; m < h.length; m += 3) {
            f = h[m], t[f] = c[f];
          } else t = c;
          m = 0;

          for (p = h.length; m < p;) {
            k = t[h[m++]], c = h[m++], f = h[m++], c ? (c.scope ? (l = a.$new(), da.$$addScopeInfo(x(k), l)) : l = a, I = c.transcludeOnThisElement ? ka(a, c.transclude, e) : !c.templateOnThisElement && e ? e : !e && b ? ka(a, b) : null, c(f, l, k, d, I)) : f && f(a, k.childNodes, void 0, e);
          }
        }

        for (var h = [], k = H(a) || a instanceof x, l, m, p, I, n, t = 0; t < a.length; t++) {
          l = new w();
          11 === Ca && ib(a, t, k);
          m = sc(a[t], [], l, 0 === t ? d : void 0, e);
          (f = m.length ? aa(m, a[t], l, b, c, null, [], [], f) : null) && f.scope && da.$$addScopeClass(l.$$element);
          l = f && f.terminal || !(p = a[t].childNodes) || !p.length ? null : Xa(p, f ? (f.transcludeOnThisElement || !f.templateOnThisElement) && f.transclude : b);
          if (f || l) h.push(t, f, l), I = !0, n = n || f;
          f = null;
        }

        return I ? g : null;
      }

      function ib(a, b, c) {
        var d = a[b],
            e = d.parentNode,
            f;
        if (d.nodeType === Pa) for (;;) {
          f = e ? d.nextSibling : a[b + 1];
          if (!f || f.nodeType !== Pa) break;
          d.nodeValue += f.nodeValue;
          f.parentNode && f.parentNode.removeChild(f);
          c && f === a[b + 1] && a.splice(b + 1, 1);
        }
      }

      function ka(a, b, c) {
        function d(e, f, g, h, k) {
          e || (e = a.$new(!1, k), e.$$transcluded = !0);
          return b(e, f, {
            parentBoundTranscludeFn: c,
            transcludeControllers: g,
            futureParentElement: h
          });
        }

        var e = d.$$slots = T(),
            f;

        for (f in b.$$slots) {
          e[f] = b.$$slots[f] ? ka(a, b.$$slots[f], c) : null;
        }

        return d;
      }

      function sc(a, b, d, e, f) {
        var g = d.$attr,
            h;

        switch (a.nodeType) {
          case 1:
            h = ua(a);
            X(b, wa(h), "E", e, f);

            for (var l, m, n, t, J, s = a.attributes, v = 0, G = s && s.length; v < G; v++) {
              var P = !1,
                  N = !1,
                  r = !1,
                  y = !1,
                  u = !1,
                  M;
              l = s[v];
              m = l.name;
              t = l.value;
              n = wa(m.toLowerCase());
              (J = n.match(Ra)) ? (r = "Attr" === J[1], y = "Prop" === J[1], u = "On" === J[1], m = m.replace(pd, "").toLowerCase().substr(4 + J[1].length).replace(/_(.)/g, function (a, b) {
                return b.toUpperCase();
              })) : (M = n.match(Sa)) && ca(M[1]) && (P = m, N = m.substr(0, m.length - 5) + "end", m = m.substr(0, m.length - 6));
              if (y || u) d[n] = t, g[n] = l.name, y ? Ea(a, b, n, m) : b.push(qd(p, L, c, n, m, !1));else {
                n = wa(m.toLowerCase());
                g[n] = m;
                if (r || !d.hasOwnProperty(n)) d[n] = t, ld(a, n) && (d[n] = !0);
                Ia(a, b, t, n, r);
                X(b, n, "A", e, f, P, N);
              }
            }

            "input" === h && "hidden" === a.getAttribute("type") && a.setAttribute("autocomplete", "off");
            if (!Qa) break;
            g = a.className;
            D(g) && (g = g.animVal);
            if (A(g) && "" !== g) for (; a = k.exec(g);) {
              n = wa(a[2]), X(b, n, "C", e, f) && (d[n] = U(a[3])), g = g.substr(a.index + a[0].length);
            }
            break;

          case Pa:
            na(b, a.nodeValue);
            break;

          case 8:
            if (!Oa) break;
            F(a, b, d, e, f);
        }

        b.sort(ia);
        return b;
      }

      function F(a, b, c, d, e) {
        try {
          var f = g.exec(a.nodeValue);

          if (f) {
            var h = wa(f[1]);
            X(b, h, "M", d, e) && (c[h] = U(f[2]));
          }
        } catch (k) {}
      }

      function V(a, b, c) {
        var d = [],
            e = 0;

        if (b && a.hasAttribute && a.hasAttribute(b)) {
          do {
            if (!a) throw $("uterdir", b, c);
            1 === a.nodeType && (a.hasAttribute(b) && e++, a.hasAttribute(c) && e--);
            d.push(a);
            a = a.nextSibling;
          } while (0 < e);
        } else d.push(a);

        return x(d);
      }

      function Y(a, b, c) {
        return function (d, e, f, g, h) {
          e = V(e[0], b, c);
          return a(d, e, f, g, h);
        };
      }

      function Z(a, b, c, d, e, f) {
        var g;
        return a ? da(b, c, d, e, f) : function () {
          g || (g = da(b, c, d, e, f), b = c = f = null);
          return g.apply(this, arguments);
        };
      }

      function aa(a, b, d, e, f, g, h, k, l) {
        function m(a, b, c, d) {
          if (a) {
            c && (a = Y(a, c, d));
            a.require = u.require;
            a.directiveName = Q;
            if (s === u || u.$$isolateScope) a = Aa(a, {
              isolateScope: !0
            });
            h.push(a);
          }

          if (b) {
            c && (b = Y(b, c, d));
            b.require = u.require;
            b.directiveName = Q;
            if (s === u || u.$$isolateScope) b = Aa(b, {
              isolateScope: !0
            });
            k.push(b);
          }
        }

        function p(a, e, f, g, l) {
          function m(a, b, c, d) {
            var e;
            bb(a) || (d = c, c = b, b = a, a = void 0);
            N && (e = P);
            c || (c = N ? Q.parent() : Q);

            if (d) {
              var f = l.$$slots[d];
              if (f) return f(a, b, e, c, R);
              if (z(f)) throw $("noslot", d, za(Q));
            } else return l(a, b, e, c, R);
          }

          var n, u, L, y, G, P, M, Q;
          b === f ? (g = d, Q = d.$$element) : (Q = x(f), g = new w(Q, d));
          G = e;
          s ? y = e.$new(!0) : t && (G = e.$parent);
          l && (M = m, M.$$boundTransclude = l, M.isSlotFilled = function (a) {
            return !!l.$$slots[a];
          });
          J && (P = ea(Q, g, M, J, y, e, s));
          s && (da.$$addScopeInfo(Q, y, !0, !(v && (v === s || v === s.$$originalDirective))), da.$$addScopeClass(Q, !0), y.$$isolateBindings = s.$$isolateBindings, u = Da(e, g, y, y.$$isolateBindings, s), u.removeWatches && y.$on("$destroy", u.removeWatches));

          for (n in P) {
            u = J[n];
            L = P[n];
            var Cg = u.$$bindings.bindToController;
            L.instance = L();
            Q.data("$" + u.name + "Controller", L.instance);
            L.bindingInfo = Da(G, g, L.instance, Cg, u);
          }

          r(J, function (a, b) {
            var c = a.require;
            a.bindToController && !H(c) && D(c) && S(P[b].instance, W(b, c, Q, P));
          });
          r(P, function (a) {
            var b = a.instance;
            if (B(b.$onChanges)) try {
              b.$onChanges(a.bindingInfo.initialChanges);
            } catch (d) {
              c(d);
            }
            if (B(b.$onInit)) try {
              b.$onInit();
            } catch (e) {
              c(e);
            }
            B(b.$doCheck) && (G.$watch(function () {
              b.$doCheck();
            }), b.$doCheck());
            B(b.$onDestroy) && G.$on("$destroy", function () {
              b.$onDestroy();
            });
          });
          n = 0;

          for (u = h.length; n < u; n++) {
            L = h[n], Ba(L, L.isolateScope ? y : e, Q, g, L.require && W(L.directiveName, L.require, Q, P), M);
          }

          var R = e;
          s && (s.template || null === s.templateUrl) && (R = y);
          a && a(R, f.childNodes, void 0, l);

          for (n = k.length - 1; 0 <= n; n--) {
            L = k[n], Ba(L, L.isolateScope ? y : e, Q, g, L.require && W(L.directiveName, L.require, Q, P), M);
          }

          r(P, function (a) {
            a = a.instance;
            B(a.$postLink) && a.$postLink();
          });
        }

        l = l || {};

        for (var n = -Number.MAX_VALUE, t = l.newScopeDirective, J = l.controllerDirectives, s = l.newIsolateScopeDirective, v = l.templateDirective, L = l.nonTlbTranscludeDirective, G = !1, P = !1, N = l.hasElementTranscludeDirective, y = d.$$element = x(b), u, Q, M, R = e, q, ma = !1, Ib = !1, O, sa = 0, A = a.length; sa < A; sa++) {
          u = a[sa];
          var E = u.$$start,
              ib = u.$$end;
          E && (y = V(b, E, ib));
          M = void 0;
          if (n > u.priority) break;
          if (O = u.scope) u.templateUrl || (D(O) ? (ba("new/isolated scope", s || t, u, y), s = u) : ba("new/isolated scope", s, u, y)), t = t || u;
          Q = u.name;

          if (!ma && (u.replace && (u.templateUrl || u.template) || u.transclude && !u.$$tlb)) {
            for (O = sa + 1; ma = a[O++];) {
              if (ma.transclude && !ma.$$tlb || ma.replace && (ma.templateUrl || ma.template)) {
                Ib = !0;
                break;
              }
            }

            ma = !0;
          }

          !u.templateUrl && u.controller && (J = J || T(), ba("'" + Q + "' controller", J[Q], u, y), J[Q] = u);
          if (O = u.transclude) if (G = !0, u.$$tlb || (ba("transclusion", L, u, y), L = u), "element" === O) N = !0, n = u.priority, M = y, y = d.$$element = x(da.$$createComment(Q, d[Q])), b = y[0], pa(f, Ha.call(M, 0), b), R = Z(Ib, M, e, n, g && g.name, {
            nonTlbTranscludeDirective: L
          });else {
            var ka = T();

            if (D(O)) {
              M = C.document.createDocumentFragment();
              var Xa = T(),
                  F = T();
              r(O, function (a, b) {
                var c = "?" === a.charAt(0);
                a = c ? a.substring(1) : a;
                Xa[a] = b;
                ka[b] = null;
                F[b] = c;
              });
              r(y.contents(), function (a) {
                var b = Xa[wa(ua(a))];
                b ? (F[b] = !0, ka[b] = ka[b] || C.document.createDocumentFragment(), ka[b].appendChild(a)) : M.appendChild(a);
              });
              r(F, function (a, b) {
                if (!a) throw $("reqslot", b);
              });

              for (var K in ka) {
                ka[K] && (R = x(ka[K].childNodes), ka[K] = Z(Ib, R, e));
              }

              M = x(M.childNodes);
            } else M = x(pc(b)).contents();

            y.empty();
            R = Z(Ib, M, e, void 0, void 0, {
              needsNewScope: u.$$isolateScope || u.$$newScope
            });
            R.$$slots = ka;
          }
          if (u.template) if (P = !0, ba("template", v, u, y), v = u, O = B(u.template) ? u.template(y, d) : u.template, O = Na(O), u.replace) {
            g = u;
            M = mc.test(O) ? rd(ja(u.templateNamespace, U(O))) : [];
            b = M[0];
            if (1 !== M.length || 1 !== b.nodeType) throw $("tplrt", Q, "");
            pa(f, y, b);
            A = {
              $attr: {}
            };
            O = sc(b, [], A);
            var Dg = a.splice(sa + 1, a.length - (sa + 1));
            (s || t) && fa(O, s, t);
            a = a.concat(O).concat(Dg);
            ga(d, A);
            A = a.length;
          } else y.html(O);
          if (u.templateUrl) P = !0, ba("template", v, u, y), v = u, u.replace && (g = u), p = ha(a.splice(sa, a.length - sa), y, d, f, G && R, h, k, {
            controllerDirectives: J,
            newScopeDirective: t !== u && t,
            newIsolateScopeDirective: s,
            templateDirective: v,
            nonTlbTranscludeDirective: L
          }), A = a.length;else if (u.compile) try {
            q = u.compile(y, d, R);
            var X = u.$$originalDirective || u;
            B(q) ? m(null, Va(X, q), E, ib) : q && m(Va(X, q.pre), Va(X, q.post), E, ib);
          } catch (ca) {
            c(ca, za(y));
          }
          u.terminal && (p.terminal = !0, n = Math.max(n, u.priority));
        }

        p.scope = t && !0 === t.scope;
        p.transcludeOnThisElement = G;
        p.templateOnThisElement = P;
        p.transclude = R;
        l.hasElementTranscludeDirective = N;
        return p;
      }

      function W(a, b, c, d) {
        var e;

        if (A(b)) {
          var f = b.match(l);
          b = b.substring(f[0].length);
          var g = f[1] || f[3],
              f = "?" === f[2];
          "^^" === g ? c = c.parent() : e = (e = d && d[b]) && e.instance;

          if (!e) {
            var h = "$" + b + "Controller";
            e = "^^" === g && c[0] && 9 === c[0].nodeType ? null : g ? c.inheritedData(h) : c.data(h);
          }

          if (!e && !f) throw $("ctreq", b, a);
        } else if (H(b)) for (e = [], g = 0, f = b.length; g < f; g++) {
          e[g] = W(a, b[g], c, d);
        } else D(b) && (e = {}, r(b, function (b, f) {
          e[f] = W(a, b, c, d);
        }));

        return e || null;
      }

      function ea(a, b, c, d, e, f, g) {
        var h = T(),
            k;

        for (k in d) {
          var l = d[k],
              m = {
            $scope: l === g || l.$$isolateScope ? e : f,
            $element: a,
            $attrs: b,
            $transclude: c
          },
              p = l.controller;
          "@" === p && (p = b[l.name]);
          m = M(p, m, !0, l.controllerAs);
          h[l.name] = m;
          a.data("$" + l.name + "Controller", m.instance);
        }

        return h;
      }

      function fa(a, b, c) {
        for (var d = 0, e = a.length; d < e; d++) {
          a[d] = ac(a[d], {
            $$isolateScope: b,
            $$newScope: c
          });
        }
      }

      function X(b, c, e, g, h, k, l) {
        if (c === h) return null;
        var m = null;

        if (f.hasOwnProperty(c)) {
          h = a.get(c + "Directive");

          for (var p = 0, n = h.length; p < n; p++) {
            if (c = h[p], (z(g) || g > c.priority) && -1 !== c.restrict.indexOf(e)) {
              k && (c = ac(c, {
                $$start: k,
                $$end: l
              }));

              if (!c.$$bindings) {
                var I = m = c,
                    t = c.name,
                    u = {
                  isolateScope: null,
                  bindToController: null
                };
                D(I.scope) && (!0 === I.bindToController ? (u.bindToController = d(I.scope, t, !0), u.isolateScope = {}) : u.isolateScope = d(I.scope, t, !1));
                D(I.bindToController) && (u.bindToController = d(I.bindToController, t, !0));
                if (u.bindToController && !I.controller) throw $("noctrl", t);
                m = m.$$bindings = u;
                D(m.isolateScope) && (c.$$isolateBindings = m.isolateScope);
              }

              b.push(c);
              m = c;
            }
          }
        }

        return m;
      }

      function ca(b) {
        if (f.hasOwnProperty(b)) for (var c = a.get(b + "Directive"), d = 0, e = c.length; d < e; d++) {
          if (b = c[d], b.multiElement) return !0;
        }
        return !1;
      }

      function ga(a, b) {
        var c = b.$attr,
            d = a.$attr;
        r(a, function (d, e) {
          "$" !== e.charAt(0) && (b[e] && b[e] !== d && (d = d.length ? d + (("style" === e ? ";" : " ") + b[e]) : b[e]), a.$set(e, d, !0, c[e]));
        });
        r(b, function (b, e) {
          a.hasOwnProperty(e) || "$" === e.charAt(0) || (a[e] = b, "class" !== e && "style" !== e && (d[e] = c[e]));
        });
      }

      function ha(a, b, d, f, g, h, k, l) {
        var m = [],
            p,
            n,
            t = b[0],
            u = a.shift(),
            J = ac(u, {
          templateUrl: null,
          transclude: null,
          replace: null,
          $$originalDirective: u
        }),
            s = B(u.templateUrl) ? u.templateUrl(b, d) : u.templateUrl,
            L = u.templateNamespace;
        b.empty();
        e(s).then(function (c) {
          var e, I;
          c = Na(c);

          if (u.replace) {
            c = mc.test(c) ? rd(ja(L, U(c))) : [];
            e = c[0];
            if (1 !== c.length || 1 !== e.nodeType) throw $("tplrt", u.name, s);
            c = {
              $attr: {}
            };
            pa(f, b, e);
            var v = sc(e, [], c);
            D(u.scope) && fa(v, !0);
            a = v.concat(a);
            ga(d, c);
          } else e = t, b.html(c);

          a.unshift(J);
          p = aa(a, e, d, g, b, u, h, k, l);
          r(f, function (a, c) {
            a === e && (f[c] = b[0]);
          });

          for (n = Xa(b[0].childNodes, g); m.length;) {
            c = m.shift();
            I = m.shift();
            var y = m.shift(),
                P = m.shift(),
                v = b[0];

            if (!c.$$destroyed) {
              if (I !== t) {
                var G = I.className;
                l.hasElementTranscludeDirective && u.replace || (v = pc(e));
                pa(y, x(I), v);
                sa(x(v), G);
              }

              I = p.transcludeOnThisElement ? ka(c, p.transclude, P) : P;
              p(n, c, v, f, I);
            }
          }

          m = null;
        })["catch"](function (a) {
          cc(a) && c(a);
        });
        return function (a, b, c, d, e) {
          a = e;
          b.$$destroyed || (m ? m.push(b, c, d, a) : (p.transcludeOnThisElement && (a = ka(b, p.transclude, e)), p(n, b, c, d, a)));
        };
      }

      function ia(a, b) {
        var c = b.priority - a.priority;
        return 0 !== c ? c : a.name !== b.name ? a.name < b.name ? -1 : 1 : a.index - b.index;
      }

      function ba(a, b, c, d) {
        function e(a) {
          return a ? " (module: " + a + ")" : "";
        }

        if (b) throw $("multidir", b.name, e(b.$$moduleName), c.name, e(c.$$moduleName), a, za(d));
      }

      function na(a, c) {
        var d = b(c, !0);
        d && a.push({
          priority: 0,
          compile: function compile(a) {
            a = a.parent();
            var b = !!a.length;
            b && da.$$addBindingClass(a);
            return function (a, c) {
              var e = c.parent();
              b || da.$$addBindingClass(e);
              da.$$addBindingInfo(e, d.expressions);
              a.$watch(d, function (a) {
                c[0].nodeValue = a;
              });
            };
          }
        });
      }

      function ja(a, b) {
        a = K(a || "html");

        switch (a) {
          case "svg":
          case "math":
            var c = C.document.createElement("div");
            c.innerHTML = "<" + a + ">" + b + "</" + a + ">";
            return c.childNodes[0].childNodes;

          default:
            return b;
        }
      }

      function oa(a, b) {
        if ("srcdoc" === b) return u.HTML;
        if ("src" === b || "ngSrc" === b) return -1 === ["img", "video", "audio", "source", "track"].indexOf(a) ? u.RESOURCE_URL : u.MEDIA_URL;
        if ("xlinkHref" === b) return "image" === a ? u.MEDIA_URL : "a" === a ? u.URL : u.RESOURCE_URL;
        if ("form" === a && "action" === b || "base" === a && "href" === b || "link" === a && "href" === b) return u.RESOURCE_URL;
        if ("a" === a && ("href" === b || "ngHref" === b)) return u.URL;
      }

      function xa(a, b) {
        var c = b.toLowerCase();
        return v[a + "|" + c] || v["*|" + c];
      }

      function ya(a) {
        return ma(u.valueOf(a), "ng-prop-srcset");
      }

      function Ea(a, b, c, d) {
        if (m.test(d)) throw $("nodomevents");
        a = ua(a);
        var e = xa(a, d),
            f = Ta;
        "srcset" !== d || "img" !== a && "source" !== a ? e && (f = u.getTrusted.bind(u, e)) : f = ya;
        b.push({
          priority: 100,
          compile: function compile(a, b) {
            var e = p(b[c]),
                g = p(b[c], function (a) {
              return u.valueOf(a);
            });
            return {
              pre: function pre(a, b) {
                function c() {
                  var g = e(a);
                  b[0][d] = f(g);
                }

                c();
                a.$watch(g, c);
              }
            };
          }
        });
      }

      function Ia(a, c, d, e, f) {
        var g = ua(a),
            k = oa(g, e),
            l = h[e] || f,
            p = b(d, !f, k, l);

        if (p) {
          if ("multiple" === e && "select" === g) throw $("selmulti", za(a));
          if (m.test(e)) throw $("nodomevents");
          c.push({
            priority: 100,
            compile: function compile() {
              return {
                pre: function pre(a, c, f) {
                  c = f.$$observers || (f.$$observers = T());
                  var g = f[e];
                  g !== d && (p = g && b(g, !0, k, l), d = g);
                  p && (f[e] = p(a), (c[e] || (c[e] = [])).$$inter = !0, (f.$$observers && f.$$observers[e].$$scope || a).$watch(p, function (a, b) {
                    "class" === e && a !== b ? f.$updateClass(a, b) : f.$set(e, a);
                  }));
                }
              };
            }
          });
        }
      }

      function pa(a, b, c) {
        var d = b[0],
            e = b.length,
            f = d.parentNode,
            g,
            h;
        if (a) for (g = 0, h = a.length; g < h; g++) {
          if (a[g] === d) {
            a[g++] = c;
            h = g + e - 1;

            for (var k = a.length; g < k; g++, h++) {
              h < k ? a[g] = a[h] : delete a[g];
            }

            a.length -= e - 1;
            a.context === d && (a.context = c);
            break;
          }
        }
        f && f.replaceChild(c, d);
        a = C.document.createDocumentFragment();

        for (g = 0; g < e; g++) {
          a.appendChild(b[g]);
        }

        x.hasData(d) && (x.data(c, x.data(d)), x(d).off("$destroy"));
        x.cleanData(a.querySelectorAll("*"));

        for (g = 1; g < e; g++) {
          delete b[g];
        }

        b[0] = c;
        b.length = 1;
      }

      function Aa(a, b) {
        return S(function () {
          return a.apply(null, arguments);
        }, a, b);
      }

      function Ba(a, b, d, e, f, g) {
        try {
          a(b, d, e, f, g);
        } catch (h) {
          c(h, za(d));
        }
      }

      function ra(a, b) {
        if (s) throw $("missingattr", a, b);
      }

      function Da(a, c, d, e, f) {
        function g(b, c, e) {
          B(d.$onChanges) && !dc(c, e) && (Ua || (a.$$postDigest(q), Ua = []), m || (m = {}, Ua.push(h)), m[b] && (e = m[b].previousValue), m[b] = new Jb(e, c));
        }

        function h() {
          d.$onChanges(m);
          m = void 0;
        }

        var k = [],
            l = {},
            m;
        r(e, function (e, h) {
          var m = e.attrName,
              n = e.optional,
              I,
              t,
              u,
              s;

          switch (e.mode) {
            case "@":
              n || ta.call(c, m) || (ra(m, f.name), d[h] = c[m] = void 0);
              n = c.$observe(m, function (a) {
                if (A(a) || Ga(a)) g(h, a, d[h]), d[h] = a;
              });
              c.$$observers[m].$$scope = a;
              I = c[m];
              A(I) ? d[h] = b(I)(a) : Ga(I) && (d[h] = I);
              l[h] = new Jb(tc, d[h]);
              k.push(n);
              break;

            case "=":
              if (!ta.call(c, m)) {
                if (n) break;
                ra(m, f.name);
                c[m] = void 0;
              }

              if (n && !c[m]) break;
              t = p(c[m]);
              s = t.literal ? va : dc;

              u = t.assign || function () {
                I = d[h] = t(a);
                throw $("nonassign", c[m], m, f.name);
              };

              I = d[h] = t(a);

              n = function n(b) {
                s(b, d[h]) || (s(b, I) ? u(a, b = d[h]) : d[h] = b);
                return I = b;
              };

              n.$stateful = !0;
              n = e.collection ? a.$watchCollection(c[m], n) : a.$watch(p(c[m], n), null, t.literal);
              k.push(n);
              break;

            case "<":
              if (!ta.call(c, m)) {
                if (n) break;
                ra(m, f.name);
                c[m] = void 0;
              }

              if (n && !c[m]) break;
              t = p(c[m]);
              var v = t.literal,
                  L = d[h] = t(a);
              l[h] = new Jb(tc, d[h]);
              n = a[e.collection ? "$watchCollection" : "$watch"](t, function (a, b) {
                if (b === a) {
                  if (b === L || v && va(b, L)) return;
                  b = L;
                }

                g(h, a, b);
                d[h] = a;
              });
              k.push(n);
              break;

            case "&":
              n || ta.call(c, m) || ra(m, f.name);
              t = c.hasOwnProperty(m) ? p(c[m]) : E;
              if (t === E && n) break;

              d[h] = function (b) {
                return t(a, b);
              };

          }
        });
        return {
          initialChanges: l,
          removeWatches: k.length && function () {
            for (var a = 0, b = k.length; a < b; ++a) {
              k[a]();
            }
          }
        };
      }

      var Ma = /^\w/,
          Fa = C.document.createElement("div"),
          Oa = t,
          Qa = N,
          Ja = G,
          Ua;
      w.prototype = {
        $normalize: wa,
        $addClass: function $addClass(a) {
          a && 0 < a.length && R.addClass(this.$$element, a);
        },
        $removeClass: function $removeClass(a) {
          a && 0 < a.length && R.removeClass(this.$$element, a);
        },
        $updateClass: function $updateClass(a, b) {
          var c = sd(a, b);
          c && c.length && R.addClass(this.$$element, c);
          (c = sd(b, a)) && c.length && R.removeClass(this.$$element, c);
        },
        $set: function $set(a, b, d, e) {
          var f = ld(this.$$element[0], a),
              g = td[a],
              h = a;
          f ? (this.$$element.prop(a, b), e = f) : g && (this[g] = b, h = g);
          this[a] = b;
          e ? this.$attr[a] = e : (e = this.$attr[a]) || (this.$attr[a] = e = Vc(a, "-"));
          "img" === ua(this.$$element) && "srcset" === a && (this[a] = b = ma(b, "$set('srcset', value)"));
          !1 !== d && (null === b || z(b) ? this.$$element.removeAttr(e) : Ma.test(e) ? f && !1 === b ? this.$$element.removeAttr(e) : this.$$element.attr(e, b) : O(this.$$element[0], e, b));
          (a = this.$$observers) && r(a[h], function (a) {
            try {
              a(b);
            } catch (d) {
              c(d);
            }
          });
        },
        $observe: function $observe(a, b) {
          var c = this,
              d = c.$$observers || (c.$$observers = T()),
              e = d[a] || (d[a] = []);
          e.push(b);
          L.$evalAsync(function () {
            e.$$inter || !c.hasOwnProperty(a) || z(c[a]) || b(c[a]);
          });
          return function () {
            cb(e, b);
          };
        }
      };
      var Ka = b.startSymbol(),
          La = b.endSymbol(),
          Na = "{{" === Ka && "}}" === La ? Ta : function (a) {
        return a.replace(/\{\{/g, Ka).replace(/}}/g, La);
      },
          Ra = /^ng(Attr|Prop|On)([A-Z].*)$/,
          Sa = /^(.+)Start$/;
      da.$$addBindingInfo = n ? function (a, b) {
        var c = a.data("$binding") || [];
        H(b) ? c = c.concat(b) : c.push(b);
        a.data("$binding", c);
      } : E;
      da.$$addBindingClass = n ? function (a) {
        sa(a, "ng-binding");
      } : E;
      da.$$addScopeInfo = n ? function (a, b, c, d) {
        a.data(c ? d ? "$isolateScopeNoTemplate" : "$isolateScope" : "$scope", b);
      } : E;
      da.$$addScopeClass = n ? function (a, b) {
        sa(a, b ? "ng-isolate-scope" : "ng-scope");
      } : E;

      da.$$createComment = function (a, b) {
        var c = "";
        n && (c = " " + (a || "") + ": ", b && (c += b + " "));
        return C.document.createComment(c);
      };

      return da;
    }];
  }

  function Jb(a, b) {
    this.previousValue = a;
    this.currentValue = b;
  }

  function wa(a) {
    return a.replace(pd, "").replace(Eg, function (a, d, c) {
      return c ? d.toUpperCase() : d;
    });
  }

  function sd(a, b) {
    var d = "",
        c = a.split(/\s+/),
        e = b.split(/\s+/),
        f = 0;

    a: for (; f < c.length; f++) {
      for (var g = c[f], k = 0; k < e.length; k++) {
        if (g === e[k]) continue a;
      }

      d += (0 < d.length ? " " : "") + g;
    }

    return d;
  }

  function rd(a) {
    a = x(a);
    var b = a.length;
    if (1 >= b) return a;

    for (; b--;) {
      var d = a[b];
      (8 === d.nodeType || d.nodeType === Pa && "" === d.nodeValue.trim()) && Fg.call(a, b, 1);
    }

    return a;
  }

  function Bg(a, b) {
    if (b && A(b)) return b;

    if (A(a)) {
      var d = ud.exec(a);
      if (d) return d[3];
    }
  }

  function Ff() {
    var a = {};

    this.has = function (b) {
      return a.hasOwnProperty(b);
    };

    this.register = function (b, d) {
      Ja(b, "controller");
      D(b) ? S(a, b) : a[b] = d;
    };

    this.$get = ["$injector", function (b) {
      function d(a, b, d, g) {
        if (!a || !D(a.$scope)) throw F("$controller")("noscp", g, b);
        a.$scope[b] = d;
      }

      return function (c, e, f, g) {
        var k, h, l;
        f = !0 === f;
        g && A(g) && (l = g);

        if (A(c)) {
          g = c.match(ud);
          if (!g) throw vd("ctrlfmt", c);
          h = g[1];
          l = l || g[3];
          c = a.hasOwnProperty(h) ? a[h] : Ge(e.$scope, h, !0);
          if (!c) throw vd("ctrlreg", h);
          sb(c, h, !0);
        }

        if (f) return f = (H(c) ? c[c.length - 1] : c).prototype, k = Object.create(f || null), l && d(e, l, k, h || c.name), S(function () {
          var a = b.invoke(c, k, e, h);
          a !== k && (D(a) || B(a)) && (k = a, l && d(e, l, k, h || c.name));
          return k;
        }, {
          instance: k,
          identifier: l
        });
        k = b.instantiate(c, e, h);
        l && d(e, l, k, h || c.name);
        return k;
      };
    }];
  }

  function Gf() {
    this.$get = ["$window", function (a) {
      return x(a.document);
    }];
  }

  function Hf() {
    this.$get = ["$document", "$rootScope", function (a, b) {
      function d() {
        e = c.hidden;
      }

      var c = a[0],
          e = c && c.hidden;
      a.on("visibilitychange", d);
      b.$on("$destroy", function () {
        a.off("visibilitychange", d);
      });
      return function () {
        return e;
      };
    }];
  }

  function If() {
    this.$get = ["$log", function (a) {
      return function (b, d) {
        a.error.apply(a, arguments);
      };
    }];
  }

  function uc(a) {
    return D(a) ? ha(a) ? a.toISOString() : eb(a) : a;
  }

  function Of() {
    this.$get = function () {
      return function (a) {
        if (!a) return "";
        var b = [];
        Oc(a, function (a, c) {
          null === a || z(a) || B(a) || (H(a) ? r(a, function (a) {
            b.push(ba(c) + "=" + ba(uc(a)));
          }) : b.push(ba(c) + "=" + ba(uc(a))));
        });
        return b.join("&");
      };
    };
  }

  function Pf() {
    this.$get = function () {
      return function (a) {
        function b(a, e, f) {
          H(a) ? r(a, function (a, c) {
            b(a, e + "[" + (D(a) ? c : "") + "]");
          }) : D(a) && !ha(a) ? Oc(a, function (a, c) {
            b(a, e + (f ? "" : "[") + c + (f ? "" : "]"));
          }) : (B(a) && (a = a()), d.push(ba(e) + "=" + (null == a ? "" : ba(uc(a)))));
        }

        if (!a) return "";
        var d = [];
        b(a, "", !0);
        return d.join("&");
      };
    };
  }

  function vc(a, b) {
    if (A(a)) {
      var d = a.replace(Gg, "").trim();

      if (d) {
        var c = b("Content-Type"),
            c = c && 0 === c.indexOf(wd),
            e;
        (e = c) || (e = (e = d.match(Hg)) && Ig[e[0]].test(d));
        if (e) try {
          a = Rc(d);
        } catch (f) {
          if (!c) return a;
          throw Kb("baddata", a, f);
        }
      }
    }

    return a;
  }

  function xd(a) {
    var b = T(),
        d;
    A(a) ? r(a.split("\n"), function (a) {
      d = a.indexOf(":");
      var e = K(U(a.substr(0, d)));
      a = U(a.substr(d + 1));
      e && (b[e] = b[e] ? b[e] + ", " + a : a);
    }) : D(a) && r(a, function (a, d) {
      var f = K(d),
          g = U(a);
      f && (b[f] = b[f] ? b[f] + ", " + g : g);
    });
    return b;
  }

  function yd(a) {
    var b;
    return function (d) {
      b || (b = xd(a));
      return d ? (d = b[K(d)], void 0 === d && (d = null), d) : b;
    };
  }

  function zd(a, b, d, c) {
    if (B(c)) return c(a, b, d);
    r(c, function (c) {
      a = c(a, b, d);
    });
    return a;
  }

  function Nf() {
    var a = this.defaults = {
      transformResponse: [vc],
      transformRequest: [function (a) {
        return D(a) && "[object File]" !== la.call(a) && "[object Blob]" !== la.call(a) && "[object FormData]" !== la.call(a) ? eb(a) : a;
      }],
      headers: {
        common: {
          Accept: "application/json, text/plain, */*"
        },
        post: ja(wc),
        put: ja(wc),
        patch: ja(wc)
      },
      xsrfCookieName: "XSRF-TOKEN",
      xsrfHeaderName: "X-XSRF-TOKEN",
      paramSerializer: "$httpParamSerializer",
      jsonpCallbackParam: "callback"
    },
        b = !1;

    this.useApplyAsync = function (a) {
      return w(a) ? (b = !!a, this) : b;
    };

    var d = this.interceptors = [],
        c = this.xsrfWhitelistedOrigins = [];
    this.$get = ["$browser", "$httpBackend", "$$cookieReader", "$cacheFactory", "$rootScope", "$q", "$injector", "$sce", function (e, f, g, k, h, l, m, p) {
      function n(b) {
        function c(a, b) {
          for (var d = 0, e = b.length; d < e;) {
            var f = b[d++],
                g = b[d++];
            a = a.then(f, g);
          }

          b.length = 0;
          return a;
        }

        function d(a, b) {
          var c,
              e = {};
          r(a, function (a, d) {
            B(a) ? (c = a(b), null != c && (e[d] = c)) : e[d] = a;
          });
          return e;
        }

        function f(a) {
          var b = S({}, a);
          b.data = zd(a.data, a.headers, a.status, g.transformResponse);
          a = a.status;
          return 200 <= a && 300 > a ? b : l.reject(b);
        }

        if (!D(b)) throw F("$http")("badreq", b);
        if (!A(p.valueOf(b.url))) throw F("$http")("badreq", b.url);
        var g = S({
          method: "get",
          transformRequest: a.transformRequest,
          transformResponse: a.transformResponse,
          paramSerializer: a.paramSerializer,
          jsonpCallbackParam: a.jsonpCallbackParam
        }, b);

        g.headers = function (b) {
          var c = a.headers,
              e = S({}, b.headers),
              f,
              g,
              h,
              c = S({}, c.common, c[K(b.method)]);

          a: for (f in c) {
            g = K(f);

            for (h in e) {
              if (K(h) === g) continue a;
            }

            e[f] = c[f];
          }

          return d(e, ja(b));
        }(b);

        g.method = ub(g.method);
        g.paramSerializer = A(g.paramSerializer) ? m.get(g.paramSerializer) : g.paramSerializer;
        e.$$incOutstandingRequestCount("$http");
        var h = [],
            k = [];
        b = l.resolve(g);
        r(v, function (a) {
          (a.request || a.requestError) && h.unshift(a.request, a.requestError);
          (a.response || a.responseError) && k.push(a.response, a.responseError);
        });
        b = c(b, h);
        b = b.then(function (b) {
          var c = b.headers,
              d = zd(b.data, yd(c), void 0, b.transformRequest);
          z(d) && r(c, function (a, b) {
            "content-type" === K(b) && delete c[b];
          });
          z(b.withCredentials) && !z(a.withCredentials) && (b.withCredentials = a.withCredentials);
          return s(b, d).then(f, f);
        });
        b = c(b, k);
        return b = b["finally"](function () {
          e.$$completeOutstandingRequest(E, "$http");
        });
      }

      function s(c, d) {
        function e(a) {
          if (a) {
            var c = {};
            r(a, function (a, d) {
              c[d] = function (c) {
                function d() {
                  a(c);
                }

                b ? h.$applyAsync(d) : h.$$phase ? d() : h.$apply(d);
              };
            });
            return c;
          }
        }

        function k(a, c, d, e, f) {
          function g() {
            m(c, a, d, e, f);
          }

          R && (200 <= a && 300 > a ? R.put(O, [a, c, xd(d), e, f]) : R.remove(O));
          b ? h.$applyAsync(g) : (g(), h.$$phase || h.$apply());
        }

        function m(a, b, d, e, f) {
          b = -1 <= b ? b : 0;
          (200 <= b && 300 > b ? L.resolve : L.reject)({
            data: a,
            status: b,
            headers: yd(d),
            config: c,
            statusText: e,
            xhrStatus: f
          });
        }

        function s(a) {
          m(a.data, a.status, ja(a.headers()), a.statusText, a.xhrStatus);
        }

        function v() {
          var a = n.pendingRequests.indexOf(c);
          -1 !== a && n.pendingRequests.splice(a, 1);
        }

        var L = l.defer(),
            u = L.promise,
            R,
            q,
            ma = c.headers,
            x = "jsonp" === K(c.method),
            O = c.url;
        x ? O = p.getTrustedResourceUrl(O) : A(O) || (O = p.valueOf(O));
        O = G(O, c.paramSerializer(c.params));
        x && (O = t(O, c.jsonpCallbackParam));
        n.pendingRequests.push(c);
        u.then(v, v);
        !c.cache && !a.cache || !1 === c.cache || "GET" !== c.method && "JSONP" !== c.method || (R = D(c.cache) ? c.cache : D(a.cache) ? a.cache : N);
        R && (q = R.get(O), w(q) ? q && B(q.then) ? q.then(s, s) : H(q) ? m(q[1], q[0], ja(q[2]), q[3], q[4]) : m(q, 200, {}, "OK", "complete") : R.put(O, u));
        z(q) && ((q = jc(c.url) ? g()[c.xsrfCookieName || a.xsrfCookieName] : void 0) && (ma[c.xsrfHeaderName || a.xsrfHeaderName] = q), f(c.method, O, d, k, ma, c.timeout, c.withCredentials, c.responseType, e(c.eventHandlers), e(c.uploadEventHandlers)));
        return u;
      }

      function G(a, b) {
        0 < b.length && (a += (-1 === a.indexOf("?") ? "?" : "&") + b);
        return a;
      }

      function t(a, b) {
        var c = a.split("?");
        if (2 < c.length) throw Kb("badjsonp", a);
        c = gc(c[1]);
        r(c, function (c, d) {
          if ("JSON_CALLBACK" === c) throw Kb("badjsonp", a);
          if (d === b) throw Kb("badjsonp", b, a);
        });
        return a += (-1 === a.indexOf("?") ? "?" : "&") + b + "=JSON_CALLBACK";
      }

      var N = k("$http");
      a.paramSerializer = A(a.paramSerializer) ? m.get(a.paramSerializer) : a.paramSerializer;
      var v = [];
      r(d, function (a) {
        v.unshift(A(a) ? m.get(a) : m.invoke(a));
      });
      var jc = Jg(c);
      n.pendingRequests = [];

      (function (a) {
        r(arguments, function (a) {
          n[a] = function (b, c) {
            return n(S({}, c || {}, {
              method: a,
              url: b
            }));
          };
        });
      })("get", "delete", "head", "jsonp");

      (function (a) {
        r(arguments, function (a) {
          n[a] = function (b, c, d) {
            return n(S({}, d || {}, {
              method: a,
              url: b,
              data: c
            }));
          };
        });
      })("post", "put", "patch");

      n.defaults = a;
      return n;
    }];
  }

  function Rf() {
    this.$get = function () {
      return function () {
        return new C.XMLHttpRequest();
      };
    };
  }

  function Qf() {
    this.$get = ["$browser", "$jsonpCallbacks", "$document", "$xhrFactory", function (a, b, d, c) {
      return Kg(a, c, a.defer, b, d[0]);
    }];
  }

  function Kg(a, b, d, c, e) {
    function f(a, b, d) {
      a = a.replace("JSON_CALLBACK", b);
      var f = e.createElement("script"),
          _m = null;
      f.type = "text/javascript";
      f.src = a;
      f.async = !0;

      _m = function m(a) {
        f.removeEventListener("load", _m);
        f.removeEventListener("error", _m);
        e.body.removeChild(f);
        f = null;
        var g = -1,
            s = "unknown";
        a && ("load" !== a.type || c.wasCalled(b) || (a = {
          type: "error"
        }), s = a.type, g = "error" === a.type ? 404 : 200);
        d && d(g, s);
      };

      f.addEventListener("load", _m);
      f.addEventListener("error", _m);
      e.body.appendChild(f);
      return _m;
    }

    return function (e, k, h, l, m, p, n, s, G, t) {
      function N(a) {
        J = "timeout" === a;
        qa && qa();
        y && y.abort();
      }

      function v(a, b, c, e, f, g) {
        w(P) && d.cancel(P);
        qa = y = null;
        a(b, c, e, f, g);
      }

      k = k || a.url();
      if ("jsonp" === K(e)) var q = c.createCallback(k),
          qa = f(k, q, function (a, b) {
        var d = 200 === a && c.getResponse(q);
        v(l, a, d, "", b, "complete");
        c.removeCallback(q);
      });else {
        var y = b(e, k),
            J = !1;
        y.open(e, k, !0);
        r(m, function (a, b) {
          w(a) && y.setRequestHeader(b, a);
        });

        y.onload = function () {
          var a = y.statusText || "",
              b = "response" in y ? y.response : y.responseText,
              c = 1223 === y.status ? 204 : y.status;
          0 === c && (c = b ? 200 : "file" === ga(k).protocol ? 404 : 0);
          v(l, c, b, y.getAllResponseHeaders(), a, "complete");
        };

        y.onerror = function () {
          v(l, -1, null, null, "", "error");
        };

        y.ontimeout = function () {
          v(l, -1, null, null, "", "timeout");
        };

        y.onabort = function () {
          v(l, -1, null, null, "", J ? "timeout" : "abort");
        };

        r(G, function (a, b) {
          y.addEventListener(b, a);
        });
        r(t, function (a, b) {
          y.upload.addEventListener(b, a);
        });
        n && (y.withCredentials = !0);
        if (s) try {
          y.responseType = s;
        } catch (I) {
          if ("json" !== s) throw I;
        }
        y.send(z(h) ? null : h);
      }
      if (0 < p) var P = d(function () {
        N("timeout");
      }, p);else p && B(p.then) && p.then(function () {
        N(w(p.$$timeoutId) ? "timeout" : "abort");
      });
    };
  }

  function Kf() {
    var a = "{{",
        b = "}}";

    this.startSymbol = function (b) {
      return b ? (a = b, this) : a;
    };

    this.endSymbol = function (a) {
      return a ? (b = a, this) : b;
    };

    this.$get = ["$parse", "$exceptionHandler", "$sce", function (d, c, e) {
      function f(a) {
        return "\\\\\\" + a;
      }

      function g(c) {
        return c.replace(p, a).replace(n, b);
      }

      function k(a, b, c, d) {
        var e = a.$watch(function (a) {
          e();
          return d(a);
        }, b, c);
        return e;
      }

      function h(f, h, n, p) {
        function v(a) {
          try {
            return a = n && !r ? e.getTrusted(n, a) : e.valueOf(a), p && !w(a) ? a : ic(a);
          } catch (b) {
            c(Ma.interr(f, b));
          }
        }

        var r = n === e.URL || n === e.MEDIA_URL;

        if (!f.length || -1 === f.indexOf(a)) {
          if (h) return;
          h = g(f);
          r && (h = e.getTrusted(n, h));
          h = ia(h);
          h.exp = f;
          h.expressions = [];
          h.$$watchDelegate = k;
          return h;
        }

        p = !!p;

        for (var q, y, J = 0, I = [], P, Q = f.length, M = [], L = [], u; J < Q;) {
          if (-1 !== (q = f.indexOf(a, J)) && -1 !== (y = f.indexOf(b, q + l))) J !== q && M.push(g(f.substring(J, q))), J = f.substring(q + l, y), I.push(J), J = y + m, L.push(M.length), M.push("");else {
            J !== Q && M.push(g(f.substring(J)));
            break;
          }
        }

        u = 1 === M.length && 1 === L.length;
        var R = r && u ? void 0 : v;
        P = I.map(function (a) {
          return d(a, R);
        });

        if (!h || I.length) {
          var x = function x(a) {
            for (var b = 0, c = I.length; b < c; b++) {
              if (p && z(a[b])) return;
              M[L[b]] = a[b];
            }

            if (r) return e.getTrusted(n, u ? M[0] : M.join(""));
            n && 1 < M.length && Ma.throwNoconcat(f);
            return M.join("");
          };

          return S(function (a) {
            var b = 0,
                d = I.length,
                e = Array(d);

            try {
              for (; b < d; b++) {
                e[b] = P[b](a);
              }

              return x(e);
            } catch (g) {
              c(Ma.interr(f, g));
            }
          }, {
            exp: f,
            expressions: I,
            $$watchDelegate: function $$watchDelegate(a, b) {
              var c;
              return a.$watchGroup(P, function (d, e) {
                var f = x(d);
                b.call(this, f, d !== e ? c : f, a);
                c = f;
              });
            }
          });
        }
      }

      var l = a.length,
          m = b.length,
          p = new RegExp(a.replace(/./g, f), "g"),
          n = new RegExp(b.replace(/./g, f), "g");

      h.startSymbol = function () {
        return a;
      };

      h.endSymbol = function () {
        return b;
      };

      return h;
    }];
  }

  function Lf() {
    this.$get = ["$$intervalFactory", "$window", function (a, b) {
      var d = {},
          c = function c(a) {
        b.clearInterval(a);
        delete d[a];
      },
          e = a(function (a, c, e) {
        a = b.setInterval(a, c);
        d[a] = e;
        return a;
      }, c);

      e.cancel = function (a) {
        if (!a) return !1;
        if (!a.hasOwnProperty("$$intervalId")) throw Lg("badprom");
        if (!d.hasOwnProperty(a.$$intervalId)) return !1;
        a = a.$$intervalId;
        var b = d[a],
            e = b.promise;
        e.$$state && (e.$$state.pur = !0);
        b.reject("canceled");
        c(a);
        return !0;
      };

      return e;
    }];
  }

  function Mf() {
    this.$get = ["$browser", "$q", "$$q", "$rootScope", function (a, b, d, c) {
      return function (e, f) {
        return function (g, k, h, l) {
          function m() {
            p ? g.apply(null, n) : g(s);
          }

          var p = 4 < arguments.length,
              n = p ? Ha.call(arguments, 4) : [],
              s = 0,
              G = w(l) && !l,
              t = (G ? d : b).defer(),
              r = t.promise;
          h = w(h) ? h : 0;
          r.$$intervalId = e(function () {
            G ? a.defer(m) : c.$evalAsync(m);
            t.notify(s++);
            0 < h && s >= h && (t.resolve(s), f(r.$$intervalId));
            G || c.$apply();
          }, k, t, G);
          return r;
        };
      };
    }];
  }

  function Ad(a, b) {
    var d = ga(a);
    b.$$protocol = d.protocol;
    b.$$host = d.hostname;
    b.$$port = fa(d.port) || Mg[d.protocol] || null;
  }

  function Bd(a, b, d) {
    if (Ng.test(a)) throw jb("badpath", a);
    var c = "/" !== a.charAt(0);
    c && (a = "/" + a);
    a = ga(a);

    for (var c = (c && "/" === a.pathname.charAt(0) ? a.pathname.substring(1) : a.pathname).split("/"), e = c.length; e--;) {
      c[e] = decodeURIComponent(c[e]), d && (c[e] = c[e].replace(/\//g, "%2F"));
    }

    d = c.join("/");
    b.$$path = d;
    b.$$search = gc(a.search);
    b.$$hash = decodeURIComponent(a.hash);
    b.$$path && "/" !== b.$$path.charAt(0) && (b.$$path = "/" + b.$$path);
  }

  function xc(a, b) {
    return a.slice(0, b.length) === b;
  }

  function xa(a, b) {
    if (xc(b, a)) return b.substr(a.length);
  }

  function Da(a) {
    var b = a.indexOf("#");
    return -1 === b ? a : a.substr(0, b);
  }

  function yc(a, b, d) {
    this.$$html5 = !0;
    d = d || "";
    Ad(a, this);

    this.$$parse = function (a) {
      var d = xa(b, a);
      if (!A(d)) throw jb("ipthprfx", a, b);
      Bd(d, this, !0);
      this.$$path || (this.$$path = "/");
      this.$$compose();
    };

    this.$$normalizeUrl = function (a) {
      return b + a.substr(1);
    };

    this.$$parseLinkUrl = function (c, e) {
      if (e && "#" === e[0]) return this.hash(e.slice(1)), !0;
      var f, g;
      w(f = xa(a, c)) ? (g = f, g = d && w(f = xa(d, f)) ? b + (xa("/", f) || f) : a + g) : w(f = xa(b, c)) ? g = b + f : b === c + "/" && (g = b);
      g && this.$$parse(g);
      return !!g;
    };
  }

  function zc(a, b, d) {
    Ad(a, this);

    this.$$parse = function (c) {
      var e = xa(a, c) || xa(b, c),
          f;
      z(e) || "#" !== e.charAt(0) ? this.$$html5 ? f = e : (f = "", z(e) && (a = c, this.replace())) : (f = xa(d, e), z(f) && (f = e));
      Bd(f, this, !1);
      c = this.$$path;
      var e = a,
          g = /^\/[A-Z]:(\/.*)/;
      xc(f, e) && (f = f.replace(e, ""));
      g.exec(f) || (c = (f = g.exec(c)) ? f[1] : c);
      this.$$path = c;
      this.$$compose();
    };

    this.$$normalizeUrl = function (b) {
      return a + (b ? d + b : "");
    };

    this.$$parseLinkUrl = function (b, d) {
      return Da(a) === Da(b) ? (this.$$parse(b), !0) : !1;
    };
  }

  function Cd(a, b, d) {
    this.$$html5 = !0;
    zc.apply(this, arguments);

    this.$$parseLinkUrl = function (c, e) {
      if (e && "#" === e[0]) return this.hash(e.slice(1)), !0;
      var f, g;
      a === Da(c) ? f = c : (g = xa(b, c)) ? f = a + d + g : b === c + "/" && (f = b);
      f && this.$$parse(f);
      return !!f;
    };

    this.$$normalizeUrl = function (b) {
      return a + d + b;
    };
  }

  function Lb(a) {
    return function () {
      return this[a];
    };
  }

  function Dd(a, b) {
    return function (d) {
      if (z(d)) return this[a];
      this[a] = b(d);
      this.$$compose();
      return this;
    };
  }

  function Tf() {
    var a = "!",
        b = {
      enabled: !1,
      requireBase: !0,
      rewriteLinks: !0
    };

    this.hashPrefix = function (b) {
      return w(b) ? (a = b, this) : a;
    };

    this.html5Mode = function (a) {
      if (Ga(a)) return b.enabled = a, this;

      if (D(a)) {
        Ga(a.enabled) && (b.enabled = a.enabled);
        Ga(a.requireBase) && (b.requireBase = a.requireBase);
        if (Ga(a.rewriteLinks) || A(a.rewriteLinks)) b.rewriteLinks = a.rewriteLinks;
        return this;
      }

      return b;
    };

    this.$get = ["$rootScope", "$browser", "$sniffer", "$rootElement", "$window", function (d, c, e, f, g) {
      function k(a, b) {
        return a === b || ga(a).href === ga(b).href;
      }

      function h(a, b, d) {
        var e = m.url(),
            f = m.$$state;

        try {
          c.url(a, b, d), m.$$state = c.state();
        } catch (g) {
          throw m.url(e), m.$$state = f, g;
        }
      }

      function l(a, b) {
        d.$broadcast("$locationChangeSuccess", m.absUrl(), a, m.$$state, b);
      }

      var m, p;
      p = c.baseHref();
      var n = c.url(),
          s;

      if (b.enabled) {
        if (!p && b.requireBase) throw jb("nobase");
        s = n.substring(0, n.indexOf("/", n.indexOf("//") + 2)) + (p || "/");
        p = e.history ? yc : Cd;
      } else s = Da(n), p = zc;

      var r = s.substr(0, Da(s).lastIndexOf("/") + 1);
      m = new p(s, r, "#" + a);
      m.$$parseLinkUrl(n, n);
      m.$$state = c.state();
      var t = /^\s*(javascript|mailto):/i;
      f.on("click", function (a) {
        var e = b.rewriteLinks;

        if (e && !a.ctrlKey && !a.metaKey && !a.shiftKey && 2 !== a.which && 2 !== a.button) {
          for (var g = x(a.target); "a" !== ua(g[0]);) {
            if (g[0] === f[0] || !(g = g.parent())[0]) return;
          }

          if (!A(e) || !z(g.attr(e))) {
            var e = g.prop("href"),
                h = g.attr("href") || g.attr("xlink:href");
            D(e) && "[object SVGAnimatedString]" === e.toString() && (e = ga(e.animVal).href);
            t.test(e) || !e || g.attr("target") || a.isDefaultPrevented() || !m.$$parseLinkUrl(e, h) || (a.preventDefault(), m.absUrl() !== c.url() && d.$apply());
          }
        }
      });
      m.absUrl() !== n && c.url(m.absUrl(), !0);
      var N = !0;
      c.onUrlChange(function (a, b) {
        xc(a, r) ? (d.$evalAsync(function () {
          var c = m.absUrl(),
              e = m.$$state,
              f;
          m.$$parse(a);
          m.$$state = b;
          f = d.$broadcast("$locationChangeStart", a, c, b, e).defaultPrevented;
          m.absUrl() === a && (f ? (m.$$parse(c), m.$$state = e, h(c, !1, e)) : (N = !1, l(c, e)));
        }), d.$$phase || d.$digest()) : g.location.href = a;
      });
      d.$watch(function () {
        if (N || m.$$urlUpdatedByLocation) {
          m.$$urlUpdatedByLocation = !1;
          var a = c.url(),
              b = m.absUrl(),
              f = c.state(),
              g = m.$$replace,
              n = !k(a, b) || m.$$html5 && e.history && f !== m.$$state;
          if (N || n) N = !1, d.$evalAsync(function () {
            var b = m.absUrl(),
                c = d.$broadcast("$locationChangeStart", b, a, m.$$state, f).defaultPrevented;
            m.absUrl() === b && (c ? (m.$$parse(a), m.$$state = f) : (n && h(b, g, f === m.$$state ? null : m.$$state), l(a, f)));
          });
        }

        m.$$replace = !1;
      });
      return m;
    }];
  }

  function Uf() {
    var a = !0,
        b = this;

    this.debugEnabled = function (b) {
      return w(b) ? (a = b, this) : a;
    };

    this.$get = ["$window", function (d) {
      function c(a) {
        cc(a) && (a.stack && f ? a = a.message && -1 === a.stack.indexOf(a.message) ? "Error: " + a.message + "\n" + a.stack : a.stack : a.sourceURL && (a = a.message + "\n" + a.sourceURL + ":" + a.line));
        return a;
      }

      function e(a) {
        var b = d.console || {},
            e = b[a] || b.log || E;
        return function () {
          var a = [];
          r(arguments, function (b) {
            a.push(c(b));
          });
          return Function.prototype.apply.call(e, b, a);
        };
      }

      var f = Ca || /\bEdge\//.test(d.navigator && d.navigator.userAgent);
      return {
        log: e("log"),
        info: e("info"),
        warn: e("warn"),
        error: e("error"),
        debug: function () {
          var c = e("debug");
          return function () {
            a && c.apply(b, arguments);
          };
        }()
      };
    }];
  }

  function Og(a) {
    return a + "";
  }

  function Pg(a, b) {
    return "undefined" !== typeof a ? a : b;
  }

  function Ed(a, b) {
    return "undefined" === typeof a ? b : "undefined" === typeof b ? a : a + b;
  }

  function Qg(a, b) {
    switch (a.type) {
      case q.MemberExpression:
        if (a.computed) return !1;
        break;

      case q.UnaryExpression:
        return 1;

      case q.BinaryExpression:
        return "+" !== a.operator ? 1 : !1;

      case q.CallExpression:
        return !1;
    }

    return void 0 === b ? Fd : b;
  }

  function Z(a, b, d) {
    var c,
        e,
        f = a.isPure = Qg(a, d);

    switch (a.type) {
      case q.Program:
        c = !0;
        r(a.body, function (a) {
          Z(a.expression, b, f);
          c = c && a.expression.constant;
        });
        a.constant = c;
        break;

      case q.Literal:
        a.constant = !0;
        a.toWatch = [];
        break;

      case q.UnaryExpression:
        Z(a.argument, b, f);
        a.constant = a.argument.constant;
        a.toWatch = a.argument.toWatch;
        break;

      case q.BinaryExpression:
        Z(a.left, b, f);
        Z(a.right, b, f);
        a.constant = a.left.constant && a.right.constant;
        a.toWatch = a.left.toWatch.concat(a.right.toWatch);
        break;

      case q.LogicalExpression:
        Z(a.left, b, f);
        Z(a.right, b, f);
        a.constant = a.left.constant && a.right.constant;
        a.toWatch = a.constant ? [] : [a];
        break;

      case q.ConditionalExpression:
        Z(a.test, b, f);
        Z(a.alternate, b, f);
        Z(a.consequent, b, f);
        a.constant = a.test.constant && a.alternate.constant && a.consequent.constant;
        a.toWatch = a.constant ? [] : [a];
        break;

      case q.Identifier:
        a.constant = !1;
        a.toWatch = [a];
        break;

      case q.MemberExpression:
        Z(a.object, b, f);
        a.computed && Z(a.property, b, f);
        a.constant = a.object.constant && (!a.computed || a.property.constant);
        a.toWatch = a.constant ? [] : [a];
        break;

      case q.CallExpression:
        c = d = a.filter ? !b(a.callee.name).$stateful : !1;
        e = [];
        r(a.arguments, function (a) {
          Z(a, b, f);
          c = c && a.constant;
          e.push.apply(e, a.toWatch);
        });
        a.constant = c;
        a.toWatch = d ? e : [a];
        break;

      case q.AssignmentExpression:
        Z(a.left, b, f);
        Z(a.right, b, f);
        a.constant = a.left.constant && a.right.constant;
        a.toWatch = [a];
        break;

      case q.ArrayExpression:
        c = !0;
        e = [];
        r(a.elements, function (a) {
          Z(a, b, f);
          c = c && a.constant;
          e.push.apply(e, a.toWatch);
        });
        a.constant = c;
        a.toWatch = e;
        break;

      case q.ObjectExpression:
        c = !0;
        e = [];
        r(a.properties, function (a) {
          Z(a.value, b, f);
          c = c && a.value.constant;
          e.push.apply(e, a.value.toWatch);
          a.computed && (Z(a.key, b, !1), c = c && a.key.constant, e.push.apply(e, a.key.toWatch));
        });
        a.constant = c;
        a.toWatch = e;
        break;

      case q.ThisExpression:
        a.constant = !1;
        a.toWatch = [];
        break;

      case q.LocalsExpression:
        a.constant = !1, a.toWatch = [];
    }
  }

  function Gd(a) {
    if (1 === a.length) {
      a = a[0].expression;
      var b = a.toWatch;
      return 1 !== b.length ? b : b[0] !== a ? b : void 0;
    }
  }

  function Hd(a) {
    return a.type === q.Identifier || a.type === q.MemberExpression;
  }

  function Id(a) {
    if (1 === a.body.length && Hd(a.body[0].expression)) return {
      type: q.AssignmentExpression,
      left: a.body[0].expression,
      right: {
        type: q.NGValueParameter
      },
      operator: "="
    };
  }

  function Jd(a) {
    this.$filter = a;
  }

  function Kd(a) {
    this.$filter = a;
  }

  function Mb(a, b, d) {
    this.ast = new q(a, d);
    this.astCompiler = d.csp ? new Kd(b) : new Jd(b);
  }

  function Ac(a) {
    return B(a.valueOf) ? a.valueOf() : Rg.call(a);
  }

  function Vf() {
    var a = T(),
        b = {
      "true": !0,
      "false": !1,
      "null": null,
      undefined: void 0
    },
        d,
        c;

    this.addLiteral = function (a, c) {
      b[a] = c;
    };

    this.setIdentifierFns = function (a, b) {
      d = a;
      c = b;
      return this;
    };

    this.$get = ["$filter", function (e) {
      function f(b, c) {
        var d, f;

        switch (_typeof(b)) {
          case "string":
            return f = b = b.trim(), d = a[f], d || (d = new Nb(G), d = new Mb(d, e, G).parse(b), a[f] = p(d)), s(d, c);

          case "function":
            return s(b, c);

          default:
            return s(E, c);
        }
      }

      function g(a, b, c) {
        return null == a || null == b ? a === b : "object" !== _typeof(a) || (a = Ac(a), "object" !== _typeof(a) || c) ? a === b || a !== a && b !== b : !1;
      }

      function k(a, b, c, d, e) {
        var f = d.inputs,
            h;

        if (1 === f.length) {
          var k = g,
              f = f[0];
          return a.$watch(function (a) {
            var b = f(a);
            g(b, k, f.isPure) || (h = d(a, void 0, void 0, [b]), k = b && Ac(b));
            return h;
          }, b, c, e);
        }

        for (var l = [], m = [], n = 0, p = f.length; n < p; n++) {
          l[n] = g, m[n] = null;
        }

        return a.$watch(function (a) {
          for (var b = !1, c = 0, e = f.length; c < e; c++) {
            var k = f[c](a);
            if (b || (b = !g(k, l[c], f[c].isPure))) m[c] = k, l[c] = k && Ac(k);
          }

          b && (h = d(a, void 0, void 0, m));
          return h;
        }, b, c, e);
      }

      function h(a, b, c, d, e) {
        function f() {
          h(m) && k();
        }

        function g(a, b, c, d) {
          m = u && d ? d[0] : n(a, b, c, d);
          h(m) && a.$$postDigest(f);
          return s(m);
        }

        var h = d.literal ? l : w,
            k,
            m,
            n = d.$$intercepted || d,
            s = d.$$interceptor || Ta,
            u = d.inputs && !n.inputs;
        g.literal = d.literal;
        g.constant = d.constant;
        g.inputs = d.inputs;
        p(g);
        return k = a.$watch(g, b, c, e);
      }

      function l(a) {
        var b = !0;
        r(a, function (a) {
          w(a) || (b = !1);
        });
        return b;
      }

      function m(a, b, c, d) {
        var e = a.$watch(function (a) {
          e();
          return d(a);
        }, b, c);
        return e;
      }

      function p(a) {
        a.constant ? a.$$watchDelegate = m : a.oneTime ? a.$$watchDelegate = h : a.inputs && (a.$$watchDelegate = k);
        return a;
      }

      function n(a, b) {
        function c(d) {
          return b(a(d));
        }

        c.$stateful = a.$stateful || b.$stateful;
        c.$$pure = a.$$pure && b.$$pure;
        return c;
      }

      function s(a, b) {
        if (!b) return a;
        a.$$interceptor && (b = n(a.$$interceptor, b), a = a.$$intercepted);

        var c = !1,
            d = function d(_d2, e, f, g) {
          _d2 = c && g ? g[0] : a(_d2, e, f, g);
          return b(_d2);
        };

        d.$$intercepted = a;
        d.$$interceptor = b;
        d.literal = a.literal;
        d.oneTime = a.oneTime;
        d.constant = a.constant;
        b.$stateful || (c = !a.inputs, d.inputs = a.inputs ? a.inputs : [a], b.$$pure || (d.inputs = d.inputs.map(function (a) {
          return a.isPure === Fd ? function (b) {
            return a(b);
          } : a;
        })));
        return p(d);
      }

      var G = {
        csp: Aa().noUnsafeEval,
        literals: Ia(b),
        isIdentifierStart: B(d) && d,
        isIdentifierContinue: B(c) && c
      };

      f.$$getAst = function (a) {
        var b = new Nb(G);
        return new Mb(b, e, G).getAst(a).ast;
      };

      return f;
    }];
  }

  function Xf() {
    var a = !0;
    this.$get = ["$rootScope", "$exceptionHandler", function (b, d) {
      return Ld(function (a) {
        b.$evalAsync(a);
      }, d, a);
    }];

    this.errorOnUnhandledRejections = function (b) {
      return w(b) ? (a = b, this) : a;
    };
  }

  function Yf() {
    var a = !0;
    this.$get = ["$browser", "$exceptionHandler", function (b, d) {
      return Ld(function (a) {
        b.defer(a);
      }, d, a);
    }];

    this.errorOnUnhandledRejections = function (b) {
      return w(b) ? (a = b, this) : a;
    };
  }

  function Ld(a, b, d) {
    function c() {
      return new e();
    }

    function e() {
      var a = this.promise = new f();

      this.resolve = function (b) {
        h(a, b);
      };

      this.reject = function (b) {
        m(a, b);
      };

      this.notify = function (b) {
        n(a, b);
      };
    }

    function f() {
      this.$$state = {
        status: 0
      };
    }

    function g() {
      for (; !w && x.length;) {
        var a = x.shift();

        if (!a.pur) {
          a.pur = !0;
          var c = a.value,
              c = "Possibly unhandled rejection: " + ("function" === typeof c ? c.toString().replace(/ \{[\s\S]*$/, "") : z(c) ? "undefined" : "string" !== typeof c ? Ie(c, void 0) : c);
          cc(a.value) ? b(a.value, c) : b(c);
        }
      }
    }

    function k(c) {
      !d || c.pending || 2 !== c.status || c.pur || (0 === w && 0 === x.length && a(g), x.push(c));
      !c.processScheduled && c.pending && (c.processScheduled = !0, ++w, a(function () {
        var e, f, k;
        k = c.pending;
        c.processScheduled = !1;
        c.pending = void 0;

        try {
          for (var l = 0, n = k.length; l < n; ++l) {
            c.pur = !0;
            f = k[l][0];
            e = k[l][c.status];

            try {
              B(e) ? h(f, e(c.value)) : 1 === c.status ? h(f, c.value) : m(f, c.value);
            } catch (p) {
              m(f, p), p && !0 === p.$$passToExceptionHandler && b(p);
            }
          }
        } finally {
          --w, d && 0 === w && a(g);
        }
      }));
    }

    function h(a, b) {
      a.$$state.status || (b === a ? p(a, v("qcycle", b)) : l(a, b));
    }

    function l(a, b) {
      function c(b) {
        g || (g = !0, l(a, b));
      }

      function d(b) {
        g || (g = !0, p(a, b));
      }

      function e(b) {
        n(a, b);
      }

      var f,
          g = !1;

      try {
        if (D(b) || B(b)) f = b.then;
        B(f) ? (a.$$state.status = -1, f.call(b, c, d, e)) : (a.$$state.value = b, a.$$state.status = 1, k(a.$$state));
      } catch (h) {
        d(h);
      }
    }

    function m(a, b) {
      a.$$state.status || p(a, b);
    }

    function p(a, b) {
      a.$$state.value = b;
      a.$$state.status = 2;
      k(a.$$state);
    }

    function n(c, d) {
      var e = c.$$state.pending;
      0 >= c.$$state.status && e && e.length && a(function () {
        for (var a, c, f = 0, g = e.length; f < g; f++) {
          c = e[f][0];
          a = e[f][3];

          try {
            n(c, B(a) ? a(d) : d);
          } catch (h) {
            b(h);
          }
        }
      });
    }

    function s(a) {
      var b = new f();
      m(b, a);
      return b;
    }

    function G(a, b, c) {
      var d = null;

      try {
        B(c) && (d = c());
      } catch (e) {
        return s(e);
      }

      return d && B(d.then) ? d.then(function () {
        return b(a);
      }, s) : b(a);
    }

    function t(a, b, c, d) {
      var e = new f();
      h(e, a);
      return e.then(b, c, d);
    }

    function q(a) {
      if (!B(a)) throw v("norslvr", a);
      var b = new f();
      a(function (a) {
        h(b, a);
      }, function (a) {
        m(b, a);
      });
      return b;
    }

    var v = F("$q", TypeError),
        w = 0,
        x = [];
    S(f.prototype, {
      then: function then(a, b, c) {
        if (z(a) && z(b) && z(c)) return this;
        var d = new f();
        this.$$state.pending = this.$$state.pending || [];
        this.$$state.pending.push([d, a, b, c]);
        0 < this.$$state.status && k(this.$$state);
        return d;
      },
      "catch": function _catch(a) {
        return this.then(null, a);
      },
      "finally": function _finally(a, b) {
        return this.then(function (b) {
          return G(b, y, a);
        }, function (b) {
          return G(b, s, a);
        }, b);
      }
    });
    var y = t;
    q.prototype = f.prototype;
    q.defer = c;
    q.reject = s;
    q.when = t;
    q.resolve = y;

    q.all = function (a) {
      var b = new f(),
          c = 0,
          d = H(a) ? [] : {};
      r(a, function (a, e) {
        c++;
        t(a).then(function (a) {
          d[e] = a;
          --c || h(b, d);
        }, function (a) {
          m(b, a);
        });
      });
      0 === c && h(b, d);
      return b;
    };

    q.race = function (a) {
      var b = c();
      r(a, function (a) {
        t(a).then(b.resolve, b.reject);
      });
      return b.promise;
    };

    return q;
  }

  function hg() {
    this.$get = ["$window", "$timeout", function (a, b) {
      var d = a.requestAnimationFrame || a.webkitRequestAnimationFrame,
          c = a.cancelAnimationFrame || a.webkitCancelAnimationFrame || a.webkitCancelRequestAnimationFrame,
          e = !!d,
          f = e ? function (a) {
        var b = d(a);
        return function () {
          c(b);
        };
      } : function (a) {
        var c = b(a, 16.66, !1);
        return function () {
          b.cancel(c);
        };
      };
      f.supported = e;
      return f;
    }];
  }

  function Wf() {
    function a(a) {
      function b() {
        this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;
        this.$$listeners = {};
        this.$$listenerCount = {};
        this.$$watchersCount = 0;
        this.$id = ++pb;
        this.$$ChildScope = null;
        this.$$suspended = !1;
      }

      b.prototype = a;
      return b;
    }

    var b = 10,
        d = F("$rootScope"),
        c = null,
        e = null;

    this.digestTtl = function (a) {
      arguments.length && (b = a);
      return b;
    };

    this.$get = ["$exceptionHandler", "$parse", "$browser", function (f, g, k) {
      function h(a) {
        a.currentScope.$$destroyed = !0;
      }

      function l(a) {
        9 === Ca && (a.$$childHead && l(a.$$childHead), a.$$nextSibling && l(a.$$nextSibling));
        a.$parent = a.$$nextSibling = a.$$prevSibling = a.$$childHead = a.$$childTail = a.$root = a.$$watchers = null;
      }

      function m() {
        this.$id = ++pb;
        this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
        this.$root = this;
        this.$$suspended = this.$$destroyed = !1;
        this.$$listeners = {};
        this.$$listenerCount = {};
        this.$$watchersCount = 0;
        this.$$isolateBindings = null;
      }

      function p(a) {
        if (v.$$phase) throw d("inprog", v.$$phase);
        v.$$phase = a;
      }

      function n(a, b) {
        do {
          a.$$watchersCount += b;
        } while (a = a.$parent);
      }

      function s(a, b, c) {
        do {
          a.$$listenerCount[c] -= b, 0 === a.$$listenerCount[c] && delete a.$$listenerCount[c];
        } while (a = a.$parent);
      }

      function G() {}

      function t() {
        for (; y.length;) {
          try {
            y.shift()();
          } catch (a) {
            f(a);
          }
        }

        e = null;
      }

      function q() {
        null === e && (e = k.defer(function () {
          v.$apply(t);
        }, null, "$applyAsync"));
      }

      m.prototype = {
        constructor: m,
        $new: function $new(b, c) {
          var d;
          c = c || this;
          b ? (d = new m(), d.$root = this.$root) : (this.$$ChildScope || (this.$$ChildScope = a(this)), d = new this.$$ChildScope());
          d.$parent = c;
          d.$$prevSibling = c.$$childTail;
          c.$$childHead ? (c.$$childTail.$$nextSibling = d, c.$$childTail = d) : c.$$childHead = c.$$childTail = d;
          (b || c !== this) && d.$on("$destroy", h);
          return d;
        },
        $watch: function $watch(a, b, d, e) {
          var f = g(a);
          b = B(b) ? b : E;
          if (f.$$watchDelegate) return f.$$watchDelegate(this, b, d, f, a);
          var h = this,
              k = h.$$watchers,
              l = {
            fn: b,
            last: G,
            get: f,
            exp: e || a,
            eq: !!d
          };
          c = null;
          k || (k = h.$$watchers = [], k.$$digestWatchIndex = -1);
          k.unshift(l);
          k.$$digestWatchIndex++;
          n(this, 1);
          return function () {
            var a = cb(k, l);
            0 <= a && (n(h, -1), a < k.$$digestWatchIndex && k.$$digestWatchIndex--);
            c = null;
          };
        },
        $watchGroup: function $watchGroup(a, b) {
          function c() {
            h = !1;

            try {
              k ? (k = !1, b(e, e, g)) : b(e, d, g);
            } finally {
              for (var f = 0; f < a.length; f++) {
                d[f] = e[f];
              }
            }
          }

          var d = Array(a.length),
              e = Array(a.length),
              f = [],
              g = this,
              h = !1,
              k = !0;

          if (!a.length) {
            var l = !0;
            g.$evalAsync(function () {
              l && b(e, e, g);
            });
            return function () {
              l = !1;
            };
          }

          if (1 === a.length) return this.$watch(a[0], function (a, c, f) {
            e[0] = a;
            d[0] = c;
            b(e, a === c ? e : d, f);
          });
          r(a, function (a, b) {
            var d = g.$watch(a, function (a) {
              e[b] = a;
              h || (h = !0, g.$evalAsync(c));
            });
            f.push(d);
          });
          return function () {
            for (; f.length;) {
              f.shift()();
            }
          };
        },
        $watchCollection: function $watchCollection(a, b) {
          function c(a) {
            e = a;
            var b, d, g, h;

            if (!z(e)) {
              if (D(e)) {
                if (ya(e)) for (f !== n && (f = n, t = f.length = 0, l++), a = e.length, t !== a && (l++, f.length = t = a), b = 0; b < a; b++) {
                  h = f[b], g = e[b], d = h !== h && g !== g, d || h === g || (l++, f[b] = g);
                } else {
                  f !== p && (f = p = {}, t = 0, l++);
                  a = 0;

                  for (b in e) {
                    ta.call(e, b) && (a++, g = e[b], h = f[b], b in f ? (d = h !== h && g !== g, d || h === g || (l++, f[b] = g)) : (t++, f[b] = g, l++));
                  }

                  if (t > a) for (b in l++, f) {
                    ta.call(e, b) || (t--, delete f[b]);
                  }
                }
              } else f !== e && (f = e, l++);
              return l;
            }
          }

          c.$$pure = g(a).literal;
          c.$stateful = !c.$$pure;
          var d = this,
              e,
              f,
              h,
              k = 1 < b.length,
              l = 0,
              m = g(a, c),
              n = [],
              p = {},
              s = !0,
              t = 0;
          return this.$watch(m, function () {
            s ? (s = !1, b(e, e, d)) : b(e, h, d);
            if (k) if (D(e)) {
              if (ya(e)) {
                h = Array(e.length);

                for (var a = 0; a < e.length; a++) {
                  h[a] = e[a];
                }
              } else for (a in h = {}, e) {
                ta.call(e, a) && (h[a] = e[a]);
              }
            } else h = e;
          });
        },
        $digest: function $digest() {
          var a,
              g,
              h,
              l,
              m,
              n,
              s,
              r = b,
              q,
              y = w.length ? v : this,
              N = [],
              z,
              A;
          p("$digest");
          k.$$checkUrlChange();
          this === v && null !== e && (k.defer.cancel(e), t());
          c = null;

          do {
            s = !1;
            q = y;

            for (n = 0; n < w.length; n++) {
              try {
                A = w[n], l = A.fn, l(A.scope, A.locals);
              } catch (C) {
                f(C);
              }

              c = null;
            }

            w.length = 0;

            a: do {
              if (n = !q.$$suspended && q.$$watchers) for (n.$$digestWatchIndex = n.length; n.$$digestWatchIndex--;) {
                try {
                  if (a = n[n.$$digestWatchIndex]) if (m = a.get, (g = m(q)) !== (h = a.last) && !(a.eq ? va(g, h) : X(g) && X(h))) s = !0, c = a, a.last = a.eq ? Ia(g, null) : g, l = a.fn, l(g, h === G ? g : h, q), 5 > r && (z = 4 - r, N[z] || (N[z] = []), N[z].push({
                    msg: B(a.exp) ? "fn: " + (a.exp.name || a.exp.toString()) : a.exp,
                    newVal: g,
                    oldVal: h
                  }));else if (a === c) {
                    s = !1;
                    break a;
                  }
                } catch (E) {
                  f(E);
                }
              }
              if (!(n = !q.$$suspended && q.$$watchersCount && q.$$childHead || q !== y && q.$$nextSibling)) for (; q !== y && !(n = q.$$nextSibling);) {
                q = q.$parent;
              }
            } while (q = n);

            if ((s || w.length) && !r--) throw v.$$phase = null, d("infdig", b, N);
          } while (s || w.length);

          for (v.$$phase = null; J < x.length;) {
            try {
              x[J++]();
            } catch (D) {
              f(D);
            }
          }

          x.length = J = 0;
          k.$$checkUrlChange();
        },
        $suspend: function $suspend() {
          this.$$suspended = !0;
        },
        $isSuspended: function $isSuspended() {
          return this.$$suspended;
        },
        $resume: function $resume() {
          this.$$suspended = !1;
        },
        $destroy: function $destroy() {
          if (!this.$$destroyed) {
            var a = this.$parent;
            this.$broadcast("$destroy");
            this.$$destroyed = !0;
            this === v && k.$$applicationDestroyed();
            n(this, -this.$$watchersCount);

            for (var b in this.$$listenerCount) {
              s(this, this.$$listenerCount[b], b);
            }

            a && a.$$childHead === this && (a.$$childHead = this.$$nextSibling);
            a && a.$$childTail === this && (a.$$childTail = this.$$prevSibling);
            this.$$prevSibling && (this.$$prevSibling.$$nextSibling = this.$$nextSibling);
            this.$$nextSibling && (this.$$nextSibling.$$prevSibling = this.$$prevSibling);
            this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = E;

            this.$on = this.$watch = this.$watchGroup = function () {
              return E;
            };

            this.$$listeners = {};
            this.$$nextSibling = null;
            l(this);
          }
        },
        $eval: function $eval(a, b) {
          return g(a)(this, b);
        },
        $evalAsync: function $evalAsync(a, b) {
          v.$$phase || w.length || k.defer(function () {
            w.length && v.$digest();
          }, null, "$evalAsync");
          w.push({
            scope: this,
            fn: g(a),
            locals: b
          });
        },
        $$postDigest: function $$postDigest(a) {
          x.push(a);
        },
        $apply: function $apply(a) {
          try {
            p("$apply");

            try {
              return this.$eval(a);
            } finally {
              v.$$phase = null;
            }
          } catch (b) {
            f(b);
          } finally {
            try {
              v.$digest();
            } catch (c) {
              throw f(c), c;
            }
          }
        },
        $applyAsync: function $applyAsync(a) {
          function b() {
            c.$eval(a);
          }

          var c = this;
          a && y.push(b);
          a = g(a);
          q();
        },
        $on: function $on(a, b) {
          var c = this.$$listeners[a];
          c || (this.$$listeners[a] = c = []);
          c.push(b);
          var d = this;

          do {
            d.$$listenerCount[a] || (d.$$listenerCount[a] = 0), d.$$listenerCount[a]++;
          } while (d = d.$parent);

          var e = this;
          return function () {
            var d = c.indexOf(b);
            -1 !== d && (delete c[d], s(e, 1, a));
          };
        },
        $emit: function $emit(a, b) {
          var c = [],
              d,
              e = this,
              g = !1,
              h = {
            name: a,
            targetScope: e,
            stopPropagation: function stopPropagation() {
              g = !0;
            },
            preventDefault: function preventDefault() {
              h.defaultPrevented = !0;
            },
            defaultPrevented: !1
          },
              k = db([h], arguments, 1),
              l,
              m;

          do {
            d = e.$$listeners[a] || c;
            h.currentScope = e;
            l = 0;

            for (m = d.length; l < m; l++) {
              if (d[l]) try {
                d[l].apply(null, k);
              } catch (n) {
                f(n);
              } else d.splice(l, 1), l--, m--;
            }

            if (g) break;
            e = e.$parent;
          } while (e);

          h.currentScope = null;
          return h;
        },
        $broadcast: function $broadcast(a, b) {
          var c = this,
              d = this,
              e = {
            name: a,
            targetScope: this,
            preventDefault: function preventDefault() {
              e.defaultPrevented = !0;
            },
            defaultPrevented: !1
          };
          if (!this.$$listenerCount[a]) return e;

          for (var g = db([e], arguments, 1), h, k; c = d;) {
            e.currentScope = c;
            d = c.$$listeners[a] || [];
            h = 0;

            for (k = d.length; h < k; h++) {
              if (d[h]) try {
                d[h].apply(null, g);
              } catch (l) {
                f(l);
              } else d.splice(h, 1), h--, k--;
            }

            if (!(d = c.$$listenerCount[a] && c.$$childHead || c !== this && c.$$nextSibling)) for (; c !== this && !(d = c.$$nextSibling);) {
              c = c.$parent;
            }
          }

          e.currentScope = null;
          return e;
        }
      };
      var v = new m(),
          w = v.$$asyncQueue = [],
          x = v.$$postDigestQueue = [],
          y = v.$$applyAsyncQueue = [],
          J = 0;
      return v;
    }];
  }

  function Le() {
    var a = /^\s*(https?|s?ftp|mailto|tel|file):/,
        b = /^\s*((https?|ftp|file|blob):|data:image\/)/;

    this.aHrefSanitizationWhitelist = function (b) {
      return w(b) ? (a = b, this) : a;
    };

    this.imgSrcSanitizationWhitelist = function (a) {
      return w(a) ? (b = a, this) : b;
    };

    this.$get = function () {
      return function (d, c) {
        var e = c ? b : a,
            f = ga(d && d.trim()).href;
        return "" === f || f.match(e) ? d : "unsafe:" + f;
      };
    };
  }

  function Sg(a) {
    if ("self" === a) return a;

    if (A(a)) {
      if (-1 < a.indexOf("***")) throw Ea("iwcard", a);
      a = Md(a).replace(/\\\*\\\*/g, ".*").replace(/\\\*/g, "[^:/.?&;]*");
      return new RegExp("^" + a + "$");
    }

    if (ab(a)) return new RegExp("^" + a.source + "$");
    throw Ea("imatcher");
  }

  function Nd(a) {
    var b = [];
    w(a) && r(a, function (a) {
      b.push(Sg(a));
    });
    return b;
  }

  function $f() {
    this.SCE_CONTEXTS = V;
    var a = ["self"],
        b = [];

    this.resourceUrlWhitelist = function (b) {
      arguments.length && (a = Nd(b));
      return a;
    };

    this.resourceUrlBlacklist = function (a) {
      arguments.length && (b = Nd(a));
      return b;
    };

    this.$get = ["$injector", "$$sanitizeUri", function (d, c) {
      function e(a, b) {
        var c;
        "self" === a ? (c = Bc(b, Od)) || (C.document.baseURI ? c = C.document.baseURI : (Na || (Na = C.document.createElement("a"), Na.href = ".", Na = Na.cloneNode(!1)), c = Na.href), c = Bc(b, c)) : c = !!a.exec(b.href);
        return c;
      }

      function f(a) {
        var b = function b(a) {
          this.$$unwrapTrustedValue = function () {
            return a;
          };
        };

        a && (b.prototype = new a());

        b.prototype.valueOf = function () {
          return this.$$unwrapTrustedValue();
        };

        b.prototype.toString = function () {
          return this.$$unwrapTrustedValue().toString();
        };

        return b;
      }

      var g = function g(a) {
        throw Ea("unsafe");
      };

      d.has("$sanitize") && (g = d.get("$sanitize"));
      var k = f(),
          h = {};
      h[V.HTML] = f(k);
      h[V.CSS] = f(k);
      h[V.MEDIA_URL] = f(k);
      h[V.URL] = f(h[V.MEDIA_URL]);
      h[V.JS] = f(k);
      h[V.RESOURCE_URL] = f(h[V.URL]);
      return {
        trustAs: function trustAs(a, b) {
          var c = h.hasOwnProperty(a) ? h[a] : null;
          if (!c) throw Ea("icontext", a, b);
          if (null === b || z(b) || "" === b) return b;
          if ("string" !== typeof b) throw Ea("itype", a);
          return new c(b);
        },
        getTrusted: function getTrusted(d, f) {
          if (null === f || z(f) || "" === f) return f;
          var k = h.hasOwnProperty(d) ? h[d] : null;
          if (k && f instanceof k) return f.$$unwrapTrustedValue();
          B(f.$$unwrapTrustedValue) && (f = f.$$unwrapTrustedValue());
          if (d === V.MEDIA_URL || d === V.URL) return c(f.toString(), d === V.MEDIA_URL);

          if (d === V.RESOURCE_URL) {
            var k = ga(f.toString()),
                n,
                s,
                r = !1;
            n = 0;

            for (s = a.length; n < s; n++) {
              if (e(a[n], k)) {
                r = !0;
                break;
              }
            }

            if (r) for (n = 0, s = b.length; n < s; n++) {
              if (e(b[n], k)) {
                r = !1;
                break;
              }
            }
            if (r) return f;
            throw Ea("insecurl", f.toString());
          }

          if (d === V.HTML) return g(f);
          throw Ea("unsafe");
        },
        valueOf: function valueOf(a) {
          return a instanceof k ? a.$$unwrapTrustedValue() : a;
        }
      };
    }];
  }

  function Zf() {
    var a = !0;

    this.enabled = function (b) {
      arguments.length && (a = !!b);
      return a;
    };

    this.$get = ["$parse", "$sceDelegate", function (b, d) {
      if (a && 8 > Ca) throw Ea("iequirks");
      var c = ja(V);

      c.isEnabled = function () {
        return a;
      };

      c.trustAs = d.trustAs;
      c.getTrusted = d.getTrusted;
      c.valueOf = d.valueOf;
      a || (c.trustAs = c.getTrusted = function (a, b) {
        return b;
      }, c.valueOf = Ta);

      c.parseAs = function (a, d) {
        var e = b(d);
        return e.literal && e.constant ? e : b(d, function (b) {
          return c.getTrusted(a, b);
        });
      };

      var e = c.parseAs,
          f = c.getTrusted,
          g = c.trustAs;
      r(V, function (a, b) {
        var d = K(b);

        c[("parse_as_" + d).replace(Cc, wb)] = function (b) {
          return e(a, b);
        };

        c[("get_trusted_" + d).replace(Cc, wb)] = function (b) {
          return f(a, b);
        };

        c[("trust_as_" + d).replace(Cc, wb)] = function (b) {
          return g(a, b);
        };
      });
      return c;
    }];
  }

  function ag() {
    this.$get = ["$window", "$document", function (a, b) {
      var d = {},
          c = !((!a.nw || !a.nw.process) && a.chrome && (a.chrome.app && a.chrome.app.runtime || !a.chrome.app && a.chrome.runtime && a.chrome.runtime.id)) && a.history && a.history.pushState,
          e = fa((/android (\d+)/.exec(K((a.navigator || {}).userAgent)) || [])[1]),
          f = /Boxee/i.test((a.navigator || {}).userAgent),
          g = b[0] || {},
          k = g.body && g.body.style,
          h = !1,
          l = !1;
      k && (h = !!("transition" in k || "webkitTransition" in k), l = !!("animation" in k || "webkitAnimation" in k));
      return {
        history: !(!c || 4 > e || f),
        hasEvent: function hasEvent(a) {
          if ("input" === a && Ca) return !1;

          if (z(d[a])) {
            var b = g.createElement("div");
            d[a] = "on" + a in b;
          }

          return d[a];
        },
        csp: Aa(),
        transitions: h,
        animations: l,
        android: e
      };
    }];
  }

  function bg() {
    this.$get = ia(function (a) {
      return new Tg(a);
    });
  }

  function Tg(a) {
    function b() {
      var a = e.pop();
      return a && a.cb;
    }

    function d(a) {
      for (var b = e.length - 1; 0 <= b; --b) {
        var c = e[b];
        if (c.type === a) return e.splice(b, 1), c.cb;
      }
    }

    var c = {},
        e = [],
        f = this.ALL_TASKS_TYPE = "$$all$$",
        g = this.DEFAULT_TASK_TYPE = "$$default$$";

    this.completeTask = function (e, h) {
      h = h || g;

      try {
        e();
      } finally {
        var l;
        l = h || g;
        c[l] && (c[l]--, c[f]--);
        l = c[h];
        var m = c[f];
        if (!m || !l) for (l = m ? d : b; m = l(h);) {
          try {
            m();
          } catch (p) {
            a.error(p);
          }
        }
      }
    };

    this.incTaskCount = function (a) {
      a = a || g;
      c[a] = (c[a] || 0) + 1;
      c[f] = (c[f] || 0) + 1;
    };

    this.notifyWhenNoPendingTasks = function (a, b) {
      b = b || f;
      c[b] ? e.push({
        type: b,
        cb: a
      }) : a();
    };
  }

  function dg() {
    var a;

    this.httpOptions = function (b) {
      return b ? (a = b, this) : a;
    };

    this.$get = ["$exceptionHandler", "$templateCache", "$http", "$q", "$sce", function (b, d, c, e, f) {
      function g(k, h) {
        g.totalPendingRequests++;
        if (!A(k) || z(d.get(k))) k = f.getTrustedResourceUrl(k);
        var l = c.defaults && c.defaults.transformResponse;
        H(l) ? l = l.filter(function (a) {
          return a !== vc;
        }) : l === vc && (l = null);
        return c.get(k, S({
          cache: d,
          transformResponse: l
        }, a))["finally"](function () {
          g.totalPendingRequests--;
        }).then(function (a) {
          return d.put(k, a.data);
        }, function (a) {
          h || (a = Ug("tpload", k, a.status, a.statusText), b(a));
          return e.reject(a);
        });
      }

      g.totalPendingRequests = 0;
      return g;
    }];
  }

  function eg() {
    this.$get = ["$rootScope", "$browser", "$location", function (a, b, d) {
      return {
        findBindings: function findBindings(a, b, d) {
          a = a.getElementsByClassName("ng-binding");
          var g = [];
          r(a, function (a) {
            var c = ca.element(a).data("$binding");
            c && r(c, function (c) {
              d ? new RegExp("(^|\\s)" + Md(b) + "(\\s|\\||$)").test(c) && g.push(a) : -1 !== c.indexOf(b) && g.push(a);
            });
          });
          return g;
        },
        findModels: function findModels(a, b, d) {
          for (var g = ["ng-", "data-ng-", "ng\\:"], k = 0; k < g.length; ++k) {
            var h = a.querySelectorAll("[" + g[k] + "model" + (d ? "=" : "*=") + '"' + b + '"]');
            if (h.length) return h;
          }
        },
        getLocation: function getLocation() {
          return d.url();
        },
        setLocation: function setLocation(b) {
          b !== d.url() && (d.url(b), a.$digest());
        },
        whenStable: function whenStable(a) {
          b.notifyWhenNoOutstandingRequests(a);
        }
      };
    }];
  }

  function fg() {
    this.$get = ["$rootScope", "$browser", "$q", "$$q", "$exceptionHandler", function (a, b, d, c, e) {
      function f(f, h, l) {
        B(f) || (l = h, h = f, f = E);
        var m = Ha.call(arguments, 3),
            p = w(l) && !l,
            n = (p ? c : d).defer(),
            s = n.promise,
            r;
        r = b.defer(function () {
          try {
            n.resolve(f.apply(null, m));
          } catch (b) {
            n.reject(b), e(b);
          } finally {
            delete g[s.$$timeoutId];
          }

          p || a.$apply();
        }, h, "$timeout");
        s.$$timeoutId = r;
        g[r] = n;
        return s;
      }

      var g = {};

      f.cancel = function (a) {
        if (!a) return !1;
        if (!a.hasOwnProperty("$$timeoutId")) throw Vg("badprom");
        if (!g.hasOwnProperty(a.$$timeoutId)) return !1;
        a = a.$$timeoutId;
        var c = g[a],
            d = c.promise;
        d.$$state && (d.$$state.pur = !0);
        c.reject("canceled");
        delete g[a];
        return b.defer.cancel(a);
      };

      return f;
    }];
  }

  function ga(a) {
    if (!A(a)) return a;
    Ca && (aa.setAttribute("href", a), a = aa.href);
    aa.setAttribute("href", a);
    a = aa.hostname;
    !Wg && -1 < a.indexOf(":") && (a = "[" + a + "]");
    return {
      href: aa.href,
      protocol: aa.protocol ? aa.protocol.replace(/:$/, "") : "",
      host: aa.host,
      search: aa.search ? aa.search.replace(/^\?/, "") : "",
      hash: aa.hash ? aa.hash.replace(/^#/, "") : "",
      hostname: a,
      port: aa.port,
      pathname: "/" === aa.pathname.charAt(0) ? aa.pathname : "/" + aa.pathname
    };
  }

  function Jg(a) {
    var b = [Od].concat(a.map(ga));
    return function (a) {
      a = ga(a);
      return b.some(Bc.bind(null, a));
    };
  }

  function Bc(a, b) {
    a = ga(a);
    b = ga(b);
    return a.protocol === b.protocol && a.host === b.host;
  }

  function gg() {
    this.$get = ia(C);
  }

  function Pd(a) {
    function b(a) {
      try {
        return decodeURIComponent(a);
      } catch (b) {
        return a;
      }
    }

    var d = a[0] || {},
        c = {},
        e = "";
    return function () {
      var a, g, k, h, l;

      try {
        a = d.cookie || "";
      } catch (m) {
        a = "";
      }

      if (a !== e) for (e = a, a = e.split("; "), c = {}, k = 0; k < a.length; k++) {
        g = a[k], h = g.indexOf("="), 0 < h && (l = b(g.substring(0, h)), z(c[l]) && (c[l] = b(g.substring(h + 1))));
      }
      return c;
    };
  }

  function kg() {
    this.$get = Pd;
  }

  function dd(a) {
    function b(d, c) {
      if (D(d)) {
        var e = {};
        r(d, function (a, c) {
          e[c] = b(c, a);
        });
        return e;
      }

      return a.factory(d + "Filter", c);
    }

    this.register = b;
    this.$get = ["$injector", function (a) {
      return function (b) {
        return a.get(b + "Filter");
      };
    }];
    b("currency", Qd);
    b("date", Rd);
    b("filter", Xg);
    b("json", Yg);
    b("limitTo", Zg);
    b("lowercase", $g);
    b("number", Sd);
    b("orderBy", Td);
    b("uppercase", ah);
  }

  function Xg() {
    return function (a, b, d, c) {
      if (!ya(a)) {
        if (null == a) return a;
        throw F("filter")("notarray", a);
      }

      c = c || "$";
      var e;

      switch (Dc(b)) {
        case "function":
          break;

        case "boolean":
        case "null":
        case "number":
        case "string":
          e = !0;

        case "object":
          b = bh(b, d, c, e);
          break;

        default:
          return a;
      }

      return Array.prototype.filter.call(a, b);
    };
  }

  function bh(a, b, d, c) {
    var e = D(a) && d in a;
    !0 === b ? b = va : B(b) || (b = function b(a, _b) {
      if (z(a)) return !1;
      if (null === a || null === _b) return a === _b;
      if (D(_b) || D(a) && !bc(a)) return !1;
      a = K("" + a);
      _b = K("" + _b);
      return -1 !== a.indexOf(_b);
    });
    return function (f) {
      return e && !D(f) ? Fa(f, a[d], b, d, !1) : Fa(f, a, b, d, c);
    };
  }

  function Fa(a, b, d, c, e, f) {
    var g = Dc(a),
        k = Dc(b);
    if ("string" === k && "!" === b.charAt(0)) return !Fa(a, b.substring(1), d, c, e);
    if (H(a)) return a.some(function (a) {
      return Fa(a, b, d, c, e);
    });

    switch (g) {
      case "object":
        var h;

        if (e) {
          for (h in a) {
            if (h.charAt && "$" !== h.charAt(0) && Fa(a[h], b, d, c, !0)) return !0;
          }

          return f ? !1 : Fa(a, b, d, c, !1);
        }

        if ("object" === k) {
          for (h in b) {
            if (f = b[h], !B(f) && !z(f) && (g = h === c, !Fa(g ? a : a[h], f, d, c, g, g))) return !1;
          }

          return !0;
        }

        return d(a, b);

      case "function":
        return !1;

      default:
        return d(a, b);
    }
  }

  function Dc(a) {
    return null === a ? "null" : _typeof(a);
  }

  function Qd(a) {
    var b = a.NUMBER_FORMATS;
    return function (a, c, e) {
      z(c) && (c = b.CURRENCY_SYM);
      z(e) && (e = b.PATTERNS[1].maxFrac);
      var f = c ? /\u00A4/g : /\s*\u00A4\s*/g;
      return null == a ? a : Ud(a, b.PATTERNS[1], b.GROUP_SEP, b.DECIMAL_SEP, e).replace(f, c);
    };
  }

  function Sd(a) {
    var b = a.NUMBER_FORMATS;
    return function (a, c) {
      return null == a ? a : Ud(a, b.PATTERNS[0], b.GROUP_SEP, b.DECIMAL_SEP, c);
    };
  }

  function ch(a) {
    var b = 0,
        d,
        c,
        e,
        f,
        g;
    -1 < (c = a.indexOf(Vd)) && (a = a.replace(Vd, ""));
    0 < (e = a.search(/e/i)) ? (0 > c && (c = e), c += +a.slice(e + 1), a = a.substring(0, e)) : 0 > c && (c = a.length);

    for (e = 0; a.charAt(e) === Ec; e++) {
      ;
    }

    if (e === (g = a.length)) d = [0], c = 1;else {
      for (g--; a.charAt(g) === Ec;) {
        g--;
      }

      c -= e;
      d = [];

      for (f = 0; e <= g; e++, f++) {
        d[f] = +a.charAt(e);
      }
    }
    c > Wd && (d = d.splice(0, Wd - 1), b = c - 1, c = 1);
    return {
      d: d,
      e: b,
      i: c
    };
  }

  function dh(a, b, d, c) {
    var e = a.d,
        f = e.length - a.i;
    b = z(b) ? Math.min(Math.max(d, f), c) : +b;
    d = b + a.i;
    c = e[d];

    if (0 < d) {
      e.splice(Math.max(a.i, d));

      for (var g = d; g < e.length; g++) {
        e[g] = 0;
      }
    } else for (f = Math.max(0, f), a.i = 1, e.length = Math.max(1, d = b + 1), e[0] = 0, g = 1; g < d; g++) {
      e[g] = 0;
    }

    if (5 <= c) if (0 > d - 1) {
      for (c = 0; c > d; c--) {
        e.unshift(0), a.i++;
      }

      e.unshift(1);
      a.i++;
    } else e[d - 1]++;

    for (; f < Math.max(0, b); f++) {
      e.push(0);
    }

    if (b = e.reduceRight(function (a, b, c, d) {
      b += a;
      d[c] = b % 10;
      return Math.floor(b / 10);
    }, 0)) e.unshift(b), a.i++;
  }

  function Ud(a, b, d, c, e) {
    if (!A(a) && !W(a) || isNaN(a)) return "";
    var f = !isFinite(a),
        g = !1,
        k = Math.abs(a) + "",
        h = "";
    if (f) h = "\u221E";else {
      g = ch(k);
      dh(g, e, b.minFrac, b.maxFrac);
      h = g.d;
      k = g.i;
      e = g.e;
      f = [];

      for (g = h.reduce(function (a, b) {
        return a && !b;
      }, !0); 0 > k;) {
        h.unshift(0), k++;
      }

      0 < k ? f = h.splice(k, h.length) : (f = h, h = [0]);
      k = [];

      for (h.length >= b.lgSize && k.unshift(h.splice(-b.lgSize, h.length).join("")); h.length > b.gSize;) {
        k.unshift(h.splice(-b.gSize, h.length).join(""));
      }

      h.length && k.unshift(h.join(""));
      h = k.join(d);
      f.length && (h += c + f.join(""));
      e && (h += "e+" + e);
    }
    return 0 > a && !g ? b.negPre + h + b.negSuf : b.posPre + h + b.posSuf;
  }

  function Ob(a, b, d, c) {
    var e = "";
    if (0 > a || c && 0 >= a) c ? a = -a + 1 : (a = -a, e = "-");

    for (a = "" + a; a.length < b;) {
      a = Ec + a;
    }

    d && (a = a.substr(a.length - b));
    return e + a;
  }

  function ea(a, b, d, c, e) {
    d = d || 0;
    return function (f) {
      f = f["get" + a]();
      if (0 < d || f > -d) f += d;
      0 === f && -12 === d && (f = 12);
      return Ob(f, b, c, e);
    };
  }

  function kb(a, b, d) {
    return function (c, e) {
      var f = c["get" + a](),
          g = ub((d ? "STANDALONE" : "") + (b ? "SHORT" : "") + a);
      return e[g][f];
    };
  }

  function Xd(a) {
    var b = new Date(a, 0, 1).getDay();
    return new Date(a, 0, (4 >= b ? 5 : 12) - b);
  }

  function Yd(a) {
    return function (b) {
      var d = Xd(b.getFullYear());
      b = +new Date(b.getFullYear(), b.getMonth(), b.getDate() + (4 - b.getDay())) - +d;
      b = 1 + Math.round(b / 6048E5);
      return Ob(b, a);
    };
  }

  function Fc(a, b) {
    return 0 >= a.getFullYear() ? b.ERAS[0] : b.ERAS[1];
  }

  function Rd(a) {
    function b(a) {
      var b;

      if (b = a.match(d)) {
        a = new Date(0);
        var f = 0,
            g = 0,
            k = b[8] ? a.setUTCFullYear : a.setFullYear,
            h = b[8] ? a.setUTCHours : a.setHours;
        b[9] && (f = fa(b[9] + b[10]), g = fa(b[9] + b[11]));
        k.call(a, fa(b[1]), fa(b[2]) - 1, fa(b[3]));
        f = fa(b[4] || 0) - f;
        g = fa(b[5] || 0) - g;
        k = fa(b[6] || 0);
        b = Math.round(1E3 * parseFloat("0." + (b[7] || 0)));
        h.call(a, f, g, k, b);
      }

      return a;
    }

    var d = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
    return function (c, d, f) {
      var g = "",
          k = [],
          h,
          l;
      d = d || "mediumDate";
      d = a.DATETIME_FORMATS[d] || d;
      A(c) && (c = eh.test(c) ? fa(c) : b(c));
      W(c) && (c = new Date(c));
      if (!ha(c) || !isFinite(c.getTime())) return c;

      for (; d;) {
        (l = fh.exec(d)) ? (k = db(k, l, 1), d = k.pop()) : (k.push(d), d = null);
      }

      var m = c.getTimezoneOffset();
      f && (m = ec(f, m), c = fc(c, f, !0));
      r(k, function (b) {
        h = gh[b];
        g += h ? h(c, a.DATETIME_FORMATS, m) : "''" === b ? "'" : b.replace(/(^'|'$)/g, "").replace(/''/g, "'");
      });
      return g;
    };
  }

  function Yg() {
    return function (a, b) {
      z(b) && (b = 2);
      return eb(a, b);
    };
  }

  function Zg() {
    return function (a, b, d) {
      b = Infinity === Math.abs(Number(b)) ? Number(b) : fa(b);
      if (X(b)) return a;
      W(a) && (a = a.toString());
      if (!ya(a)) return a;
      d = !d || isNaN(d) ? 0 : fa(d);
      d = 0 > d ? Math.max(0, a.length + d) : d;
      return 0 <= b ? Gc(a, d, d + b) : 0 === d ? Gc(a, b, a.length) : Gc(a, Math.max(0, d + b), d);
    };
  }

  function Gc(a, b, d) {
    return A(a) ? a.slice(b, d) : Ha.call(a, b, d);
  }

  function Td(a) {
    function b(b) {
      return b.map(function (b) {
        var c = 1,
            d = Ta;
        if (B(b)) d = b;else if (A(b)) {
          if ("+" === b.charAt(0) || "-" === b.charAt(0)) c = "-" === b.charAt(0) ? -1 : 1, b = b.substring(1);
          if ("" !== b && (d = a(b), d.constant)) var e = d(),
              d = function d(a) {
            return a[e];
          };
        }
        return {
          get: d,
          descending: c
        };
      });
    }

    function d(a) {
      switch (_typeof(a)) {
        case "number":
        case "boolean":
        case "string":
          return !0;

        default:
          return !1;
      }
    }

    function c(a, b) {
      var c = 0,
          d = a.type,
          h = b.type;

      if (d === h) {
        var h = a.value,
            l = b.value;
        "string" === d ? (h = h.toLowerCase(), l = l.toLowerCase()) : "object" === d && (D(h) && (h = a.index), D(l) && (l = b.index));
        h !== l && (c = h < l ? -1 : 1);
      } else c = "undefined" === d ? 1 : "undefined" === h ? -1 : "null" === d ? 1 : "null" === h ? -1 : d < h ? -1 : 1;

      return c;
    }

    return function (a, f, g, k) {
      if (null == a) return a;
      if (!ya(a)) throw F("orderBy")("notarray", a);
      H(f) || (f = [f]);
      0 === f.length && (f = ["+"]);
      var h = b(f),
          l = g ? -1 : 1,
          m = B(k) ? k : c;
      a = Array.prototype.map.call(a, function (a, b) {
        return {
          value: a,
          tieBreaker: {
            value: b,
            type: "number",
            index: b
          },
          predicateValues: h.map(function (c) {
            var e = c.get(a);
            c = _typeof(e);
            if (null === e) c = "null";else if ("object" === c) a: {
              if (B(e.valueOf) && (e = e.valueOf(), d(e))) break a;
              bc(e) && (e = e.toString(), d(e));
            }
            return {
              value: e,
              type: c,
              index: b
            };
          })
        };
      });
      a.sort(function (a, b) {
        for (var d = 0, e = h.length; d < e; d++) {
          var f = m(a.predicateValues[d], b.predicateValues[d]);
          if (f) return f * h[d].descending * l;
        }

        return (m(a.tieBreaker, b.tieBreaker) || c(a.tieBreaker, b.tieBreaker)) * l;
      });
      return a = a.map(function (a) {
        return a.value;
      });
    };
  }

  function Ra(a) {
    B(a) && (a = {
      link: a
    });
    a.restrict = a.restrict || "AC";
    return ia(a);
  }

  function Pb(a, b, d, c, e) {
    this.$$controls = [];
    this.$error = {};
    this.$$success = {};
    this.$pending = void 0;
    this.$name = e(b.name || b.ngForm || "")(d);
    this.$dirty = !1;
    this.$valid = this.$pristine = !0;
    this.$submitted = this.$invalid = !1;
    this.$$parentForm = lb;
    this.$$element = a;
    this.$$animate = c;
    Zd(this);
  }

  function Zd(a) {
    a.$$classCache = {};
    a.$$classCache[$d] = !(a.$$classCache[mb] = a.$$element.hasClass(mb));
  }

  function ae(a) {
    function b(a, b, c) {
      c && !a.$$classCache[b] ? (a.$$animate.addClass(a.$$element, b), a.$$classCache[b] = !0) : !c && a.$$classCache[b] && (a.$$animate.removeClass(a.$$element, b), a.$$classCache[b] = !1);
    }

    function d(a, c, d) {
      c = c ? "-" + Vc(c, "-") : "";
      b(a, mb + c, !0 === d);
      b(a, $d + c, !1 === d);
    }

    var c = a.set,
        e = a.unset;

    a.clazz.prototype.$setValidity = function (a, g, k) {
      z(g) ? (this.$pending || (this.$pending = {}), c(this.$pending, a, k)) : (this.$pending && e(this.$pending, a, k), be(this.$pending) && (this.$pending = void 0));
      Ga(g) ? g ? (e(this.$error, a, k), c(this.$$success, a, k)) : (c(this.$error, a, k), e(this.$$success, a, k)) : (e(this.$error, a, k), e(this.$$success, a, k));
      this.$pending ? (b(this, "ng-pending", !0), this.$valid = this.$invalid = void 0, d(this, "", null)) : (b(this, "ng-pending", !1), this.$valid = be(this.$error), this.$invalid = !this.$valid, d(this, "", this.$valid));
      g = this.$pending && this.$pending[a] ? void 0 : this.$error[a] ? !1 : this.$$success[a] ? !0 : null;
      d(this, a, g);
      this.$$parentForm.$setValidity(a, g, this);
    };
  }

  function be(a) {
    if (a) for (var b in a) {
      if (a.hasOwnProperty(b)) return !1;
    }
    return !0;
  }

  function Hc(a) {
    a.$formatters.push(function (b) {
      return a.$isEmpty(b) ? b : b.toString();
    });
  }

  function Sa(a, b, d, c, e, f) {
    var g = K(b[0].type);

    if (!e.android) {
      var k = !1;
      b.on("compositionstart", function () {
        k = !0;
      });
      b.on("compositionupdate", function (a) {
        if (z(a.data) || "" === a.data) k = !1;
      });
      b.on("compositionend", function () {
        k = !1;
        l();
      });
    }

    var h,
        l = function l(a) {
      h && (f.defer.cancel(h), h = null);

      if (!k) {
        var e = b.val();
        a = a && a.type;
        "password" === g || d.ngTrim && "false" === d.ngTrim || (e = U(e));
        (c.$viewValue !== e || "" === e && c.$$hasNativeValidators) && c.$setViewValue(e, a);
      }
    };

    if (e.hasEvent("input")) b.on("input", l);else {
      var m = function m(a, b, c) {
        h || (h = f.defer(function () {
          h = null;
          b && b.value === c || l(a);
        }));
      };

      b.on("keydown", function (a) {
        var b = a.keyCode;
        91 === b || 15 < b && 19 > b || 37 <= b && 40 >= b || m(a, this, this.value);
      });
      if (e.hasEvent("paste")) b.on("paste cut drop", m);
    }
    b.on("change", l);
    if (ce[g] && c.$$hasNativeValidators && g === d.type) b.on("keydown wheel mousedown", function (a) {
      if (!h) {
        var b = this.validity,
            c = b.badInput,
            d = b.typeMismatch;
        h = f.defer(function () {
          h = null;
          b.badInput === c && b.typeMismatch === d || l(a);
        });
      }
    });

    c.$render = function () {
      var a = c.$isEmpty(c.$viewValue) ? "" : c.$viewValue;
      b.val() !== a && b.val(a);
    };
  }

  function Qb(a, b) {
    return function (d, c) {
      var e, f;
      if (ha(d)) return d;

      if (A(d)) {
        '"' === d.charAt(0) && '"' === d.charAt(d.length - 1) && (d = d.substring(1, d.length - 1));
        if (hh.test(d)) return new Date(d);
        a.lastIndex = 0;
        if (e = a.exec(d)) return e.shift(), f = c ? {
          yyyy: c.getFullYear(),
          MM: c.getMonth() + 1,
          dd: c.getDate(),
          HH: c.getHours(),
          mm: c.getMinutes(),
          ss: c.getSeconds(),
          sss: c.getMilliseconds() / 1E3
        } : {
          yyyy: 1970,
          MM: 1,
          dd: 1,
          HH: 0,
          mm: 0,
          ss: 0,
          sss: 0
        }, r(e, function (a, c) {
          c < b.length && (f[b[c]] = +a);
        }), e = new Date(f.yyyy, f.MM - 1, f.dd, f.HH, f.mm, f.ss || 0, 1E3 * f.sss || 0), 100 > f.yyyy && e.setFullYear(f.yyyy), e;
      }

      return NaN;
    };
  }

  function nb(a, b, d, c) {
    return function (e, f, g, k, h, l, m, p) {
      function n(a) {
        return a && !(a.getTime && a.getTime() !== a.getTime());
      }

      function s(a) {
        return w(a) && !ha(a) ? r(a) || void 0 : a;
      }

      function r(a, b) {
        var c = k.$options.getOption("timezone");
        v && v !== c && (b = Sc(b, ec(v)));
        var e = d(a, b);
        !isNaN(e) && c && (e = fc(e, c));
        return e;
      }

      Ic(e, f, g, k, a);
      Sa(e, f, g, k, h, l);
      var t = "time" === a || "datetimelocal" === a,
          q,
          v;
      k.$parsers.push(function (c) {
        if (k.$isEmpty(c)) return null;
        if (b.test(c)) return r(c, q);
        k.$$parserName = a;
      });
      k.$formatters.push(function (a) {
        if (a && !ha(a)) throw ob("datefmt", a);

        if (n(a)) {
          q = a;
          var b = k.$options.getOption("timezone");
          b && (v = b, q = fc(q, b, !0));
          var d = c;
          t && A(k.$options.getOption("timeSecondsFormat")) && (d = c.replace("ss.sss", k.$options.getOption("timeSecondsFormat")).replace(/:$/, ""));
          a = m("date")(a, d, b);
          t && k.$options.getOption("timeStripZeroSeconds") && (a = a.replace(/(?::00)?(?:\.000)?$/, ""));
          return a;
        }

        v = q = null;
        return "";
      });

      if (w(g.min) || g.ngMin) {
        var x = g.min || p(g.ngMin)(e),
            B = s(x);

        k.$validators.min = function (a) {
          return !n(a) || z(B) || d(a) >= B;
        };

        g.$observe("min", function (a) {
          a !== x && (B = s(a), x = a, k.$validate());
        });
      }

      if (w(g.max) || g.ngMax) {
        var y = g.max || p(g.ngMax)(e),
            J = s(y);

        k.$validators.max = function (a) {
          return !n(a) || z(J) || d(a) <= J;
        };

        g.$observe("max", function (a) {
          a !== y && (J = s(a), y = a, k.$validate());
        });
      }
    };
  }

  function Ic(a, b, d, c, e) {
    (c.$$hasNativeValidators = D(b[0].validity)) && c.$parsers.push(function (a) {
      var d = b.prop("validity") || {};
      if (d.badInput || d.typeMismatch) c.$$parserName = e;else return a;
    });
  }

  function de(a) {
    a.$parsers.push(function (b) {
      if (a.$isEmpty(b)) return null;
      if (ih.test(b)) return parseFloat(b);
      a.$$parserName = "number";
    });
    a.$formatters.push(function (b) {
      if (!a.$isEmpty(b)) {
        if (!W(b)) throw ob("numfmt", b);
        b = b.toString();
      }

      return b;
    });
  }

  function na(a) {
    w(a) && !W(a) && (a = parseFloat(a));
    return X(a) ? void 0 : a;
  }

  function Jc(a) {
    var b = a.toString(),
        d = b.indexOf(".");
    return -1 === d ? -1 < a && 1 > a && (a = /e-(\d+)$/.exec(b)) ? Number(a[1]) : 0 : b.length - d - 1;
  }

  function ee(a, b, d) {
    a = Number(a);
    var c = (a | 0) !== a,
        e = (b | 0) !== b,
        f = (d | 0) !== d;

    if (c || e || f) {
      var g = c ? Jc(a) : 0,
          k = e ? Jc(b) : 0,
          h = f ? Jc(d) : 0,
          g = Math.max(g, k, h),
          g = Math.pow(10, g);
      a *= g;
      b *= g;
      d *= g;
      c && (a = Math.round(a));
      e && (b = Math.round(b));
      f && (d = Math.round(d));
    }

    return 0 === (a - b) % d;
  }

  function fe(a, b, d, c, e) {
    if (w(c)) {
      a = a(c);
      if (!a.constant) throw ob("constexpr", d, c);
      return a(b);
    }

    return e;
  }

  function Kc(a, b) {
    function d(a, b) {
      if (!a || !a.length) return [];
      if (!b || !b.length) return a;
      var c = [],
          d = 0;

      a: for (; d < a.length; d++) {
        for (var e = a[d], m = 0; m < b.length; m++) {
          if (e === b[m]) continue a;
        }

        c.push(e);
      }

      return c;
    }

    function c(a) {
      if (!a) return a;
      var b = a;
      H(a) ? b = a.map(c).join(" ") : D(a) ? b = Object.keys(a).filter(function (b) {
        return a[b];
      }).join(" ") : A(a) || (b = a + "");
      return b;
    }

    a = "ngClass" + a;
    var e;
    return ["$parse", function (f) {
      return {
        restrict: "AC",
        link: function link(g, k, h) {
          function l(a, b) {
            var c = [];
            r(a, function (a) {
              if (0 < b || p[a]) p[a] = (p[a] || 0) + b, p[a] === +(0 < b) && c.push(a);
            });
            return c.join(" ");
          }

          function m(a) {
            if (a === b) {
              var c = s,
                  c = l(c && c.split(" "), 1);
              h.$addClass(c);
            } else c = s, c = l(c && c.split(" "), -1), h.$removeClass(c);

            n = a;
          }

          var p = k.data("$classCounts"),
              n = !0,
              s;
          p || (p = T(), k.data("$classCounts", p));
          "ngClass" !== a && (e || (e = f("$index", function (a) {
            return a & 1;
          })), g.$watch(e, m));
          g.$watch(f(h[a], c), function (a) {
            if (n === b) {
              var c = s && s.split(" "),
                  e = a && a.split(" "),
                  f = d(c, e),
                  c = d(e, c),
                  f = l(f, -1),
                  c = l(c, 1);
              h.$addClass(c);
              h.$removeClass(f);
            }

            s = a;
          });
        }
      };
    }];
  }

  function qd(a, b, d, c, e, f) {
    return {
      restrict: "A",
      compile: function compile(g, k) {
        var h = a(k[c]);
        return function (a, c) {
          c.on(e, function (c) {
            var e = function e() {
              h(a, {
                $event: c
              });
            };

            if (b.$$phase) {
              if (f) a.$evalAsync(e);else try {
                e();
              } catch (g) {
                d(g);
              }
            } else a.$apply(e);
          });
        };
      }
    };
  }

  function Rb(a, b, d, c, e, f, g, k, h) {
    this.$modelValue = this.$viewValue = Number.NaN;
    this.$$rawModelValue = void 0;
    this.$validators = {};
    this.$asyncValidators = {};
    this.$parsers = [];
    this.$formatters = [];
    this.$viewChangeListeners = [];
    this.$untouched = !0;
    this.$touched = !1;
    this.$pristine = !0;
    this.$dirty = !1;
    this.$valid = !0;
    this.$invalid = !1;
    this.$error = {};
    this.$$success = {};
    this.$pending = void 0;
    this.$name = h(d.name || "", !1)(a);
    this.$$parentForm = lb;
    this.$options = Sb;
    this.$$updateEvents = "";
    this.$$updateEventHandler = this.$$updateEventHandler.bind(this);
    this.$$parsedNgModel = e(d.ngModel);
    this.$$parsedNgModelAssign = this.$$parsedNgModel.assign;
    this.$$ngModelGet = this.$$parsedNgModel;
    this.$$ngModelSet = this.$$parsedNgModelAssign;
    this.$$pendingDebounce = null;
    this.$$parserValid = void 0;
    this.$$parserName = "parse";
    this.$$currentValidationRunId = 0;
    this.$$scope = a;
    this.$$rootScope = a.$root;
    this.$$attr = d;
    this.$$element = c;
    this.$$animate = f;
    this.$$timeout = g;
    this.$$parse = e;
    this.$$q = k;
    this.$$exceptionHandler = b;
    Zd(this);
    jh(this);
  }

  function jh(a) {
    a.$$scope.$watch(function (b) {
      b = a.$$ngModelGet(b);
      b === a.$modelValue || a.$modelValue !== a.$modelValue && b !== b || a.$$setModelValue(b);
      return b;
    });
  }

  function Lc(a) {
    this.$$options = a;
  }

  function ge(a, b) {
    r(b, function (b, c) {
      w(a[c]) || (a[c] = b);
    });
  }

  function Oa(a, b) {
    a.prop("selected", b);
    a.attr("selected", b);
  }

  function he(a, b, d) {
    if (a) {
      A(a) && (a = new RegExp("^" + a + "$"));
      if (!a.test) throw F("ngPattern")("noregexp", b, a, za(d));
      return a;
    }
  }

  function Tb(a) {
    a = fa(a);
    return X(a) ? -1 : a;
  }

  var Wb = {
    objectMaxDepth: 5,
    urlErrorParamsEnabled: !0
  },
      ie = /^\/(.+)\/([a-z]*)$/,
      ta = Object.prototype.hasOwnProperty,
      K = function K(a) {
    return A(a) ? a.toLowerCase() : a;
  },
      ub = function ub(a) {
    return A(a) ? a.toUpperCase() : a;
  },
      Ca,
      x,
      rb,
      Ha = [].slice,
      Fg = [].splice,
      kh = [].push,
      la = Object.prototype.toString,
      Pc = Object.getPrototypeOf,
      pa = F("ng"),
      ca = C.angular || (C.angular = {}),
      kc,
      pb = 0;

  Ca = C.document.documentMode;

  var X = Number.isNaN || function (a) {
    return a !== a;
  };

  E.$inject = [];
  Ta.$inject = [];

  var ve = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array]$/,
      U = function U(a) {
    return A(a) ? a.trim() : a;
  },
      Md = function Md(a) {
    return a.replace(/([-()[\]{}+?*.$^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
  },
      Aa = function Aa() {
    if (!w(Aa.rules)) {
      var a = C.document.querySelector("[ng-csp]") || C.document.querySelector("[data-ng-csp]");

      if (a) {
        var b = a.getAttribute("ng-csp") || a.getAttribute("data-ng-csp");
        Aa.rules = {
          noUnsafeEval: !b || -1 !== b.indexOf("no-unsafe-eval"),
          noInlineStyle: !b || -1 !== b.indexOf("no-inline-style")
        };
      } else {
        a = Aa;

        try {
          new Function(""), b = !1;
        } catch (d) {
          b = !0;
        }

        a.rules = {
          noUnsafeEval: b,
          noInlineStyle: !1
        };
      }
    }

    return Aa.rules;
  },
      qb = function qb() {
    if (w(qb.name_)) return qb.name_;
    var a,
        b,
        d = Qa.length,
        c,
        e;

    for (b = 0; b < d; ++b) {
      if (c = Qa[b], a = C.document.querySelector("[" + c.replace(":", "\\:") + "jq]")) {
        e = a.getAttribute(c + "jq");
        break;
      }
    }

    return qb.name_ = e;
  },
      xe = /:/g,
      Qa = ["ng-", "data-ng-", "ng:", "x-ng-"],
      Be = function (a) {
    var b = a.currentScript;
    if (!b) return !0;
    if (!(b instanceof C.HTMLScriptElement || b instanceof C.SVGScriptElement)) return !1;
    b = b.attributes;
    return [b.getNamedItem("src"), b.getNamedItem("href"), b.getNamedItem("xlink:href")].every(function (b) {
      if (!b) return !0;
      if (!b.value) return !1;
      var c = a.createElement("a");
      c.href = b.value;
      if (a.location.origin === c.origin) return !0;

      switch (c.protocol) {
        case "http:":
        case "https:":
        case "ftp:":
        case "blob:":
        case "file:":
        case "data:":
          return !0;

        default:
          return !1;
      }
    });
  }(C.document),
      Ee = /[A-Z]/g,
      Wc = !1,
      Pa = 3,
      Ke = {
    full: "1.7.8",
    major: 1,
    minor: 7,
    dot: 8,
    codeName: "enthusiastic-oblation"
  };

  Y.expando = "ng339";
  var Ka = Y.cache = {},
      pg = 1;

  Y._data = function (a) {
    return this.cache[a[this.expando]] || {};
  };

  var lg = /-([a-z])/g,
      lh = /^-ms-/,
      Ab = {
    mouseleave: "mouseout",
    mouseenter: "mouseover"
  },
      nc = F("jqLite"),
      og = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
      mc = /<|&#?\w+;/,
      mg = /<([\w:-]+)/,
      ng = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
      oa = {
    option: [1, '<select multiple="multiple">', "</select>"],
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""]
  };
  oa.optgroup = oa.option;
  oa.tbody = oa.tfoot = oa.colgroup = oa.caption = oa.thead;
  oa.th = oa.td;

  var ug = C.Node.prototype.contains || function (a) {
    return !!(this.compareDocumentPosition(a) & 16);
  },
      Wa = Y.prototype = {
    ready: fd,
    toString: function toString() {
      var a = [];
      r(this, function (b) {
        a.push("" + b);
      });
      return "[" + a.join(", ") + "]";
    },
    eq: function eq(a) {
      return 0 <= a ? x(this[a]) : x(this[this.length + a]);
    },
    length: 0,
    push: kh,
    sort: [].sort,
    splice: [].splice
  },
      Gb = {};

  r("multiple selected checked disabled readOnly required open".split(" "), function (a) {
    Gb[K(a)] = a;
  });
  var md = {};
  r("input select option textarea button form details".split(" "), function (a) {
    md[a] = !0;
  });
  var td = {
    ngMinlength: "minlength",
    ngMaxlength: "maxlength",
    ngMin: "min",
    ngMax: "max",
    ngPattern: "pattern",
    ngStep: "step"
  };
  r({
    data: rc,
    removeData: qc,
    hasData: function hasData(a) {
      for (var b in Ka[a.ng339]) {
        return !0;
      }

      return !1;
    },
    cleanData: function cleanData(a) {
      for (var b = 0, d = a.length; b < d; b++) {
        qc(a[b]), id(a[b]);
      }
    }
  }, function (a, b) {
    Y[b] = a;
  });
  r({
    data: rc,
    inheritedData: Eb,
    scope: function scope(a) {
      return x.data(a, "$scope") || Eb(a.parentNode || a, ["$isolateScope", "$scope"]);
    },
    isolateScope: function isolateScope(a) {
      return x.data(a, "$isolateScope") || x.data(a, "$isolateScopeNoTemplate");
    },
    controller: jd,
    injector: function injector(a) {
      return Eb(a, "$injector");
    },
    removeAttr: function removeAttr(a, b) {
      a.removeAttribute(b);
    },
    hasClass: Bb,
    css: function css(a, b, d) {
      b = xb(b.replace(lh, "ms-"));
      if (w(d)) a.style[b] = d;else return a.style[b];
    },
    attr: function attr(a, b, d) {
      var c = a.nodeType;

      if (c !== Pa && 2 !== c && 8 !== c && a.getAttribute) {
        var c = K(b),
            e = Gb[c];
        if (w(d)) null === d || !1 === d && e ? a.removeAttribute(b) : a.setAttribute(b, e ? c : d);else return a = a.getAttribute(b), e && null !== a && (a = c), null === a ? void 0 : a;
      }
    },
    prop: function prop(a, b, d) {
      if (w(d)) a[b] = d;else return a[b];
    },
    text: function () {
      function a(a, d) {
        if (z(d)) {
          var c = a.nodeType;
          return 1 === c || c === Pa ? a.textContent : "";
        }

        a.textContent = d;
      }

      a.$dv = "";
      return a;
    }(),
    val: function val(a, b) {
      if (z(b)) {
        if (a.multiple && "select" === ua(a)) {
          var d = [];
          r(a.options, function (a) {
            a.selected && d.push(a.value || a.text);
          });
          return d;
        }

        return a.value;
      }

      a.value = b;
    },
    html: function html(a, b) {
      if (z(b)) return a.innerHTML;
      yb(a, !0);
      a.innerHTML = b;
    },
    empty: kd
  }, function (a, b) {
    Y.prototype[b] = function (b, c) {
      var e,
          f,
          g = this.length;

      if (a !== kd && z(2 === a.length && a !== Bb && a !== jd ? b : c)) {
        if (D(b)) {
          for (e = 0; e < g; e++) {
            if (a === rc) a(this[e], b);else for (f in b) {
              a(this[e], f, b[f]);
            }
          }

          return this;
        }

        e = a.$dv;
        g = z(e) ? Math.min(g, 1) : g;

        for (f = 0; f < g; f++) {
          var k = a(this[f], b, c);
          e = e ? e + k : k;
        }

        return e;
      }

      for (e = 0; e < g; e++) {
        a(this[e], b, c);
      }

      return this;
    };
  });
  r({
    removeData: qc,
    on: function on(a, b, d, c) {
      if (w(c)) throw nc("onargs");

      if (lc(a)) {
        c = zb(a, !0);
        var e = c.events,
            f = c.handle;
        f || (f = c.handle = rg(a, e));
        c = 0 <= b.indexOf(" ") ? b.split(" ") : [b];

        for (var g = c.length, k = function k(b, c, g) {
          var k = e[b];
          k || (k = e[b] = [], k.specialHandlerWrapper = c, "$destroy" === b || g || a.addEventListener(b, f));
          k.push(d);
        }; g--;) {
          b = c[g], Ab[b] ? (k(Ab[b], tg), k(b, void 0, !0)) : k(b);
        }
      }
    },
    off: id,
    one: function one(a, b, d) {
      a = x(a);
      a.on(b, function e() {
        a.off(b, d);
        a.off(b, e);
      });
      a.on(b, d);
    },
    replaceWith: function replaceWith(a, b) {
      var d,
          c = a.parentNode;
      yb(a);
      r(new Y(b), function (b) {
        d ? c.insertBefore(b, d.nextSibling) : c.replaceChild(b, a);
        d = b;
      });
    },
    children: function children(a) {
      var b = [];
      r(a.childNodes, function (a) {
        1 === a.nodeType && b.push(a);
      });
      return b;
    },
    contents: function contents(a) {
      return a.contentDocument || a.childNodes || [];
    },
    append: function append(a, b) {
      var d = a.nodeType;

      if (1 === d || 11 === d) {
        b = new Y(b);

        for (var d = 0, c = b.length; d < c; d++) {
          a.appendChild(b[d]);
        }
      }
    },
    prepend: function prepend(a, b) {
      if (1 === a.nodeType) {
        var d = a.firstChild;
        r(new Y(b), function (b) {
          a.insertBefore(b, d);
        });
      }
    },
    wrap: function wrap(a, b) {
      var d = x(b).eq(0).clone()[0],
          c = a.parentNode;
      c && c.replaceChild(d, a);
      d.appendChild(a);
    },
    remove: Fb,
    detach: function detach(a) {
      Fb(a, !0);
    },
    after: function after(a, b) {
      var d = a,
          c = a.parentNode;

      if (c) {
        b = new Y(b);

        for (var e = 0, f = b.length; e < f; e++) {
          var g = b[e];
          c.insertBefore(g, d.nextSibling);
          d = g;
        }
      }
    },
    addClass: Db,
    removeClass: Cb,
    toggleClass: function toggleClass(a, b, d) {
      b && r(b.split(" "), function (b) {
        var e = d;
        z(e) && (e = !Bb(a, b));
        (e ? Db : Cb)(a, b);
      });
    },
    parent: function parent(a) {
      return (a = a.parentNode) && 11 !== a.nodeType ? a : null;
    },
    next: function next(a) {
      return a.nextElementSibling;
    },
    find: function find(a, b) {
      return a.getElementsByTagName ? a.getElementsByTagName(b) : [];
    },
    clone: pc,
    triggerHandler: function triggerHandler(a, b, d) {
      var c,
          e,
          f = b.type || b,
          g = zb(a);
      if (g = (g = g && g.events) && g[f]) c = {
        preventDefault: function preventDefault() {
          this.defaultPrevented = !0;
        },
        isDefaultPrevented: function isDefaultPrevented() {
          return !0 === this.defaultPrevented;
        },
        stopImmediatePropagation: function stopImmediatePropagation() {
          this.immediatePropagationStopped = !0;
        },
        isImmediatePropagationStopped: function isImmediatePropagationStopped() {
          return !0 === this.immediatePropagationStopped;
        },
        stopPropagation: E,
        type: f,
        target: a
      }, b.type && (c = S(c, b)), b = ja(g), e = d ? [c].concat(d) : [c], r(b, function (b) {
        c.isImmediatePropagationStopped() || b.apply(a, e);
      });
    }
  }, function (a, b) {
    Y.prototype[b] = function (b, c, e) {
      for (var f, g = 0, k = this.length; g < k; g++) {
        z(f) ? (f = a(this[g], b, c, e), w(f) && (f = x(f))) : oc(f, a(this[g], b, c, e));
      }

      return w(f) ? f : this;
    };
  });
  Y.prototype.bind = Y.prototype.on;
  Y.prototype.unbind = Y.prototype.off;
  var mh = Object.create(null);
  nd.prototype = {
    _idx: function _idx(a) {
      a !== this._lastKey && (this._lastKey = a, this._lastIndex = this._keys.indexOf(a));
      return this._lastIndex;
    },
    _transformKey: function _transformKey(a) {
      return X(a) ? mh : a;
    },
    get: function get(a) {
      a = this._transformKey(a);
      a = this._idx(a);
      if (-1 !== a) return this._values[a];
    },
    has: function has(a) {
      a = this._transformKey(a);
      return -1 !== this._idx(a);
    },
    set: function set(a, b) {
      a = this._transformKey(a);

      var d = this._idx(a);

      -1 === d && (d = this._lastIndex = this._keys.length);
      this._keys[d] = a;
      this._values[d] = b;
    },
    "delete": function _delete(a) {
      a = this._transformKey(a);
      a = this._idx(a);
      if (-1 === a) return !1;

      this._keys.splice(a, 1);

      this._values.splice(a, 1);

      this._lastKey = NaN;
      this._lastIndex = -1;
      return !0;
    }
  };
  var Hb = nd,
      jg = [function () {
    this.$get = [function () {
      return Hb;
    }];
  }],
      wg = /^([^(]+?)=>/,
      xg = /^[^(]*\(\s*([^)]*)\)/m,
      nh = /,/,
      oh = /^\s*(_?)(\S+?)\1\s*$/,
      vg = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
      Ba = F("$injector");

  fb.$$annotate = function (a, b, d) {
    var c;

    if ("function" === typeof a) {
      if (!(c = a.$inject)) {
        c = [];

        if (a.length) {
          if (b) throw A(d) && d || (d = a.name || yg(a)), Ba("strictdi", d);
          b = od(a);
          r(b[1].split(nh), function (a) {
            a.replace(oh, function (a, b, d) {
              c.push(d);
            });
          });
        }

        a.$inject = c;
      }
    } else H(a) ? (b = a.length - 1, sb(a[b], "fn"), c = a.slice(0, b)) : sb(a, "fn", !0);

    return c;
  };

  var je = F("$animate"),
      zf = function zf() {
    this.$get = E;
  },
      Af = function Af() {
    var a = new Hb(),
        b = [];
    this.$get = ["$$AnimateRunner", "$rootScope", function (d, c) {
      function e(a, b, c) {
        var d = !1;
        b && (b = A(b) ? b.split(" ") : H(b) ? b : [], r(b, function (b) {
          b && (d = !0, a[b] = c);
        }));
        return d;
      }

      function f() {
        r(b, function (b) {
          var c = a.get(b);

          if (c) {
            var d = zg(b.attr("class")),
                e = "",
                f = "";
            r(c, function (a, b) {
              a !== !!d[b] && (a ? e += (e.length ? " " : "") + b : f += (f.length ? " " : "") + b);
            });
            r(b, function (a) {
              e && Db(a, e);
              f && Cb(a, f);
            });
            a["delete"](b);
          }
        });
        b.length = 0;
      }

      return {
        enabled: E,
        on: E,
        off: E,
        pin: E,
        push: function push(g, k, h, l) {
          l && l();
          h = h || {};
          h.from && g.css(h.from);
          h.to && g.css(h.to);
          if (h.addClass || h.removeClass) if (k = h.addClass, l = h.removeClass, h = a.get(g) || {}, k = e(h, k, !0), l = e(h, l, !1), k || l) a.set(g, h), b.push(g), 1 === b.length && c.$$postDigest(f);
          g = new d();
          g.complete();
          return g;
        }
      };
    }];
  },
      xf = ["$provide", function (a) {
    var b = this,
        d = null,
        c = null;
    this.$$registeredAnimations = Object.create(null);

    this.register = function (c, d) {
      if (c && "." !== c.charAt(0)) throw je("notcsel", c);
      var g = c + "-animation";
      b.$$registeredAnimations[c.substr(1)] = g;
      a.factory(g, d);
    };

    this.customFilter = function (a) {
      1 === arguments.length && (c = B(a) ? a : null);
      return c;
    };

    this.classNameFilter = function (a) {
      if (1 === arguments.length && (d = a instanceof RegExp ? a : null) && /[(\s|\/)]ng-animate[(\s|\/)]/.test(d.toString())) throw d = null, je("nongcls", "ng-animate");
      return d;
    };

    this.$get = ["$$animateQueue", function (a) {
      function b(a, c, d) {
        if (d) {
          var e;

          a: {
            for (e = 0; e < d.length; e++) {
              var f = d[e];

              if (1 === f.nodeType) {
                e = f;
                break a;
              }
            }

            e = void 0;
          }

          !e || e.parentNode || e.previousElementSibling || (d = null);
        }

        d ? d.after(a) : c.prepend(a);
      }

      return {
        on: a.on,
        off: a.off,
        pin: a.pin,
        enabled: a.enabled,
        cancel: function cancel(a) {
          a.cancel && a.cancel();
        },
        enter: function enter(c, d, h, l) {
          d = d && x(d);
          h = h && x(h);
          d = d || h.parent();
          b(c, d, h);
          return a.push(c, "enter", ra(l));
        },
        move: function move(c, d, h, l) {
          d = d && x(d);
          h = h && x(h);
          d = d || h.parent();
          b(c, d, h);
          return a.push(c, "move", ra(l));
        },
        leave: function leave(b, c) {
          return a.push(b, "leave", ra(c), function () {
            b.remove();
          });
        },
        addClass: function addClass(b, c, d) {
          d = ra(d);
          d.addClass = hb(d.addclass, c);
          return a.push(b, "addClass", d);
        },
        removeClass: function removeClass(b, c, d) {
          d = ra(d);
          d.removeClass = hb(d.removeClass, c);
          return a.push(b, "removeClass", d);
        },
        setClass: function setClass(b, c, d, f) {
          f = ra(f);
          f.addClass = hb(f.addClass, c);
          f.removeClass = hb(f.removeClass, d);
          return a.push(b, "setClass", f);
        },
        animate: function animate(b, c, d, f, m) {
          m = ra(m);
          m.from = m.from ? S(m.from, c) : c;
          m.to = m.to ? S(m.to, d) : d;
          m.tempClasses = hb(m.tempClasses, f || "ng-inline-animate");
          return a.push(b, "animate", m);
        }
      };
    }];
  }],
      Cf = function Cf() {
    this.$get = ["$$rAF", function (a) {
      function b(b) {
        d.push(b);
        1 < d.length || a(function () {
          for (var a = 0; a < d.length; a++) {
            d[a]();
          }

          d = [];
        });
      }

      var d = [];
      return function () {
        var a = !1;
        b(function () {
          a = !0;
        });
        return function (d) {
          a ? d() : b(d);
        };
      };
    }];
  },
      Bf = function Bf() {
    this.$get = ["$q", "$sniffer", "$$animateAsyncRun", "$$isDocumentHidden", "$timeout", function (a, b, d, c, e) {
      function f(a) {
        this.setHost(a);
        var b = d();
        this._doneCallbacks = [];

        this._tick = function (a) {
          c() ? e(a, 0, !1) : b(a);
        };

        this._state = 0;
      }

      f.chain = function (a, b) {
        function c() {
          if (d === a.length) b(!0);else a[d](function (a) {
            !1 === a ? b(!1) : (d++, c());
          });
        }

        var d = 0;
        c();
      };

      f.all = function (a, b) {
        function c(f) {
          e = e && f;
          ++d === a.length && b(e);
        }

        var d = 0,
            e = !0;
        r(a, function (a) {
          a.done(c);
        });
      };

      f.prototype = {
        setHost: function setHost(a) {
          this.host = a || {};
        },
        done: function done(a) {
          2 === this._state ? a() : this._doneCallbacks.push(a);
        },
        progress: E,
        getPromise: function getPromise() {
          if (!this.promise) {
            var b = this;
            this.promise = a(function (a, c) {
              b.done(function (b) {
                !1 === b ? c() : a();
              });
            });
          }

          return this.promise;
        },
        then: function then(a, b) {
          return this.getPromise().then(a, b);
        },
        "catch": function _catch(a) {
          return this.getPromise()["catch"](a);
        },
        "finally": function _finally(a) {
          return this.getPromise()["finally"](a);
        },
        pause: function pause() {
          this.host.pause && this.host.pause();
        },
        resume: function resume() {
          this.host.resume && this.host.resume();
        },
        end: function end() {
          this.host.end && this.host.end();

          this._resolve(!0);
        },
        cancel: function cancel() {
          this.host.cancel && this.host.cancel();

          this._resolve(!1);
        },
        complete: function complete(a) {
          var b = this;
          0 === b._state && (b._state = 1, b._tick(function () {
            b._resolve(a);
          }));
        },
        _resolve: function _resolve(a) {
          2 !== this._state && (r(this._doneCallbacks, function (b) {
            b(a);
          }), this._doneCallbacks.length = 0, this._state = 2);
        }
      };
      return f;
    }];
  },
      yf = function yf() {
    this.$get = ["$$rAF", "$q", "$$AnimateRunner", function (a, b, d) {
      return function (b, e) {
        function f() {
          a(function () {
            g.addClass && (b.addClass(g.addClass), g.addClass = null);
            g.removeClass && (b.removeClass(g.removeClass), g.removeClass = null);
            g.to && (b.css(g.to), g.to = null);
            k || h.complete();
            k = !0;
          });
          return h;
        }

        var g = e || {};
        g.$$prepared || (g = Ia(g));
        g.cleanupStyles && (g.from = g.to = null);
        g.from && (b.css(g.from), g.from = null);
        var k,
            h = new d();
        return {
          start: f,
          end: f
        };
      };
    }];
  },
      $ = F("$compile"),
      tc = new function () {}();

  Xc.$inject = ["$provide", "$$sanitizeUriProvider"];

  Jb.prototype.isFirstChange = function () {
    return this.previousValue === tc;
  };

  var pd = /^((?:x|data)[:\-_])/i,
      Eg = /[:\-_]+(.)/g,
      vd = F("$controller"),
      ud = /^(\S+)(\s+as\s+([\w$]+))?$/,
      Jf = function Jf() {
    this.$get = ["$document", function (a) {
      return function (b) {
        b ? !b.nodeType && b instanceof x && (b = b[0]) : b = a[0].body;
        return b.offsetWidth + 1;
      };
    }];
  },
      wd = "application/json",
      wc = {
    "Content-Type": wd + ";charset=utf-8"
  },
      Hg = /^\[|^\{(?!\{)/,
      Ig = {
    "[": /]$/,
    "{": /}$/
  },
      Gg = /^\)]\}',?\n/,
      Kb = F("$http"),
      Ma = ca.$interpolateMinErr = F("$interpolate");

  Ma.throwNoconcat = function (a) {
    throw Ma("noconcat", a);
  };

  Ma.interr = function (a, b) {
    return Ma("interr", a, b.toString());
  };

  var Lg = F("$interval"),
      Sf = function Sf() {
    this.$get = function () {
      function a(a) {
        var b = function b(a) {
          b.data = a;
          b.called = !0;
        };

        b.id = a;
        return b;
      }

      var b = ca.callbacks,
          d = {};
      return {
        createCallback: function createCallback(c) {
          c = "_" + (b.$$counter++).toString(36);
          var e = "angular.callbacks." + c,
              f = a(c);
          d[e] = b[c] = f;
          return e;
        },
        wasCalled: function wasCalled(a) {
          return d[a].called;
        },
        getResponse: function getResponse(a) {
          return d[a].data;
        },
        removeCallback: function removeCallback(a) {
          delete b[d[a].id];
          delete d[a];
        }
      };
    };
  },
      ph = /^([^?#]*)(\?([^#]*))?(#(.*))?$/,
      Mg = {
    http: 80,
    https: 443,
    ftp: 21
  },
      jb = F("$location"),
      Ng = /^\s*[\\/]{2,}/,
      qh = {
    $$absUrl: "",
    $$html5: !1,
    $$replace: !1,
    $$compose: function $$compose() {
      for (var a = this.$$path, b = this.$$hash, d = ye(this.$$search), b = b ? "#" + hc(b) : "", a = a.split("/"), c = a.length; c--;) {
        a[c] = hc(a[c].replace(/%2F/g, "/"));
      }

      this.$$url = a.join("/") + (d ? "?" + d : "") + b;
      this.$$absUrl = this.$$normalizeUrl(this.$$url);
      this.$$urlUpdatedByLocation = !0;
    },
    absUrl: Lb("$$absUrl"),
    url: function url(a) {
      if (z(a)) return this.$$url;
      var b = ph.exec(a);
      (b[1] || "" === a) && this.path(decodeURIComponent(b[1]));
      (b[2] || b[1] || "" === a) && this.search(b[3] || "");
      this.hash(b[5] || "");
      return this;
    },
    protocol: Lb("$$protocol"),
    host: Lb("$$host"),
    port: Lb("$$port"),
    path: Dd("$$path", function (a) {
      a = null !== a ? a.toString() : "";
      return "/" === a.charAt(0) ? a : "/" + a;
    }),
    search: function search(a, b) {
      switch (arguments.length) {
        case 0:
          return this.$$search;

        case 1:
          if (A(a) || W(a)) a = a.toString(), this.$$search = gc(a);else if (D(a)) a = Ia(a, {}), r(a, function (b, c) {
            null == b && delete a[c];
          }), this.$$search = a;else throw jb("isrcharg");
          break;

        default:
          z(b) || null === b ? delete this.$$search[a] : this.$$search[a] = b;
      }

      this.$$compose();
      return this;
    },
    hash: Dd("$$hash", function (a) {
      return null !== a ? a.toString() : "";
    }),
    replace: function replace() {
      this.$$replace = !0;
      return this;
    }
  };

  r([Cd, zc, yc], function (a) {
    a.prototype = Object.create(qh);

    a.prototype.state = function (b) {
      if (!arguments.length) return this.$$state;
      if (a !== yc || !this.$$html5) throw jb("nostate");
      this.$$state = z(b) ? null : b;
      this.$$urlUpdatedByLocation = !0;
      return this;
    };
  });
  var Ya = F("$parse"),
      Rg = {}.constructor.prototype.valueOf,
      Ub = T();
  r("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function (a) {
    Ub[a] = !0;
  });

  var rh = {
    n: "\n",
    f: "\f",
    r: "\r",
    t: "\t",
    v: "\v",
    "'": "'",
    '"': '"'
  },
      Nb = function Nb(a) {
    this.options = a;
  };

  Nb.prototype = {
    constructor: Nb,
    lex: function lex(a) {
      this.text = a;
      this.index = 0;

      for (this.tokens = []; this.index < this.text.length;) {
        if (a = this.text.charAt(this.index), '"' === a || "'" === a) this.readString(a);else if (this.isNumber(a) || "." === a && this.isNumber(this.peek())) this.readNumber();else if (this.isIdentifierStart(this.peekMultichar())) this.readIdent();else if (this.is(a, "(){}[].,;:?")) this.tokens.push({
          index: this.index,
          text: a
        }), this.index++;else if (this.isWhitespace(a)) this.index++;else {
          var b = a + this.peek(),
              d = b + this.peek(2),
              c = Ub[b],
              e = Ub[d];
          Ub[a] || c || e ? (a = e ? d : c ? b : a, this.tokens.push({
            index: this.index,
            text: a,
            operator: !0
          }), this.index += a.length) : this.throwError("Unexpected next character ", this.index, this.index + 1);
        }
      }

      return this.tokens;
    },
    is: function is(a, b) {
      return -1 !== b.indexOf(a);
    },
    peek: function peek(a) {
      a = a || 1;
      return this.index + a < this.text.length ? this.text.charAt(this.index + a) : !1;
    },
    isNumber: function isNumber(a) {
      return "0" <= a && "9" >= a && "string" === typeof a;
    },
    isWhitespace: function isWhitespace(a) {
      return " " === a || "\r" === a || "\t" === a || "\n" === a || "\v" === a || "\xA0" === a;
    },
    isIdentifierStart: function isIdentifierStart(a) {
      return this.options.isIdentifierStart ? this.options.isIdentifierStart(a, this.codePointAt(a)) : this.isValidIdentifierStart(a);
    },
    isValidIdentifierStart: function isValidIdentifierStart(a) {
      return "a" <= a && "z" >= a || "A" <= a && "Z" >= a || "_" === a || "$" === a;
    },
    isIdentifierContinue: function isIdentifierContinue(a) {
      return this.options.isIdentifierContinue ? this.options.isIdentifierContinue(a, this.codePointAt(a)) : this.isValidIdentifierContinue(a);
    },
    isValidIdentifierContinue: function isValidIdentifierContinue(a, b) {
      return this.isValidIdentifierStart(a, b) || this.isNumber(a);
    },
    codePointAt: function codePointAt(a) {
      return 1 === a.length ? a.charCodeAt(0) : (a.charCodeAt(0) << 10) + a.charCodeAt(1) - 56613888;
    },
    peekMultichar: function peekMultichar() {
      var a = this.text.charAt(this.index),
          b = this.peek();
      if (!b) return a;
      var d = a.charCodeAt(0),
          c = b.charCodeAt(0);
      return 55296 <= d && 56319 >= d && 56320 <= c && 57343 >= c ? a + b : a;
    },
    isExpOperator: function isExpOperator(a) {
      return "-" === a || "+" === a || this.isNumber(a);
    },
    throwError: function throwError(a, b, d) {
      d = d || this.index;
      b = w(b) ? "s " + b + "-" + this.index + " [" + this.text.substring(b, d) + "]" : " " + d;
      throw Ya("lexerr", a, b, this.text);
    },
    readNumber: function readNumber() {
      for (var a = "", b = this.index; this.index < this.text.length;) {
        var d = K(this.text.charAt(this.index));
        if ("." === d || this.isNumber(d)) a += d;else {
          var c = this.peek();
          if ("e" === d && this.isExpOperator(c)) a += d;else if (this.isExpOperator(d) && c && this.isNumber(c) && "e" === a.charAt(a.length - 1)) a += d;else if (!this.isExpOperator(d) || c && this.isNumber(c) || "e" !== a.charAt(a.length - 1)) break;else this.throwError("Invalid exponent");
        }
        this.index++;
      }

      this.tokens.push({
        index: b,
        text: a,
        constant: !0,
        value: Number(a)
      });
    },
    readIdent: function readIdent() {
      var a = this.index;

      for (this.index += this.peekMultichar().length; this.index < this.text.length;) {
        var b = this.peekMultichar();
        if (!this.isIdentifierContinue(b)) break;
        this.index += b.length;
      }

      this.tokens.push({
        index: a,
        text: this.text.slice(a, this.index),
        identifier: !0
      });
    },
    readString: function readString(a) {
      var b = this.index;
      this.index++;

      for (var d = "", c = a, e = !1; this.index < this.text.length;) {
        var f = this.text.charAt(this.index),
            c = c + f;
        if (e) "u" === f ? (e = this.text.substring(this.index + 1, this.index + 5), e.match(/[\da-f]{4}/i) || this.throwError("Invalid unicode escape [\\u" + e + "]"), this.index += 4, d += String.fromCharCode(parseInt(e, 16))) : d += rh[f] || f, e = !1;else if ("\\" === f) e = !0;else {
          if (f === a) {
            this.index++;
            this.tokens.push({
              index: b,
              text: c,
              constant: !0,
              value: d
            });
            return;
          }

          d += f;
        }
        this.index++;
      }

      this.throwError("Unterminated quote", b);
    }
  };

  var q = function q(a, b) {
    this.lexer = a;
    this.options = b;
  };

  q.Program = "Program";
  q.ExpressionStatement = "ExpressionStatement";
  q.AssignmentExpression = "AssignmentExpression";
  q.ConditionalExpression = "ConditionalExpression";
  q.LogicalExpression = "LogicalExpression";
  q.BinaryExpression = "BinaryExpression";
  q.UnaryExpression = "UnaryExpression";
  q.CallExpression = "CallExpression";
  q.MemberExpression = "MemberExpression";
  q.Identifier = "Identifier";
  q.Literal = "Literal";
  q.ArrayExpression = "ArrayExpression";
  q.Property = "Property";
  q.ObjectExpression = "ObjectExpression";
  q.ThisExpression = "ThisExpression";
  q.LocalsExpression = "LocalsExpression";
  q.NGValueParameter = "NGValueParameter";
  q.prototype = {
    ast: function ast(a) {
      this.text = a;
      this.tokens = this.lexer.lex(a);
      a = this.program();
      0 !== this.tokens.length && this.throwError("is an unexpected token", this.tokens[0]);
      return a;
    },
    program: function program() {
      for (var a = [];;) {
        if (0 < this.tokens.length && !this.peek("}", ")", ";", "]") && a.push(this.expressionStatement()), !this.expect(";")) return {
          type: q.Program,
          body: a
        };
      }
    },
    expressionStatement: function expressionStatement() {
      return {
        type: q.ExpressionStatement,
        expression: this.filterChain()
      };
    },
    filterChain: function filterChain() {
      for (var a = this.expression(); this.expect("|");) {
        a = this.filter(a);
      }

      return a;
    },
    expression: function expression() {
      return this.assignment();
    },
    assignment: function assignment() {
      var a = this.ternary();

      if (this.expect("=")) {
        if (!Hd(a)) throw Ya("lval");
        a = {
          type: q.AssignmentExpression,
          left: a,
          right: this.assignment(),
          operator: "="
        };
      }

      return a;
    },
    ternary: function ternary() {
      var a = this.logicalOR(),
          b,
          d;
      return this.expect("?") && (b = this.expression(), this.consume(":")) ? (d = this.expression(), {
        type: q.ConditionalExpression,
        test: a,
        alternate: b,
        consequent: d
      }) : a;
    },
    logicalOR: function logicalOR() {
      for (var a = this.logicalAND(); this.expect("||");) {
        a = {
          type: q.LogicalExpression,
          operator: "||",
          left: a,
          right: this.logicalAND()
        };
      }

      return a;
    },
    logicalAND: function logicalAND() {
      for (var a = this.equality(); this.expect("&&");) {
        a = {
          type: q.LogicalExpression,
          operator: "&&",
          left: a,
          right: this.equality()
        };
      }

      return a;
    },
    equality: function equality() {
      for (var a = this.relational(), b; b = this.expect("==", "!=", "===", "!==");) {
        a = {
          type: q.BinaryExpression,
          operator: b.text,
          left: a,
          right: this.relational()
        };
      }

      return a;
    },
    relational: function relational() {
      for (var a = this.additive(), b; b = this.expect("<", ">", "<=", ">=");) {
        a = {
          type: q.BinaryExpression,
          operator: b.text,
          left: a,
          right: this.additive()
        };
      }

      return a;
    },
    additive: function additive() {
      for (var a = this.multiplicative(), b; b = this.expect("+", "-");) {
        a = {
          type: q.BinaryExpression,
          operator: b.text,
          left: a,
          right: this.multiplicative()
        };
      }

      return a;
    },
    multiplicative: function multiplicative() {
      for (var a = this.unary(), b; b = this.expect("*", "/", "%");) {
        a = {
          type: q.BinaryExpression,
          operator: b.text,
          left: a,
          right: this.unary()
        };
      }

      return a;
    },
    unary: function unary() {
      var a;
      return (a = this.expect("+", "-", "!")) ? {
        type: q.UnaryExpression,
        operator: a.text,
        prefix: !0,
        argument: this.unary()
      } : this.primary();
    },
    primary: function primary() {
      var a;
      this.expect("(") ? (a = this.filterChain(), this.consume(")")) : this.expect("[") ? a = this.arrayDeclaration() : this.expect("{") ? a = this.object() : this.selfReferential.hasOwnProperty(this.peek().text) ? a = Ia(this.selfReferential[this.consume().text]) : this.options.literals.hasOwnProperty(this.peek().text) ? a = {
        type: q.Literal,
        value: this.options.literals[this.consume().text]
      } : this.peek().identifier ? a = this.identifier() : this.peek().constant ? a = this.constant() : this.throwError("not a primary expression", this.peek());

      for (var b; b = this.expect("(", "[", ".");) {
        "(" === b.text ? (a = {
          type: q.CallExpression,
          callee: a,
          arguments: this.parseArguments()
        }, this.consume(")")) : "[" === b.text ? (a = {
          type: q.MemberExpression,
          object: a,
          property: this.expression(),
          computed: !0
        }, this.consume("]")) : "." === b.text ? a = {
          type: q.MemberExpression,
          object: a,
          property: this.identifier(),
          computed: !1
        } : this.throwError("IMPOSSIBLE");
      }

      return a;
    },
    filter: function filter(a) {
      a = [a];

      for (var b = {
        type: q.CallExpression,
        callee: this.identifier(),
        arguments: a,
        filter: !0
      }; this.expect(":");) {
        a.push(this.expression());
      }

      return b;
    },
    parseArguments: function parseArguments() {
      var a = [];

      if (")" !== this.peekToken().text) {
        do {
          a.push(this.filterChain());
        } while (this.expect(","));
      }

      return a;
    },
    identifier: function identifier() {
      var a = this.consume();
      a.identifier || this.throwError("is not a valid identifier", a);
      return {
        type: q.Identifier,
        name: a.text
      };
    },
    constant: function constant() {
      return {
        type: q.Literal,
        value: this.consume().value
      };
    },
    arrayDeclaration: function arrayDeclaration() {
      var a = [];

      if ("]" !== this.peekToken().text) {
        do {
          if (this.peek("]")) break;
          a.push(this.expression());
        } while (this.expect(","));
      }

      this.consume("]");
      return {
        type: q.ArrayExpression,
        elements: a
      };
    },
    object: function object() {
      var a = [],
          b;

      if ("}" !== this.peekToken().text) {
        do {
          if (this.peek("}")) break;
          b = {
            type: q.Property,
            kind: "init"
          };
          this.peek().constant ? (b.key = this.constant(), b.computed = !1, this.consume(":"), b.value = this.expression()) : this.peek().identifier ? (b.key = this.identifier(), b.computed = !1, this.peek(":") ? (this.consume(":"), b.value = this.expression()) : b.value = b.key) : this.peek("[") ? (this.consume("["), b.key = this.expression(), this.consume("]"), b.computed = !0, this.consume(":"), b.value = this.expression()) : this.throwError("invalid key", this.peek());
          a.push(b);
        } while (this.expect(","));
      }

      this.consume("}");
      return {
        type: q.ObjectExpression,
        properties: a
      };
    },
    throwError: function throwError(a, b) {
      throw Ya("syntax", b.text, a, b.index + 1, this.text, this.text.substring(b.index));
    },
    consume: function consume(a) {
      if (0 === this.tokens.length) throw Ya("ueoe", this.text);
      var b = this.expect(a);
      b || this.throwError("is unexpected, expecting [" + a + "]", this.peek());
      return b;
    },
    peekToken: function peekToken() {
      if (0 === this.tokens.length) throw Ya("ueoe", this.text);
      return this.tokens[0];
    },
    peek: function peek(a, b, d, c) {
      return this.peekAhead(0, a, b, d, c);
    },
    peekAhead: function peekAhead(a, b, d, c, e) {
      if (this.tokens.length > a) {
        a = this.tokens[a];
        var f = a.text;
        if (f === b || f === d || f === c || f === e || !(b || d || c || e)) return a;
      }

      return !1;
    },
    expect: function expect(a, b, d, c) {
      return (a = this.peek(a, b, d, c)) ? (this.tokens.shift(), a) : !1;
    },
    selfReferential: {
      "this": {
        type: q.ThisExpression
      },
      $locals: {
        type: q.LocalsExpression
      }
    }
  };
  var Fd = 2;
  Jd.prototype = {
    compile: function compile(a) {
      var b = this;
      this.state = {
        nextId: 0,
        filters: {},
        fn: {
          vars: [],
          body: [],
          own: {}
        },
        assign: {
          vars: [],
          body: [],
          own: {}
        },
        inputs: []
      };
      Z(a, b.$filter);
      var d = "",
          c;
      this.stage = "assign";
      if (c = Id(a)) this.state.computing = "assign", d = this.nextId(), this.recurse(c, d), this.return_(d), d = "fn.assign=" + this.generateFunction("assign", "s,v,l");
      c = Gd(a.body);
      b.stage = "inputs";
      r(c, function (a, c) {
        var d = "fn" + c;
        b.state[d] = {
          vars: [],
          body: [],
          own: {}
        };
        b.state.computing = d;
        var k = b.nextId();
        b.recurse(a, k);
        b.return_(k);
        b.state.inputs.push({
          name: d,
          isPure: a.isPure
        });
        a.watchId = c;
      });
      this.state.computing = "fn";
      this.stage = "main";
      this.recurse(a);
      a = '"' + this.USE + " " + this.STRICT + '";\n' + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + d + this.watchFns() + "return fn;";
      a = new Function("$filter", "getStringValue", "ifDefined", "plus", a)(this.$filter, Og, Pg, Ed);
      this.state = this.stage = void 0;
      return a;
    },
    USE: "use",
    STRICT: "strict",
    watchFns: function watchFns() {
      var a = [],
          b = this.state.inputs,
          d = this;
      r(b, function (b) {
        a.push("var " + b.name + "=" + d.generateFunction(b.name, "s"));
        b.isPure && a.push(b.name, ".isPure=" + JSON.stringify(b.isPure) + ";");
      });
      b.length && a.push("fn.inputs=[" + b.map(function (a) {
        return a.name;
      }).join(",") + "];");
      return a.join("");
    },
    generateFunction: function generateFunction(a, b) {
      return "function(" + b + "){" + this.varsPrefix(a) + this.body(a) + "};";
    },
    filterPrefix: function filterPrefix() {
      var a = [],
          b = this;
      r(this.state.filters, function (d, c) {
        a.push(d + "=$filter(" + b.escape(c) + ")");
      });
      return a.length ? "var " + a.join(",") + ";" : "";
    },
    varsPrefix: function varsPrefix(a) {
      return this.state[a].vars.length ? "var " + this.state[a].vars.join(",") + ";" : "";
    },
    body: function body(a) {
      return this.state[a].body.join("");
    },
    recurse: function recurse(a, b, d, c, e, f) {
      var g,
          k,
          h = this,
          l,
          m,
          p;
      c = c || E;
      if (!f && w(a.watchId)) b = b || this.nextId(), this.if_("i", this.lazyAssign(b, this.computedMember("i", a.watchId)), this.lazyRecurse(a, b, d, c, e, !0));else switch (a.type) {
        case q.Program:
          r(a.body, function (b, c) {
            h.recurse(b.expression, void 0, void 0, function (a) {
              k = a;
            });
            c !== a.body.length - 1 ? h.current().body.push(k, ";") : h.return_(k);
          });
          break;

        case q.Literal:
          m = this.escape(a.value);
          this.assign(b, m);
          c(b || m);
          break;

        case q.UnaryExpression:
          this.recurse(a.argument, void 0, void 0, function (a) {
            k = a;
          });
          m = a.operator + "(" + this.ifDefined(k, 0) + ")";
          this.assign(b, m);
          c(m);
          break;

        case q.BinaryExpression:
          this.recurse(a.left, void 0, void 0, function (a) {
            g = a;
          });
          this.recurse(a.right, void 0, void 0, function (a) {
            k = a;
          });
          m = "+" === a.operator ? this.plus(g, k) : "-" === a.operator ? this.ifDefined(g, 0) + a.operator + this.ifDefined(k, 0) : "(" + g + ")" + a.operator + "(" + k + ")";
          this.assign(b, m);
          c(m);
          break;

        case q.LogicalExpression:
          b = b || this.nextId();
          h.recurse(a.left, b);
          h.if_("&&" === a.operator ? b : h.not(b), h.lazyRecurse(a.right, b));
          c(b);
          break;

        case q.ConditionalExpression:
          b = b || this.nextId();
          h.recurse(a.test, b);
          h.if_(b, h.lazyRecurse(a.alternate, b), h.lazyRecurse(a.consequent, b));
          c(b);
          break;

        case q.Identifier:
          b = b || this.nextId();
          d && (d.context = "inputs" === h.stage ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", a.name) + "?l:s"), d.computed = !1, d.name = a.name);
          h.if_("inputs" === h.stage || h.not(h.getHasOwnProperty("l", a.name)), function () {
            h.if_("inputs" === h.stage || "s", function () {
              e && 1 !== e && h.if_(h.isNull(h.nonComputedMember("s", a.name)), h.lazyAssign(h.nonComputedMember("s", a.name), "{}"));
              h.assign(b, h.nonComputedMember("s", a.name));
            });
          }, b && h.lazyAssign(b, h.nonComputedMember("l", a.name)));
          c(b);
          break;

        case q.MemberExpression:
          g = d && (d.context = this.nextId()) || this.nextId();
          b = b || this.nextId();
          h.recurse(a.object, g, void 0, function () {
            h.if_(h.notNull(g), function () {
              a.computed ? (k = h.nextId(), h.recurse(a.property, k), h.getStringValue(k), e && 1 !== e && h.if_(h.not(h.computedMember(g, k)), h.lazyAssign(h.computedMember(g, k), "{}")), m = h.computedMember(g, k), h.assign(b, m), d && (d.computed = !0, d.name = k)) : (e && 1 !== e && h.if_(h.isNull(h.nonComputedMember(g, a.property.name)), h.lazyAssign(h.nonComputedMember(g, a.property.name), "{}")), m = h.nonComputedMember(g, a.property.name), h.assign(b, m), d && (d.computed = !1, d.name = a.property.name));
            }, function () {
              h.assign(b, "undefined");
            });
            c(b);
          }, !!e);
          break;

        case q.CallExpression:
          b = b || this.nextId();
          a.filter ? (k = h.filter(a.callee.name), l = [], r(a.arguments, function (a) {
            var b = h.nextId();
            h.recurse(a, b);
            l.push(b);
          }), m = k + "(" + l.join(",") + ")", h.assign(b, m), c(b)) : (k = h.nextId(), g = {}, l = [], h.recurse(a.callee, k, g, function () {
            h.if_(h.notNull(k), function () {
              r(a.arguments, function (b) {
                h.recurse(b, a.constant ? void 0 : h.nextId(), void 0, function (a) {
                  l.push(a);
                });
              });
              m = g.name ? h.member(g.context, g.name, g.computed) + "(" + l.join(",") + ")" : k + "(" + l.join(",") + ")";
              h.assign(b, m);
            }, function () {
              h.assign(b, "undefined");
            });
            c(b);
          }));
          break;

        case q.AssignmentExpression:
          k = this.nextId();
          g = {};
          this.recurse(a.left, void 0, g, function () {
            h.if_(h.notNull(g.context), function () {
              h.recurse(a.right, k);
              m = h.member(g.context, g.name, g.computed) + a.operator + k;
              h.assign(b, m);
              c(b || m);
            });
          }, 1);
          break;

        case q.ArrayExpression:
          l = [];
          r(a.elements, function (b) {
            h.recurse(b, a.constant ? void 0 : h.nextId(), void 0, function (a) {
              l.push(a);
            });
          });
          m = "[" + l.join(",") + "]";
          this.assign(b, m);
          c(b || m);
          break;

        case q.ObjectExpression:
          l = [];
          p = !1;
          r(a.properties, function (a) {
            a.computed && (p = !0);
          });
          p ? (b = b || this.nextId(), this.assign(b, "{}"), r(a.properties, function (a) {
            a.computed ? (g = h.nextId(), h.recurse(a.key, g)) : g = a.key.type === q.Identifier ? a.key.name : "" + a.key.value;
            k = h.nextId();
            h.recurse(a.value, k);
            h.assign(h.member(b, g, a.computed), k);
          })) : (r(a.properties, function (b) {
            h.recurse(b.value, a.constant ? void 0 : h.nextId(), void 0, function (a) {
              l.push(h.escape(b.key.type === q.Identifier ? b.key.name : "" + b.key.value) + ":" + a);
            });
          }), m = "{" + l.join(",") + "}", this.assign(b, m));
          c(b || m);
          break;

        case q.ThisExpression:
          this.assign(b, "s");
          c(b || "s");
          break;

        case q.LocalsExpression:
          this.assign(b, "l");
          c(b || "l");
          break;

        case q.NGValueParameter:
          this.assign(b, "v"), c(b || "v");
      }
    },
    getHasOwnProperty: function getHasOwnProperty(a, b) {
      var d = a + "." + b,
          c = this.current().own;
      c.hasOwnProperty(d) || (c[d] = this.nextId(!1, a + "&&(" + this.escape(b) + " in " + a + ")"));
      return c[d];
    },
    assign: function assign(a, b) {
      if (a) return this.current().body.push(a, "=", b, ";"), a;
    },
    filter: function filter(a) {
      this.state.filters.hasOwnProperty(a) || (this.state.filters[a] = this.nextId(!0));
      return this.state.filters[a];
    },
    ifDefined: function ifDefined(a, b) {
      return "ifDefined(" + a + "," + this.escape(b) + ")";
    },
    plus: function plus(a, b) {
      return "plus(" + a + "," + b + ")";
    },
    return_: function return_(a) {
      this.current().body.push("return ", a, ";");
    },
    if_: function if_(a, b, d) {
      if (!0 === a) b();else {
        var c = this.current().body;
        c.push("if(", a, "){");
        b();
        c.push("}");
        d && (c.push("else{"), d(), c.push("}"));
      }
    },
    not: function not(a) {
      return "!(" + a + ")";
    },
    isNull: function isNull(a) {
      return a + "==null";
    },
    notNull: function notNull(a) {
      return a + "!=null";
    },
    nonComputedMember: function nonComputedMember(a, b) {
      var d = /[^$_a-zA-Z0-9]/g;
      return /^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(b) ? a + "." + b : a + '["' + b.replace(d, this.stringEscapeFn) + '"]';
    },
    computedMember: function computedMember(a, b) {
      return a + "[" + b + "]";
    },
    member: function member(a, b, d) {
      return d ? this.computedMember(a, b) : this.nonComputedMember(a, b);
    },
    getStringValue: function getStringValue(a) {
      this.assign(a, "getStringValue(" + a + ")");
    },
    lazyRecurse: function lazyRecurse(a, b, d, c, e, f) {
      var g = this;
      return function () {
        g.recurse(a, b, d, c, e, f);
      };
    },
    lazyAssign: function lazyAssign(a, b) {
      var d = this;
      return function () {
        d.assign(a, b);
      };
    },
    stringEscapeRegex: /[^ a-zA-Z0-9]/g,
    stringEscapeFn: function stringEscapeFn(a) {
      return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
    },
    escape: function escape(a) {
      if (A(a)) return "'" + a.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
      if (W(a)) return a.toString();
      if (!0 === a) return "true";
      if (!1 === a) return "false";
      if (null === a) return "null";
      if ("undefined" === typeof a) return "undefined";
      throw Ya("esc");
    },
    nextId: function nextId(a, b) {
      var d = "v" + this.state.nextId++;
      a || this.current().vars.push(d + (b ? "=" + b : ""));
      return d;
    },
    current: function current() {
      return this.state[this.state.computing];
    }
  };
  Kd.prototype = {
    compile: function compile(a) {
      var b = this;
      Z(a, b.$filter);
      var d, c;
      if (d = Id(a)) c = this.recurse(d);
      d = Gd(a.body);
      var e;
      d && (e = [], r(d, function (a, c) {
        var d = b.recurse(a);
        d.isPure = a.isPure;
        a.input = d;
        e.push(d);
        a.watchId = c;
      }));
      var f = [];
      r(a.body, function (a) {
        f.push(b.recurse(a.expression));
      });
      a = 0 === a.body.length ? E : 1 === a.body.length ? f[0] : function (a, b) {
        var c;
        r(f, function (d) {
          c = d(a, b);
        });
        return c;
      };
      c && (a.assign = function (a, b, d) {
        return c(a, d, b);
      });
      e && (a.inputs = e);
      return a;
    },
    recurse: function recurse(a, b, d) {
      var c,
          e,
          f = this,
          g;
      if (a.input) return this.inputs(a.input, a.watchId);

      switch (a.type) {
        case q.Literal:
          return this.value(a.value, b);

        case q.UnaryExpression:
          return e = this.recurse(a.argument), this["unary" + a.operator](e, b);

        case q.BinaryExpression:
          return c = this.recurse(a.left), e = this.recurse(a.right), this["binary" + a.operator](c, e, b);

        case q.LogicalExpression:
          return c = this.recurse(a.left), e = this.recurse(a.right), this["binary" + a.operator](c, e, b);

        case q.ConditionalExpression:
          return this["ternary?:"](this.recurse(a.test), this.recurse(a.alternate), this.recurse(a.consequent), b);

        case q.Identifier:
          return f.identifier(a.name, b, d);

        case q.MemberExpression:
          return c = this.recurse(a.object, !1, !!d), a.computed || (e = a.property.name), a.computed && (e = this.recurse(a.property)), a.computed ? this.computedMember(c, e, b, d) : this.nonComputedMember(c, e, b, d);

        case q.CallExpression:
          return g = [], r(a.arguments, function (a) {
            g.push(f.recurse(a));
          }), a.filter && (e = this.$filter(a.callee.name)), a.filter || (e = this.recurse(a.callee, !0)), a.filter ? function (a, c, d, f) {
            for (var p = [], n = 0; n < g.length; ++n) {
              p.push(g[n](a, c, d, f));
            }

            a = e.apply(void 0, p, f);
            return b ? {
              context: void 0,
              name: void 0,
              value: a
            } : a;
          } : function (a, c, d, f) {
            var p = e(a, c, d, f),
                n;

            if (null != p.value) {
              n = [];

              for (var s = 0; s < g.length; ++s) {
                n.push(g[s](a, c, d, f));
              }

              n = p.value.apply(p.context, n);
            }

            return b ? {
              value: n
            } : n;
          };

        case q.AssignmentExpression:
          return c = this.recurse(a.left, !0, 1), e = this.recurse(a.right), function (a, d, f, g) {
            var p = c(a, d, f, g);
            a = e(a, d, f, g);
            p.context[p.name] = a;
            return b ? {
              value: a
            } : a;
          };

        case q.ArrayExpression:
          return g = [], r(a.elements, function (a) {
            g.push(f.recurse(a));
          }), function (a, c, d, e) {
            for (var f = [], n = 0; n < g.length; ++n) {
              f.push(g[n](a, c, d, e));
            }

            return b ? {
              value: f
            } : f;
          };

        case q.ObjectExpression:
          return g = [], r(a.properties, function (a) {
            a.computed ? g.push({
              key: f.recurse(a.key),
              computed: !0,
              value: f.recurse(a.value)
            }) : g.push({
              key: a.key.type === q.Identifier ? a.key.name : "" + a.key.value,
              computed: !1,
              value: f.recurse(a.value)
            });
          }), function (a, c, d, e) {
            for (var f = {}, n = 0; n < g.length; ++n) {
              g[n].computed ? f[g[n].key(a, c, d, e)] = g[n].value(a, c, d, e) : f[g[n].key] = g[n].value(a, c, d, e);
            }

            return b ? {
              value: f
            } : f;
          };

        case q.ThisExpression:
          return function (a) {
            return b ? {
              value: a
            } : a;
          };

        case q.LocalsExpression:
          return function (a, c) {
            return b ? {
              value: c
            } : c;
          };

        case q.NGValueParameter:
          return function (a, c, d) {
            return b ? {
              value: d
            } : d;
          };
      }
    },
    "unary+": function unary(a, b) {
      return function (d, c, e, f) {
        d = a(d, c, e, f);
        d = w(d) ? +d : 0;
        return b ? {
          value: d
        } : d;
      };
    },
    "unary-": function unary(a, b) {
      return function (d, c, e, f) {
        d = a(d, c, e, f);
        d = w(d) ? -d : -0;
        return b ? {
          value: d
        } : d;
      };
    },
    "unary!": function unary(a, b) {
      return function (d, c, e, f) {
        d = !a(d, c, e, f);
        return b ? {
          value: d
        } : d;
      };
    },
    "binary+": function binary(a, b, d) {
      return function (c, e, f, g) {
        var k = a(c, e, f, g);
        c = b(c, e, f, g);
        k = Ed(k, c);
        return d ? {
          value: k
        } : k;
      };
    },
    "binary-": function binary(a, b, d) {
      return function (c, e, f, g) {
        var k = a(c, e, f, g);
        c = b(c, e, f, g);
        k = (w(k) ? k : 0) - (w(c) ? c : 0);
        return d ? {
          value: k
        } : k;
      };
    },
    "binary*": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) * b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary/": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) / b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary%": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) % b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary===": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) === b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary!==": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) !== b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary==": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) == b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary!=": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) != b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary<": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) < b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary>": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) > b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary<=": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) <= b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary>=": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) >= b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary&&": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) && b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "binary||": function binary(a, b, d) {
      return function (c, e, f, g) {
        c = a(c, e, f, g) || b(c, e, f, g);
        return d ? {
          value: c
        } : c;
      };
    },
    "ternary?:": function ternary(a, b, d, c) {
      return function (e, f, g, k) {
        e = a(e, f, g, k) ? b(e, f, g, k) : d(e, f, g, k);
        return c ? {
          value: e
        } : e;
      };
    },
    value: function value(a, b) {
      return function () {
        return b ? {
          context: void 0,
          name: void 0,
          value: a
        } : a;
      };
    },
    identifier: function identifier(a, b, d) {
      return function (c, e, f, g) {
        c = e && a in e ? e : c;
        d && 1 !== d && c && null == c[a] && (c[a] = {});
        e = c ? c[a] : void 0;
        return b ? {
          context: c,
          name: a,
          value: e
        } : e;
      };
    },
    computedMember: function computedMember(a, b, d, c) {
      return function (e, f, g, k) {
        var h = a(e, f, g, k),
            l,
            m;
        null != h && (l = b(e, f, g, k), l += "", c && 1 !== c && h && !h[l] && (h[l] = {}), m = h[l]);
        return d ? {
          context: h,
          name: l,
          value: m
        } : m;
      };
    },
    nonComputedMember: function nonComputedMember(a, b, d, c) {
      return function (e, f, g, k) {
        e = a(e, f, g, k);
        c && 1 !== c && e && null == e[b] && (e[b] = {});
        f = null != e ? e[b] : void 0;
        return d ? {
          context: e,
          name: b,
          value: f
        } : f;
      };
    },
    inputs: function inputs(a, b) {
      return function (d, c, e, f) {
        return f ? f[b] : a(d, c, e);
      };
    }
  };
  Mb.prototype = {
    constructor: Mb,
    parse: function parse(a) {
      a = this.getAst(a);
      var b = this.astCompiler.compile(a.ast),
          d = a.ast;
      b.literal = 0 === d.body.length || 1 === d.body.length && (d.body[0].expression.type === q.Literal || d.body[0].expression.type === q.ArrayExpression || d.body[0].expression.type === q.ObjectExpression);
      b.constant = a.ast.constant;
      b.oneTime = a.oneTime;
      return b;
    },
    getAst: function getAst(a) {
      var b = !1;
      a = a.trim();
      ":" === a.charAt(0) && ":" === a.charAt(1) && (b = !0, a = a.substring(2));
      return {
        ast: this.ast.ast(a),
        oneTime: b
      };
    }
  };
  var Ea = F("$sce"),
      V = {
    HTML: "html",
    CSS: "css",
    MEDIA_URL: "mediaUrl",
    URL: "url",
    RESOURCE_URL: "resourceUrl",
    JS: "js"
  },
      Cc = /_([a-z])/g,
      Ug = F("$templateRequest"),
      Vg = F("$timeout"),
      aa = C.document.createElement("a"),
      Od = ga(C.location.href),
      Na;
  aa.href = "http://[::1]";
  var Wg = "[::1]" === aa.hostname;
  Pd.$inject = ["$document"];
  dd.$inject = ["$provide"];
  var Wd = 22,
      Vd = ".",
      Ec = "0";
  Qd.$inject = ["$locale"];
  Sd.$inject = ["$locale"];
  var gh = {
    yyyy: ea("FullYear", 4, 0, !1, !0),
    yy: ea("FullYear", 2, 0, !0, !0),
    y: ea("FullYear", 1, 0, !1, !0),
    MMMM: kb("Month"),
    MMM: kb("Month", !0),
    MM: ea("Month", 2, 1),
    M: ea("Month", 1, 1),
    LLLL: kb("Month", !1, !0),
    dd: ea("Date", 2),
    d: ea("Date", 1),
    HH: ea("Hours", 2),
    H: ea("Hours", 1),
    hh: ea("Hours", 2, -12),
    h: ea("Hours", 1, -12),
    mm: ea("Minutes", 2),
    m: ea("Minutes", 1),
    ss: ea("Seconds", 2),
    s: ea("Seconds", 1),
    sss: ea("Milliseconds", 3),
    EEEE: kb("Day"),
    EEE: kb("Day", !0),
    a: function a(_a, b) {
      return 12 > _a.getHours() ? b.AMPMS[0] : b.AMPMS[1];
    },
    Z: function Z(a, b, d) {
      a = -1 * d;
      return a = (0 <= a ? "+" : "") + (Ob(Math[0 < a ? "floor" : "ceil"](a / 60), 2) + Ob(Math.abs(a % 60), 2));
    },
    ww: Yd(2),
    w: Yd(1),
    G: Fc,
    GG: Fc,
    GGG: Fc,
    GGGG: function GGGG(a, b) {
      return 0 >= a.getFullYear() ? b.ERANAMES[0] : b.ERANAMES[1];
    }
  },
      fh = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))([\s\S]*)/,
      eh = /^-?\d+$/;
  Rd.$inject = ["$locale"];
  var $g = ia(K),
      ah = ia(ub);
  Td.$inject = ["$parse"];
  var Me = ia({
    restrict: "E",
    compile: function compile(a, b) {
      if (!b.href && !b.xlinkHref) return function (a, b) {
        if ("a" === b[0].nodeName.toLowerCase()) {
          var e = "[object SVGAnimatedString]" === la.call(b.prop("href")) ? "xlink:href" : "href";
          b.on("click", function (a) {
            b.attr(e) || a.preventDefault();
          });
        }
      };
    }
  }),
      vb = {};
  r(Gb, function (a, b) {
    function d(a, d, e) {
      a.$watch(e[c], function (a) {
        e.$set(b, !!a);
      });
    }

    if ("multiple" !== a) {
      var c = wa("ng-" + b),
          e = d;
      "checked" === a && (e = function e(a, b, _e) {
        _e.ngModel !== _e[c] && d(a, b, _e);
      });

      vb[c] = function () {
        return {
          restrict: "A",
          priority: 100,
          link: e
        };
      };
    }
  });
  r(td, function (a, b) {
    vb[b] = function () {
      return {
        priority: 100,
        link: function link(a, c, e) {
          if ("ngPattern" === b && "/" === e.ngPattern.charAt(0) && (c = e.ngPattern.match(ie))) {
            e.$set("ngPattern", new RegExp(c[1], c[2]));
            return;
          }

          a.$watch(e[b], function (a) {
            e.$set(b, a);
          });
        }
      };
    };
  });
  r(["src", "srcset", "href"], function (a) {
    var b = wa("ng-" + a);
    vb[b] = ["$sce", function (d) {
      return {
        priority: 99,
        link: function link(c, e, f) {
          var g = a,
              k = a;
          "href" === a && "[object SVGAnimatedString]" === la.call(e.prop("href")) && (k = "xlinkHref", f.$attr[k] = "xlink:href", g = null);
          f.$set(b, d.getTrustedMediaUrl(f[b]));
          f.$observe(b, function (b) {
            b ? (f.$set(k, b), Ca && g && e.prop(g, f[k])) : "href" === a && f.$set(k, null);
          });
        }
      };
    }];
  });
  var lb = {
    $addControl: E,
    $getControls: ia([]),
    $$renameControl: function $$renameControl(a, b) {
      a.$name = b;
    },
    $removeControl: E,
    $setValidity: E,
    $setDirty: E,
    $setPristine: E,
    $setSubmitted: E,
    $$setSubmitted: E
  };
  Pb.$inject = ["$element", "$attrs", "$scope", "$animate", "$interpolate"];
  Pb.prototype = {
    $rollbackViewValue: function $rollbackViewValue() {
      r(this.$$controls, function (a) {
        a.$rollbackViewValue();
      });
    },
    $commitViewValue: function $commitViewValue() {
      r(this.$$controls, function (a) {
        a.$commitViewValue();
      });
    },
    $addControl: function $addControl(a) {
      Ja(a.$name, "input");
      this.$$controls.push(a);
      a.$name && (this[a.$name] = a);
      a.$$parentForm = this;
    },
    $getControls: function $getControls() {
      return ja(this.$$controls);
    },
    $$renameControl: function $$renameControl(a, b) {
      var d = a.$name;
      this[d] === a && delete this[d];
      this[b] = a;
      a.$name = b;
    },
    $removeControl: function $removeControl(a) {
      a.$name && this[a.$name] === a && delete this[a.$name];
      r(this.$pending, function (b, d) {
        this.$setValidity(d, null, a);
      }, this);
      r(this.$error, function (b, d) {
        this.$setValidity(d, null, a);
      }, this);
      r(this.$$success, function (b, d) {
        this.$setValidity(d, null, a);
      }, this);
      cb(this.$$controls, a);
      a.$$parentForm = lb;
    },
    $setDirty: function $setDirty() {
      this.$$animate.removeClass(this.$$element, Za);
      this.$$animate.addClass(this.$$element, Vb);
      this.$dirty = !0;
      this.$pristine = !1;
      this.$$parentForm.$setDirty();
    },
    $setPristine: function $setPristine() {
      this.$$animate.setClass(this.$$element, Za, Vb + " ng-submitted");
      this.$dirty = !1;
      this.$pristine = !0;
      this.$submitted = !1;
      r(this.$$controls, function (a) {
        a.$setPristine();
      });
    },
    $setUntouched: function $setUntouched() {
      r(this.$$controls, function (a) {
        a.$setUntouched();
      });
    },
    $setSubmitted: function $setSubmitted() {
      for (var a = this; a.$$parentForm && a.$$parentForm !== lb;) {
        a = a.$$parentForm;
      }

      a.$$setSubmitted();
    },
    $$setSubmitted: function $$setSubmitted() {
      this.$$animate.addClass(this.$$element, "ng-submitted");
      this.$submitted = !0;
      r(this.$$controls, function (a) {
        a.$$setSubmitted && a.$$setSubmitted();
      });
    }
  };
  ae({
    clazz: Pb,
    set: function set(a, b, d) {
      var c = a[b];
      c ? -1 === c.indexOf(d) && c.push(d) : a[b] = [d];
    },
    unset: function unset(a, b, d) {
      var c = a[b];
      c && (cb(c, d), 0 === c.length && delete a[b]);
    }
  });

  var ke = function ke(a) {
    return ["$timeout", "$parse", function (b, d) {
      function c(a) {
        return "" === a ? d('this[""]').assign : d(a).assign || E;
      }

      return {
        name: "form",
        restrict: a ? "EAC" : "E",
        require: ["form", "^^?form"],
        controller: Pb,
        compile: function compile(d, f) {
          d.addClass(Za).addClass(mb);
          var g = f.name ? "name" : a && f.ngForm ? "ngForm" : !1;
          return {
            pre: function pre(a, d, e, f) {
              var p = f[0];

              if (!("action" in e)) {
                var n = function n(b) {
                  a.$apply(function () {
                    p.$commitViewValue();
                    p.$setSubmitted();
                  });
                  b.preventDefault();
                };

                d[0].addEventListener("submit", n);
                d.on("$destroy", function () {
                  b(function () {
                    d[0].removeEventListener("submit", n);
                  }, 0, !1);
                });
              }

              (f[1] || p.$$parentForm).$addControl(p);
              var s = g ? c(p.$name) : E;
              g && (s(a, p), e.$observe(g, function (b) {
                p.$name !== b && (s(a, void 0), p.$$parentForm.$$renameControl(p, b), s = c(p.$name), s(a, p));
              }));
              d.on("$destroy", function () {
                p.$$parentForm.$removeControl(p);
                s(a, void 0);
                S(p, lb);
              });
            }
          };
        }
      };
    }];
  },
      Ne = ke(),
      Ze = ke(!0),
      hh = /^\d{4,}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/,
      sh = /^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i,
      th = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/,
      ih = /^\s*(-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/,
      le = /^(\d{4,})-(\d{2})-(\d{2})$/,
      me = /^(\d{4,})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
      Mc = /^(\d{4,})-W(\d\d)$/,
      ne = /^(\d{4,})-(\d\d)$/,
      oe = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/,
      ce = T();

  r(["date", "datetime-local", "month", "time", "week"], function (a) {
    ce[a] = !0;
  });

  var pe = {
    text: function text(a, b, d, c, e, f) {
      Sa(a, b, d, c, e, f);
      Hc(c);
    },
    date: nb("date", le, Qb(le, ["yyyy", "MM", "dd"]), "yyyy-MM-dd"),
    "datetime-local": nb("datetimelocal", me, Qb(me, "yyyy MM dd HH mm ss sss".split(" ")), "yyyy-MM-ddTHH:mm:ss.sss"),
    time: nb("time", oe, Qb(oe, ["HH", "mm", "ss", "sss"]), "HH:mm:ss.sss"),
    week: nb("week", Mc, function (a, b) {
      if (ha(a)) return a;

      if (A(a)) {
        Mc.lastIndex = 0;
        var d = Mc.exec(a);

        if (d) {
          var c = +d[1],
              e = +d[2],
              f = d = 0,
              g = 0,
              k = 0,
              h = Xd(c),
              e = 7 * (e - 1);
          b && (d = b.getHours(), f = b.getMinutes(), g = b.getSeconds(), k = b.getMilliseconds());
          return new Date(c, 0, h.getDate() + e, d, f, g, k);
        }
      }

      return NaN;
    }, "yyyy-Www"),
    month: nb("month", ne, Qb(ne, ["yyyy", "MM"]), "yyyy-MM"),
    number: function number(a, b, d, c, e, f, g, k) {
      Ic(a, b, d, c, "number");
      de(c);
      Sa(a, b, d, c, e, f);
      var h;

      if (w(d.min) || d.ngMin) {
        var l = d.min || k(d.ngMin)(a);
        h = na(l);

        c.$validators.min = function (a, b) {
          return c.$isEmpty(b) || z(h) || b >= h;
        };

        d.$observe("min", function (a) {
          a !== l && (h = na(a), l = a, c.$validate());
        });
      }

      if (w(d.max) || d.ngMax) {
        var m = d.max || k(d.ngMax)(a),
            p = na(m);

        c.$validators.max = function (a, b) {
          return c.$isEmpty(b) || z(p) || b <= p;
        };

        d.$observe("max", function (a) {
          a !== m && (p = na(a), m = a, c.$validate());
        });
      }

      if (w(d.step) || d.ngStep) {
        var n = d.step || k(d.ngStep)(a),
            s = na(n);

        c.$validators.step = function (a, b) {
          return c.$isEmpty(b) || z(s) || ee(b, h || 0, s);
        };

        d.$observe("step", function (a) {
          a !== n && (s = na(a), n = a, c.$validate());
        });
      }
    },
    url: function url(a, b, d, c, e, f) {
      Sa(a, b, d, c, e, f);
      Hc(c);

      c.$validators.url = function (a, b) {
        var d = a || b;
        return c.$isEmpty(d) || sh.test(d);
      };
    },
    email: function email(a, b, d, c, e, f) {
      Sa(a, b, d, c, e, f);
      Hc(c);

      c.$validators.email = function (a, b) {
        var d = a || b;
        return c.$isEmpty(d) || th.test(d);
      };
    },
    radio: function radio(a, b, d, c) {
      var e = !d.ngTrim || "false" !== U(d.ngTrim);
      z(d.name) && b.attr("name", ++pb);
      b.on("change", function (a) {
        var g;
        b[0].checked && (g = d.value, e && (g = U(g)), c.$setViewValue(g, a && a.type));
      });

      c.$render = function () {
        var a = d.value;
        e && (a = U(a));
        b[0].checked = a === c.$viewValue;
      };

      d.$observe("value", c.$render);
    },
    range: function range(a, b, d, c, e, f) {
      function g(a, c) {
        b.attr(a, d[a]);
        var e = d[a];
        d.$observe(a, function (a) {
          a !== e && (e = a, c(a));
        });
      }

      function k(a) {
        p = na(a);
        X(c.$modelValue) || (m ? (a = b.val(), p > a && (a = p, b.val(a)), c.$setViewValue(a)) : c.$validate());
      }

      function h(a) {
        n = na(a);
        X(c.$modelValue) || (m ? (a = b.val(), n < a && (b.val(n), a = n < p ? p : n), c.$setViewValue(a)) : c.$validate());
      }

      function l(a) {
        s = na(a);
        X(c.$modelValue) || (m ? c.$viewValue !== b.val() && c.$setViewValue(b.val()) : c.$validate());
      }

      Ic(a, b, d, c, "range");
      de(c);
      Sa(a, b, d, c, e, f);
      var m = c.$$hasNativeValidators && "range" === b[0].type,
          p = m ? 0 : void 0,
          n = m ? 100 : void 0,
          s = m ? 1 : void 0,
          r = b[0].validity;
      a = w(d.min);
      e = w(d.max);
      f = w(d.step);
      var q = c.$render;
      c.$render = m && w(r.rangeUnderflow) && w(r.rangeOverflow) ? function () {
        q();
        c.$setViewValue(b.val());
      } : q;
      a && (p = na(d.min), c.$validators.min = m ? function () {
        return !0;
      } : function (a, b) {
        return c.$isEmpty(b) || z(p) || b >= p;
      }, g("min", k));
      e && (n = na(d.max), c.$validators.max = m ? function () {
        return !0;
      } : function (a, b) {
        return c.$isEmpty(b) || z(n) || b <= n;
      }, g("max", h));
      f && (s = na(d.step), c.$validators.step = m ? function () {
        return !r.stepMismatch;
      } : function (a, b) {
        return c.$isEmpty(b) || z(s) || ee(b, p || 0, s);
      }, g("step", l));
    },
    checkbox: function checkbox(a, b, d, c, e, f, g, k) {
      var h = fe(k, a, "ngTrueValue", d.ngTrueValue, !0),
          l = fe(k, a, "ngFalseValue", d.ngFalseValue, !1);
      b.on("change", function (a) {
        c.$setViewValue(b[0].checked, a && a.type);
      });

      c.$render = function () {
        b[0].checked = c.$viewValue;
      };

      c.$isEmpty = function (a) {
        return !1 === a;
      };

      c.$formatters.push(function (a) {
        return va(a, h);
      });
      c.$parsers.push(function (a) {
        return a ? h : l;
      });
    },
    hidden: E,
    button: E,
    submit: E,
    reset: E,
    file: E
  },
      Yc = ["$browser", "$sniffer", "$filter", "$parse", function (a, b, d, c) {
    return {
      restrict: "E",
      require: ["?ngModel"],
      link: {
        pre: function pre(e, f, g, k) {
          k[0] && (pe[K(g.type)] || pe.text)(e, f, g, k[0], b, a, d, c);
        }
      }
    };
  }],
      vf = function vf() {
    var a = {
      configurable: !0,
      enumerable: !1,
      get: function get() {
        return this.getAttribute("value") || "";
      },
      set: function set(a) {
        this.setAttribute("value", a);
      }
    };
    return {
      restrict: "E",
      priority: 200,
      compile: function compile(b, d) {
        if ("hidden" === K(d.type)) return {
          pre: function pre(b, d, f, g) {
            b = d[0];
            b.parentNode && b.parentNode.insertBefore(b, b.nextSibling);
            Object.defineProperty && Object.defineProperty(b, "value", a);
          }
        };
      }
    };
  },
      uh = /^(true|false|\d+)$/,
      sf = function sf() {
    function a(a, d, c) {
      var e = w(c) ? c : 9 === Ca ? "" : null;
      a.prop("value", e);
      d.$set("value", c);
    }

    return {
      restrict: "A",
      priority: 100,
      compile: function compile(b, d) {
        return uh.test(d.ngValue) ? function (b, d, f) {
          b = b.$eval(f.ngValue);
          a(d, f, b);
        } : function (b, d, f) {
          b.$watch(f.ngValue, function (b) {
            a(d, f, b);
          });
        };
      }
    };
  },
      Re = ["$compile", function (a) {
    return {
      restrict: "AC",
      compile: function compile(b) {
        a.$$addBindingClass(b);
        return function (b, c, e) {
          a.$$addBindingInfo(c, e.ngBind);
          c = c[0];
          b.$watch(e.ngBind, function (a) {
            c.textContent = ic(a);
          });
        };
      }
    };
  }],
      Te = ["$interpolate", "$compile", function (a, b) {
    return {
      compile: function compile(d) {
        b.$$addBindingClass(d);
        return function (c, d, f) {
          c = a(d.attr(f.$attr.ngBindTemplate));
          b.$$addBindingInfo(d, c.expressions);
          d = d[0];
          f.$observe("ngBindTemplate", function (a) {
            d.textContent = z(a) ? "" : a;
          });
        };
      }
    };
  }],
      Se = ["$sce", "$parse", "$compile", function (a, b, d) {
    return {
      restrict: "A",
      compile: function compile(c, e) {
        var f = b(e.ngBindHtml),
            g = b(e.ngBindHtml, function (b) {
          return a.valueOf(b);
        });
        d.$$addBindingClass(c);
        return function (b, c, e) {
          d.$$addBindingInfo(c, e.ngBindHtml);
          b.$watch(g, function () {
            var d = f(b);
            c.html(a.getTrustedHtml(d) || "");
          });
        };
      }
    };
  }],
      rf = ia({
    restrict: "A",
    require: "ngModel",
    link: function link(a, b, d, c) {
      c.$viewChangeListeners.push(function () {
        a.$eval(d.ngChange);
      });
    }
  }),
      Ue = Kc("", !0),
      We = Kc("Odd", 0),
      Ve = Kc("Even", 1),
      Xe = Ra({
    compile: function compile(a, b) {
      b.$set("ngCloak", void 0);
      a.removeClass("ng-cloak");
    }
  }),
      Ye = [function () {
    return {
      restrict: "A",
      scope: !0,
      controller: "@",
      priority: 500
    };
  }],
      cd = {},
      vh = {
    blur: !0,
    focus: !0
  };

  r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "), function (a) {
    var b = wa("ng-" + a);
    cd[b] = ["$parse", "$rootScope", "$exceptionHandler", function (d, c, e) {
      return qd(d, c, e, b, a, vh[a]);
    }];
  });

  var af = ["$animate", "$compile", function (a, b) {
    return {
      multiElement: !0,
      transclude: "element",
      priority: 600,
      terminal: !0,
      restrict: "A",
      $$tlb: !0,
      link: function link(d, c, e, f, g) {
        var k, h, l;
        d.$watch(e.ngIf, function (d) {
          d ? h || g(function (d, f) {
            h = f;
            d[d.length++] = b.$$createComment("end ngIf", e.ngIf);
            k = {
              clone: d
            };
            a.enter(d, c.parent(), c);
          }) : (l && (l.remove(), l = null), h && (h.$destroy(), h = null), k && (l = tb(k.clone), a.leave(l).done(function (a) {
            !1 !== a && (l = null);
          }), k = null));
        });
      }
    };
  }],
      bf = ["$templateRequest", "$anchorScroll", "$animate", function (a, b, d) {
    return {
      restrict: "ECA",
      priority: 400,
      terminal: !0,
      transclude: "element",
      controller: ca.noop,
      compile: function compile(c, e) {
        var f = e.ngInclude || e.src,
            g = e.onload || "",
            k = e.autoscroll;
        return function (c, e, m, p, n) {
          var r = 0,
              q,
              t,
              x,
              v = function v() {
            t && (t.remove(), t = null);
            q && (q.$destroy(), q = null);
            x && (d.leave(x).done(function (a) {
              !1 !== a && (t = null);
            }), t = x, x = null);
          };

          c.$watch(f, function (f) {
            var m = function m(a) {
              !1 === a || !w(k) || k && !c.$eval(k) || b();
            },
                t = ++r;

            f ? (a(f, !0).then(function (a) {
              if (!c.$$destroyed && t === r) {
                var b = c.$new();
                p.template = a;
                a = n(b, function (a) {
                  v();
                  d.enter(a, null, e).done(m);
                });
                q = b;
                x = a;
                q.$emit("$includeContentLoaded", f);
                c.$eval(g);
              }
            }, function () {
              c.$$destroyed || t !== r || (v(), c.$emit("$includeContentError", f));
            }), c.$emit("$includeContentRequested", f)) : (v(), p.template = null);
          });
        };
      }
    };
  }],
      uf = ["$compile", function (a) {
    return {
      restrict: "ECA",
      priority: -400,
      require: "ngInclude",
      link: function link(b, d, c, e) {
        la.call(d[0]).match(/SVG/) ? (d.empty(), a(ed(e.template, C.document).childNodes)(b, function (a) {
          d.append(a);
        }, {
          futureParentElement: d
        })) : (d.html(e.template), a(d.contents())(b));
      }
    };
  }],
      cf = Ra({
    priority: 450,
    compile: function compile() {
      return {
        pre: function pre(a, b, d) {
          a.$eval(d.ngInit);
        }
      };
    }
  }),
      qf = function qf() {
    return {
      restrict: "A",
      priority: 100,
      require: "ngModel",
      link: function link(a, b, d, c) {
        var e = d.ngList || ", ",
            f = "false" !== d.ngTrim,
            g = f ? U(e) : e;
        c.$parsers.push(function (a) {
          if (!z(a)) {
            var b = [];
            a && r(a.split(g), function (a) {
              a && b.push(f ? U(a) : a);
            });
            return b;
          }
        });
        c.$formatters.push(function (a) {
          if (H(a)) return a.join(e);
        });

        c.$isEmpty = function (a) {
          return !a || !a.length;
        };
      }
    };
  },
      mb = "ng-valid",
      $d = "ng-invalid",
      Za = "ng-pristine",
      Vb = "ng-dirty",
      ob = F("ngModel");

  Rb.$inject = "$scope $exceptionHandler $attrs $element $parse $animate $timeout $q $interpolate".split(" ");
  Rb.prototype = {
    $$initGetterSetters: function $$initGetterSetters() {
      if (this.$options.getOption("getterSetter")) {
        var a = this.$$parse(this.$$attr.ngModel + "()"),
            b = this.$$parse(this.$$attr.ngModel + "($$$p)");

        this.$$ngModelGet = function (b) {
          var c = this.$$parsedNgModel(b);
          B(c) && (c = a(b));
          return c;
        };

        this.$$ngModelSet = function (a, c) {
          B(this.$$parsedNgModel(a)) ? b(a, {
            $$$p: c
          }) : this.$$parsedNgModelAssign(a, c);
        };
      } else if (!this.$$parsedNgModel.assign) throw ob("nonassign", this.$$attr.ngModel, za(this.$$element));
    },
    $render: E,
    $isEmpty: function $isEmpty(a) {
      return z(a) || "" === a || null === a || a !== a;
    },
    $$updateEmptyClasses: function $$updateEmptyClasses(a) {
      this.$isEmpty(a) ? (this.$$animate.removeClass(this.$$element, "ng-not-empty"), this.$$animate.addClass(this.$$element, "ng-empty")) : (this.$$animate.removeClass(this.$$element, "ng-empty"), this.$$animate.addClass(this.$$element, "ng-not-empty"));
    },
    $setPristine: function $setPristine() {
      this.$dirty = !1;
      this.$pristine = !0;
      this.$$animate.removeClass(this.$$element, Vb);
      this.$$animate.addClass(this.$$element, Za);
    },
    $setDirty: function $setDirty() {
      this.$dirty = !0;
      this.$pristine = !1;
      this.$$animate.removeClass(this.$$element, Za);
      this.$$animate.addClass(this.$$element, Vb);
      this.$$parentForm.$setDirty();
    },
    $setUntouched: function $setUntouched() {
      this.$touched = !1;
      this.$untouched = !0;
      this.$$animate.setClass(this.$$element, "ng-untouched", "ng-touched");
    },
    $setTouched: function $setTouched() {
      this.$touched = !0;
      this.$untouched = !1;
      this.$$animate.setClass(this.$$element, "ng-touched", "ng-untouched");
    },
    $rollbackViewValue: function $rollbackViewValue() {
      this.$$timeout.cancel(this.$$pendingDebounce);
      this.$viewValue = this.$$lastCommittedViewValue;
      this.$render();
    },
    $validate: function $validate() {
      if (!X(this.$modelValue)) {
        var a = this.$$lastCommittedViewValue,
            b = this.$$rawModelValue,
            d = this.$valid,
            c = this.$modelValue,
            e = this.$options.getOption("allowInvalid"),
            f = this;
        this.$$runValidators(b, a, function (a) {
          e || d === a || (f.$modelValue = a ? b : void 0, f.$modelValue !== c && f.$$writeModelToScope());
        });
      }
    },
    $$runValidators: function $$runValidators(a, b, d) {
      function c() {
        var c = !0;
        r(h.$validators, function (d, e) {
          var g = Boolean(d(a, b));
          c = c && g;
          f(e, g);
        });
        return c ? !0 : (r(h.$asyncValidators, function (a, b) {
          f(b, null);
        }), !1);
      }

      function e() {
        var c = [],
            d = !0;
        r(h.$asyncValidators, function (e, g) {
          var h = e(a, b);
          if (!h || !B(h.then)) throw ob("nopromise", h);
          f(g, void 0);
          c.push(h.then(function () {
            f(g, !0);
          }, function () {
            d = !1;
            f(g, !1);
          }));
        });
        c.length ? h.$$q.all(c).then(function () {
          g(d);
        }, E) : g(!0);
      }

      function f(a, b) {
        k === h.$$currentValidationRunId && h.$setValidity(a, b);
      }

      function g(a) {
        k === h.$$currentValidationRunId && d(a);
      }

      this.$$currentValidationRunId++;
      var k = this.$$currentValidationRunId,
          h = this;
      (function () {
        var a = h.$$parserName;
        if (z(h.$$parserValid)) f(a, null);else return h.$$parserValid || (r(h.$validators, function (a, b) {
          f(b, null);
        }), r(h.$asyncValidators, function (a, b) {
          f(b, null);
        })), f(a, h.$$parserValid), h.$$parserValid;
        return !0;
      })() ? c() ? e() : g(!1) : g(!1);
    },
    $commitViewValue: function $commitViewValue() {
      var a = this.$viewValue;
      this.$$timeout.cancel(this.$$pendingDebounce);
      if (this.$$lastCommittedViewValue !== a || "" === a && this.$$hasNativeValidators) this.$$updateEmptyClasses(a), this.$$lastCommittedViewValue = a, this.$pristine && this.$setDirty(), this.$$parseAndValidate();
    },
    $$parseAndValidate: function $$parseAndValidate() {
      var a = this.$$lastCommittedViewValue,
          b = this;
      this.$$parserValid = z(a) ? void 0 : !0;
      this.$setValidity(this.$$parserName, null);
      this.$$parserName = "parse";
      if (this.$$parserValid) for (var d = 0; d < this.$parsers.length; d++) {
        if (a = this.$parsers[d](a), z(a)) {
          this.$$parserValid = !1;
          break;
        }
      }
      X(this.$modelValue) && (this.$modelValue = this.$$ngModelGet(this.$$scope));
      var c = this.$modelValue,
          e = this.$options.getOption("allowInvalid");
      this.$$rawModelValue = a;
      e && (this.$modelValue = a, b.$modelValue !== c && b.$$writeModelToScope());
      this.$$runValidators(a, this.$$lastCommittedViewValue, function (d) {
        e || (b.$modelValue = d ? a : void 0, b.$modelValue !== c && b.$$writeModelToScope());
      });
    },
    $$writeModelToScope: function $$writeModelToScope() {
      this.$$ngModelSet(this.$$scope, this.$modelValue);
      r(this.$viewChangeListeners, function (a) {
        try {
          a();
        } catch (b) {
          this.$$exceptionHandler(b);
        }
      }, this);
    },
    $setViewValue: function $setViewValue(a, b) {
      this.$viewValue = a;
      this.$options.getOption("updateOnDefault") && this.$$debounceViewValueCommit(b);
    },
    $$debounceViewValueCommit: function $$debounceViewValueCommit(a) {
      var b = this.$options.getOption("debounce");
      W(b[a]) ? b = b[a] : W(b["default"]) && -1 === this.$options.getOption("updateOn").indexOf(a) ? b = b["default"] : W(b["*"]) && (b = b["*"]);
      this.$$timeout.cancel(this.$$pendingDebounce);
      var d = this;
      0 < b ? this.$$pendingDebounce = this.$$timeout(function () {
        d.$commitViewValue();
      }, b) : this.$$rootScope.$$phase ? this.$commitViewValue() : this.$$scope.$apply(function () {
        d.$commitViewValue();
      });
    },
    $overrideModelOptions: function $overrideModelOptions(a) {
      this.$options = this.$options.createChild(a);
      this.$$setUpdateOnEvents();
    },
    $processModelValue: function $processModelValue() {
      var a = this.$$format();
      this.$viewValue !== a && (this.$$updateEmptyClasses(a), this.$viewValue = this.$$lastCommittedViewValue = a, this.$render(), this.$$runValidators(this.$modelValue, this.$viewValue, E));
    },
    $$format: function $$format() {
      for (var a = this.$formatters, b = a.length, d = this.$modelValue; b--;) {
        d = a[b](d);
      }

      return d;
    },
    $$setModelValue: function $$setModelValue(a) {
      this.$modelValue = this.$$rawModelValue = a;
      this.$$parserValid = void 0;
      this.$processModelValue();
    },
    $$setUpdateOnEvents: function $$setUpdateOnEvents() {
      this.$$updateEvents && this.$$element.off(this.$$updateEvents, this.$$updateEventHandler);
      if (this.$$updateEvents = this.$options.getOption("updateOn")) this.$$element.on(this.$$updateEvents, this.$$updateEventHandler);
    },
    $$updateEventHandler: function $$updateEventHandler(a) {
      this.$$debounceViewValueCommit(a && a.type);
    }
  };
  ae({
    clazz: Rb,
    set: function set(a, b) {
      a[b] = !0;
    },
    unset: function unset(a, b) {
      delete a[b];
    }
  });
  var pf = ["$rootScope", function (a) {
    return {
      restrict: "A",
      require: ["ngModel", "^?form", "^?ngModelOptions"],
      controller: Rb,
      priority: 1,
      compile: function compile(b) {
        b.addClass(Za).addClass("ng-untouched").addClass(mb);
        return {
          pre: function pre(a, b, e, f) {
            var g = f[0];
            b = f[1] || g.$$parentForm;
            if (f = f[2]) g.$options = f.$options;
            g.$$initGetterSetters();
            b.$addControl(g);
            e.$observe("name", function (a) {
              g.$name !== a && g.$$parentForm.$$renameControl(g, a);
            });
            a.$on("$destroy", function () {
              g.$$parentForm.$removeControl(g);
            });
          },
          post: function post(b, c, e, f) {
            function g() {
              k.$setTouched();
            }

            var k = f[0];
            k.$$setUpdateOnEvents();
            c.on("blur", function () {
              k.$touched || (a.$$phase ? b.$evalAsync(g) : b.$apply(g));
            });
          }
        };
      }
    };
  }],
      Sb,
      wh = /(\s+|^)default(\s+|$)/;
  Lc.prototype = {
    getOption: function getOption(a) {
      return this.$$options[a];
    },
    createChild: function createChild(a) {
      var b = !1;
      a = S({}, a);
      r(a, function (d, c) {
        "$inherit" === d ? "*" === c ? b = !0 : (a[c] = this.$$options[c], "updateOn" === c && (a.updateOnDefault = this.$$options.updateOnDefault)) : "updateOn" === c && (a.updateOnDefault = !1, a[c] = U(d.replace(wh, function () {
          a.updateOnDefault = !0;
          return " ";
        })));
      }, this);
      b && (delete a["*"], ge(a, this.$$options));
      ge(a, Sb.$$options);
      return new Lc(a);
    }
  };
  Sb = new Lc({
    updateOn: "",
    updateOnDefault: !0,
    debounce: 0,
    getterSetter: !1,
    allowInvalid: !1,
    timezone: null
  });

  var tf = function tf() {
    function a(a, d) {
      this.$$attrs = a;
      this.$$scope = d;
    }

    a.$inject = ["$attrs", "$scope"];
    a.prototype = {
      $onInit: function $onInit() {
        var a = this.parentCtrl ? this.parentCtrl.$options : Sb,
            d = this.$$scope.$eval(this.$$attrs.ngModelOptions);
        this.$options = a.createChild(d);
      }
    };
    return {
      restrict: "A",
      priority: 10,
      require: {
        parentCtrl: "?^^ngModelOptions"
      },
      bindToController: !0,
      controller: a
    };
  },
      df = Ra({
    terminal: !0,
    priority: 1E3
  }),
      xh = F("ngOptions"),
      yh = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([$\w][$\w]*)|(?:\(\s*([$\w][$\w]*)\s*,\s*([$\w][$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
      nf = ["$compile", "$document", "$parse", function (a, b, d) {
    function c(a, b, c) {
      function e(a, b, c, d, f) {
        this.selectValue = a;
        this.viewValue = b;
        this.label = c;
        this.group = d;
        this.disabled = f;
      }

      function f(a) {
        var b;
        if (!r && ya(a)) b = a;else {
          b = [];

          for (var c in a) {
            a.hasOwnProperty(c) && "$" !== c.charAt(0) && b.push(c);
          }
        }
        return b;
      }

      var p = a.match(yh);
      if (!p) throw xh("iexp", a, za(b));
      var n = p[5] || p[7],
          r = p[6];
      a = / as /.test(p[0]) && p[1];
      var q = p[9];
      b = d(p[2] ? p[1] : n);

      var t = a && d(a) || b,
          w = q && d(q),
          v = q ? function (a, b) {
        return w(c, b);
      } : function (a) {
        return La(a);
      },
          x = function x(a, b) {
        return v(a, A(a, b));
      },
          z = d(p[2] || p[1]),
          y = d(p[3] || ""),
          J = d(p[4] || ""),
          I = d(p[8]),
          B = {},
          A = r ? function (a, b) {
        B[r] = b;
        B[n] = a;
        return B;
      } : function (a) {
        B[n] = a;
        return B;
      };

      return {
        trackBy: q,
        getTrackByValue: x,
        getWatchables: d(I, function (a) {
          var b = [];
          a = a || [];

          for (var d = f(a), e = d.length, g = 0; g < e; g++) {
            var k = a === d ? g : d[g],
                l = a[k],
                k = A(l, k),
                l = v(l, k);
            b.push(l);
            if (p[2] || p[1]) l = z(c, k), b.push(l);
            p[4] && (k = J(c, k), b.push(k));
          }

          return b;
        }),
        getOptions: function getOptions() {
          for (var a = [], b = {}, d = I(c) || [], g = f(d), k = g.length, n = 0; n < k; n++) {
            var p = d === g ? n : g[n],
                r = A(d[p], p),
                s = t(c, r),
                p = v(s, r),
                w = z(c, r),
                B = y(c, r),
                r = J(c, r),
                s = new e(p, s, w, B, r);
            a.push(s);
            b[p] = s;
          }

          return {
            items: a,
            selectValueMap: b,
            getOptionFromViewValue: function getOptionFromViewValue(a) {
              return b[x(a)];
            },
            getViewValueFromOption: function getViewValueFromOption(a) {
              return q ? Ia(a.viewValue) : a.viewValue;
            }
          };
        }
      };
    }

    var e = C.document.createElement("option"),
        f = C.document.createElement("optgroup");
    return {
      restrict: "A",
      terminal: !0,
      require: ["select", "ngModel"],
      link: {
        pre: function pre(a, b, c, d) {
          d[0].registerOption = E;
        },
        post: function post(d, k, h, l) {
          function m(a) {
            var b = (a = v.getOptionFromViewValue(a)) && a.element;
            b && !b.selected && (b.selected = !0);
            return a;
          }

          function p(a, b) {
            a.element = b;
            b.disabled = a.disabled;
            a.label !== b.label && (b.label = a.label, b.textContent = a.label);
            b.value = a.selectValue;
          }

          var n = l[0],
              q = l[1],
              z = h.multiple;
          l = 0;

          for (var t = k.children(), B = t.length; l < B; l++) {
            if ("" === t[l].value) {
              n.hasEmptyOption = !0;
              n.emptyOption = t.eq(l);
              break;
            }
          }

          k.empty();
          l = !!n.emptyOption;
          x(e.cloneNode(!1)).val("?");
          var v,
              A = c(h.ngOptions, k, d),
              C = b[0].createDocumentFragment();

          n.generateUnknownOptionValue = function (a) {
            return "?";
          };

          z ? (n.writeValue = function (a) {
            if (v) {
              var b = a && a.map(m) || [];
              v.items.forEach(function (a) {
                a.element.selected && -1 === Array.prototype.indexOf.call(b, a) && (a.element.selected = !1);
              });
            }
          }, n.readValue = function () {
            var a = k.val() || [],
                b = [];
            r(a, function (a) {
              (a = v.selectValueMap[a]) && !a.disabled && b.push(v.getViewValueFromOption(a));
            });
            return b;
          }, A.trackBy && d.$watchCollection(function () {
            if (H(q.$viewValue)) return q.$viewValue.map(function (a) {
              return A.getTrackByValue(a);
            });
          }, function () {
            q.$render();
          })) : (n.writeValue = function (a) {
            if (v) {
              var b = k[0].options[k[0].selectedIndex],
                  c = v.getOptionFromViewValue(a);
              b && b.removeAttribute("selected");
              c ? (k[0].value !== c.selectValue && (n.removeUnknownOption(), k[0].value = c.selectValue, c.element.selected = !0), c.element.setAttribute("selected", "selected")) : n.selectUnknownOrEmptyOption(a);
            }
          }, n.readValue = function () {
            var a = v.selectValueMap[k.val()];
            return a && !a.disabled ? (n.unselectEmptyOption(), n.removeUnknownOption(), v.getViewValueFromOption(a)) : null;
          }, A.trackBy && d.$watch(function () {
            return A.getTrackByValue(q.$viewValue);
          }, function () {
            q.$render();
          }));
          l && (a(n.emptyOption)(d), k.prepend(n.emptyOption), 8 === n.emptyOption[0].nodeType ? (n.hasEmptyOption = !1, n.registerOption = function (a, b) {
            "" === b.val() && (n.hasEmptyOption = !0, n.emptyOption = b, n.emptyOption.removeClass("ng-scope"), q.$render(), b.on("$destroy", function () {
              var a = n.$isEmptyOptionSelected();
              n.hasEmptyOption = !1;
              n.emptyOption = void 0;
              a && q.$render();
            }));
          }) : n.emptyOption.removeClass("ng-scope"));
          d.$watchCollection(A.getWatchables, function () {
            var a = v && n.readValue();
            if (v) for (var b = v.items.length - 1; 0 <= b; b--) {
              var c = v.items[b];
              w(c.group) ? Fb(c.element.parentNode) : Fb(c.element);
            }
            v = A.getOptions();
            var d = {};
            v.items.forEach(function (a) {
              var b;

              if (w(a.group)) {
                b = d[a.group];
                b || (b = f.cloneNode(!1), C.appendChild(b), b.label = null === a.group ? "null" : a.group, d[a.group] = b);
                var c = e.cloneNode(!1);
                b.appendChild(c);
                p(a, c);
              } else b = e.cloneNode(!1), C.appendChild(b), p(a, b);
            });
            k[0].appendChild(C);
            q.$render();
            q.$isEmpty(a) || (b = n.readValue(), (A.trackBy || z ? va(a, b) : a === b) || (q.$setViewValue(b), q.$render()));
          });
        }
      }
    };
  }],
      ef = ["$locale", "$interpolate", "$log", function (a, b, d) {
    var c = /{}/g,
        e = /^when(Minus)?(.+)$/;
    return {
      link: function link(f, g, k) {
        function h(a) {
          g.text(a || "");
        }

        var l = k.count,
            m = k.$attr.when && g.attr(k.$attr.when),
            p = k.offset || 0,
            n = f.$eval(m) || {},
            q = {},
            w = b.startSymbol(),
            t = b.endSymbol(),
            x = w + l + "-" + p + t,
            v = ca.noop,
            A;
        r(k, function (a, b) {
          var c = e.exec(b);
          c && (c = (c[1] ? "-" : "") + K(c[2]), n[c] = g.attr(k.$attr[b]));
        });
        r(n, function (a, d) {
          q[d] = b(a.replace(c, x));
        });
        f.$watch(l, function (b) {
          var c = parseFloat(b),
              e = X(c);
          e || c in n || (c = a.pluralCat(c - p));
          c === A || e && X(A) || (v(), e = q[c], z(e) ? (null != b && d.debug("ngPluralize: no rule defined for '" + c + "' in " + m), v = E, h()) : v = f.$watch(e, h), A = c);
        });
      }
    };
  }],
      qe = F("ngRef"),
      ff = ["$parse", function (a) {
    return {
      priority: -1,
      restrict: "A",
      compile: function compile(b, d) {
        var c = wa(ua(b)),
            e = a(d.ngRef),
            f = e.assign || function () {
          throw qe("nonassign", d.ngRef);
        };

        return function (a, b, h) {
          var l;
          if (h.hasOwnProperty("ngRefRead")) {
            if ("$element" === h.ngRefRead) l = b;else {
              if (l = b.data("$" + h.ngRefRead + "Controller"), !l) throw qe("noctrl", h.ngRefRead, d.ngRef);
            }
          } else l = b.data("$" + c + "Controller");
          l = l || b;
          f(a, l);
          b.on("$destroy", function () {
            e(a) === l && f(a, null);
          });
        };
      }
    };
  }],
      gf = ["$parse", "$animate", "$compile", function (a, b, d) {
    var c = F("ngRepeat"),
        e = function e(a, b, c, d, _e2, f, g) {
      a[c] = d;
      _e2 && (a[_e2] = f);
      a.$index = b;
      a.$first = 0 === b;
      a.$last = b === g - 1;
      a.$middle = !(a.$first || a.$last);
      a.$odd = !(a.$even = 0 === (b & 1));
    },
        f = function f(a, b, c) {
      return La(c);
    },
        g = function g(a, b) {
      return b;
    };

    return {
      restrict: "A",
      multiElement: !0,
      transclude: "element",
      priority: 1E3,
      terminal: !0,
      $$tlb: !0,
      compile: function compile(k, h) {
        var l = h.ngRepeat,
            m = d.$$createComment("end ngRepeat", l),
            p = l.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
        if (!p) throw c("iexp", l);
        var n = p[1],
            q = p[2],
            w = p[3],
            t = p[4],
            p = n.match(/^(?:(\s*[$\w]+)|\(\s*([$\w]+)\s*,\s*([$\w]+)\s*\))$/);
        if (!p) throw c("iidexp", n);
        var x = p[3] || p[1],
            v = p[2];
        if (w && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(w) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(w))) throw c("badident", w);
        var z;

        if (t) {
          var A = {
            $id: La
          },
              y = a(t);

          z = function z(a, b, c, d) {
            v && (A[v] = b);
            A[x] = c;
            A.$index = d;
            return y(a, A);
          };
        }

        return function (a, d, h, k, n) {
          var p = T();
          a.$watchCollection(q, function (h) {
            var k,
                q,
                t = d[0],
                s,
                y = T(),
                B,
                C,
                E,
                D,
                H,
                F,
                K;
            w && (a[w] = h);
            if (ya(h)) H = h, q = z || f;else for (K in q = z || g, H = [], h) {
              ta.call(h, K) && "$" !== K.charAt(0) && H.push(K);
            }
            B = H.length;
            K = Array(B);

            for (k = 0; k < B; k++) {
              if (C = h === H ? k : H[k], E = h[C], D = q(a, C, E, k), p[D]) F = p[D], delete p[D], y[D] = F, K[k] = F;else {
                if (y[D]) throw r(K, function (a) {
                  a && a.scope && (p[a.id] = a);
                }), c("dupes", l, D, E);
                K[k] = {
                  id: D,
                  scope: void 0,
                  clone: void 0
                };
                y[D] = !0;
              }
            }

            A && (A[x] = void 0);

            for (s in p) {
              F = p[s];
              D = tb(F.clone);
              b.leave(D);
              if (D[0].parentNode) for (k = 0, q = D.length; k < q; k++) {
                D[k].$$NG_REMOVED = !0;
              }
              F.scope.$destroy();
            }

            for (k = 0; k < B; k++) {
              if (C = h === H ? k : H[k], E = h[C], F = K[k], F.scope) {
                s = t;

                do {
                  s = s.nextSibling;
                } while (s && s.$$NG_REMOVED);

                F.clone[0] !== s && b.move(tb(F.clone), null, t);
                t = F.clone[F.clone.length - 1];
                e(F.scope, k, x, E, v, C, B);
              } else n(function (a, c) {
                F.scope = c;
                var d = m.cloneNode(!1);
                a[a.length++] = d;
                b.enter(a, null, t);
                t = d;
                F.clone = a;
                y[F.id] = F;
                e(F.scope, k, x, E, v, C, B);
              });
            }

            p = y;
          });
        };
      }
    };
  }],
      hf = ["$animate", function (a) {
    return {
      restrict: "A",
      multiElement: !0,
      link: function link(b, d, c) {
        b.$watch(c.ngShow, function (b) {
          a[b ? "removeClass" : "addClass"](d, "ng-hide", {
            tempClasses: "ng-hide-animate"
          });
        });
      }
    };
  }],
      $e = ["$animate", function (a) {
    return {
      restrict: "A",
      multiElement: !0,
      link: function link(b, d, c) {
        b.$watch(c.ngHide, function (b) {
          a[b ? "addClass" : "removeClass"](d, "ng-hide", {
            tempClasses: "ng-hide-animate"
          });
        });
      }
    };
  }],
      jf = Ra(function (a, b, d) {
    a.$watchCollection(d.ngStyle, function (a, d) {
      d && a !== d && (a || (a = {}), r(d, function (b, d) {
        null == a[d] && (a[d] = "");
      }));
      a && b.css(a);
    });
  }),
      kf = ["$animate", "$compile", function (a, b) {
    return {
      require: "ngSwitch",
      controller: ["$scope", function () {
        this.cases = {};
      }],
      link: function link(d, c, e, f) {
        var g = [],
            k = [],
            h = [],
            l = [],
            m = function m(a, b) {
          return function (c) {
            !1 !== c && a.splice(b, 1);
          };
        };

        d.$watch(e.ngSwitch || e.on, function (c) {
          for (var d, e; h.length;) {
            a.cancel(h.pop());
          }

          d = 0;

          for (e = l.length; d < e; ++d) {
            var q = tb(k[d].clone);
            l[d].$destroy();
            (h[d] = a.leave(q)).done(m(h, d));
          }

          k.length = 0;
          l.length = 0;
          (g = f.cases["!" + c] || f.cases["?"]) && r(g, function (c) {
            c.transclude(function (d, e) {
              l.push(e);
              var f = c.element;
              d[d.length++] = b.$$createComment("end ngSwitchWhen");
              k.push({
                clone: d
              });
              a.enter(d, f.parent(), f);
            });
          });
        });
      }
    };
  }],
      lf = Ra({
    transclude: "element",
    priority: 1200,
    require: "^ngSwitch",
    multiElement: !0,
    link: function link(a, b, d, c, e) {
      a = d.ngSwitchWhen.split(d.ngSwitchWhenSeparator).sort().filter(function (a, b, c) {
        return c[b - 1] !== a;
      });
      r(a, function (a) {
        c.cases["!" + a] = c.cases["!" + a] || [];
        c.cases["!" + a].push({
          transclude: e,
          element: b
        });
      });
    }
  }),
      mf = Ra({
    transclude: "element",
    priority: 1200,
    require: "^ngSwitch",
    multiElement: !0,
    link: function link(a, b, d, c, e) {
      c.cases["?"] = c.cases["?"] || [];
      c.cases["?"].push({
        transclude: e,
        element: b
      });
    }
  }),
      zh = F("ngTransclude"),
      of = ["$compile", function (a) {
    return {
      restrict: "EAC",
      compile: function compile(b) {
        var d = a(b.contents());
        b.empty();
        return function (a, b, f, g, k) {
          function h() {
            d(a, function (a) {
              b.append(a);
            });
          }

          if (!k) throw zh("orphan", za(b));
          f.ngTransclude === f.$attr.ngTransclude && (f.ngTransclude = "");
          f = f.ngTransclude || f.ngTranscludeSlot;
          k(function (a, c) {
            var d;
            if (d = a.length) a: {
              d = 0;

              for (var f = a.length; d < f; d++) {
                var g = a[d];

                if (g.nodeType !== Pa || g.nodeValue.trim()) {
                  d = !0;
                  break a;
                }
              }

              d = void 0;
            }
            d ? b.append(a) : (h(), c.$destroy());
          }, null, f);
          f && !k.isSlotFilled(f) && h();
        };
      }
    };
  }],
      Oe = ["$templateCache", function (a) {
    return {
      restrict: "E",
      terminal: !0,
      compile: function compile(b, d) {
        "text/ng-template" === d.type && a.put(d.id, b[0].text);
      }
    };
  }],
      Ah = {
    $setViewValue: E,
    $render: E
  },
      Bh = ["$element", "$scope", function (a, b) {
    function d() {
      g || (g = !0, b.$$postDigest(function () {
        g = !1;
        e.ngModelCtrl.$render();
      }));
    }

    function c(a) {
      k || (k = !0, b.$$postDigest(function () {
        b.$$destroyed || (k = !1, e.ngModelCtrl.$setViewValue(e.readValue()), a && e.ngModelCtrl.$render());
      }));
    }

    var e = this,
        f = new Hb();
    e.selectValueMap = {};
    e.ngModelCtrl = Ah;
    e.multiple = !1;
    e.unknownOption = x(C.document.createElement("option"));
    e.hasEmptyOption = !1;
    e.emptyOption = void 0;

    e.renderUnknownOption = function (b) {
      b = e.generateUnknownOptionValue(b);
      e.unknownOption.val(b);
      a.prepend(e.unknownOption);
      Oa(e.unknownOption, !0);
      a.val(b);
    };

    e.updateUnknownOption = function (b) {
      b = e.generateUnknownOptionValue(b);
      e.unknownOption.val(b);
      Oa(e.unknownOption, !0);
      a.val(b);
    };

    e.generateUnknownOptionValue = function (a) {
      return "? " + La(a) + " ?";
    };

    e.removeUnknownOption = function () {
      e.unknownOption.parent() && e.unknownOption.remove();
    };

    e.selectEmptyOption = function () {
      e.emptyOption && (a.val(""), Oa(e.emptyOption, !0));
    };

    e.unselectEmptyOption = function () {
      e.hasEmptyOption && Oa(e.emptyOption, !1);
    };

    b.$on("$destroy", function () {
      e.renderUnknownOption = E;
    });

    e.readValue = function () {
      var b = a.val(),
          b = b in e.selectValueMap ? e.selectValueMap[b] : b;
      return e.hasOption(b) ? b : null;
    };

    e.writeValue = function (b) {
      var c = a[0].options[a[0].selectedIndex];
      c && Oa(x(c), !1);
      e.hasOption(b) ? (e.removeUnknownOption(), c = La(b), a.val(c in e.selectValueMap ? c : b), Oa(x(a[0].options[a[0].selectedIndex]), !0)) : e.selectUnknownOrEmptyOption(b);
    };

    e.addOption = function (a, b) {
      if (8 !== b[0].nodeType) {
        Ja(a, '"option value"');
        "" === a && (e.hasEmptyOption = !0, e.emptyOption = b);
        var c = f.get(a) || 0;
        f.set(a, c + 1);
        d();
      }
    };

    e.removeOption = function (a) {
      var b = f.get(a);
      b && (1 === b ? (f["delete"](a), "" === a && (e.hasEmptyOption = !1, e.emptyOption = void 0)) : f.set(a, b - 1));
    };

    e.hasOption = function (a) {
      return !!f.get(a);
    };

    e.$hasEmptyOption = function () {
      return e.hasEmptyOption;
    };

    e.$isUnknownOptionSelected = function () {
      return a[0].options[0] === e.unknownOption[0];
    };

    e.$isEmptyOptionSelected = function () {
      return e.hasEmptyOption && a[0].options[a[0].selectedIndex] === e.emptyOption[0];
    };

    e.selectUnknownOrEmptyOption = function (a) {
      null == a && e.emptyOption ? (e.removeUnknownOption(), e.selectEmptyOption()) : e.unknownOption.parent().length ? e.updateUnknownOption(a) : e.renderUnknownOption(a);
    };

    var g = !1,
        k = !1;

    e.registerOption = function (a, b, f, g, k) {
      if (f.$attr.ngValue) {
        var q, r;
        f.$observe("value", function (a) {
          var d,
              f = b.prop("selected");
          w(r) && (e.removeOption(q), delete e.selectValueMap[r], d = !0);
          r = La(a);
          q = a;
          e.selectValueMap[r] = a;
          e.addOption(a, b);
          b.attr("value", r);
          d && f && c();
        });
      } else g ? f.$observe("value", function (a) {
        e.readValue();
        var d,
            f = b.prop("selected");
        w(q) && (e.removeOption(q), d = !0);
        q = a;
        e.addOption(a, b);
        d && f && c();
      }) : k ? a.$watch(k, function (a, d) {
        f.$set("value", a);
        var g = b.prop("selected");
        d !== a && e.removeOption(d);
        e.addOption(a, b);
        d && g && c();
      }) : e.addOption(f.value, b);

      f.$observe("disabled", function (a) {
        if ("true" === a || a && b.prop("selected")) e.multiple ? c(!0) : (e.ngModelCtrl.$setViewValue(null), e.ngModelCtrl.$render());
      });
      b.on("$destroy", function () {
        var a = e.readValue(),
            b = f.value;
        e.removeOption(b);
        d();
        (e.multiple && a && -1 !== a.indexOf(b) || a === b) && c(!0);
      });
    };
  }],
      Pe = function Pe() {
    return {
      restrict: "E",
      require: ["select", "?ngModel"],
      controller: Bh,
      priority: 1,
      link: {
        pre: function pre(a, b, d, c) {
          var e = c[0],
              f = c[1];

          if (f) {
            if (e.ngModelCtrl = f, b.on("change", function () {
              e.removeUnknownOption();
              a.$apply(function () {
                f.$setViewValue(e.readValue());
              });
            }), d.multiple) {
              e.multiple = !0;

              e.readValue = function () {
                var a = [];
                r(b.find("option"), function (b) {
                  b.selected && !b.disabled && (b = b.value, a.push(b in e.selectValueMap ? e.selectValueMap[b] : b));
                });
                return a;
              };

              e.writeValue = function (a) {
                r(b.find("option"), function (b) {
                  var c = !!a && (-1 !== Array.prototype.indexOf.call(a, b.value) || -1 !== Array.prototype.indexOf.call(a, e.selectValueMap[b.value]));
                  c !== b.selected && Oa(x(b), c);
                });
              };

              var g,
                  k = NaN;
              a.$watch(function () {
                k !== f.$viewValue || va(g, f.$viewValue) || (g = ja(f.$viewValue), f.$render());
                k = f.$viewValue;
              });

              f.$isEmpty = function (a) {
                return !a || 0 === a.length;
              };
            }
          } else e.registerOption = E;
        },
        post: function post(a, b, d, c) {
          var e = c[1];

          if (e) {
            var f = c[0];

            e.$render = function () {
              f.writeValue(e.$viewValue);
            };
          }
        }
      }
    };
  },
      Qe = ["$interpolate", function (a) {
    return {
      restrict: "E",
      priority: 100,
      compile: function compile(b, d) {
        var c, e;
        w(d.ngValue) || (w(d.value) ? c = a(d.value, !0) : (e = a(b.text(), !0)) || d.$set("value", b.text()));
        return function (a, b, d) {
          var h = b.parent();
          (h = h.data("$selectController") || h.parent().data("$selectController")) && h.registerOption(a, b, d, c, e);
        };
      }
    };
  }],
      $c = ["$parse", function (a) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function link(b, d, c, e) {
        if (e) {
          var f = c.hasOwnProperty("required") || a(c.ngRequired)(b);
          c.ngRequired || (c.required = !0);

          e.$validators.required = function (a, b) {
            return !f || !e.$isEmpty(b);
          };

          c.$observe("required", function (a) {
            f !== a && (f = a, e.$validate());
          });
        }
      }
    };
  }],
      Zc = ["$parse", function (a) {
    return {
      restrict: "A",
      require: "?ngModel",
      compile: function compile(b, d) {
        var c, e;
        d.ngPattern && (c = d.ngPattern, e = "/" === d.ngPattern.charAt(0) && ie.test(d.ngPattern) ? function () {
          return d.ngPattern;
        } : a(d.ngPattern));
        return function (a, b, d, h) {
          if (h) {
            var l = d.pattern;
            d.ngPattern ? l = e(a) : c = d.pattern;
            var m = he(l, c, b);
            d.$observe("pattern", function (a) {
              var d = m;
              m = he(a, c, b);
              (d && d.toString()) !== (m && m.toString()) && h.$validate();
            });

            h.$validators.pattern = function (a, b) {
              return h.$isEmpty(b) || z(m) || m.test(b);
            };
          }
        };
      }
    };
  }],
      bd = ["$parse", function (a) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function link(b, d, c, e) {
        if (e) {
          var f = c.maxlength || a(c.ngMaxlength)(b),
              g = Tb(f);
          c.$observe("maxlength", function (a) {
            f !== a && (g = Tb(a), f = a, e.$validate());
          });

          e.$validators.maxlength = function (a, b) {
            return 0 > g || e.$isEmpty(b) || b.length <= g;
          };
        }
      }
    };
  }],
      ad = ["$parse", function (a) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function link(b, d, c, e) {
        if (e) {
          var f = c.minlength || a(c.ngMinlength)(b),
              g = Tb(f) || -1;
          c.$observe("minlength", function (a) {
            f !== a && (g = Tb(a) || -1, f = a, e.$validate());
          });

          e.$validators.minlength = function (a, b) {
            return e.$isEmpty(b) || b.length >= g;
          };
        }
      }
    };
  }];

  C.angular.bootstrap ? C.console && console.log("WARNING: Tried to load AngularJS more than once.") : (Fe(), Je(ca), ca.module("ngLocale", [], ["$provide", function (a) {
    function b(a) {
      a += "";
      var b = a.indexOf(".");
      return -1 == b ? 0 : a.length - b - 1;
    }

    a.value("$locale", {
      DATETIME_FORMATS: {
        AMPMS: ["AM", "PM"],
        DAY: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        ERANAMES: ["Before Christ", "Anno Domini"],
        ERAS: ["BC", "AD"],
        FIRSTDAYOFWEEK: 6,
        MONTH: "January February March April May June July August September October November December".split(" "),
        SHORTDAY: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
        SHORTMONTH: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
        STANDALONEMONTH: "January February March April May June July August September October November December".split(" "),
        WEEKENDRANGE: [5, 6],
        fullDate: "EEEE, MMMM d, y",
        longDate: "MMMM d, y",
        medium: "MMM d, y h:mm:ss a",
        mediumDate: "MMM d, y",
        mediumTime: "h:mm:ss a",
        "short": "M/d/yy h:mm a",
        shortDate: "M/d/yy",
        shortTime: "h:mm a"
      },
      NUMBER_FORMATS: {
        CURRENCY_SYM: "$",
        DECIMAL_SEP: ".",
        GROUP_SEP: ",",
        PATTERNS: [{
          gSize: 3,
          lgSize: 3,
          maxFrac: 3,
          minFrac: 0,
          minInt: 1,
          negPre: "-",
          negSuf: "",
          posPre: "",
          posSuf: ""
        }, {
          gSize: 3,
          lgSize: 3,
          maxFrac: 2,
          minFrac: 2,
          minInt: 1,
          negPre: "-\xA4",
          negSuf: "",
          posPre: "\xA4",
          posSuf: ""
        }]
      },
      id: "en-us",
      localeID: "en_US",
      pluralCat: function pluralCat(a, c) {
        var e = a | 0,
            f = c;
        void 0 === f && (f = Math.min(b(a), 3));
        Math.pow(10, f);
        return 1 == e && 0 == f ? "one" : "other";
      }
    });
  }]), x(function () {
    Ae(C.document, Uc);
  }));
})(window);

!window.angular.$$csp().noInlineStyle && window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>');

/***/ }),

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tailwindcss_tailwind_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tailwindcss/tailwind.css */ "./node_modules/tailwindcss/tailwind.css");
__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");



__webpack_require__(/*! ./angular.js */ "./resources/js/angular.js");

__webpack_require__(/*! ./route.js */ "./resources/js/route.js");

__webpack_require__(/*! ./IndexController.js */ "./resources/js/IndexController.js");

/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

window._ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */
// import Echo from 'laravel-echo';
// window.Pusher = require('pusher-js');
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: true
// });

/***/ }),

/***/ "./resources/js/route.js":
/*!*******************************!*\
  !*** ./resources/js/route.js ***!
  \*******************************/
/***/ (() => {

/**
 * @license AngularJS v1.7.7
 * (c) 2010-2018 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function (window, angular) {
  'use strict';
  /* global shallowCopy: true */

  /**
   * Creates a shallow copy of an object, an array or a primitive.
   *
   * Assumes that there are no proto properties for objects.
   */

  function shallowCopy(src, dst) {
    if (isArray(src)) {
      dst = dst || [];

      for (var i = 0, ii = src.length; i < ii; i++) {
        dst[i] = src[i];
      }
    } else if (isObject(src)) {
      dst = dst || {};

      for (var key in src) {
        if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
          dst[key] = src[key];
        }
      }
    }

    return dst || src;
  }
  /* global routeToRegExp: true */

  /**
   * @param {string} path - The path to parse. (It is assumed to have query and hash stripped off.)
   * @param {Object} opts - Options.
   * @return {Object} - An object containing an array of path parameter names (`keys`) and a regular
   *     expression (`regexp`) that can be used to identify a matching URL and extract the path
   *     parameter values.
   *
   * @description
   * Parses the given path, extracting path parameter names and a regular expression to match URLs.
   *
   * Originally inspired by `pathRexp` in `visionmedia/express/lib/utils.js`.
   */


  function routeToRegExp(path, opts) {
    var keys = [];
    var pattern = path.replace(/([().])/g, '\\$1').replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function (_, slash, key, option) {
      var optional = option === '?' || option === '*?';
      var star = option === '*' || option === '*?';
      keys.push({
        name: key,
        optional: optional
      });
      slash = slash || '';
      return (optional ? '(?:' + slash : slash + '(?:') + (star ? '(.+?)' : '([^/]+)') + (optional ? '?)?' : ')');
    }).replace(/([/$*])/g, '\\$1');

    if (opts.ignoreTrailingSlashes) {
      pattern = pattern.replace(/\/+$/, '') + '/*';
    }

    return {
      keys: keys,
      regexp: new RegExp('^' + pattern + '(?:[?#]|$)', opts.caseInsensitiveMatch ? 'i' : '')
    };
  }
  /* global routeToRegExp: false */

  /* global shallowCopy: false */
  // `isArray` and `isObject` are necessary for `shallowCopy()` (included via `src/shallowCopy.js`).
  // They are initialized inside the `$RouteProvider`, to ensure `window.angular` is available.


  var isArray;
  var isObject;
  var isDefined;
  var noop;
  /**
   * @ngdoc module
   * @name ngRoute
   * @description
   *
   * The `ngRoute` module provides routing and deeplinking services and directives for AngularJS apps.
   *
   * ## Example
   * See {@link ngRoute.$route#examples $route} for an example of configuring and using `ngRoute`.
   *
   */

  /* global -ngRouteModule */

  var ngRouteModule = angular.module('ngRoute', []).info({
    angularVersion: '1.7.7'
  }).provider('$route', $RouteProvider). // Ensure `$route` will be instantiated in time to capture the initial `$locationChangeSuccess`
  // event (unless explicitly disabled). This is necessary in case `ngView` is included in an
  // asynchronously loaded template.
  run(instantiateRoute);
  var $routeMinErr = angular.$$minErr('ngRoute');
  var isEagerInstantiationEnabled;
  /**
   * @ngdoc provider
   * @name $routeProvider
   * @this
   *
   * @description
   *
   * Used for configuring routes.
   *
   * ## Example
   * See {@link ngRoute.$route#examples $route} for an example of configuring and using `ngRoute`.
   *
   * ## Dependencies
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   */

  function $RouteProvider() {
    isArray = angular.isArray;
    isObject = angular.isObject;
    isDefined = angular.isDefined;
    noop = angular.noop;

    function inherit(parent, extra) {
      return angular.extend(Object.create(parent), extra);
    }

    var routes = {};
    /**
     * @ngdoc method
     * @name $routeProvider#when
     *
     * @param {string} path Route path (matched against `$location.path`). If `$location.path`
     *    contains redundant trailing slash or is missing one, the route will still match and the
     *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
     *    route definition.
     *
     *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
     *        to the next slash are matched and stored in `$routeParams` under the given `name`
     *        when the route matches.
     *    * `path` can contain named groups starting with a colon and ending with a star:
     *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
     *        when the route matches.
     *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
     *
     *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
     *    `/color/brown/largecode/code/with/slashes/edit` and extract:
     *
     *    * `color: brown`
     *    * `largecode: code/with/slashes`.
     *
     *
     * @param {Object} route Mapping information to be assigned to `$route.current` on route
     *    match.
     *
     *    Object properties:
     *
     *    - `controller` – `{(string|Function)=}` – Controller fn that should be associated with
     *      newly created scope or the name of a {@link angular.Module#controller registered
     *      controller} if passed as a string.
     *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
     *      If present, the controller will be published to scope under the `controllerAs` name.
     *    - `template` – `{(string|Function)=}` – html template as a string or a function that
     *      returns an html template as a string which should be used by {@link
     *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
     *      This property takes precedence over `templateUrl`.
     *
     *      If `template` is a function, it will be called with the following parameters:
     *
     *      - `{Array.<Object>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route
     *
     *      One of `template` or `templateUrl` is required.
     *
     *    - `templateUrl` – `{(string|Function)=}` – path or function that returns a path to an html
     *      template that should be used by {@link ngRoute.directive:ngView ngView}.
     *
     *      If `templateUrl` is a function, it will be called with the following parameters:
     *
     *      - `{Array.<Object>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route
     *
     *      One of `templateUrl` or `template` is required.
     *
     *    - `resolve` - `{Object.<string, Function>=}` - An optional map of dependencies which should
     *      be injected into the controller. If any of these dependencies are promises, the router
     *      will wait for them all to be resolved or one to be rejected before the controller is
     *      instantiated.
     *      If all the promises are resolved successfully, the values of the resolved promises are
     *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
     *      fired. If any of the promises are rejected the
     *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired.
     *      For easier access to the resolved dependencies from the template, the `resolve` map will
     *      be available on the scope of the route, under `$resolve` (by default) or a custom name
     *      specified by the `resolveAs` property (see below). This can be particularly useful, when
     *      working with {@link angular.Module#component components} as route templates.<br />
     *      <div class="alert alert-warning">
     *        **Note:** If your scope already contains a property with this name, it will be hidden
     *        or overwritten. Make sure, you specify an appropriate name for this property, that
     *        does not collide with other properties on the scope.
     *      </div>
     *      The map object is:
     *
     *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
     *      - `factory` - `{string|Function}`: If `string` then it is an alias for a service.
     *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
     *        and the return value is treated as the dependency. If the result is a promise, it is
     *        resolved before its value is injected into the controller. Be aware that
     *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
     *        functions.  Use `$route.current.params` to access the new route parameters, instead.
     *
     *    - `resolveAs` - `{string=}` - The name under which the `resolve` map will be available on
     *      the scope of the route. If omitted, defaults to `$resolve`.
     *
     *    - `redirectTo` – `{(string|Function)=}` – value to update
     *      {@link ng.$location $location} path with and trigger route redirection.
     *
     *      If `redirectTo` is a function, it will be called with the following parameters:
     *
     *      - `{Object.<string>}` - route parameters extracted from the current
     *        `$location.path()` by applying the current route templateUrl.
     *      - `{string}` - current `$location.path()`
     *      - `{Object}` - current `$location.search()`
     *
     *      The custom `redirectTo` function is expected to return a string which will be used
     *      to update `$location.url()`. If the function throws an error, no further processing will
     *      take place and the {@link ngRoute.$route#$routeChangeError $routeChangeError} event will
     *      be fired.
     *
     *      Routes that specify `redirectTo` will not have their controllers, template functions
     *      or resolves called, the `$location` will be changed to the redirect url and route
     *      processing will stop. The exception to this is if the `redirectTo` is a function that
     *      returns `undefined`. In this case the route transition occurs as though there was no
     *      redirection.
     *
     *    - `resolveRedirectTo` – `{Function=}` – a function that will (eventually) return the value
     *      to update {@link ng.$location $location} URL with and trigger route redirection. In
     *      contrast to `redirectTo`, dependencies can be injected into `resolveRedirectTo` and the
     *      return value can be either a string or a promise that will be resolved to a string.
     *
     *      Similar to `redirectTo`, if the return value is `undefined` (or a promise that gets
     *      resolved to `undefined`), no redirection takes place and the route transition occurs as
     *      though there was no redirection.
     *
     *      If the function throws an error or the returned promise gets rejected, no further
     *      processing will take place and the
     *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event will be fired.
     *
     *      `redirectTo` takes precedence over `resolveRedirectTo`, so specifying both on the same
     *      route definition, will cause the latter to be ignored.
     *
     *    - `[reloadOnUrl=true]` - `{boolean=}` - reload route when any part of the URL changes
     *      (including the path) even if the new URL maps to the same route.
     *
     *      If the option is set to `false` and the URL in the browser changes, but the new URL maps
     *      to the same route, then a `$routeUpdate` event is broadcasted on the root scope (without
     *      reloading the route).
     *
     *    - `[reloadOnSearch=true]` - `{boolean=}` - reload route when only `$location.search()`
     *      or `$location.hash()` changes.
     *
     *      If the option is set to `false` and the URL in the browser changes, then a `$routeUpdate`
     *      event is broadcasted on the root scope (without reloading the route).
     *
     *      <div class="alert alert-warning">
     *        **Note:** This option has no effect if `reloadOnUrl` is set to `false`.
     *      </div>
     *
     *    - `[caseInsensitiveMatch=false]` - `{boolean=}` - match routes without being case sensitive
     *
     *      If the option is set to `true`, then the particular route can be matched without being
     *      case sensitive
     *
     * @returns {Object} self
     *
     * @description
     * Adds a new route definition to the `$route` service.
     */

    this.when = function (path, route) {
      //copy original route object to preserve params inherited from proto chain
      var routeCopy = shallowCopy(route);

      if (angular.isUndefined(routeCopy.reloadOnUrl)) {
        routeCopy.reloadOnUrl = true;
      }

      if (angular.isUndefined(routeCopy.reloadOnSearch)) {
        routeCopy.reloadOnSearch = true;
      }

      if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
        routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
      }

      routes[path] = angular.extend(routeCopy, {
        originalPath: path
      }, path && routeToRegExp(path, routeCopy)); // create redirection for trailing slashes

      if (path) {
        var redirectPath = path[path.length - 1] === '/' ? path.substr(0, path.length - 1) : path + '/';
        routes[redirectPath] = angular.extend({
          originalPath: path,
          redirectTo: path
        }, routeToRegExp(redirectPath, routeCopy));
      }

      return this;
    };
    /**
     * @ngdoc property
     * @name $routeProvider#caseInsensitiveMatch
     * @description
     *
     * A boolean property indicating if routes defined
     * using this provider should be matched using a case insensitive
     * algorithm. Defaults to `false`.
     */


    this.caseInsensitiveMatch = false;
    /**
     * @ngdoc method
     * @name $routeProvider#otherwise
     *
     * @description
     * Sets route definition that will be used on route change when no other route definition
     * is matched.
     *
     * @param {Object|string} params Mapping information to be assigned to `$route.current`.
     * If called with a string, the value maps to `redirectTo`.
     * @returns {Object} self
     */

    this.otherwise = function (params) {
      if (typeof params === 'string') {
        params = {
          redirectTo: params
        };
      }

      this.when(null, params);
      return this;
    };
    /**
     * @ngdoc method
     * @name $routeProvider#eagerInstantiationEnabled
     * @kind function
     *
     * @description
     * Call this method as a setter to enable/disable eager instantiation of the
     * {@link ngRoute.$route $route} service upon application bootstrap. You can also call it as a
     * getter (i.e. without any arguments) to get the current value of the
     * `eagerInstantiationEnabled` flag.
     *
     * Instantiating `$route` early is necessary for capturing the initial
     * {@link ng.$location#$locationChangeStart $locationChangeStart} event and navigating to the
     * appropriate route. Usually, `$route` is instantiated in time by the
     * {@link ngRoute.ngView ngView} directive. Yet, in cases where `ngView` is included in an
     * asynchronously loaded template (e.g. in another directive's template), the directive factory
     * might not be called soon enough for `$route` to be instantiated _before_ the initial
     * `$locationChangeSuccess` event is fired. Eager instantiation ensures that `$route` is always
     * instantiated in time, regardless of when `ngView` will be loaded.
     *
     * The default value is true.
     *
     * **Note**:<br />
     * You may want to disable the default behavior when unit-testing modules that depend on
     * `ngRoute`, in order to avoid an unexpected request for the default route's template.
     *
     * @param {boolean=} enabled - If provided, update the internal `eagerInstantiationEnabled` flag.
     *
     * @returns {*} The current value of the `eagerInstantiationEnabled` flag if used as a getter or
     *     itself (for chaining) if used as a setter.
     */


    isEagerInstantiationEnabled = true;

    this.eagerInstantiationEnabled = function eagerInstantiationEnabled(enabled) {
      if (isDefined(enabled)) {
        isEagerInstantiationEnabled = enabled;
        return this;
      }

      return isEagerInstantiationEnabled;
    };

    this.$get = ['$rootScope', '$location', '$routeParams', '$q', '$injector', '$templateRequest', '$sce', '$browser', function ($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce, $browser) {
      /**
       * @ngdoc service
       * @name $route
       * @requires $location
       * @requires $routeParams
       *
       * @property {Object} current Reference to the current route definition.
       * The route definition contains:
       *
       *   - `controller`: The controller constructor as defined in the route definition.
       *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
       *     controller instantiation. The `locals` contain
       *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
       *
       *     - `$scope` - The current route scope.
       *     - `$template` - The current route template HTML.
       *
       *     The `locals` will be assigned to the route scope's `$resolve` property. You can override
       *     the property name, using `resolveAs` in the route definition. See
       *     {@link ngRoute.$routeProvider $routeProvider} for more info.
       *
       * @property {Object} routes Object with all route configuration Objects as its properties.
       *
       * @description
       * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
       * It watches `$location.url()` and tries to map the path to an existing route definition.
       *
       * Requires the {@link ngRoute `ngRoute`} module to be installed.
       *
       * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
       *
       * The `$route` service is typically used in conjunction with the
       * {@link ngRoute.directive:ngView `ngView`} directive and the
       * {@link ngRoute.$routeParams `$routeParams`} service.
       *
       * @example
       * This example shows how changing the URL hash causes the `$route` to match a route against the
       * URL, and the `ngView` pulls in the partial.
       *
       * <example name="$route-service" module="ngRouteExample"
       *          deps="angular-route.js" fixBase="true">
       *   <file name="index.html">
       *     <div ng-controller="MainController">
       *       Choose:
       *       <a href="Book/Moby">Moby</a> |
       *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
       *       <a href="Book/Gatsby">Gatsby</a> |
       *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
       *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
       *
       *       <div ng-view></div>
       *
       *       <hr />
       *
       *       <pre>$location.path() = {{$location.path()}}</pre>
       *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
       *       <pre>$route.current.params = {{$route.current.params}}</pre>
       *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
       *       <pre>$routeParams = {{$routeParams}}</pre>
       *     </div>
       *   </file>
       *
       *   <file name="book.html">
       *     controller: {{name}}<br />
       *     Book Id: {{params.bookId}}<br />
       *   </file>
       *
       *   <file name="chapter.html">
       *     controller: {{name}}<br />
       *     Book Id: {{params.bookId}}<br />
       *     Chapter Id: {{params.chapterId}}
       *   </file>
       *
       *   <file name="script.js">
       *     angular.module('ngRouteExample', ['ngRoute'])
       *
       *      .controller('MainController', function($scope, $route, $routeParams, $location) {
       *          $scope.$route = $route;
       *          $scope.$location = $location;
       *          $scope.$routeParams = $routeParams;
       *      })
       *
       *      .controller('BookController', function($scope, $routeParams) {
       *          $scope.name = 'BookController';
       *          $scope.params = $routeParams;
       *      })
       *
       *      .controller('ChapterController', function($scope, $routeParams) {
       *          $scope.name = 'ChapterController';
       *          $scope.params = $routeParams;
       *      })
       *
       *     .config(function($routeProvider, $locationProvider) {
       *       $routeProvider
       *        .when('/Book/:bookId', {
       *         templateUrl: 'book.html',
       *         controller: 'BookController',
       *         resolve: {
       *           // I will cause a 1 second delay
       *           delay: function($q, $timeout) {
       *             var delay = $q.defer();
       *             $timeout(delay.resolve, 1000);
       *             return delay.promise;
       *           }
       *         }
       *       })
       *       .when('/Book/:bookId/ch/:chapterId', {
       *         templateUrl: 'chapter.html',
       *         controller: 'ChapterController'
       *       });
       *
       *       // configure html5 to get links working on jsfiddle
       *       $locationProvider.html5Mode(true);
       *     });
       *
       *   </file>
       *
       *   <file name="protractor.js" type="protractor">
       *     it('should load and compile correct template', function() {
       *       element(by.linkText('Moby: Ch1')).click();
       *       var content = element(by.css('[ng-view]')).getText();
       *       expect(content).toMatch(/controller: ChapterController/);
       *       expect(content).toMatch(/Book Id: Moby/);
       *       expect(content).toMatch(/Chapter Id: 1/);
       *
       *       element(by.partialLinkText('Scarlet')).click();
       *
       *       content = element(by.css('[ng-view]')).getText();
       *       expect(content).toMatch(/controller: BookController/);
       *       expect(content).toMatch(/Book Id: Scarlet/);
       *     });
       *   </file>
       * </example>
       */

      /**
       * @ngdoc event
       * @name $route#$routeChangeStart
       * @eventType broadcast on root scope
       * @description
       * Broadcasted before a route change. At this  point the route services starts
       * resolving all of the dependencies needed for the route change to occur.
       * Typically this involves fetching the view template as well as any dependencies
       * defined in `resolve` route property. Once  all of the dependencies are resolved
       * `$routeChangeSuccess` is fired.
       *
       * The route change (and the `$location` change that triggered it) can be prevented
       * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
       * for more details about event object.
       *
       * @param {Object} angularEvent Synthetic event object.
       * @param {Route} next Future route information.
       * @param {Route} current Current route information.
       */

      /**
       * @ngdoc event
       * @name $route#$routeChangeSuccess
       * @eventType broadcast on root scope
       * @description
       * Broadcasted after a route change has happened successfully.
       * The `resolve` dependencies are now available in the `current.locals` property.
       *
       * {@link ngRoute.directive:ngView ngView} listens for the directive
       * to instantiate the controller and render the view.
       *
       * @param {Object} angularEvent Synthetic event object.
       * @param {Route} current Current route information.
       * @param {Route|Undefined} previous Previous route information, or undefined if current is
       * first route entered.
       */

      /**
       * @ngdoc event
       * @name $route#$routeChangeError
       * @eventType broadcast on root scope
       * @description
       * Broadcasted if a redirection function fails or any redirection or resolve promises are
       * rejected.
       *
       * @param {Object} angularEvent Synthetic event object
       * @param {Route} current Current route information.
       * @param {Route} previous Previous route information.
       * @param {Route} rejection The thrown error or the rejection reason of the promise. Usually
       * the rejection reason is the error that caused the promise to get rejected.
       */

      /**
       * @ngdoc event
       * @name $route#$routeUpdate
       * @eventType broadcast on root scope
       * @description
       * Broadcasted if the same instance of a route (including template, controller instance,
       * resolved dependencies, etc.) is being reused. This can happen if either `reloadOnSearch` or
       * `reloadOnUrl` has been set to `false`.
       *
       * @param {Object} angularEvent Synthetic event object
       * @param {Route} current Current/previous route information.
       */
      var forceReload = false,
          preparedRoute,
          preparedRouteIsUpdateOnly,
          $route = {
        routes: routes,

        /**
         * @ngdoc method
         * @name $route#reload
         *
         * @description
         * Causes `$route` service to reload the current route even if
         * {@link ng.$location $location} hasn't changed.
         *
         * As a result of that, {@link ngRoute.directive:ngView ngView}
         * creates new scope and reinstantiates the controller.
         */
        reload: function reload() {
          forceReload = true;
          var fakeLocationEvent = {
            defaultPrevented: false,
            preventDefault: function fakePreventDefault() {
              this.defaultPrevented = true;
              forceReload = false;
            }
          };
          $rootScope.$evalAsync(function () {
            prepareRoute(fakeLocationEvent);
            if (!fakeLocationEvent.defaultPrevented) commitRoute();
          });
        },

        /**
         * @ngdoc method
         * @name $route#updateParams
         *
         * @description
         * Causes `$route` service to update the current URL, replacing
         * current route parameters with those specified in `newParams`.
         * Provided property names that match the route's path segment
         * definitions will be interpolated into the location's path, while
         * remaining properties will be treated as query params.
         *
         * @param {!Object<string, string>} newParams mapping of URL parameter names to values
         */
        updateParams: function updateParams(newParams) {
          if (this.current && this.current.$$route) {
            newParams = angular.extend({}, this.current.params, newParams);
            $location.path(interpolate(this.current.$$route.originalPath, newParams)); // interpolate modifies newParams, only query params are left

            $location.search(newParams);
          } else {
            throw $routeMinErr('norout', 'Tried updating route with no current route');
          }
        }
      };
      $rootScope.$on('$locationChangeStart', prepareRoute);
      $rootScope.$on('$locationChangeSuccess', commitRoute);
      return $route; /////////////////////////////////////////////////////

      /**
       * @param on {string} current url
       * @param route {Object} route regexp to match the url against
       * @return {?Object}
       *
       * @description
       * Check if the route matches the current url.
       *
       * Inspired by match in
       * visionmedia/express/lib/router/router.js.
       */

      function switchRouteMatcher(on, route) {
        var keys = route.keys,
            params = {};
        if (!route.regexp) return null;
        var m = route.regexp.exec(on);
        if (!m) return null;

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = m[i];

          if (key && val) {
            params[key.name] = val;
          }
        }

        return params;
      }

      function prepareRoute($locationEvent) {
        var lastRoute = $route.current;
        preparedRoute = parseRoute();
        preparedRouteIsUpdateOnly = isNavigationUpdateOnly(preparedRoute, lastRoute);

        if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
          if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
            if ($locationEvent) {
              $locationEvent.preventDefault();
            }
          }
        }
      }

      function commitRoute() {
        var lastRoute = $route.current;
        var nextRoute = preparedRoute;

        if (preparedRouteIsUpdateOnly) {
          lastRoute.params = nextRoute.params;
          angular.copy(lastRoute.params, $routeParams);
          $rootScope.$broadcast('$routeUpdate', lastRoute);
        } else if (nextRoute || lastRoute) {
          forceReload = false;
          $route.current = nextRoute;
          var nextRoutePromise = $q.resolve(nextRoute);
          $browser.$$incOutstandingRequestCount('$route');
          nextRoutePromise.then(getRedirectionData).then(handlePossibleRedirection).then(function (keepProcessingRoute) {
            return keepProcessingRoute && nextRoutePromise.then(resolveLocals).then(function (locals) {
              // after route change
              if (nextRoute === $route.current) {
                if (nextRoute) {
                  nextRoute.locals = locals;
                  angular.copy(nextRoute.params, $routeParams);
                }

                $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
              }
            });
          })["catch"](function (error) {
            if (nextRoute === $route.current) {
              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          })["finally"](function () {
            // Because `commitRoute()` is called from a `$rootScope.$evalAsync` block (see
            // `$locationWatch`), this `$$completeOutstandingRequest()` call will not cause
            // `outstandingRequestCount` to hit zero.  This is important in case we are redirecting
            // to a new route which also requires some asynchronous work.
            $browser.$$completeOutstandingRequest(noop, '$route');
          });
        }
      }

      function getRedirectionData(route) {
        var data = {
          route: route,
          hasRedirection: false
        };

        if (route) {
          if (route.redirectTo) {
            if (angular.isString(route.redirectTo)) {
              data.path = interpolate(route.redirectTo, route.params);
              data.search = route.params;
              data.hasRedirection = true;
            } else {
              var oldPath = $location.path();
              var oldSearch = $location.search();
              var newUrl = route.redirectTo(route.pathParams, oldPath, oldSearch);

              if (angular.isDefined(newUrl)) {
                data.url = newUrl;
                data.hasRedirection = true;
              }
            }
          } else if (route.resolveRedirectTo) {
            return $q.resolve($injector.invoke(route.resolveRedirectTo)).then(function (newUrl) {
              if (angular.isDefined(newUrl)) {
                data.url = newUrl;
                data.hasRedirection = true;
              }

              return data;
            });
          }
        }

        return data;
      }

      function handlePossibleRedirection(data) {
        var keepProcessingRoute = true;

        if (data.route !== $route.current) {
          keepProcessingRoute = false;
        } else if (data.hasRedirection) {
          var oldUrl = $location.url();
          var newUrl = data.url;

          if (newUrl) {
            $location.url(newUrl).replace();
          } else {
            newUrl = $location.path(data.path).search(data.search).replace().url();
          }

          if (newUrl !== oldUrl) {
            // Exit out and don't process current next value,
            // wait for next location change from redirect
            keepProcessingRoute = false;
          }
        }

        return keepProcessingRoute;
      }

      function resolveLocals(route) {
        if (route) {
          var locals = angular.extend({}, route.resolve);
          angular.forEach(locals, function (value, key) {
            locals[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value, null, null, key);
          });
          var template = getTemplateFor(route);

          if (angular.isDefined(template)) {
            locals['$template'] = template;
          }

          return $q.all(locals);
        }
      }

      function getTemplateFor(route) {
        var template, templateUrl;

        if (angular.isDefined(template = route.template)) {
          if (angular.isFunction(template)) {
            template = template(route.params);
          }
        } else if (angular.isDefined(templateUrl = route.templateUrl)) {
          if (angular.isFunction(templateUrl)) {
            templateUrl = templateUrl(route.params);
          }

          if (angular.isDefined(templateUrl)) {
            route.loadedTemplateUrl = $sce.valueOf(templateUrl);
            template = $templateRequest(templateUrl);
          }
        }

        return template;
      }
      /**
       * @returns {Object} the current active route, by matching it against the URL
       */


      function parseRoute() {
        // Match a route
        var params, match;
        angular.forEach(routes, function (route, path) {
          if (!match && (params = switchRouteMatcher($location.path(), route))) {
            match = inherit(route, {
              params: angular.extend({}, $location.search(), params),
              pathParams: params
            });
            match.$$route = route;
          }
        }); // No route matched; fallback to "otherwise" route

        return match || routes[null] && inherit(routes[null], {
          params: {},
          pathParams: {}
        });
      }
      /**
       * @param {Object} newRoute - The new route configuration (as returned by `parseRoute()`).
       * @param {Object} oldRoute - The previous route configuration (as returned by `parseRoute()`).
       * @returns {boolean} Whether this is an "update-only" navigation, i.e. the URL maps to the same
       *                    route and it can be reused (based on the config and the type of change).
       */


      function isNavigationUpdateOnly(newRoute, oldRoute) {
        // IF this is not a forced reload
        return !forceReload // AND both `newRoute`/`oldRoute` are defined
        && newRoute && oldRoute // AND they map to the same Route Definition Object
        && newRoute.$$route === oldRoute.$$route // AND `reloadOnUrl` is disabled
        && (!newRoute.reloadOnUrl // OR `reloadOnSearch` is disabled
        || !newRoute.reloadOnSearch // AND both routes have the same path params
        && angular.equals(newRoute.pathParams, oldRoute.pathParams));
      }
      /**
       * @returns {string} interpolation of the redirect path with the parameters
       */


      function interpolate(string, params) {
        var result = [];
        angular.forEach((string || '').split(':'), function (segment, i) {
          if (i === 0) {
            result.push(segment);
          } else {
            var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
            var key = segmentMatch[1];
            result.push(params[key]);
            result.push(segmentMatch[2] || '');
            delete params[key];
          }
        });
        return result.join('');
      }
    }];
  }

  instantiateRoute.$inject = ['$injector'];

  function instantiateRoute($injector) {
    if (isEagerInstantiationEnabled) {
      // Instantiate `$route`
      $injector.get('$route');
    }
  }

  ngRouteModule.provider('$routeParams', $RouteParamsProvider);
  /**
   * @ngdoc service
   * @name $routeParams
   * @requires $route
   * @this
   *
   * @description
   * The `$routeParams` service allows you to retrieve the current set of route parameters.
   *
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   *
   * The route parameters are a combination of {@link ng.$location `$location`}'s
   * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
   * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
   *
   * In case of parameter name collision, `path` params take precedence over `search` params.
   *
   * The service guarantees that the identity of the `$routeParams` object will remain unchanged
   * (but its properties will likely change) even when a route change occurs.
   *
   * Note that the `$routeParams` are only updated *after* a route change completes successfully.
   * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
   * Instead you can use `$route.current.params` to access the new route's parameters.
   *
   * @example
   * ```js
   *  // Given:
   *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
   *  // Route: /Chapter/:chapterId/Section/:sectionId
   *  //
   *  // Then
   *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
   * ```
   */

  function $RouteParamsProvider() {
    this.$get = function () {
      return {};
    };
  }

  ngRouteModule.directive('ngView', ngViewFactory);
  ngRouteModule.directive('ngView', ngViewFillContentFactory);
  /**
   * @ngdoc directive
   * @name ngView
   * @restrict ECA
   *
   * @description
   * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
   * including the rendered template of the current route into the main layout (`index.html`) file.
   * Every time the current route changes, the included view changes with it according to the
   * configuration of the `$route` service.
   *
   * Requires the {@link ngRoute `ngRoute`} module to be installed.
   *
   * @animations
   * | Animation                        | Occurs                              |
   * |----------------------------------|-------------------------------------|
   * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
   * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
   *
   * The enter and leave animation occur concurrently.
   *
   * @scope
   * @priority 400
   * @param {string=} onload Expression to evaluate whenever the view updates.
   *
   * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
   *                  $anchorScroll} to scroll the viewport after the view is updated.
   *
   *                  - If the attribute is not set, disable scrolling.
   *                  - If the attribute is set without value, enable scrolling.
   *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
   *                    as an expression yields a truthy value.
   * @example
      <example name="ngView-directive" module="ngViewExample"
               deps="angular-route.js;angular-animate.js"
               animations="true" fixBase="true">
        <file name="index.html">
          <div ng-controller="MainCtrl as main">
            Choose:
            <a href="Book/Moby">Moby</a> |
            <a href="Book/Moby/ch/1">Moby: Ch1</a> |
            <a href="Book/Gatsby">Gatsby</a> |
            <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
            <a href="Book/Scarlet">Scarlet Letter</a><br/>
  
            <div class="view-animate-container">
              <div ng-view class="view-animate"></div>
            </div>
            <hr />
  
            <pre>$location.path() = {{main.$location.path()}}</pre>
            <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
            <pre>$route.current.params = {{main.$route.current.params}}</pre>
            <pre>$routeParams = {{main.$routeParams}}</pre>
          </div>
        </file>
  
        <file name="book.html">
          <div>
            controller: {{book.name}}<br />
            Book Id: {{book.params.bookId}}<br />
          </div>
        </file>
  
        <file name="chapter.html">
          <div>
            controller: {{chapter.name}}<br />
            Book Id: {{chapter.params.bookId}}<br />
            Chapter Id: {{chapter.params.chapterId}}
          </div>
        </file>
  
        <file name="animations.css">
          .view-animate-container {
            position:relative;
            height:100px!important;
            background:white;
            border:1px solid black;
            height:40px;
            overflow:hidden;
          }
  
          .view-animate {
            padding:10px;
          }
  
          .view-animate.ng-enter, .view-animate.ng-leave {
            transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;
  
            display:block;
            width:100%;
            border-left:1px solid black;
  
            position:absolute;
            top:0;
            left:0;
            right:0;
            bottom:0;
            padding:10px;
          }
  
          .view-animate.ng-enter {
            left:100%;
          }
          .view-animate.ng-enter.ng-enter-active {
            left:0;
          }
          .view-animate.ng-leave.ng-leave-active {
            left:-100%;
          }
        </file>
  
        <file name="script.js">
          angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
            .config(['$routeProvider', '$locationProvider',
              function($routeProvider, $locationProvider) {
                $routeProvider
                  .when('/Book/:bookId', {
                    templateUrl: 'book.html',
                    controller: 'BookCtrl',
                    controllerAs: 'book'
                  })
                  .when('/Book/:bookId/ch/:chapterId', {
                    templateUrl: 'chapter.html',
                    controller: 'ChapterCtrl',
                    controllerAs: 'chapter'
                  });
  
                $locationProvider.html5Mode(true);
            }])
            .controller('MainCtrl', ['$route', '$routeParams', '$location',
              function MainCtrl($route, $routeParams, $location) {
                this.$route = $route;
                this.$location = $location;
                this.$routeParams = $routeParams;
            }])
            .controller('BookCtrl', ['$routeParams', function BookCtrl($routeParams) {
              this.name = 'BookCtrl';
              this.params = $routeParams;
            }])
            .controller('ChapterCtrl', ['$routeParams', function ChapterCtrl($routeParams) {
              this.name = 'ChapterCtrl';
              this.params = $routeParams;
            }]);
  
        </file>
  
        <file name="protractor.js" type="protractor">
          it('should load and compile correct template', function() {
            element(by.linkText('Moby: Ch1')).click();
            var content = element(by.css('[ng-view]')).getText();
            expect(content).toMatch(/controller: ChapterCtrl/);
            expect(content).toMatch(/Book Id: Moby/);
            expect(content).toMatch(/Chapter Id: 1/);
  
            element(by.partialLinkText('Scarlet')).click();
  
            content = element(by.css('[ng-view]')).getText();
            expect(content).toMatch(/controller: BookCtrl/);
            expect(content).toMatch(/Book Id: Scarlet/);
          });
        </file>
      </example>
   */

  /**
   * @ngdoc event
   * @name ngView#$viewContentLoaded
   * @eventType emit on the current ngView scope
   * @description
   * Emitted every time the ngView content is reloaded.
   */

  ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];

  function ngViewFactory($route, $anchorScroll, $animate) {
    return {
      restrict: 'ECA',
      terminal: true,
      priority: 400,
      transclude: 'element',
      link: function link(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';
        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }

          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.done(function (response) {
              if (response !== false) previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current; // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.

            var clone = $transclude(newScope, function (clone) {
              $animate.enter(clone, null, currentElement || $element).done(function onNgViewEnter(response) {
                if (response !== false && angular.isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });
            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
      }
    };
  } // This directive is called during the $transclude call of the first `ngView` directive.
  // It will replace and compile the content of the element with the loaded template.
  // We need this directive so that the element content is already filled when
  // the link function of another directive on the same element as ngView
  // is called.


  ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];

  function ngViewFillContentFactory($compile, $controller, $route) {
    return {
      restrict: 'ECA',
      priority: -400,
      link: function link(scope, $element) {
        var current = $route.current,
            locals = current.locals;
        $element.html(locals.$template);
        var link = $compile($element.contents());

        if (current.controller) {
          locals.$scope = scope;
          var controller = $controller(current.controller, locals);

          if (current.controllerAs) {
            scope[current.controllerAs] = controller;
          }

          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }

        scope[current.resolveAs || '$resolve'] = locals;
        link(scope);
      }
    };
  }
})(window, window.angular);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/tailwindcss/tailwind.css":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/tailwindcss/tailwind.css ***!
  \*********************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@tailwind base;\n\n@tailwind components;\n\n@tailwind utilities;\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/lodash/lodash.js":
/*!***************************************!*\
  !*** ./node_modules/lodash/lodash.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.21';

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Error message constants. */
  var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
      FUNC_ERROR_TEXT = 'Expected a function',
      INVALID_TEMPL_VAR_ERROR_TEXT = 'Invalid `variable` option passed into `_.template`';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /** Used to compose bitmasks for function metadata. */
  var WRAP_BIND_FLAG = 1,
      WRAP_BIND_KEY_FLAG = 2,
      WRAP_CURRY_BOUND_FLAG = 4,
      WRAP_CURRY_FLAG = 8,
      WRAP_CURRY_RIGHT_FLAG = 16,
      WRAP_PARTIAL_FLAG = 32,
      WRAP_PARTIAL_RIGHT_FLAG = 64,
      WRAP_ARY_FLAG = 128,
      WRAP_REARG_FLAG = 256,
      WRAP_FLIP_FLAG = 512;

  /** Used as default options for `_.truncate`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2,
      LAZY_WHILE_FLAG = 3;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991,
      MAX_INTEGER = 1.7976931348623157e+308,
      NAN = 0 / 0;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295,
      MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

  /** Used to associate wrap methods with their bit flags. */
  var wrapFlags = [
    ['ary', WRAP_ARY_FLAG],
    ['bind', WRAP_BIND_FLAG],
    ['bindKey', WRAP_BIND_KEY_FLAG],
    ['curry', WRAP_CURRY_FLAG],
    ['curryRight', WRAP_CURRY_RIGHT_FLAG],
    ['flip', WRAP_FLIP_FLAG],
    ['partial', WRAP_PARTIAL_FLAG],
    ['partialRight', WRAP_PARTIAL_RIGHT_FLAG],
    ['rearg', WRAP_REARG_FLAG]
  ];

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      asyncTag = '[object AsyncFunction]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      domExcTag = '[object DOMException]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      nullTag = '[object Null]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]',
      weakMapTag = '[object WeakMap]',
      weakSetTag = '[object WeakSet]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
      reUnescapedHtml = /[&<>"']/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
      reHasRegExpChar = RegExp(reRegExpChar.source);

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /** Used to match wrap detail comments. */
  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
      reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
      reSplitDetails = /,? & /;

  /** Used to match words composed of alphanumeric characters. */
  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

  /**
   * Used to validate the `validate` option in `_.template` variable.
   *
   * Forbids characters which could potentially change the meaning of the function argument definition:
   * - "()," (modification of function parameters)
   * - "=" (default value)
   * - "[]{}" (destructuring of function parameters)
   * - "/" (beginning of a comment)
   * - whitespace
   */
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Used to match
   * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to match Latin Unicode letters (excluding mathematical operators). */
  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsDingbatRange = '\\u2700-\\u27bf',
      rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
      rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
      rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
      rsPunctuationRange = '\\u2000-\\u206f',
      rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
      rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
      rsVarRange = '\\ufe0e\\ufe0f',
      rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

  /** Used to compose unicode capture groups. */
  var rsApos = "['\u2019]",
      rsAstral = '[' + rsAstralRange + ']',
      rsBreak = '[' + rsBreakRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsDigits = '\\d+',
      rsDingbat = '[' + rsDingbatRange + ']',
      rsLower = '[' + rsLowerRange + ']',
      rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsUpper = '[' + rsUpperRange + ']',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
      rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
      rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
      rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
      reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
      rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match apostrophes. */
  var reApos = RegExp(rsApos, 'g');

  /**
   * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
   * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
   */
  var reComboMark = RegExp(rsCombo, 'g');

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to match complex or compound words. */
  var reUnicodeWord = RegExp([
    rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
    rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
    rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
    rsUpper + '+' + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join('|'), 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Used to detect strings that need a more robust regexp to match words. */
  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object',
    'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
    '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
  cloneableTags[boolTag] = cloneableTags[dateTag] =
  cloneableTags[float32Tag] = cloneableTags[float64Tag] =
  cloneableTags[int8Tag] = cloneableTags[int16Tag] =
  cloneableTags[int32Tag] = cloneableTags[mapTag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[setTag] =
  cloneableTags[stringTag] = cloneableTags[symbolTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map Latin Unicode letters to basic Latin letters. */
  var deburredLetters = {
    // Latin-1 Supplement block.
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss',
    // Latin Extended-A block.
    '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
    '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
    '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
    '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
    '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
    '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
    '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
    '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
    '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
    '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
    '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
    '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
    '\u0134': 'J',  '\u0135': 'j',
    '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
    '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
    '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
    '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
    '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
    '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
    '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
    '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
    '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
    '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
    '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
    '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
    '\u0163': 't',  '\u0165': 't', '\u0167': 't',
    '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
    '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
    '\u0174': 'W',  '\u0175': 'w',
    '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
    '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
    '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
    '\u0132': 'IJ', '\u0133': 'ij',
    '\u0152': 'Oe', '\u0153': 'oe',
    '\u0149': "'n", '\u017f': 's'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Built-in method references without a dependency on `root`. */
  var freeParseFloat = parseFloat,
      freeParseInt = parseInt;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports =  true && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
      nodeIsDate = nodeUtil && nodeUtil.isDate,
      nodeIsMap = nodeUtil && nodeUtil.isMap,
      nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
      nodeIsSet = nodeUtil && nodeUtil.isSet,
      nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /*--------------------------------------------------------------------------*/

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /**
   * A specialized version of `baseAggregator` for arrays.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} setter The function to set `accumulator` values.
   * @param {Function} iteratee The iteratee to transform keys.
   * @param {Object} accumulator The initial aggregated object.
   * @returns {Function} Returns `accumulator`.
   */
  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.forEachRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;

    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.every` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if all elements pass the predicate check,
   *  else `false`.
   */
  function arrayEvery(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.reduceRight` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the last element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the size of an ASCII `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  var asciiSize = baseProperty('length');

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * Splits an ASCII `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  /**
   * The base implementation of methods like `_.findKey` and `_.findLastKey`,
   * without support for iteratee shorthands, which iterates over `collection`
   * using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * This function is like `baseIndexOf` except that it accepts a comparator.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * The base implementation of `_.mean` and `_.meanBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the mean.
   */
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? (baseSum(array, iteratee) / length) : NAN;
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.propertyOf` without support for deep paths.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyOf(object) {
    return function(key) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * The base implementation of `_.sortBy` which uses `comparer` to define the
   * sort order of `array` and replaces criteria objects with their corresponding
   * values.
   *
   * @private
   * @param {Array} array The array to sort.
   * @param {Function} comparer The function to define sort order.
   * @returns {Array} Returns `array`.
   */
  function baseSortBy(array, comparer) {
    var length = array.length;

    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  /**
   * The base implementation of `_.sum` and `_.sumBy` without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {number} Returns the sum.
   */
  function baseSum(array, iteratee) {
    var result,
        index = -1,
        length = array.length;

    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== undefined) {
        result = result === undefined ? current : (result + current);
      }
    }
    return result;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /**
   * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
   * of key-value pairs for `object` corresponding to the property names of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the key-value pairs.
   */
  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /**
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */
  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */
  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
    return index;
  }

  /**
   * Gets the number of `placeholder` occurrences in `array`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} placeholder The placeholder to search for.
   * @returns {number} Returns the placeholder count.
   */
  function countHolders(array, placeholder) {
    var length = array.length,
        result = 0;

    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  /**
   * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
   * letters to basic Latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  var deburrLetter = basePropertyOf(deburredLetters);

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Checks if `string` contains a word composed of Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a word is found, else `false`.
   */
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  /**
   * Converts `iterator` to an array.
   *
   * @private
   * @param {Object} iterator The iterator to convert.
   * @returns {Array} Returns the converted array.
   */
  function iteratorToArray(iterator) {
    var data,
        result = [];

    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER) {
        array[index] = PLACEHOLDER;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /**
   * Converts `set` to its value-value pairs.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the value-value pairs.
   */
  function setToPairs(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * A specialized version of `_.lastIndexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  /**
   * Gets the number of symbols in `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the string size.
   */
  function stringSize(string) {
    return hasUnicode(string)
      ? unicodeSize(string)
      : asciiSize(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  /**
   * Gets the size of a Unicode `string`.
   *
   * @private
   * @param {string} string The string inspect.
   * @returns {number} Returns the string size.
   */
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /**
   * Splits a Unicode `string` into an array of its words.
   *
   * @private
   * @param {string} The string to inspect.
   * @returns {Array} Returns the words of `string`.
   */
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the `context` object.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Util
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // Create a suped-up `defer` in Node.js.
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  var runInContext = (function runInContext(context) {
    context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));

    /** Built-in constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = context['__core-js_shared__'];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? context.Buffer : undefined,
        Symbol = context.Symbol,
        Uint8Array = context.Uint8Array,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice,
        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
        symIterator = Symbol ? Symbol.iterator : undefined,
        symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Mocked built-ins. */
    var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
        ctxNow = Date && Date.now !== root.Date.now && Date.now,
        ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeFloor = Math.floor,
        nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeIsFinite = context.isFinite,
        nativeJoin = arrayProto.join,
        nativeKeys = overArg(Object.keys, Object),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = Date.now,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random,
        nativeReverse = arrayProto.reverse;

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(context, 'DataView'),
        Map = getNative(context, 'Map'),
        Promise = getNative(context, 'Promise'),
        Set = getNative(context, 'Set'),
        WeakMap = getNative(context, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit method
     * chain sequences. Methods that operate on and return arrays, collections,
     * and functions can be chained together. Methods that retrieve a single value
     * or may return a primitive value will automatically end the chain sequence
     * and return the unwrapped value. Otherwise, the value must be unwrapped
     * with `_#value`.
     *
     * Explicit chain sequences, which must be unwrapped with `_#value`, may be
     * enabled using `_.chain`.
     *
     * The execution of chained methods is lazy, that is, it's deferred until
     * `_#value` is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion.
     * Shortcut fusion is an optimization to merge iteratee calls; this avoids
     * the creation of intermediate arrays and can greatly reduce the number of
     * iteratee executions. Sections of a chain sequence qualify for shortcut
     * fusion if the section is applied to an array and iteratees accept only
     * one argument. The heuristic for whether a section qualifies for shortcut
     * fusion is subject to change.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
     * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
     * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
     * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
     * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
     * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
     * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
     * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
     * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
     * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
     * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
     * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
     * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
     * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
     * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
     * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
     * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
     * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
     * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
     * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
     * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
     * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
     * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
     * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
     * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
     * `zipObject`, `zipObjectDeep`, and `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
     * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
     * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
     * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
     * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
     * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
     * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
     * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
     * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
     * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
     * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
     * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
     * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
     * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
     * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
     * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
     * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
     * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
     * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
     * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
     * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
     * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
     * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
     * `upperFirst`, `value`, and `words`
     *
     * @name _
     * @constructor
     * @category Seq
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // Returns an unwrapped value.
     * wrapped.reduce(_.add);
     * // => 6
     *
     * // Returns a wrapped value.
     * var squares = wrapped.map(square);
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} proto The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object;
        object.prototype = undefined;
        return result;
      };
    }());

    /**
     * The function whose prototype chain sequence wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable explicit method chain sequences.
     */
    function LodashWrapper(value, chainAll) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__chain__ = !!chainAll;
      this.__index__ = 0;
      this.__values__ = undefined;
    }

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB) as well as ES2015 template strings. Change the
     * following template settings to use alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type {Object}
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type {RegExp}
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type {string}
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type {Object}
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type {Function}
         */
        '_': lodash
      }
    };

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;
    lodash.prototype.constructor = lodash;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @constructor
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = MAX_ARRAY_LENGTH;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = copyArray(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = copyArray(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = copyArray(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || (!isRight && arrLength == length && takeCount == length)) {
        return baseWrapperValue(array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    // Ensure `LazyWrapper` is an instance of `baseLodash`.
    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /*------------------------------------------------------------------------*/

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.sample` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @returns {*} Returns the random element.
     */
    function arraySample(array) {
      var length = array.length;
      return length ? array[baseRandom(0, length - 1)] : undefined;
    }

    /**
     * A specialized version of `_.sampleSize` for arrays.
     *
     * @private
     * @param {Array} array The array to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function arraySampleSize(array, n) {
      return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
    }

    /**
     * A specialized version of `_.shuffle` for arrays.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function arrayShuffle(array) {
      return shuffleSelf(copyArray(array));
    }

    /**
     * This function is like `assignValue` except that it doesn't assign
     * `undefined` values.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignMergeValue(object, key, value) {
      if ((value !== undefined && !eq(object[key], value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
          (value === undefined && !(key in object))) {
        baseAssignValue(object, key, value);
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.assignIn` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * The base implementation of `_.at` without support for individual paths.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {string[]} paths The property paths to pick.
     * @returns {Array} Returns the picked elements.
     */
    function baseAt(object, paths) {
      var index = -1,
          length = paths.length,
          result = Array(length),
          skip = object == null;

      while (++index < length) {
        result[index] = skip ? undefined : get(object, paths[index]);
      }
      return result;
    }

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Deep clone
     *  2 - Flatten inherited properties
     *  4 - Clone symbols
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result,
          isDeep = bitmask & CLONE_DEEP_FLAG,
          isFlat = bitmask & CLONE_FLAT_FLAG,
          isFull = bitmask & CLONE_SYMBOLS_FLAG;

      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = (isFlat || isFunc) ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat
              ? copySymbolsIn(value, baseAssignIn(result, value))
              : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack);
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key) {
          result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
      }

      var keysFunc = isFull
        ? (isFlat ? getAllKeysIn : getAllKeys)
        : (isFlat ? keysIn : keys);

      var props = isArr ? undefined : keysFunc(value);
      arrayEach(props || value, function(subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
      return result;
    }

    /**
     * The base implementation of `_.conforms` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     */
    function baseConforms(source) {
      var props = keys(source);
      return function(object) {
        return baseConformsTo(object, source, props);
      };
    }

    /**
     * The base implementation of `_.conformsTo` which accepts `props` to check.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     */
    function baseConformsTo(object, source, props) {
      var length = props.length;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (length--) {
        var key = props[length],
            predicate = source[key],
            value = object[key];

        if ((value === undefined && !(key in object)) || !predicate(value)) {
          return false;
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts `args`
     * to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Array} args The arguments to provide to `func`.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * The base implementation of methods like `_.max` and `_.min` which accepts a
     * `comparator` to determine the extremum value.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The iteratee invoked per iteration.
     * @param {Function} comparator The comparator used to compare values.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(array, iteratee, comparator) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index],
            current = iteratee(value);

        if (current != null && (computed === undefined
              ? (current === current && !isSymbol(current))
              : comparator(current, computed)
            )) {
          var computed = current,
              result = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = toInteger(start);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : toInteger(end);
      if (end < 0) {
        end += length;
      }
      end = start > end ? 0 : toLength(end);
      while (start < end) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return object && baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from `props`.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the function names.
     */
    function baseFunctions(object, props) {
      return arrayFilter(props, function(key) {
        return isFunction(object[key]);
      });
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.gt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     */
    function baseGt(value, other) {
      return value > other;
    }

    /**
     * The base implementation of `_.has` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHas(object, key) {
      return object != null && hasOwnProperty.call(object, key);
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    /**
     * The base implementation of methods like `_.intersection`, without support
     * for iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of shared values.
     */
    function baseIntersection(arrays, iteratee, comparator) {
      var includes = comparator ? arrayIncludesWith : arrayIncludes,
          length = arrays[0].length,
          othLength = arrays.length,
          othIndex = othLength,
          caches = Array(othLength),
          maxLength = Infinity,
          result = [];

      while (othIndex--) {
        var array = arrays[othIndex];
        if (othIndex && iteratee) {
          array = arrayMap(array, baseUnary(iteratee));
        }
        maxLength = nativeMin(array.length, maxLength);
        caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
          ? new SetCache(othIndex && array)
          : undefined;
      }
      array = arrays[0];

      var index = -1,
          seen = caches[0];

      outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (!(seen
              ? cacheHas(seen, computed)
              : includes(result, computed, comparator)
            )) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache
                  ? cacheHas(cache, computed)
                  : includes(arrays[othIndex], computed, comparator))
                ) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.invert` and `_.invertBy` which inverts
     * `object` with values transformed by `iteratee` and set by `setter`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform values.
     * @param {Object} accumulator The initial inverted object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseInverter(object, setter, iteratee, accumulator) {
      baseForOwn(object, function(value, key, object) {
        setter(accumulator, iteratee(value), key, object);
      });
      return accumulator;
    }

    /**
     * The base implementation of `_.invoke` without support for individual
     * method arguments.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function baseInvoke(object, path, args) {
      path = castPath(path, object);
      object = parent(object, path);
      var func = object == null ? object : object[toKey(last(path))];
      return func == null ? undefined : apply(func, object, args);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isArrayBuffer` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     */
    function baseIsArrayBuffer(value) {
      return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
    }

    /**
     * The base implementation of `_.isDate` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     */
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag(object),
          othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isMap` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     */
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isRegExp` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     */
    function baseIsRegExp(value) {
      return isObjectLike(value) && baseGetTag(value) == regexpTag;
    }

    /**
     * The base implementation of `_.isSet` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     */
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object),
          result = [];

      for (var key in object) {
        if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.lt` which doesn't coerce arguments.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     */
    function baseLt(value, other) {
      return value < other;
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.merge` without support for multiple sources.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack);
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        }
        else {
          var newValue = customizer
            ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
            : undefined;

          if (newValue === undefined) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {number} srcIndex The index of `source`.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     */
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key),
          srcValue = safeGet(source, key),
          stacked = stack.get(srcValue);

      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer
        ? customizer(objValue, srcValue, (key + ''), object, source, stack)
        : undefined;

      var isCommon = newValue === undefined;

      if (isCommon) {
        var isArr = isArray(srcValue),
            isBuff = !isArr && isBuffer(srcValue),
            isTyped = !isArr && !isBuff && isTypedArray(srcValue);

        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          }
          else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          }
          else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          }
          else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          }
          else {
            newValue = [];
          }
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          }
          else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        }
        else {
          isCommon = false;
        }
      }
      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack['delete'](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }

    /**
     * The base implementation of `_.nth` which doesn't coerce arguments.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {number} n The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     */
    function baseNth(array, n) {
      var length = array.length;
      if (!length) {
        return;
      }
      n += n < 0 ? length : 0;
      return isIndex(n, length) ? array[n] : undefined;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            }
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }

      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(getIteratee()));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.pick` without support for individual
     * property identifiers.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @returns {Object} Returns the new object.
     */
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }

    /**
     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} paths The property paths to pick.
     * @param {Function} predicate The function invoked per property.
     * @returns {Object} Returns the new object.
     */
    function basePickBy(object, paths, predicate) {
      var index = -1,
          length = paths.length,
          result = {};

      while (++index < length) {
        var path = paths[index],
            value = baseGet(object, path);

        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * The base implementation of `_.pullAllBy` without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     */
    function basePullAll(array, values, iteratee, comparator) {
      var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
          index = -1,
          length = values.length,
          seen = array;

      if (array === values) {
        values = copyArray(values);
      }
      if (iteratee) {
        seen = arrayMap(array, baseUnary(iteratee));
      }
      while (++index < length) {
        var fromIndex = 0,
            value = values[index],
            computed = iteratee ? iteratee(value) : value;

        while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
          if (seen !== array) {
            splice.call(seen, fromIndex, 1);
          }
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for returning
     * floating-point numbers.
     *
     * @private
     * @param {number} lower The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the random number.
     */
    function baseRandom(lower, upper) {
      return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
    }

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * The base implementation of `_.repeat` which doesn't coerce arguments.
     *
     * @private
     * @param {string} string The string to repeat.
     * @param {number} n The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     */
    function baseRepeat(string, n) {
      var result = '';
      if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
          string += string;
        }
      } while (n);

      return result;
    }

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + '');
    }

    /**
     * The base implementation of `_.sample`.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     */
    function baseSample(collection) {
      return arraySample(values(collection));
    }

    /**
     * The base implementation of `_.sampleSize` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to sample.
     * @param {number} n The number of elements to sample.
     * @returns {Array} Returns the random elements.
     */
    function baseSampleSize(collection, n) {
      var array = values(collection);
      return shuffleSelf(array, baseClamp(n, 0, array.length));
    }

    /**
     * The base implementation of `_.set`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = toKey(path[index]),
            newValue = value;

        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return object;
        }

        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : undefined;
          if (newValue === undefined) {
            newValue = isObject(objValue)
              ? objValue
              : (isIndex(path[index + 1]) ? [] : {});
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }

    /**
     * The base implementation of `setData` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant(string),
        'writable': true
      });
    };

    /**
     * The base implementation of `_.shuffle`.
     *
     * @private
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    function baseShuffle(collection) {
      return shuffleSelf(values(collection));
    }

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
     * performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndex(array, value, retHighest) {
      var low = 0,
          high = array == null ? low : array.length;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if (computed !== null && !isSymbol(computed) &&
              (retHighest ? (computed <= value) : (computed < value))) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return baseSortedIndexBy(array, value, identity, retHighest);
    }

    /**
     * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
     * which invokes `iteratee` for `value` and each element of `array` to compute
     * their sort ranking. The iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The iteratee invoked per element.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function baseSortedIndexBy(array, value, iteratee, retHighest) {
      var low = 0,
          high = array == null ? 0 : array.length;
      if (high === 0) {
        return 0;
      }

      value = iteratee(value);
      var valIsNaN = value !== value,
          valIsNull = value === null,
          valIsSymbol = isSymbol(value),
          valIsUndefined = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            othIsDefined = computed !== undefined,
            othIsNull = computed === null,
            othIsReflexive = computed === computed,
            othIsSymbol = isSymbol(computed);

        if (valIsNaN) {
          var setLow = retHighest || othIsReflexive;
        } else if (valIsUndefined) {
          setLow = othIsReflexive && (retHighest || othIsDefined);
        } else if (valIsNull) {
          setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
        } else if (valIsSymbol) {
          setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
        } else if (othIsNull || othIsSymbol) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseSortedUniq(array, iteratee) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        if (!index || !eq(computed, seen)) {
          var seen = computed;
          result[resIndex++] = value === 0 ? 0 : value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.toNumber` which doesn't ensure correct
     * conversions of binary, hexadecimal, or octal string values.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     */
    function baseToNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      return +value;
    }

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.uniqBy` without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     */
    function baseUniq(array, iteratee, comparator) {
      var index = -1,
          includes = arrayIncludes,
          length = array.length,
          isCommon = true,
          result = [],
          seen = result;

      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      }
      else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache;
      }
      else {
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value) : value;

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.unset`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The property path to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     */
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }

    /**
     * The base implementation of `_.update`.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to update.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize path creation.
     * @returns {Object} Returns `object`.
     */
    function baseUpdate(object, path, updater, customizer) {
      return baseSet(object, path, updater(baseGet(object, path)), customizer);
    }

    /**
     * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
     * without support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) &&
        predicate(array[index], index, array)) {}

      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to perform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      return arrayReduce(actions, function(result, action) {
        return action.func.apply(action.thisArg, arrayPush([result], action.args));
      }, result);
    }

    /**
     * The base implementation of methods like `_.xor`, without support for
     * iteratee shorthands, that accepts an array of arrays to inspect.
     *
     * @private
     * @param {Array} arrays The arrays to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of values.
     */
    function baseXor(arrays, iteratee, comparator) {
      var length = arrays.length;
      if (length < 2) {
        return length ? baseUniq(arrays[0]) : [];
      }
      var index = -1,
          result = Array(length);

      while (++index < length) {
        var array = arrays[index],
            othIndex = -1;

        while (++othIndex < length) {
          if (othIndex != index) {
            result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
          }
        }
      }
      return baseUniq(baseFlatten(result, 1), iteratee, comparator);
    }

    /**
     * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
     *
     * @private
     * @param {Array} props The property identifiers.
     * @param {Array} values The property values.
     * @param {Function} assignFunc The function to assign values.
     * @returns {Object} Returns the new object.
     */
    function baseZipObject(props, values, assignFunc) {
      var index = -1,
          length = props.length,
          valsLength = values.length,
          result = {};

      while (++index < length) {
        var value = index < valsLength ? values[index] : undefined;
        assignFunc(result, props[index], value);
      }
      return result;
    }

    /**
     * Casts `value` to an empty array if it's not an array like object.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Array|Object} Returns the cast array-like object.
     */
    function castArrayLikeObject(value) {
      return isArrayLikeObject(value) ? value : [];
    }

    /**
     * Casts `value` to `identity` if it's not a function.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {Function} Returns cast function.
     */
    function castFunction(value) {
      return typeof value == 'function' ? value : identity;
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /**
     * A `baseRest` alias which can be replaced with `identity` by module
     * replacement plugins.
     *
     * @private
     * @type {Function}
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    var castRest = baseRest;

    /**
     * Casts `array` to a slice if it's needed.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {number} start The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the cast slice.
     */
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === undefined ? length : end;
      return (!start && end >= length) ? array : baseSlice(array, start, end);
    }

    /**
     * A simple wrapper around the global [`clearTimeout`](https://mdn.io/clearTimeout).
     *
     * @private
     * @param {number|Object} id The timer id or timeout object of the timer to clear.
     */
    var clearTimeout = ctxClearTimeout || function(id) {
      return root.clearTimeout(id);
    };

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersLength = holders.length,
          leftIndex = -1,
          leftLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(leftLength + rangeLength),
          isUncurried = !isCurried;

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[holders[argsIndex]] = args[argsIndex];
        }
      }
      while (rangeLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @params {boolean} [isCurried] Specify composing for a curried function.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders, isCurried) {
      var argsIndex = -1,
          argsLength = args.length,
          holdersIndex = -1,
          holdersLength = holders.length,
          rightIndex = -1,
          rightLength = partials.length,
          rangeLength = nativeMax(argsLength - holdersLength, 0),
          result = Array(rangeLength + rightLength),
          isUncurried = !isCurried;

      while (++argsIndex < rangeLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        if (isUncurried || argsIndex < argsLength) {
          result[offset + holders[holdersIndex]] = args[argsIndex++];
        }
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        if (newValue === undefined) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }

    /**
     * Copies own symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Copies own and inherited symbols of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, getIteratee(iteratee, 2), accumulator);
      };
    }

    /**
     * Creates a function like `_.assign`.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1,
            length = sources.length,
            customizer = length > 1 ? sources[length - 1] : undefined,
            guard = length > 2 ? sources[2] : undefined;

        customizer = (assigner.length > 3 && typeof customizer == 'function')
          ? (length--, customizer)
          : undefined;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` to invoke it with the optional `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createBind(func, bitmask, thisArg) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.lowerFirst`.
     *
     * @private
     * @param {string} methodName The name of the `String` case method to use.
     * @returns {Function} Returns the new case function.
     */
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);

        var strSymbols = hasUnicode(string)
          ? stringToArray(string)
          : undefined;

        var chr = strSymbols
          ? strSymbols[0]
          : string.charAt(0);

        var trailing = strSymbols
          ? castSlice(strSymbols, 1).join('')
          : string.slice(1);

        return chr[methodName]() + trailing;
      };
    }

    /**
     * Creates a function like `_.camelCase`.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtor(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors. See
        // http://ecma-international.org/ecma-262/7.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a function that wraps `func` to enable currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {number} arity The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length < arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} findIndexFunc The function to find the collection index.
     * @returns {Function} Returns the new find function.
     */
    function createFind(findIndexFunc) {
      return function(collection, predicate, fromIndex) {
        var iterable = Object(collection);
        if (!isArrayLike(collection)) {
          var iteratee = getIteratee(predicate, 3);
          collection = keys(collection);
          predicate = function(key) { return iteratee(iterable[key], key, iterable); };
        }
        var index = findIndexFunc(collection, predicate, fromIndex);
        return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return flatRest(function(funcs) {
        var length = funcs.length,
            index = length,
            prereq = LodashWrapper.prototype.thru;

        if (fromRight) {
          funcs.reverse();
        }
        while (index--) {
          var func = funcs[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
            var wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? index : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) &&
                data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) &&
                !data[4].length && data[9] == 1
              ) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func))
              ? wrapper[funcName]()
              : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value)) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      });
    }

    /**
     * Creates a function that wraps `func` to invoke it with optional `this`
     * binding of `thisArg`, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided
     *  to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length < arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length > 1) {
          args.reverse();
        }
        if (isAry && ary < length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates a function like `_.invertBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} toIteratee The function to resolve iteratees.
     * @returns {Function} Returns the new inverter function.
     */
    function createInverter(setter, toIteratee) {
      return function(object, iteratee) {
        return baseInverter(object, setter, toIteratee(iteratee), {});
      };
    }

    /**
     * Creates a function that performs a mathematical operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @param {number} [defaultValue] The value used for `undefined` arguments.
     * @returns {Function} Returns the new mathematical operation function.
     */
    function createMathOperation(operator, defaultValue) {
      return function(value, other) {
        var result;
        if (value === undefined && other === undefined) {
          return defaultValue;
        }
        if (value !== undefined) {
          result = value;
        }
        if (other !== undefined) {
          if (result === undefined) {
            return other;
          }
          if (typeof value == 'string' || typeof other == 'string') {
            value = baseToString(value);
            other = baseToString(other);
          } else {
            value = baseToNumber(value);
            other = baseToNumber(other);
          }
          result = operator(value, other);
        }
        return result;
      };
    }

    /**
     * Creates a function like `_.over`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over iteratees.
     * @returns {Function} Returns the new over function.
     */
    function createOver(arrayFunc) {
      return flatRest(function(iteratees) {
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        return baseRest(function(args) {
          var thisArg = this;
          return arrayFunc(iteratees, function(iteratee) {
            return apply(iteratee, thisArg, args);
          });
        });
      });
    }

    /**
     * Creates the padding for `string` based on `length`. The `chars` string
     * is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {number} length The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padding for `string`.
     */
    function createPadding(length, chars) {
      chars = chars === undefined ? ' ' : baseToString(chars);

      var charsLength = chars.length;
      if (charsLength < 2) {
        return charsLength ? baseRepeat(chars, length) : chars;
      }
      var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
      return hasUnicode(chars)
        ? castSlice(stringToArray(result), 0, length).join('')
        : result.slice(0, length);
    }

    /**
     * Creates a function that wraps `func` to invoke it with the `this` binding
     * of `thisArg` and `partials` prepended to the arguments it receives.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to
     *  the new function.
     * @returns {Function} Returns the new wrapped function.
     */
    function createPartial(func, bitmask, thisArg, partials) {
      var isBind = bitmask & WRAP_BIND_FLAG,
          Ctor = createCtor(func);

      function wrapper() {
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength),
            fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        return apply(fn, isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates a function that performs a relational operation on two values.
     *
     * @private
     * @param {Function} operator The function to perform the operation.
     * @returns {Function} Returns the new relational operation function.
     */
    function createRelationalOperation(operator) {
      return function(value, other) {
        if (!(typeof value == 'string' && typeof other == 'string')) {
          value = toNumber(value);
          other = toNumber(other);
        }
        return operator(value, other);
      };
    }

    /**
     * Creates a function that wraps `func` to continue currying.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @param {Function} wrapFunc The function to create the `func` wrapper.
     * @param {*} placeholder The placeholder value.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to
     *  the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }

    /**
     * Creates a function like `_.round`.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        number = toNumber(number);
        precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
        if (precision && nativeIsFinite(number)) {
          // Shift with exponential notation to avoid floating-point issues.
          // See [MDN](https://mdn.io/round#Examples) for more details.
          var pair = (toString(number) + 'e').split('e'),
              value = func(pair[0] + 'e' + (+pair[1] + precision));

          pair = (toString(value) + 'e').split('e');
          return +(pair[0] + 'e' + (+pair[1] - precision));
        }
        return func(number);
      };
    }

    /**
     * Creates a set object of `values`.
     *
     * @private
     * @param {Array} values The values to add to the set.
     * @returns {Object} Returns the new set.
     */
    var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
      return new Set(values);
    };

    /**
     * Creates a `_.toPairs` or `_.toPairsIn` function.
     *
     * @private
     * @param {Function} keysFunc The function to get the keys of a given object.
     * @returns {Function} Returns the new pairs function.
     */
    function createToPairs(keysFunc) {
      return function(object) {
        var tag = getTag(object);
        if (tag == mapTag) {
          return mapToArray(object);
        }
        if (tag == setTag) {
          return setToPairs(object);
        }
        return baseToPairs(object, keysFunc(object));
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind`
     *    2 - `_.bindKey`
     *    4 - `_.curry` or `_.curryRight` of a bound function
     *    8 - `_.curry`
     *   16 - `_.curryRight`
     *   32 - `_.partial`
     *   64 - `_.partialRight`
     *  128 - `_.rearg`
     *  256 - `_.ary`
     *  512 - `_.flip`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }

    /**
     * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
     * of source objects to the destination object for all destination properties
     * that resolve to `undefined`.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to assign.
     * @param {Object} object The parent object of `objValue`.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsAssignIn(objValue, srcValue, key, object) {
      if (objValue === undefined ||
          (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
        return srcValue;
      }
      return objValue;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
     * objects into destination objects that are passed thru.
     *
     * @private
     * @param {*} objValue The destination value.
     * @param {*} srcValue The source value.
     * @param {string} key The key of the property to merge.
     * @param {Object} object The parent object of `objValue`.
     * @param {Object} source The parent object of `srcValue`.
     * @param {Object} [stack] Tracks traversed source values and their merged
     *  counterparts.
     * @returns {*} Returns the value to assign.
     */
    function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
      if (isObject(objValue) && isObject(srcValue)) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        stack.set(srcValue, objValue);
        baseMerge(objValue, srcValue, undefined, customDefaultsMerge, stack);
        stack['delete'](srcValue);
      }
      return objValue;
    }

    /**
     * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
     * objects.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {string} key The key of the property to inspect.
     * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
     */
    function customOmitClone(value) {
      return isPlainObject(value) ? undefined : value;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /**
     * A specialized version of `baseRest` which flattens the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @returns {Function} Returns the new function.
     */
    function flatRest(func) {
      return setToString(overRest(func, undefined, flatten), func + '');
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Creates an array of own and inherited enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = (func.name + ''),
          array = realNames[result],
          length = hasOwnProperty.call(realNames, result) ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the argument placeholder value for `func`.
     *
     * @private
     * @param {Function} func The function to inspect.
     * @returns {*} Returns the placeholder value.
     */
    function getHolder(func) {
      var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
      return object.placeholder;
    }

    /**
     * Gets the appropriate "iteratee" function. If `_.iteratee` is customized,
     * this function returns the custom method, otherwise it returns `baseIteratee`.
     * If arguments are provided, the chosen function is invoked with them and
     * its result is returned.
     *
     * @private
     * @param {*} [value] The value to convert to an iteratee.
     * @param {number} [arity] The arity of the created iteratee.
     * @returns {Function} Returns the chosen function or its result.
     */
    function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * Creates an array of the own and inherited enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (Map && getTag(new Map) != mapTag) ||
        (Promise && getTag(Promise.resolve()) != promiseTag) ||
        (Set && getTag(new Set) != setTag) ||
        (WeakMap && getTag(new WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Extracts wrapper details from the `source` body comment.
     *
     * @private
     * @param {string} source The source to inspect.
     * @returns {Array} Returns the wrapper details.
     */
    function getWrapDetails(source) {
      var match = source.match(reWrapDetails);
      return match ? match[1].split(reSplitDetails) : [];
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return (typeof object.constructor == 'function' && !isPrototype(object))
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return new Ctor;

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return new Ctor;

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Inserts wrapper `details` in a comment at the top of the `source` body.
     *
     * @private
     * @param {string} source The source to modify.
     * @returns {Array} details The details to insert.
     * @returns {string} Returns the modified source.
     */
    function insertWrapDetails(source, details) {
      var length = details.length;
      if (!length) {
        return source;
      }
      var lastIndex = length - 1;
      details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
      details = details.join(length > 2 ? ', ' : ' ');
      return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
    }

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart,
     *  else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func),
          other = lodash[funcName];

      if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
        return false;
      }
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Checks if `func` is capable of being masked.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `func` is maskable, else `false`.
     */
    var isMaskable = coreJsData ? isFunction : stubFalse;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers used to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and
     * `_.rearg` modify function arguments, making the order in which they are
     * executed important, preventing the merging of metadata. However, we make
     * an exception for a safe combined case where curried functions have `_.ary`
     * and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);

      var isCombo =
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_CURRY_FLAG)) ||
        ((srcBitmask == WRAP_ARY_FLAG) && (bitmask == WRAP_REARG_FLAG) && (data[7].length <= source[8])) ||
        ((srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG)) && (source[7].length <= source[8]) && (bitmask == WRAP_CURRY_FLAG));

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & WRAP_BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : value;
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = value;
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & WRAP_ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * This function is like
     * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * except that it includes inherited enumerable properties.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }

    /**
     * Gets the parent value at `path` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path to get the parent value of.
     * @returns {*} Returns the parent value.
     */
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = copyArray(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function safeGet(object, key) {
      if (key === 'constructor' && typeof object[key] === 'function') {
        return;
      }

      if (key == '__proto__') {
        return;
      }

      return object[key];
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity
     * function to avoid garbage collection pauses in V8. See
     * [V8 issue 2070](https://bugs.chromium.org/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = shortOut(baseSetData);

    /**
     * A simple wrapper around the global [`setTimeout`](https://mdn.io/setTimeout).
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @returns {number|Object} Returns the timer id or timeout object.
     */
    var setTimeout = ctxSetTimeout || function(func, wait) {
      return root.setTimeout(func, wait);
    };

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = shortOut(baseSetToString);

    /**
     * Sets the `toString` method of `wrapper` to mimic the source of `reference`
     * with wrapper details in a comment at the top of the source body.
     *
     * @private
     * @param {Function} wrapper The function to modify.
     * @param {Function} reference The reference function.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Function} Returns `wrapper`.
     */
    function setWrapToString(wrapper, reference, bitmask) {
      var source = (reference + '');
      return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
    }

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    /**
     * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
     *
     * @private
     * @param {Array} array The array to shuffle.
     * @param {number} [size=array.length] The size of `array`.
     * @returns {Array} Returns `array`.
     */
    function shuffleSelf(array, size) {
      var index = -1,
          length = array.length,
          lastIndex = length - 1;

      size = size === undefined ? length : size;
      while (++index < size) {
        var rand = baseRandom(index, lastIndex),
            value = array[rand];

        array[rand] = array[index];
        array[index] = value;
      }
      array.length = size;
      return array;
    }

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Updates wrapper `details` based on `bitmask` flags.
     *
     * @private
     * @returns {Array} details The details to modify.
     * @param {number} bitmask The bitmask flags. See `createWrap` for more details.
     * @returns {Array} Returns `details`.
     */
    function updateWrapDetails(details, bitmask) {
      arrayEach(wrapFlags, function(pair) {
        var value = '_.' + pair[0];
        if ((bitmask & pair[1]) && !arrayIncludes(details, value)) {
          details.push(value);
        }
      });
      return details.sort();
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      if (wrapper instanceof LazyWrapper) {
        return wrapper.clone();
      }
      var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
      result.__actions__ = copyArray(wrapper.__actions__);
      result.__index__  = wrapper.__index__;
      result.__values__ = wrapper.__values__;
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `array` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the new array of chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
        size = 1;
      } else {
        size = nativeMax(toInteger(size), 0);
      }
      var length = array == null ? 0 : array.length;
      if (!length || size < 1) {
        return [];
      }
      var index = 0,
          resIndex = 0,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[resIndex++] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Creates a new array concatenating `array` with any additional arrays
     * and/or values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to concatenate.
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var other = _.concat(array, 2, [3], [[4]]);
     *
     * console.log(other);
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    function concat() {
      var length = arguments.length;
      if (!length) {
        return [];
      }
      var args = Array(length - 1),
          array = arguments[0],
          index = length;

      while (index--) {
        args[index - 1] = arguments[index];
      }
      return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
    }

    /**
     * Creates an array of `array` values not included in the other given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * **Note:** Unlike `_.pullAll`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.without, _.xor
     * @example
     *
     * _.difference([2, 1], [2, 3]);
     * // => [1]
     */
    var difference = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = baseRest(function(array, values) {
      var iteratee = last(values);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.difference` except that it accepts `comparator`
     * which is invoked to compare elements of `array` to `values`. The order and
     * references of result values are determined by the first array. The comparator
     * is invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     *
     * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }]
     */
    var differenceWith = baseRest(function(array, values) {
      var comparator = last(values);
      if (isArrayLikeObject(comparator)) {
        comparator = undefined;
      }
      return isArrayLikeObject(array)
        ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.dropRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropRightWhile(users, ['active', false]);
     * // => objects for ['barney']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropRightWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.dropWhile(users, function(o) { return !o.active; });
     * // => objects for ['pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.dropWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.dropWhile(users, ['active', false]);
     * // => objects for ['pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.dropWhile(users, 'active');
     * // => objects for ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8, 10], '*', 1, 3);
     * // => [4, '*', '*', 10]
     */
    function fill(array, value, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(o) { return o.user == 'barney'; });
     * // => 0
     *
     * // The `_.matches` iteratee shorthand.
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findIndex(users, ['active', false]);
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.findIndex(users, 'active');
     * // => 2
     */
    function findIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index);
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
     * // => 2
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastIndex(users, ['active', false]);
     * // => 2
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    function findLastIndex(array, predicate, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length - 1;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = fromIndex < 0
          ? nativeMax(length + index, 0)
          : nativeMin(index, length - 1);
      }
      return baseFindIndex(array, getIteratee(predicate, 3), index, true);
    }

    /**
     * Flattens `array` a single level deep.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, [3, [4]], 5]]);
     * // => [1, 2, [3, [4]], 5]
     */
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }

    /**
     * Recursively flattens `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, [3, [4]], 5]]);
     * // => [1, 2, 3, 4, 5]
     */
    function flattenDeep(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, INFINITY) : [];
    }

    /**
     * Recursively flatten `array` up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * var array = [1, [2, [3, [4]], 5]];
     *
     * _.flattenDepth(array, 1);
     * // => [1, 2, [3, [4]], 5]
     *
     * _.flattenDepth(array, 2);
     * // => [1, 2, 3, [4], 5]
     */
    function flattenDepth(array, depth) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(array, depth);
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed
     * from key-value `pairs`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} pairs The key-value pairs.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.fromPairs([['a', 1], ['b', 2]]);
     * // => { 'a': 1, 'b': 2 }
     */
    function fromPairs(pairs) {
      var index = -1,
          length = pairs == null ? 0 : pairs.length,
          result = {};

      while (++index < length) {
        var pair = pairs[index];
        result[pair[0]] = pair[1];
      }
      return result;
    }

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias first
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.head([1, 2, 3]);
     * // => 1
     *
     * _.head([]);
     * // => undefined
     */
    function head(array) {
      return (array && array.length) ? array[0] : undefined;
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it's used as the
     * offset from the end of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // Search from the `fromIndex`.
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     */
    function indexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = fromIndex == null ? 0 : toInteger(fromIndex);
      if (index < 0) {
        index = nativeMax(length + index, 0);
      }
      return baseIndexOf(array, value, index);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 0, -1) : [];
    }

    /**
     * Creates an array of unique values that are included in all given arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons. The order and references of result values are
     * determined by the first array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersection([2, 1], [2, 3]);
     * // => [2]
     */
    var intersection = baseRest(function(arrays) {
      var mapped = arrayMap(arrays, castArrayLikeObject);
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped)
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `iteratee`
     * which is invoked for each element of each `arrays` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [2.1]
     *
     * // The `_.property` iteratee shorthand.
     * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }]
     */
    var intersectionBy = baseRest(function(arrays) {
      var iteratee = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      if (iteratee === last(mapped)) {
        iteratee = undefined;
      } else {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, getIteratee(iteratee, 2))
        : [];
    });

    /**
     * This method is like `_.intersection` except that it accepts `comparator`
     * which is invoked to compare elements of `arrays`. The order and references
     * of result values are determined by the first array. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of intersecting values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.intersectionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }]
     */
    var intersectionWith = baseRest(function(arrays) {
      var comparator = last(arrays),
          mapped = arrayMap(arrays, castArrayLikeObject);

      comparator = typeof comparator == 'function' ? comparator : undefined;
      if (comparator) {
        mapped.pop();
      }
      return (mapped.length && mapped[0] === arrays[0])
        ? baseIntersection(mapped, undefined, comparator)
        : [];
    });

    /**
     * Converts all elements in `array` into a string separated by `separator`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to convert.
     * @param {string} [separator=','] The element separator.
     * @returns {string} Returns the joined string.
     * @example
     *
     * _.join(['a', 'b', 'c'], '~');
     * // => 'a~b~c'
     */
    function join(array, separator) {
      return array == null ? '' : nativeJoin.call(array, separator);
    }

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // Search from the `fromIndex`.
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return -1;
      }
      var index = length;
      if (fromIndex !== undefined) {
        index = toInteger(fromIndex);
        index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
      }
      return value === value
        ? strictLastIndexOf(array, value, index)
        : baseFindIndex(array, baseIsNaN, index, true);
    }

    /**
     * Gets the element at index `n` of `array`. If `n` is negative, the nth
     * element from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.11.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=0] The index of the element to return.
     * @returns {*} Returns the nth element of `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     *
     * _.nth(array, 1);
     * // => 'b'
     *
     * _.nth(array, -2);
     * // => 'c';
     */
    function nth(array, n) {
      return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
    }

    /**
     * Removes all given values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
     * to remove elements from an array by predicate.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pull(array, 'a', 'c');
     * console.log(array);
     * // => ['b', 'b']
     */
    var pull = baseRest(pullAll);

    /**
     * This method is like `_.pull` except that it accepts an array of values to remove.
     *
     * **Note:** Unlike `_.difference`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
     *
     * _.pullAll(array, ['a', 'c']);
     * console.log(array);
     * // => ['b', 'b']
     */
    function pullAll(array, values) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values)
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `iteratee` which is
     * invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The iteratee is invoked with one argument: (value).
     *
     * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
     *
     * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
     * console.log(array);
     * // => [{ 'x': 2 }]
     */
    function pullAllBy(array, values, iteratee) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, getIteratee(iteratee, 2))
        : array;
    }

    /**
     * This method is like `_.pullAll` except that it accepts `comparator` which
     * is invoked to compare elements of `array` to `values`. The comparator is
     * invoked with two arguments: (arrVal, othVal).
     *
     * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Array} values The values to remove.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
     *
     * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
     * console.log(array);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
     */
    function pullAllWith(array, values, comparator) {
      return (array && array.length && values && values.length)
        ? basePullAll(array, values, undefined, comparator)
        : array;
    }

    /**
     * Removes elements from `array` corresponding to `indexes` and returns an
     * array of removed elements.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = ['a', 'b', 'c', 'd'];
     * var pulled = _.pullAt(array, [1, 3]);
     *
     * console.log(array);
     * // => ['a', 'c']
     *
     * console.log(pulled);
     * // => ['b', 'd']
     */
    var pullAt = flatRest(function(array, indexes) {
      var length = array == null ? 0 : array.length,
          result = baseAt(array, indexes);

      basePullAt(array, arrayMap(indexes, function(index) {
        return isIndex(index, length) ? +index : index;
      }).sort(compareAscending));

      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Reverses `array` so that the first element becomes the last, the second
     * element becomes the second to last, and so on.
     *
     * **Note:** This method mutates `array` and is based on
     * [`Array#reverse`](https://mdn.io/Array/reverse).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.reverse(array);
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function reverse(array) {
      return array == null ? array : nativeReverse.call(array);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of
     * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
     * returned.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      else {
        start = start == null ? 0 : toInteger(start);
        end = end === undefined ? length : toInteger(end);
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     */
    function sortedIndex(array, value) {
      return baseSortedIndex(array, value);
    }

    /**
     * This method is like `_.sortedIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 0
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
     * // => 0
     */
    function sortedIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
    }

    /**
     * This method is like `_.indexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
     * // => 1
     */
    function sortedIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value);
        if (index < length && eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
     * // => 4
     */
    function sortedLastIndex(array, value) {
      return baseSortedIndex(array, value, true);
    }

    /**
     * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
     * which is invoked for `value` and each element of `array` to compute their
     * sort ranking. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * var objects = [{ 'x': 4 }, { 'x': 5 }];
     *
     * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
     * // => 1
     *
     * // The `_.property` iteratee shorthand.
     * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
     * // => 1
     */
    function sortedLastIndexBy(array, value, iteratee) {
      return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
    }

    /**
     * This method is like `_.lastIndexOf` except that it performs a binary
     * search on a sorted `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
     * // => 3
     */
    function sortedLastIndexOf(array, value) {
      var length = array == null ? 0 : array.length;
      if (length) {
        var index = baseSortedIndex(array, value, true) - 1;
        if (eq(array[index], value)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.uniq` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniq([1, 1, 2]);
     * // => [1, 2]
     */
    function sortedUniq(array) {
      return (array && array.length)
        ? baseSortedUniq(array)
        : [];
    }

    /**
     * This method is like `_.uniqBy` except that it's designed and optimized
     * for sorted arrays.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
     * // => [1.1, 2.3]
     */
    function sortedUniqBy(array, iteratee) {
      return (array && array.length)
        ? baseSortedUniq(array, getIteratee(iteratee, 2))
        : [];
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.tail([1, 2, 3]);
     * // => [2, 3]
     */
    function tail(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseSlice(array, 1, length) : [];
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      if (!(array && array.length)) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array == null ? 0 : array.length;
      if (!length) {
        return [];
      }
      n = (guard || n === undefined) ? 1 : toInteger(n);
      n = length - n;
      return baseSlice(array, n < 0 ? 0 : n, length);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.takeRightWhile(users, function(o) { return !o.active; });
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
     * // => objects for ['pebbles']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeRightWhile(users, ['active', false]);
     * // => objects for ['fred', 'pebbles']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeRightWhile(users, 'active');
     * // => []
     */
    function takeRightWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is invoked with
     * three arguments: (value, index, array).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.takeWhile(users, function(o) { return !o.active; });
     * // => objects for ['barney', 'fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.takeWhile(users, { 'user': 'barney', 'active': false });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.takeWhile(users, ['active', false]);
     * // => objects for ['barney', 'fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.takeWhile(users, 'active');
     * // => []
     */
    function takeWhile(array, predicate) {
      return (array && array.length)
        ? baseWhile(array, getIteratee(predicate, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all given arrays using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([2], [1, 2]);
     * // => [2, 1]
     */
    var union = baseRest(function(arrays) {
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
    });

    /**
     * This method is like `_.union` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which uniqueness is computed. Result values are chosen from the first
     * array in which the value occurs. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.unionBy([2.1], [1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    var unionBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.union` except that it accepts `comparator` which
     * is invoked to compare elements of `arrays`. Result values are chosen from
     * the first array in which the value occurs. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.unionWith(objects, others, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var unionWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurrence of each element
     * is kept. The order of result values is determined by the order they occur
     * in the array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     */
    function uniq(array) {
      return (array && array.length) ? baseUniq(array) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * uniqueness is computed. The order of result values is determined by the
     * order they occur in the array. The iteratee is invoked with one argument:
     * (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
     * // => [2.1, 1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniqBy(array, iteratee) {
      return (array && array.length) ? baseUniq(array, getIteratee(iteratee, 2)) : [];
    }

    /**
     * This method is like `_.uniq` except that it accepts `comparator` which
     * is invoked to compare elements of `array`. The order of result values is
     * determined by the order they occur in the array.The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new duplicate free array.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.uniqWith(objects, _.isEqual);
     * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
     */
    function uniqWith(array, comparator) {
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @since 1.2.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     *
     * _.unzip(zipped);
     * // => [['a', 'b'], [1, 2], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var length = 0;
      array = arrayFilter(array, function(group) {
        if (isArrayLikeObject(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      return baseTimes(length, function(index) {
        return arrayMap(array, baseProperty(index));
      });
    }

    /**
     * This method is like `_.unzip` except that it accepts `iteratee` to specify
     * how regrouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  regrouped values.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee) {
      if (!(array && array.length)) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      return arrayMap(result, function(group) {
        return apply(iteratee, undefined, group);
      });
    }

    /**
     * Creates an array excluding all given values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.pull`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.xor
     * @example
     *
     * _.without([2, 1, 2, 3], 1, 2);
     * // => [3]
     */
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the
     * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the given arrays. The order of result values is determined by the order
     * they occur in the arrays.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of filtered values.
     * @see _.difference, _.without
     * @example
     *
     * _.xor([2, 1], [2, 3]);
     * // => [1, 3]
     */
    var xor = baseRest(function(arrays) {
      return baseXor(arrayFilter(arrays, isArrayLikeObject));
    });

    /**
     * This method is like `_.xor` except that it accepts `iteratee` which is
     * invoked for each element of each `arrays` to generate the criterion by
     * which by which they're compared. The order of result values is determined
     * by the order they occur in the arrays. The iteratee is invoked with one
     * argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2, 3.4]
     *
     * // The `_.property` iteratee shorthand.
     * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var xorBy = baseRest(function(arrays) {
      var iteratee = last(arrays);
      if (isArrayLikeObject(iteratee)) {
        iteratee = undefined;
      }
      return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
    });

    /**
     * This method is like `_.xor` except that it accepts `comparator` which is
     * invoked to compare elements of `arrays`. The order of result values is
     * determined by the order they occur in the arrays. The comparator is invoked
     * with two arguments: (arrVal, othVal).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
     * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
     *
     * _.xorWith(objects, others, _.isEqual);
     * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
     */
    var xorWith = baseRest(function(arrays) {
      var comparator = last(arrays);
      comparator = typeof comparator == 'function' ? comparator : undefined;
      return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
    });

    /**
     * Creates an array of grouped elements, the first of which contains the
     * first elements of the given arrays, the second of which contains the
     * second elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['a', 'b'], [1, 2], [true, false]);
     * // => [['a', 1, true], ['b', 2, false]]
     */
    var zip = baseRest(unzip);

    /**
     * This method is like `_.fromPairs` except that it accepts two arrays,
     * one of property identifiers and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 0.4.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject(['a', 'b'], [1, 2]);
     * // => { 'a': 1, 'b': 2 }
     */
    function zipObject(props, values) {
      return baseZipObject(props || [], values || [], assignValue);
    }

    /**
     * This method is like `_.zipObject` except that it supports property paths.
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Array
     * @param {Array} [props=[]] The property identifiers.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
     * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
     */
    function zipObjectDeep(props, values) {
      return baseZipObject(props || [], values || [], baseSet);
    }

    /**
     * This method is like `_.zip` except that it accepts `iteratee` to specify
     * how grouped values should be combined. The iteratee is invoked with the
     * elements of each group: (...group).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee=_.identity] The function to combine
     *  grouped values.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
     *   return a + b + c;
     * });
     * // => [111, 222]
     */
    var zipWith = baseRest(function(arrays) {
      var length = arrays.length,
          iteratee = length > 1 ? arrays[length - 1] : undefined;

      iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
      return unzipWith(arrays, iteratee);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` wrapper instance that wraps `value` with explicit method
     * chain sequences enabled. The result of such sequences must be unwrapped
     * with `_#value`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Seq
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _
     *   .chain(users)
     *   .sortBy('age')
     *   .map(function(o) {
     *     return o.user + ' is ' + o.age;
     *   })
     *   .head()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor
     * is invoked with one argument; (value). The purpose of this method is to
     * "tap into" a method chain sequence in order to modify intermediate results.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    // Mutate input array.
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     * The purpose of this method is to "pass thru" values replacing intermediate
     * results in a method chain sequence.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Seq
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor) {
      return interceptor(value);
    }

    /**
     * This method is the wrapper version of `_.at`.
     *
     * @name at
     * @memberOf _
     * @since 1.0.0
     * @category Seq
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _(object).at(['a[0].b.c', 'a[1]']).value();
     * // => [3, 4]
     */
    var wrapperAt = flatRest(function(paths) {
      var length = paths.length,
          start = length ? paths[0] : 0,
          value = this.__wrapped__,
          interceptor = function(object) { return baseAt(object, paths); };

      if (length > 1 || this.__actions__.length ||
          !(value instanceof LazyWrapper) || !isIndex(start)) {
        return this.thru(interceptor);
      }
      value = value.slice(start, +start + (length ? 1 : 0));
      value.__actions__.push({
        'func': thru,
        'args': [interceptor],
        'thisArg': undefined
      });
      return new LodashWrapper(value, this.__chain__).thru(function(array) {
        if (length && !array.length) {
          array.push(undefined);
        }
        return array;
      });
    });

    /**
     * Creates a `lodash` wrapper instance with explicit method chain sequences enabled.
     *
     * @name chain
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // A sequence without explicit chaining.
     * _(users).head();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // A sequence with explicit chaining.
     * _(users)
     *   .chain()
     *   .head()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chain sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Gets the next value on a wrapped object following the
     * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
     *
     * @name next
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the next iterator value.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 1 }
     *
     * wrapped.next();
     * // => { 'done': false, 'value': 2 }
     *
     * wrapped.next();
     * // => { 'done': true, 'value': undefined }
     */
    function wrapperNext() {
      if (this.__values__ === undefined) {
        this.__values__ = toArray(this.value());
      }
      var done = this.__index__ >= this.__values__.length,
          value = done ? undefined : this.__values__[this.__index__++];

      return { 'done': done, 'value': value };
    }

    /**
     * Enables the wrapper to be iterable.
     *
     * @name Symbol.iterator
     * @memberOf _
     * @since 4.0.0
     * @category Seq
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var wrapped = _([1, 2]);
     *
     * wrapped[Symbol.iterator]() === wrapped;
     * // => true
     *
     * Array.from(wrapped);
     * // => [1, 2]
     */
    function wrapperToIterator() {
      return this;
    }

    /**
     * Creates a clone of the chain sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @since 3.2.0
     * @category Seq
     * @param {*} value The value to plant.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var wrapped = _([1, 2]).map(square);
     * var other = wrapped.plant([3, 4]);
     *
     * other.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        clone.__index__ = 0;
        clone.__values__ = undefined;
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * This method is the wrapper version of `_.reverse`.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @since 0.1.0
     * @category Seq
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({
          'func': thru,
          'args': [reverse],
          'thisArg': undefined
        });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(reverse);
    }

    /**
     * Executes the chain sequence to resolve the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @since 0.1.0
     * @alias toJSON, valueOf
     * @category Seq
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the number of times the key was returned by `iteratee`. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': 1, '6': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        ++result[key];
      } else {
        baseAssignValue(result, key, 1);
      }
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * Iteration is stopped once `predicate` returns falsey. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * **Note:** This method returns `true` for
     * [empty collections](https://en.wikipedia.org/wiki/Empty_set) because
     * [everything is true](https://en.wikipedia.org/wiki/Vacuous_truth) of
     * elements of empty collections.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.every(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, guard) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * **Note:** Unlike `_.remove`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.reject
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, { 'age': 36, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.filter(users, 'active');
     * // => objects for ['barney']
     *
     * // Combining several predicates using `_.overEvery` or `_.overSome`.
     * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
     * // => objects for ['fred', 'barney']
     */
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is invoked with three
     * arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.find(users, function(o) { return o.age < 40; });
     * // => object for 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.find(users, { 'age': 1, 'active': true });
     * // => object for 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.find(users, ['active', false]);
     * // => object for 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.find(users, 'active');
     * // => object for 'barney'
     */
    var find = createFind(findIndex);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=collection.length-1] The index to search from.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(findLastIndex);

    /**
     * Creates a flattened array of values by running each element in `collection`
     * thru `iteratee` and flattening the mapped results. The iteratee is invoked
     * with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [n, n];
     * }
     *
     * _.flatMap([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMap(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), 1);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDeep([1, 2], duplicate);
     * // => [1, 1, 2, 2]
     */
    function flatMapDeep(collection, iteratee) {
      return baseFlatten(map(collection, iteratee), INFINITY);
    }

    /**
     * This method is like `_.flatMap` except that it recursively flattens the
     * mapped results up to `depth` times.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {number} [depth=1] The maximum recursion depth.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * function duplicate(n) {
     *   return [[[n, n]]];
     * }
     *
     * _.flatMapDepth([1, 2], duplicate, 2);
     * // => [[1, 1], [2, 2]]
     */
    function flatMapDepth(collection, iteratee, depth) {
      depth = depth === undefined ? 1 : toInteger(depth);
      return baseFlatten(map(collection, iteratee), depth);
    }

    /**
     * Iterates over elements of `collection` and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length"
     * property are iterated like arrays. To avoid this behavior use `_.forIn`
     * or `_.forOwn` for object iteration.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @alias each
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEachRight
     * @example
     *
     * _.forEach([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `1` then `2`.
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forEach(collection, iteratee) {
      var func = isArray(collection) ? arrayEach : baseEach;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @alias eachRight
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     * @see _.forEach
     * @example
     *
     * _.forEachRight([1, 2], function(value) {
     *   console.log(value);
     * });
     * // => Logs `2` then `1`.
     */
    function forEachRight(collection, iteratee) {
      var func = isArray(collection) ? arrayEachRight : baseEachRight;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `path` is a function, it's invoked
     * for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke each method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invokeMap([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invokeMap = baseRest(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
      });
      return result;
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The corresponding value of
     * each key is the last element responsible for generating the key. The
     * iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var array = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.keyBy(array, function(o) {
     *   return String.fromCharCode(o.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.keyBy(array, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     */
    var keyBy = createAggregator(function(result, value, key) {
      baseAssignValue(result, key, value);
    });

    /**
     * Creates an array of values by running each element in `collection` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
     * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
     * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
     * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * _.map([4, 8], square);
     * // => [16, 64]
     *
     * _.map({ 'a': 4, 'b': 8 }, square);
     * // => [16, 64] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, the second of which
     * contains elements `predicate` returns falsey for. The predicate is
     * invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * _.partition(users, function(o) { return o.active; });
     * // => objects for [['fred'], ['barney', 'pebbles']]
     *
     * // The `_.matches` iteratee shorthand.
     * _.partition(users, { 'age': 1, 'active': false });
     * // => objects for [['pebbles'], ['barney', 'fred']]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.partition(users, ['active', false]);
     * // => objects for [['barney', 'pebbles'], ['fred']]
     *
     * // The `_.property` iteratee shorthand.
     * _.partition(users, 'active');
     * // => objects for [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` thru `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not given, the first element of `collection` is used as the initial
     * value. The iteratee is invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
     * and `sortBy`
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduceRight
     * @example
     *
     * _.reduce([1, 2], function(sum, n) {
     *   return sum + n;
     * }, 0);
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     *   return result;
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
     */
    function reduce(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @returns {*} Returns the accumulated value.
     * @see _.reduce
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduceRight : baseReduce,
          initAccum = arguments.length < 3;

      return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
    }

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     * @see _.filter
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * _.reject(users, function(o) { return !o.active; });
     * // => objects for ['fred']
     *
     * // The `_.matches` iteratee shorthand.
     * _.reject(users, { 'age': 40, 'active': true });
     * // => objects for ['barney']
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.reject(users, ['active', false]);
     * // => objects for ['fred']
     *
     * // The `_.property` iteratee shorthand.
     * _.reject(users, 'active');
     * // => objects for ['barney']
     */
    function reject(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, negate(getIteratee(predicate, 3)));
    }

    /**
     * Gets a random element from `collection`.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @returns {*} Returns the random element.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     */
    function sample(collection) {
      var func = isArray(collection) ? arraySample : baseSample;
      return func(collection);
    }

    /**
     * Gets `n` random elements at unique keys from `collection` up to the
     * size of `collection`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to sample.
     * @param {number} [n=1] The number of elements to sample.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the random elements.
     * @example
     *
     * _.sampleSize([1, 2, 3], 2);
     * // => [3, 1]
     *
     * _.sampleSize([1, 2, 3], 4);
     * // => [2, 3, 1]
     */
    function sampleSize(collection, n, guard) {
      if ((guard ? isIterateeCall(collection, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      var func = isArray(collection) ? arraySampleSize : baseSampleSize;
      return func(collection, n);
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      var func = isArray(collection) ? arrayShuffle : baseShuffle;
      return func(collection);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable string keyed properties for objects.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the collection size.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      if (collection == null) {
        return 0;
      }
      if (isArrayLike(collection)) {
        return isString(collection) ? stringSize(collection) : collection.length;
      }
      var tag = getTag(collection);
      if (tag == mapTag || tag == setTag) {
        return collection.size;
      }
      return baseKeys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * Iteration is stopped once `predicate` returns truthy. The predicate is
     * invoked with three arguments: (value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.some(users, ['active', false]);
     * // => true
     *
     * // The `_.property` iteratee shorthand.
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, guard) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (guard && isIterateeCall(collection, predicate, guard)) {
        predicate = undefined;
      }
      return func(collection, getIteratee(predicate, 3));
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection thru each iteratee. This method
     * performs a stable sort, that is, it preserves the original sort order of
     * equal elements. The iteratees are invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 30 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.sortBy(users, [function(o) { return o.user; }]);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 30]]
     *
     * _.sortBy(users, ['user', 'age']);
     * // => objects for [['barney', 34], ['barney', 36], ['fred', 30], ['fred', 48]]
     */
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = ctxNow || function() {
      return root.Date.now();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it's called `n` or more times.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => Logs 'done saving!' after the two async saves have completed.
     */
    function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that invokes `func`, with up to `n` arguments,
     * ignoring any additional arguments.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it's called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery(element).on('click', _.before(5, addContactToList));
     * // => Allows adding up to 4 contacts to the list.
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and `partials` prepended to the arguments it receives.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind`, this method doesn't set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * function greet(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * }
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = baseRest(function(func, thisArg, partials) {
      var bitmask = WRAP_BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bind));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Creates a function that invokes the method at `object[key]` with `partials`
     * prepended to the arguments it receives.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist. See
     * [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Function
     * @param {Object} object The object to invoke the method on.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // Bound with placeholders.
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = baseRest(function(object, key, partials) {
      var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, getHolder(bindKey));
        bitmask |= WRAP_PARTIAL_FLAG;
      }
      return createWrap(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts arguments of `func` and either invokes
     * `func` returning its result, if at least `arity` number of arguments have
     * been provided, or returns a function that accepts the remaining `func`
     * arguments, and so on. The arity of `func` may be specified if `func.length`
     * is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    function curry(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curry.placeholder;
      return result;
    }

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method doesn't set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // Curried with placeholders.
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    function curryRight(func, arity, guard) {
      arity = guard ? undefined : arity;
      var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
      result.placeholder = curryRight.placeholder;
      return result;
    }

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now());
      }

      function debounced() {
        var time = now(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // => Logs 'deferred' after one millisecond.
     */
    var defer = baseRest(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => Logs 'later' after one second.
     */
    var delay = baseRest(function(func, wait, args) {
      return baseDelay(func, toNumber(wait) || 0, args);
    });

    /**
     * Creates a function that invokes `func` with arguments reversed.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to flip arguments for.
     * @returns {Function} Returns the new flipped function.
     * @example
     *
     * var flipped = _.flip(function() {
     *   return _.toArray(arguments);
     * });
     *
     * flipped('a', 'b', 'c', 'd');
     * // => ['d', 'c', 'b', 'a']
     */
    function flip(func) {
      return createWrap(func, WRAP_FLIP_FLAG);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        var args = arguments;
        switch (args.length) {
          case 0: return !predicate.call(this);
          case 1: return !predicate.call(this, args[0]);
          case 2: return !predicate.call(this, args[0], args[1]);
          case 3: return !predicate.call(this, args[0], args[1], args[2]);
        }
        return !predicate.apply(this, args);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first invocation. The `func` is
     * invoked with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // => `createApplication` is invoked once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with its arguments transformed.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms=[_.identity]]
     *  The argument transforms.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var func = _.overArgs(function(x, y) {
     *   return [x, y];
     * }, [square, doubled]);
     *
     * func(9, 3);
     * // => [81, 6]
     *
     * func(10, 5);
     * // => [100, 10]
     */
    var overArgs = castRest(function(func, transforms) {
      transforms = (transforms.length == 1 && isArray(transforms[0]))
        ? arrayMap(transforms[0], baseUnary(getIteratee()))
        : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));

      var funcsLength = transforms.length;
      return baseRest(function(args) {
        var index = -1,
            length = nativeMin(args.length, funcsLength);

        while (++index < length) {
          args[index] = transforms[index].call(this, args[index]);
        }
        return apply(func, this, args);
      });
    });

    /**
     * Creates a function that invokes `func` with `partials` prepended to the
     * arguments it receives. This method is like `_.bind` except it does **not**
     * alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 0.2.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // Partially applied with placeholders.
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partial));
      return createWrap(func, WRAP_PARTIAL_FLAG, undefined, partials, holders);
    });

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to the arguments it receives.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method doesn't set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * function greet(greeting, name) {
     *   return greeting + ' ' + name;
     * }
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // Partially applied with placeholders.
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = baseRest(function(func, partials) {
      var holders = replaceHolders(partials, getHolder(partialRight));
      return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined, partials, holders);
    });

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified `indexes` where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, [2, 0, 1]);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     */
    var rearg = flatRest(function(func, indexes) {
      return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as
     * an array.
     *
     * **Note:** This method is based on the
     * [rest parameter](https://mdn.io/rest_parameters).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.rest(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function rest(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start === undefined ? start : toInteger(start);
      return baseRest(func, start);
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * create function and an array of arguments much like
     * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
     *
     * **Note:** This method is based on the
     * [spread operator](https://mdn.io/spread_operator).
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @param {number} [start=0] The start position of the spread.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = start == null ? 0 : nativeMax(toInteger(start), 0);
      return baseRest(function(args) {
        var array = args[start],
            otherArgs = castSlice(args, 0, start);

        if (array) {
          arrayPush(otherArgs, array);
        }
        return apply(func, this, otherArgs);
      });
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed `func` invocations and a `flush` method to
     * immediately invoke them. Provide `options` to indicate whether `func`
     * should be invoked on the leading and/or trailing edge of the `wait`
     * timeout. The `func` is invoked with the last arguments provided to the
     * throttled function. Subsequent calls to the throttled function return the
     * result of the last `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the throttled function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=true]
     *  Specify invoking on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // Avoid excessively updating the position while scrolling.
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
     * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
     * jQuery(element).on('click', throttled);
     *
     * // Cancel the trailing throttled invocation.
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
      });
    }

    /**
     * Creates a function that accepts up to one argument, ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     * @example
     *
     * _.map(['6', '8', '10'], _.unary(parseInt));
     * // => [6, 8, 10]
     */
    function unary(func) {
      return ary(func, 1);
    }

    /**
     * Creates a function that provides `value` to `wrapper` as its first
     * argument. Any additional arguments provided to the function are appended
     * to those provided to the `wrapper`. The wrapper is invoked with the `this`
     * binding of the created function.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} [wrapper=identity] The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      return partial(castFunction(wrapper), value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Casts `value` as an array if it's not one.
     *
     * @static
     * @memberOf _
     * @since 4.4.0
     * @category Lang
     * @param {*} value The value to inspect.
     * @returns {Array} Returns the cast array.
     * @example
     *
     * _.castArray(1);
     * // => [1]
     *
     * _.castArray({ 'a': 1 });
     * // => [{ 'a': 1 }]
     *
     * _.castArray('abc');
     * // => ['abc']
     *
     * _.castArray(null);
     * // => [null]
     *
     * _.castArray(undefined);
     * // => [undefined]
     *
     * _.castArray();
     * // => []
     *
     * var array = [1, 2, 3];
     * console.log(_.castArray(array) === array);
     * // => true
     */
    function castArray() {
      if (!arguments.length) {
        return [];
      }
      var value = arguments[0];
      return isArray(value) ? value : [value];
    }

    /**
     * Creates a shallow clone of `value`.
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
     * and supports cloning arrays, array buffers, booleans, date objects, maps,
     * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
     * arrays. The own enumerable properties of `arguments` objects are cloned
     * as plain objects. An empty object is returned for uncloneable values such
     * as error objects, functions, DOM nodes, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to clone.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeep
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var shallow = _.clone(objects);
     * console.log(shallow[0] === objects[0]);
     * // => true
     */
    function clone(value) {
      return baseClone(value, CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.clone` except that it accepts `customizer` which
     * is invoked to produce the cloned value. If `customizer` returns `undefined`,
     * cloning is handled by the method instead. The `customizer` is invoked with
     * up to four arguments; (value [, index|key, object, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the cloned value.
     * @see _.cloneDeepWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * }
     *
     * var el = _.cloneWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 0
     */
    function cloneWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
    }

    /**
     * This method is like `_.cloneWith` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @param {Function} [customizer] The function to customize cloning.
     * @returns {*} Returns the deep cloned value.
     * @see _.cloneWith
     * @example
     *
     * function customizer(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * }
     *
     * var el = _.cloneDeepWith(document.body, customizer);
     *
     * console.log(el === document.body);
     * // => false
     * console.log(el.nodeName);
     * // => 'BODY'
     * console.log(el.childNodes.length);
     * // => 20
     */
    function cloneDeepWith(value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
    }

    /**
     * Checks if `object` conforms to `source` by invoking the predicate
     * properties of `source` with the corresponding property values of `object`.
     *
     * **Note:** This method is equivalent to `_.conforms` when `source` is
     * partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property predicates to conform to.
     * @returns {boolean} Returns `true` if `object` conforms, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 1; } });
     * // => true
     *
     * _.conformsTo(object, { 'b': function(n) { return n > 2; } });
     * // => false
     */
    function conformsTo(object, source) {
      return source == null || baseConformsTo(object, source, keys(source));
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`,
     *  else `false`.
     * @see _.lt
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    var gt = createRelationalOperation(baseGt);

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to
     *  `other`, else `false`.
     * @see _.lte
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    var gte = createRelationalOperation(function(value, other) {
      return value >= other;
    });

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is classified as an `ArrayBuffer` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
     * @example
     *
     * _.isArrayBuffer(new ArrayBuffer(2));
     * // => true
     *
     * _.isArrayBuffer(new Array(2));
     * // => false
     */
    var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        (isObjectLike(value) && baseGetTag(value) == boolTag);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    /**
     * Checks if `value` is an empty object, collection, map, or set.
     *
     * Objects are considered empty if they have no own enumerable string keyed
     * properties.
     *
     * Array-like values such as `arguments` objects, arrays, buffers, strings, or
     * jQuery-like collections are considered empty if they have a `length` of `0`.
     * Similarly, maps and sets are considered empty if they have a `size` of `0`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) &&
          (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
            isBuffer(value) || isTypedArray(value) || isArguments(value))) {
        return !value.length;
      }
      var tag = getTag(value);
      if (tag == mapTag || tag == setTag) {
        return !value.size;
      }
      if (isPrototype(value)) {
        return !baseKeys(value).length;
      }
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * This method is like `_.isEqual` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with up to
     * six arguments: (objValue, othValue [, index|key, object, other, stack]).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, othValue) {
     *   if (isGreeting(objValue) && isGreeting(othValue)) {
     *     return true;
     *   }
     * }
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqualWith(array, other, customizer);
     * // => true
     */
    function isEqualWith(value, other, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      if (!isObjectLike(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == errorTag || tag == domExcTag ||
        (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on
     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(3);
     * // => true
     *
     * _.isFinite(Number.MIN_VALUE);
     * // => true
     *
     * _.isFinite(Infinity);
     * // => false
     *
     * _.isFinite('3');
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /**
     * Checks if `value` is an integer.
     *
     * **Note:** This method is based on
     * [`Number.isInteger`](https://mdn.io/Number/isInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
     * @example
     *
     * _.isInteger(3);
     * // => true
     *
     * _.isInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isInteger(Infinity);
     * // => false
     *
     * _.isInteger('3');
     * // => false
     */
    function isInteger(value) {
      return typeof value == 'number' && value == toInteger(value);
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /**
     * Checks if `value` is classified as a `Map` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a map, else `false`.
     * @example
     *
     * _.isMap(new Map);
     * // => true
     *
     * _.isMap(new WeakMap);
     * // => false
     */
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

    /**
     * Performs a partial deep comparison between `object` and `source` to
     * determine if `object` contains equivalent property values.
     *
     * **Note:** This method is equivalent to `_.matches` when `source` is
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     *
     * _.isMatch(object, { 'b': 2 });
     * // => true
     *
     * _.isMatch(object, { 'b': 1 });
     * // => false
     */
    function isMatch(object, source) {
      return object === source || baseIsMatch(object, source, getMatchData(source));
    }

    /**
     * This method is like `_.isMatch` except that it accepts `customizer` which
     * is invoked to compare values. If `customizer` returns `undefined`, comparisons
     * are handled by the method instead. The `customizer` is invoked with five
     * arguments: (objValue, srcValue, index|key, object, source).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * function isGreeting(value) {
     *   return /^h(?:i|ello)$/.test(value);
     * }
     *
     * function customizer(objValue, srcValue) {
     *   if (isGreeting(objValue) && isGreeting(srcValue)) {
     *     return true;
     *   }
     * }
     *
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatchWith(object, source, customizer);
     * // => true
     */
    function isMatchWith(object, source, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return baseIsMatch(object, source, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is based on
     * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
     * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
     * `undefined` and other non-number values.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some
      // ActiveX objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a pristine native function.
     *
     * **Note:** This method can't reliably detect native functions in the presence
     * of the core-js package because core-js circumvents this kind of detection.
     * Despite multiple requests, the core-js maintainer has made it clear: any
     * attempt to fix the detection will be obstructed. As a result, we're left
     * with little choice but to throw an error. Unfortunately, this also affects
     * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
     * which rely on core-js.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (isMaskable(value)) {
        throw new Error(CORE_ERROR_TEXT);
      }
      return baseIsNative(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is `null` or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
     * @example
     *
     * _.isNil(null);
     * // => true
     *
     * _.isNil(void 0);
     * // => true
     *
     * _.isNil(NaN);
     * // => false
     */
    function isNil(value) {
      return value == null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
     * classified as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(3);
     * // => true
     *
     * _.isNumber(Number.MIN_VALUE);
     * // => true
     *
     * _.isNumber(Infinity);
     * // => true
     *
     * _.isNumber('3');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        (isObjectLike(value) && baseGetTag(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

    /**
     * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
     * double precision number which isn't the result of a rounded unsafe integer.
     *
     * **Note:** This method is based on
     * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
     * @example
     *
     * _.isSafeInteger(3);
     * // => true
     *
     * _.isSafeInteger(Number.MIN_VALUE);
     * // => false
     *
     * _.isSafeInteger(Infinity);
     * // => false
     *
     * _.isSafeInteger('3');
     * // => false
     */
    function isSafeInteger(value) {
      return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is classified as a `Set` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a set, else `false`.
     * @example
     *
     * _.isSet(new Set);
     * // => true
     *
     * _.isSet(new WeakSet);
     * // => false
     */
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' ||
        (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is classified as a `WeakMap` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
     * @example
     *
     * _.isWeakMap(new WeakMap);
     * // => true
     *
     * _.isWeakMap(new Map);
     * // => false
     */
    function isWeakMap(value) {
      return isObjectLike(value) && getTag(value) == weakMapTag;
    }

    /**
     * Checks if `value` is classified as a `WeakSet` object.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
     * @example
     *
     * _.isWeakSet(new WeakSet);
     * // => true
     *
     * _.isWeakSet(new Set);
     * // => false
     */
    function isWeakSet(value) {
      return isObjectLike(value) && baseGetTag(value) == weakSetTag;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`,
     *  else `false`.
     * @see _.gt
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    var lt = createRelationalOperation(baseLt);

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @since 3.9.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to
     *  `other`, else `false`.
     * @see _.gte
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    var lte = createRelationalOperation(function(value, other) {
      return value <= other;
    });

    /**
     * Converts `value` to an array.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * _.toArray({ 'a': 1, 'b': 2 });
     * // => [1, 2]
     *
     * _.toArray('abc');
     * // => ['a', 'b', 'c']
     *
     * _.toArray(1);
     * // => []
     *
     * _.toArray(null);
     * // => []
     */
    function toArray(value) {
      if (!value) {
        return [];
      }
      if (isArrayLike(value)) {
        return isString(value) ? stringToArray(value) : copyArray(value);
      }
      if (symIterator && value[symIterator]) {
        return iteratorToArray(value[symIterator]());
      }
      var tag = getTag(value),
          func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

      return func(value);
    }

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }

    /**
     * Converts `value` to an integer suitable for use as the length of an
     * array-like object.
     *
     * **Note:** This method is based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toLength(3.2);
     * // => 3
     *
     * _.toLength(Number.MIN_VALUE);
     * // => 0
     *
     * _.toLength(Infinity);
     * // => 4294967295
     *
     * _.toLength('3.2');
     * // => 3
     */
    function toLength(value) {
      return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
    }

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable string
     * keyed properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }

    /**
     * Converts `value` to a safe integer. A safe integer can be compared and
     * represented correctly.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toSafeInteger(3.2);
     * // => 3
     *
     * _.toSafeInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toSafeInteger(Infinity);
     * // => 9007199254740991
     *
     * _.toSafeInteger('3.2');
     * // => 3
     */
    function toSafeInteger(value) {
      return value
        ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER)
        : (value === 0 ? value : 0);
    }

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable string keyed properties of source objects to the
     * destination object. Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object` and is loosely based on
     * [`Object.assign`](https://mdn.io/Object/assign).
     *
     * @static
     * @memberOf _
     * @since 0.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assignIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assign({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'c': 3 }
     */
    var assign = createAssigner(function(object, source) {
      if (isPrototype(source) || isArrayLike(source)) {
        copyObject(source, keys(source), object);
        return;
      }
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          assignValue(object, key, source[key]);
        }
      }
    });

    /**
     * This method is like `_.assign` except that it iterates over own and
     * inherited source properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.assign
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * function Bar() {
     *   this.c = 3;
     * }
     *
     * Foo.prototype.b = 2;
     * Bar.prototype.d = 4;
     *
     * _.assignIn({ 'a': 0 }, new Foo, new Bar);
     * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
     */
    var assignIn = createAssigner(function(object, source) {
      copyObject(source, keysIn(source), object);
    });

    /**
     * This method is like `_.assignIn` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias extendWith
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignInWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keysIn(source), object, customizer);
    });

    /**
     * This method is like `_.assign` except that it accepts `customizer`
     * which is invoked to produce the assigned values. If `customizer` returns
     * `undefined`, assignment is handled by the method instead. The `customizer`
     * is invoked with five arguments: (objValue, srcValue, key, object, source).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @see _.assignInWith
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   return _.isUndefined(objValue) ? srcValue : objValue;
     * }
     *
     * var defaults = _.partialRight(_.assignWith, customizer);
     *
     * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
      copyObject(source, keys(source), object, customizer);
    });

    /**
     * Creates an array of values corresponding to `paths` of `object`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Array} Returns the picked values.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
     *
     * _.at(object, ['a[0].b.c', 'a[1]']);
     * // => [3, 4]
     */
    var at = flatRest(baseAt);

    /**
     * Creates an object that inherits from the `prototype` object. If a
     * `properties` object is given, its own enumerable string keyed properties
     * are assigned to the created object.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties == null ? result : baseAssign(result, properties);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source
     * objects to the destination object for all destination properties that
     * resolve to `undefined`. Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaultsDeep
     * @example
     *
     * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
     * // => { 'a': 1, 'b': 2 }
     */
    var defaults = baseRest(function(object, sources) {
      object = Object(object);

      var index = -1;
      var length = sources.length;
      var guard = length > 2 ? sources[2] : undefined;

      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        length = 1;
      }

      while (++index < length) {
        var source = sources[index];
        var props = keysIn(source);
        var propsIndex = -1;
        var propsLength = props.length;

        while (++propsIndex < propsLength) {
          var key = props[propsIndex];
          var value = object[key];

          if (value === undefined ||
              (eq(value, objectProto[key]) && !hasOwnProperty.call(object, key))) {
            object[key] = source[key];
          }
        }
      }

      return object;
    });

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @see _.defaults
     * @example
     *
     * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
     * // => { 'a': { 'b': 2, 'c': 3 } }
     */
    var defaultsDeep = baseRest(function(args) {
      args.push(undefined, customDefaultsMerge);
      return apply(mergeWith, undefined, args);
    });

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(o) { return o.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // The `_.matches` iteratee shorthand.
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    function findKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {string|undefined} Returns the key of the matched element,
     *  else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(o) { return o.age < 40; });
     * // => returns 'pebbles' assuming `_.findKey` returns 'barney'
     *
     * // The `_.matches` iteratee shorthand.
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.findLastKey(users, ['active', false]);
     * // => 'fred'
     *
     * // The `_.property` iteratee shorthand.
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    function findLastKey(object, predicate) {
      return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
    }

    /**
     * Iterates over own and inherited enumerable string keyed properties of an
     * object and invokes `iteratee` for each property. The iteratee is invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forInRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a', 'b', then 'c' (iteration order is not guaranteed).
     */
    function forIn(object, iteratee) {
      return object == null
        ? object
        : baseFor(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forIn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'c', 'b', then 'a' assuming `_.forIn` logs 'a', 'b', then 'c'.
     */
    function forInRight(object, iteratee) {
      return object == null
        ? object
        : baseForRight(object, getIteratee(iteratee, 3), keysIn);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and
     * invokes `iteratee` for each property. The iteratee is invoked with three
     * arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 0.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwnRight
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'a' then 'b' (iteration order is not guaranteed).
     */
    function forOwn(object, iteratee) {
      return object && baseForOwn(object, getIteratee(iteratee, 3));
    }

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns `object`.
     * @see _.forOwn
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => Logs 'b' then 'a' assuming `_.forOwn` logs 'a' then 'b'.
     */
    function forOwnRight(object, iteratee) {
      return object && baseForOwnRight(object, getIteratee(iteratee, 3));
    }

    /**
     * Creates an array of function property names from own enumerable properties
     * of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functionsIn
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functions(new Foo);
     * // => ['a', 'b']
     */
    function functions(object) {
      return object == null ? [] : baseFunctions(object, keys(object));
    }

    /**
     * Creates an array of function property names from own and inherited
     * enumerable properties of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the function names.
     * @see _.functions
     * @example
     *
     * function Foo() {
     *   this.a = _.constant('a');
     *   this.b = _.constant('b');
     * }
     *
     * Foo.prototype.c = _.constant('c');
     *
     * _.functionsIn(new Foo);
     * // => ['a', 'b', 'c']
     */
    function functionsIn(object) {
      return object == null ? [] : baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property of `object`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': 2 } };
     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b');
     * // => true
     *
     * _.has(object, ['a', 'b']);
     * // => true
     *
     * _.has(other, 'a');
     * // => false
     */
    function has(object, path) {
      return object != null && hasPath(object, path, baseHas);
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite
     * property assignments of previous values.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Object
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     */
    var invert = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      result[value] = key;
    }, constant(identity));

    /**
     * This method is like `_.invert` except that the inverted object is generated
     * from the results of running each element of `object` thru `iteratee`. The
     * corresponding inverted value of each inverted key is an array of keys
     * responsible for generating the inverted value. The iteratee is invoked
     * with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.1.0
     * @category Object
     * @param {Object} object The object to invert.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invertBy(object);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     *
     * _.invertBy(object, function(value) {
     *   return 'group' + value;
     * });
     * // => { 'group1': ['a', 'c'], 'group2': ['b'] }
     */
    var invertBy = createInverter(function(result, value, key) {
      if (value != null &&
          typeof value.toString != 'function') {
        value = nativeObjectToString.call(value);
      }

      if (hasOwnProperty.call(result, value)) {
        result[value].push(key);
      } else {
        result[value] = [key];
      }
    }, getIteratee);

    /**
     * Invokes the method at `path` of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
     *
     * _.invoke(object, 'a[0].b.c.slice', 1, 3);
     * // => [2, 3]
     */
    var invoke = baseRest(baseInvoke);

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * string keyed property of `object` thru `iteratee`. The iteratee is invoked
     * with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 3.8.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapValues
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    function mapKeys(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, iteratee(value, key, object), value);
      });
      return result;
    }

    /**
     * Creates an object with the same keys as `object` and values generated
     * by running each own enumerable string keyed property of `object` thru
     * `iteratee`. The iteratee is invoked with three arguments:
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Object} Returns the new mapped object.
     * @see _.mapKeys
     * @example
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * _.mapValues(users, function(o) { return o.age; });
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     *
     * // The `_.property` iteratee shorthand.
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    function mapValues(object, iteratee) {
      var result = {};
      iteratee = getIteratee(iteratee, 3);

      baseForOwn(object, function(value, key, object) {
        baseAssignValue(result, key, iteratee(value, key, object));
      });
      return result;
    }

    /**
     * This method is like `_.assign` except that it recursively merges own and
     * inherited enumerable string keyed properties of source objects into the
     * destination object. Source properties that resolve to `undefined` are
     * skipped if a destination value exists. Array and plain object properties
     * are merged recursively. Other objects and value types are overridden by
     * assignment. Source objects are applied from left to right. Subsequent
     * sources overwrite property assignments of previous sources.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 0.5.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {
     *   'a': [{ 'b': 2 }, { 'd': 4 }]
     * };
     *
     * var other = {
     *   'a': [{ 'c': 3 }, { 'e': 5 }]
     * };
     *
     * _.merge(object, other);
     * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
     */
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });

    /**
     * This method is like `_.merge` except that it accepts `customizer` which
     * is invoked to produce the merged values of the destination and source
     * properties. If `customizer` returns `undefined`, merging is handled by the
     * method instead. The `customizer` is invoked with six arguments:
     * (objValue, srcValue, key, object, source, stack).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function customizer(objValue, srcValue) {
     *   if (_.isArray(objValue)) {
     *     return objValue.concat(srcValue);
     *   }
     * }
     *
     * var object = { 'a': [1], 'b': [2] };
     * var other = { 'a': [3], 'b': [4] };
     *
     * _.mergeWith(object, other, customizer);
     * // => { 'a': [1, 3], 'b': [2, 4] }
     */
    var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
      baseMerge(object, source, srcIndex, customizer);
    });

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable property paths of `object` that are not omitted.
     *
     * **Note:** This method is considerably slower than `_.pick`.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to omit.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omit(object, ['a', 'c']);
     * // => { 'b': '2' }
     */
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });

    /**
     * The opposite of `_.pickBy`; this method creates an object composed of
     * the own and inherited enumerable string keyed properties of `object` that
     * `predicate` doesn't return truthy for. The predicate is invoked with two
     * arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.omitBy(object, _.isNumber);
     * // => { 'b': '2' }
     */
    function omitBy(object, predicate) {
      return pickBy(object, negate(getIteratee(predicate)));
    }

    /**
     * Creates an object composed of the picked `object` properties.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {...(string|string[])} [paths] The property paths to pick.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pick(object, ['a', 'c']);
     * // => { 'a': 1, 'c': 3 }
     */
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });

    /**
     * Creates an object composed of the `object` properties `predicate` returns
     * truthy for. The predicate is invoked with two arguments: (value, key).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The source object.
     * @param {Function} [predicate=_.identity] The function invoked per property.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'a': 1, 'b': '2', 'c': 3 };
     *
     * _.pickBy(object, _.isNumber);
     * // => { 'a': 1, 'c': 3 }
     */
    function pickBy(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = getIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }

    /**
     * This method is like `_.get` except that if the resolved value is a
     * function it's invoked with the `this` binding of its parent object and
     * its result is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a[0].b.c3', 'default');
     * // => 'default'
     *
     * _.result(object, 'a[0].b.c3', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      path = castPath(path, object);

      var index = -1,
          length = path.length;

      // Ensure the loop is entered when path is empty.
      if (!length) {
        length = 1;
        object = undefined;
      }
      while (++index < length) {
        var value = object == null ? undefined : object[toKey(path[index])];
        if (value === undefined) {
          index = length;
          value = defaultValue;
        }
        object = isFunction(value) ? value.call(object) : value;
      }
      return object;
    }

    /**
     * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
     * it's created. Arrays are created for missing index properties while objects
     * are created for all other missing properties. Use `_.setWith` to customize
     * `path` creation.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, ['x', '0', 'y', 'z'], 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }

    /**
     * This method is like `_.set` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.setWith(object, '[0][1]', 'a', Object);
     * // => { '0': { '1': 'a' } }
     */
    function setWith(object, path, value, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseSet(object, path, value, customizer);
    }

    /**
     * Creates an array of own enumerable string keyed-value pairs for `object`
     * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
     * entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entries
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairs(new Foo);
     * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
     */
    var toPairs = createToPairs(keys);

    /**
     * Creates an array of own and inherited enumerable string keyed-value pairs
     * for `object` which can be consumed by `_.fromPairs`. If `object` is a map
     * or set, its entries are returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @alias entriesIn
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the key-value pairs.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.toPairsIn(new Foo);
     * // => [['a', 1], ['b', 2], ['c', 3]] (iteration order is not guaranteed)
     */
    var toPairsIn = createToPairs(keysIn);

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable string keyed properties thru `iteratee`, with each invocation
     * potentially mutating the `accumulator` object. If `accumulator` is not
     * provided, a new object with the same `[[Prototype]]` will be used. The
     * iteratee is invoked with four arguments: (accumulator, value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @since 1.3.0
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * }, []);
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
     *   (result[value] || (result[value] = [])).push(key);
     * }, {});
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function transform(object, iteratee, accumulator) {
      var isArr = isArray(object),
          isArrLike = isArr || isBuffer(object) || isTypedArray(object);

      iteratee = getIteratee(iteratee, 4);
      if (accumulator == null) {
        var Ctor = object && object.constructor;
        if (isArrLike) {
          accumulator = isArr ? new Ctor : [];
        }
        else if (isObject(object)) {
          accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
        }
        else {
          accumulator = {};
        }
      }
      (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Removes the property at `path` of `object`.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to unset.
     * @returns {boolean} Returns `true` if the property is deleted, else `false`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 7 } }] };
     * _.unset(object, 'a[0].b.c');
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     *
     * _.unset(object, ['a', '0', 'b', 'c']);
     * // => true
     *
     * console.log(object);
     * // => { 'a': [{ 'b': {} }] };
     */
    function unset(object, path) {
      return object == null ? true : baseUnset(object, path);
    }

    /**
     * This method is like `_.set` except that accepts `updater` to produce the
     * value to set. Use `_.updateWith` to customize `path` creation. The `updater`
     * is invoked with one argument: (value).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.update(object, 'a[0].b.c', function(n) { return n * n; });
     * console.log(object.a[0].b.c);
     * // => 9
     *
     * _.update(object, 'x[0].y.z', function(n) { return n ? n + 1 : 0; });
     * console.log(object.x[0].y.z);
     * // => 0
     */
    function update(object, path, updater) {
      return object == null ? object : baseUpdate(object, path, castFunction(updater));
    }

    /**
     * This method is like `_.update` except that it accepts `customizer` which is
     * invoked to produce the objects of `path`.  If `customizer` returns `undefined`
     * path creation is handled by the method instead. The `customizer` is invoked
     * with three arguments: (nsValue, key, nsObject).
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @since 4.6.0
     * @category Object
     * @param {Object} object The object to modify.
     * @param {Array|string} path The path of the property to set.
     * @param {Function} updater The function to produce the updated value.
     * @param {Function} [customizer] The function to customize assigned values.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = {};
     *
     * _.updateWith(object, '[0][1]', _.constant('a'), Object);
     * // => { '0': { '1': 'a' } }
     */
    function updateWith(object, path, updater, customizer) {
      customizer = typeof customizer == 'function' ? customizer : undefined;
      return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
    }

    /**
     * Creates an array of the own enumerable string keyed property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return object == null ? [] : baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable string keyed property
     * values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return object == null ? [] : baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    /**
     * Produces a random number between the inclusive `lower` and `upper` bounds.
     * If only one argument is provided a number between `0` and the given number
     * is returned. If `floating` is `true`, or either `lower` or `upper` are
     * floats, a floating-point number is returned instead of an integer.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @memberOf _
     * @since 0.7.0
     * @category Number
     * @param {number} [lower=0] The lower bound.
     * @param {number} [upper=1] The upper bound.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(lower, upper, floating) {
      if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
      }
      if (floating === undefined) {
        if (typeof upper == 'boolean') {
          floating = upper;
          upper = undefined;
        }
        else if (typeof lower == 'boolean') {
          floating = lower;
          lower = undefined;
        }
      }
      if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
      }
      else {
        lower = toFinite(lower);
        if (upper === undefined) {
          upper = lower;
          lower = 0;
        } else {
          upper = toFinite(upper);
        }
      }
      if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
      }
      if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
      }
      return baseRandom(lower, upper);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar--');
     * // => 'fooBar'
     *
     * _.camelCase('__FOO_BAR__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });

    /**
     * Converts the first character of `string` to upper case and the remaining
     * to lower case.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('FRED');
     * // => 'Fred'
     */
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }

    /**
     * Deburrs `string` by converting
     * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
     * letters to basic Latin letters and removing
     * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search up to.
     * @returns {boolean} Returns `true` if `string` ends with `target`,
     *  else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = toString(string);
      target = baseToString(target);

      var length = string.length;
      position = position === undefined
        ? length
        : baseClamp(toInteger(position), 0, length);

      var end = position;
      position -= target.length;
      return position >= 0 && string.slice(position, end) == target;
    }

    /**
     * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
     * corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional
     * characters use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value. See
     * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * When working with HTML you should always
     * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
     * XSS vectors.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      string = toString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
     * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https://lodash\.com/\)'
     */
    function escapeRegExp(string) {
      string = toString(string);
      return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : string;
    }

    /**
     * Converts `string` to
     * [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__FOO_BAR__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Converts `string`, as space separated words, to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.lowerCase('--Foo-Bar--');
     * // => 'foo bar'
     *
     * _.lowerCase('fooBar');
     * // => 'foo bar'
     *
     * _.lowerCase('__FOO_BAR__');
     * // => 'foo bar'
     */
    var lowerCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toLowerCase();
    });

    /**
     * Converts the first character of `string` to lower case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.lowerFirst('Fred');
     * // => 'fred'
     *
     * _.lowerFirst('FRED');
     * // => 'fRED'
     */
    var lowerFirst = createCaseFirst('toLowerCase');

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      if (!length || strLength >= length) {
        return string;
      }
      var mid = (length - strLength) / 2;
      return (
        createPadding(nativeFloor(mid), chars) +
        string +
        createPadding(nativeCeil(mid), chars)
      );
    }

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padEnd('abc', 6);
     * // => 'abc   '
     *
     * _.padEnd('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padEnd('abc', 3);
     * // => 'abc'
     */
    function padEnd(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (string + createPadding(length - strLength, chars))
        : string;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padStart('abc', 6);
     * // => '   abc'
     *
     * _.padStart('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padStart('abc', 3);
     * // => 'abc'
     */
    function padStart(string, length, chars) {
      string = toString(string);
      length = toInteger(length);

      var strLength = length ? stringSize(string) : 0;
      return (length && strLength < length)
        ? (createPadding(length - strLength, chars) + string)
        : string;
    }

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a
     * hexadecimal, in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the
     * [ES5 implementation](https://es5.github.io/#x15.1.2.2) of `parseInt`.
     *
     * @static
     * @memberOf _
     * @since 1.1.0
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix=10] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      if (guard || radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=1] The number of times to repeat the string.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n, guard) {
      if ((guard ? isIterateeCall(string, n, guard) : n === undefined)) {
        n = 1;
      } else {
        n = toInteger(n);
      }
      return baseRepeat(toString(string), n);
    }

    /**
     * Replaces matches for `pattern` in `string` with `replacement`.
     *
     * **Note:** This method is based on
     * [`String#replace`](https://mdn.io/String/replace).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to modify.
     * @param {RegExp|string} pattern The pattern to replace.
     * @param {Function|string} replacement The match replacement.
     * @returns {string} Returns the modified string.
     * @example
     *
     * _.replace('Hi Fred', 'Fred', 'Barney');
     * // => 'Hi Barney'
     */
    function replace() {
      var args = arguments,
          string = toString(args[0]);

      return args.length < 3 ? string : string.replace(args[1], args[2]);
    }

    /**
     * Converts `string` to
     * [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--FOO-BAR--');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Splits `string` by `separator`.
     *
     * **Note:** This method is based on
     * [`String#split`](https://mdn.io/String/split).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to split.
     * @param {RegExp|string} separator The separator pattern to split by.
     * @param {number} [limit] The length to truncate results to.
     * @returns {Array} Returns the string segments.
     * @example
     *
     * _.split('a-b-c', '-', 2);
     * // => ['a', 'b']
     */
    function split(string, separator, limit) {
      if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
        separator = limit = undefined;
      }
      limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
      if (!limit) {
        return [];
      }
      string = toString(string);
      if (string && (
            typeof separator == 'string' ||
            (separator != null && !isRegExp(separator))
          )) {
        separator = baseToString(separator);
        if (!separator && hasUnicode(string)) {
          return castSlice(stringToArray(string), 0, limit);
        }
      }
      return string.split(separator, limit);
    }

    /**
     * Converts `string` to
     * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @since 3.1.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar--');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__FOO_BAR__');
     * // => 'FOO BAR'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + upperFirst(word);
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`,
     *  else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = toString(string);
      position = position == null
        ? 0
        : baseClamp(toInteger(position), 0, string.length);

      target = baseToString(target);
      return string.slice(position, position + target.length) == target;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is given, it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options={}] The options object.
     * @param {RegExp} [options.escape=_.templateSettings.escape]
     *  The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
     *  The "evaluate" delimiter.
     * @param {Object} [options.imports=_.templateSettings.imports]
     *  An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
     *  The "interpolate" delimiter.
     * @param {string} [options.sourceURL='lodash.templateSources[n]']
     *  The sourceURL of the compiled template.
     * @param {string} [options.variable='obj']
     *  The data object variable name.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // Use the "interpolate" delimiter to create a compiled template.
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // Use the HTML "escape" delimiter to escape data property values.
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the internal `print` function in "evaluate" delimiters.
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // Use the ES template literal delimiter as an "interpolate" delimiter.
     * // Disable support by replacing the "interpolate" delimiter.
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // Use backslashes to treat delimiters as plain text.
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // Use the `imports` option to import `jQuery` as `jq`.
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // Use the `sourceURL` option to specify a custom sourceURL for the template.
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
     *
     * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // Use custom template delimiters.
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // Use the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and stack traces.
     * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, guard) {
      // Based on John Resig's `tmpl` implementation
      // (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      string = toString(string);
      options = assignInWith({}, options, settings, customDefaultsAssignIn);

      var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      // The sourceURL gets injected into the source that's eval-ed, so be careful
      // to normalize all kinds of whitespace, so e.g. newlines (and unicode versions of it) can't sneak in
      // and escape the comment, thus injecting code that gets evaled.
      var sourceURL = '//# sourceURL=' +
        (hasOwnProperty.call(options, 'sourceURL')
          ? (options.sourceURL + '').replace(/\s/g, ' ')
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products needs `match` returned in
        // order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = hasOwnProperty.call(options, 'variable') && options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Throw an error if a forbidden character was found in `variable`, to prevent
      // potential command injection attacks.
      else if (reForbiddenIdentifierChars.test(variable)) {
        throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
      }

      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source)
          .apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Converts `string`, as a whole, to lower case just like
     * [String#toLowerCase](https://mdn.io/toLowerCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the lower cased string.
     * @example
     *
     * _.toLower('--Foo-Bar--');
     * // => '--foo-bar--'
     *
     * _.toLower('fooBar');
     * // => 'foobar'
     *
     * _.toLower('__FOO_BAR__');
     * // => '__foo_bar__'
     */
    function toLower(value) {
      return toString(value).toLowerCase();
    }

    /**
     * Converts `string`, as a whole, to upper case just like
     * [String#toUpperCase](https://mdn.io/toUpperCase).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.toUpper('--foo-bar--');
     * // => '--FOO-BAR--'
     *
     * _.toUpper('fooBar');
     * // => 'FOOBAR'
     *
     * _.toUpper('__foo_bar__');
     * // => '__FOO_BAR__'
     */
    function toUpper(value) {
      return toString(value).toUpperCase();
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return baseTrim(string);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          chrSymbols = stringToArray(chars),
          start = charsStartIndex(strSymbols, chrSymbols),
          end = charsEndIndex(strSymbols, chrSymbols) + 1;

      return castSlice(strSymbols, start, end).join('');
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimEnd('  abc  ');
     * // => '  abc'
     *
     * _.trimEnd('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimEnd(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.slice(0, trimmedEndIndex(string) + 1);
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;

      return castSlice(strSymbols, 0, end).join('');
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimStart('  abc  ');
     * // => 'abc  '
     *
     * _.trimStart('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimStart(string, chars, guard) {
      string = toString(string);
      if (string && (guard || chars === undefined)) {
        return string.replace(reTrimStart, '');
      }
      if (!string || !(chars = baseToString(chars))) {
        return string;
      }
      var strSymbols = stringToArray(string),
          start = charsStartIndex(strSymbols, stringToArray(chars));

      return castSlice(strSymbols, start).join('');
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object} [options={}] The options object.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.truncate('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.truncate('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function truncate(string, options) {
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (isObject(options)) {
        var separator = 'separator' in options ? options.separator : separator;
        length = 'length' in options ? toInteger(options.length) : length;
        omission = 'omission' in options ? baseToString(options.omission) : omission;
      }
      string = toString(string);

      var strLength = string.length;
      if (hasUnicode(string)) {
        var strSymbols = stringToArray(string);
        strLength = strSymbols.length;
      }
      if (length >= strLength) {
        return string;
      }
      var end = length - stringSize(omission);
      if (end < 1) {
        return omission;
      }
      var result = strSymbols
        ? castSlice(strSymbols, 0, end).join('')
        : string.slice(0, end);

      if (separator === undefined) {
        return result + omission;
      }
      if (strSymbols) {
        end += (result.length - end);
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              substring = result;

          if (!separator.global) {
            separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            var newEnd = match.index;
          }
          result = result.slice(0, newEnd === undefined ? end : newEnd);
        }
      } else if (string.indexOf(baseToString(separator), end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
     * their corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional
     * HTML entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @since 0.6.0
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = toString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Converts `string`, as space separated words, to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the upper cased string.
     * @example
     *
     * _.upperCase('--foo-bar');
     * // => 'FOO BAR'
     *
     * _.upperCase('fooBar');
     * // => 'FOO BAR'
     *
     * _.upperCase('__foo_bar__');
     * // => 'FOO BAR'
     */
    var upperCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + word.toUpperCase();
    });

    /**
     * Converts the first character of `string` to upper case.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.upperFirst('fred');
     * // => 'Fred'
     *
     * _.upperFirst('FRED');
     * // => 'FRED'
     */
    var upperFirst = createCaseFirst('toUpperCase');

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? undefined : pattern;

      if (pattern === undefined) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it's invoked.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Function} func The function to attempt.
     * @param {...*} [args] The arguments to invoke `func` with.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // Avoid throwing errors for invalid selectors.
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = baseRest(function(func, args) {
      try {
        return apply(func, undefined, args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method.
     *
     * **Note:** This method doesn't set the "length" property of bound functions.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} methodNames The object method names to bind.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'click': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view, ['click']);
     * jQuery(element).on('click', view.click);
     * // => Logs 'clicked docs' when clicked.
     */
    var bindAll = flatRest(function(object, methodNames) {
      arrayEach(methodNames, function(key) {
        key = toKey(key);
        baseAssignValue(object, key, bind(object[key], object));
      });
      return object;
    });

    /**
     * Creates a function that iterates over `pairs` and invokes the corresponding
     * function of the first predicate to return truthy. The predicate-function
     * pairs are invoked with the `this` binding and arguments of the created
     * function.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Array} pairs The predicate-function pairs.
     * @returns {Function} Returns the new composite function.
     * @example
     *
     * var func = _.cond([
     *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
     *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
     *   [_.stubTrue,                      _.constant('no match')]
     * ]);
     *
     * func({ 'a': 1, 'b': 2 });
     * // => 'matches A'
     *
     * func({ 'a': 0, 'b': 1 });
     * // => 'matches B'
     *
     * func({ 'a': '1', 'b': '2' });
     * // => 'no match'
     */
    function cond(pairs) {
      var length = pairs == null ? 0 : pairs.length,
          toIteratee = getIteratee();

      pairs = !length ? [] : arrayMap(pairs, function(pair) {
        if (typeof pair[1] != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        return [toIteratee(pair[0]), pair[1]];
      });

      return baseRest(function(args) {
        var index = -1;
        while (++index < length) {
          var pair = pairs[index];
          if (apply(pair[0], this, args)) {
            return apply(pair[1], this, args);
          }
        }
      });
    }

    /**
     * Creates a function that invokes the predicate properties of `source` with
     * the corresponding property values of a given object, returning `true` if
     * all predicates return truthy, else `false`.
     *
     * **Note:** The created function is equivalent to `_.conformsTo` with
     * `source` partially applied.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {Object} source The object of property predicates to conform to.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 2, 'b': 1 },
     *   { 'a': 1, 'b': 2 }
     * ];
     *
     * _.filter(objects, _.conforms({ 'b': function(n) { return n > 1; } }));
     * // => [{ 'a': 1, 'b': 2 }]
     */
    function conforms(source) {
      return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Checks `value` to determine whether a default value should be returned in
     * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
     * or `undefined`.
     *
     * @static
     * @memberOf _
     * @since 4.14.0
     * @category Util
     * @param {*} value The value to check.
     * @param {*} defaultValue The default value.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * _.defaultTo(1, 10);
     * // => 1
     *
     * _.defaultTo(undefined, 10);
     * // => 10
     */
    function defaultTo(value, defaultValue) {
      return (value == null || value !== value) ? defaultValue : value;
    }

    /**
     * Creates a function that returns the result of invoking the given functions
     * with the `this` binding of the created function, where each successive
     * invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flowRight
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow([_.add, square]);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the given functions from right to left.
     *
     * @static
     * @since 3.0.0
     * @memberOf _
     * @category Util
     * @param {...(Function|Function[])} [funcs] The functions to invoke.
     * @returns {Function} Returns the new composite function.
     * @see _.flow
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight([square, _.add]);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that invokes `func` with the arguments of the created
     * function. If `func` is a property name, the created function returns the
     * property value for a given element. If `func` is an array or object, the
     * created function returns `true` for elements that contain the equivalent
     * source properties, otherwise it returns `false`.
     *
     * @static
     * @since 4.0.0
     * @memberOf _
     * @category Util
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // The `_.matches` iteratee shorthand.
     * _.filter(users, _.iteratee({ 'user': 'barney', 'active': true }));
     * // => [{ 'user': 'barney', 'age': 36, 'active': true }]
     *
     * // The `_.matchesProperty` iteratee shorthand.
     * _.filter(users, _.iteratee(['user', 'fred']));
     * // => [{ 'user': 'fred', 'age': 40 }]
     *
     * // The `_.property` iteratee shorthand.
     * _.map(users, _.iteratee('user'));
     * // => ['barney', 'fred']
     *
     * // Create custom iteratee shorthands.
     * _.iteratee = _.wrap(_.iteratee, function(iteratee, func) {
     *   return !_.isRegExp(func) ? iteratee(func) : function(string) {
     *     return func.test(string);
     *   };
     * });
     *
     * _.filter(['abc', 'def'], /ef/);
     * // => ['def']
     */
    function iteratee(func) {
      return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between a given
     * object and `source`, returning `true` if the given object has equivalent
     * property values, else `false`.
     *
     * **Note:** The created function is equivalent to `_.isMatch` with `source`
     * partially applied.
     *
     * Partial comparisons will match empty array and empty object `source`
     * values against any array or object value, respectively. See `_.isEqual`
     * for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.filter(objects, _.matches({ 'a': 4, 'c': 6 }));
     * // => [{ 'a': 4, 'b': 5, 'c': 6 }]
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matches({ 'a': 1 }), _.matches({ 'a': 4 })]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that performs a partial deep comparison between the
     * value at `path` of a given object to `srcValue`, returning `true` if the
     * object value is equivalent, else `false`.
     *
     * **Note:** Partial comparisons will match empty array and empty object
     * `srcValue` values against any array or object value, respectively. See
     * `_.isEqual` for a list of supported value comparisons.
     *
     * **Note:** Multiple values can be checked by combining several matchers
     * using `_.overSome`
     *
     * @static
     * @memberOf _
     * @since 3.2.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     * @example
     *
     * var objects = [
     *   { 'a': 1, 'b': 2, 'c': 3 },
     *   { 'a': 4, 'b': 5, 'c': 6 }
     * ];
     *
     * _.find(objects, _.matchesProperty('a', 4));
     * // => { 'a': 4, 'b': 5, 'c': 6 }
     *
     * // Checking for several possible values
     * _.filter(objects, _.overSome([_.matchesProperty('a', 1), _.matchesProperty('a', 4)]));
     * // => [{ 'a': 1, 'b': 2, 'c': 3 }, { 'a': 4, 'b': 5, 'c': 6 }]
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
    }

    /**
     * Creates a function that invokes the method at `path` of a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': _.constant(2) } },
     *   { 'a': { 'b': _.constant(1) } }
     * ];
     *
     * _.map(objects, _.method('a.b'));
     * // => [2, 1]
     *
     * _.map(objects, _.method(['a', 'b']));
     * // => [2, 1]
     */
    var method = baseRest(function(path, args) {
      return function(object) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path of `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Util
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new invoker function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = baseRest(function(object, args) {
      return function(path) {
        return baseInvoke(object, path, args);
      };
    });

    /**
     * Adds all own enumerable string keyed function properties of a source
     * object to the destination object. If `object` is a function, then methods
     * are added to its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.chain=true] Specify whether mixins are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      var props = keys(source),
          methodNames = baseFunctions(source, props);

      if (options == null &&
          !(isObject(source) && (methodNames.length || !props.length))) {
        options = source;
        source = object;
        object = this;
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
          isFunc = isFunction(object);

      arrayEach(methodNames, function(methodName) {
        var func = source[methodName];
        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = function() {
            var chainAll = this.__chain__;
            if (chain || chainAll) {
              var result = object(this.__wrapped__),
                  actions = result.__actions__ = copyArray(this.__actions__);

              actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
              result.__chain__ = chainAll;
              return result;
            }
            return func.apply(object, arrayPush([this.value()], arguments));
          };
        }
      });

      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      if (root._ === this) {
        root._ = oldDash;
      }
      return this;
    }

    /**
     * This method returns `undefined`.
     *
     * @static
     * @memberOf _
     * @since 2.3.0
     * @category Util
     * @example
     *
     * _.times(2, _.noop);
     * // => [undefined, undefined]
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that gets the argument at index `n`. If `n` is negative,
     * the nth argument from the end is returned.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [n=0] The index of the argument to return.
     * @returns {Function} Returns the new pass-thru function.
     * @example
     *
     * var func = _.nthArg(1);
     * func('a', 'b', 'c', 'd');
     * // => 'b'
     *
     * var func = _.nthArg(-2);
     * func('a', 'b', 'c', 'd');
     * // => 'c'
     */
    function nthArg(n) {
      n = toInteger(n);
      return baseRest(function(args) {
        return baseNth(args, n);
      });
    }

    /**
     * Creates a function that invokes `iteratees` with the arguments it receives
     * and returns their results.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [iteratees=[_.identity]]
     *  The iteratees to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.over([Math.max, Math.min]);
     *
     * func(1, 2, 3, 4);
     * // => [4, 1]
     */
    var over = createOver(arrayMap);

    /**
     * Creates a function that checks if **all** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overEvery([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => false
     *
     * func(NaN);
     * // => false
     */
    var overEvery = createOver(arrayEvery);

    /**
     * Creates a function that checks if **any** of the `predicates` return
     * truthy when invoked with the arguments it receives.
     *
     * Following shorthands are possible for providing predicates.
     * Pass an `Object` and it will be used as an parameter for `_.matches` to create the predicate.
     * Pass an `Array` of parameters for `_.matchesProperty` and the predicate will be created using them.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {...(Function|Function[])} [predicates=[_.identity]]
     *  The predicates to check.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var func = _.overSome([Boolean, isFinite]);
     *
     * func('1');
     * // => true
     *
     * func(null);
     * // => true
     *
     * func(NaN);
     * // => false
     *
     * var matchesFunc = _.overSome([{ 'a': 1 }, { 'a': 2 }])
     * var matchesPropertyFunc = _.overSome([['a', 1], ['a', 2]])
     */
    var overSome = createOver(arraySome);

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the value at a given path of `object`.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Util
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return object == null ? undefined : baseGet(object, path);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    /**
     * This method is like `_.range` except that it populates values in
     * descending order.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.range
     * @example
     *
     * _.rangeRight(4);
     * // => [3, 2, 1, 0]
     *
     * _.rangeRight(-4);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 5);
     * // => [4, 3, 2, 1]
     *
     * _.rangeRight(0, 20, 5);
     * // => [15, 10, 5, 0]
     *
     * _.rangeRight(0, -4, -1);
     * // => [-3, -2, -1, 0]
     *
     * _.rangeRight(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.rangeRight(0);
     * // => []
     */
    var rangeRight = createRange(true);

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /**
     * This method returns a new empty object.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Object} Returns the new empty object.
     * @example
     *
     * var objects = _.times(2, _.stubObject);
     *
     * console.log(objects);
     * // => [{}, {}]
     *
     * console.log(objects[0] === objects[1]);
     * // => false
     */
    function stubObject() {
      return {};
    }

    /**
     * This method returns an empty string.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {string} Returns the empty string.
     * @example
     *
     * _.times(2, _.stubString);
     * // => ['', '']
     */
    function stubString() {
      return '';
    }

    /**
     * This method returns `true`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `true`.
     * @example
     *
     * _.times(2, _.stubTrue);
     * // => [true, true]
     */
    function stubTrue() {
      return true;
    }

    /**
     * Invokes the iteratee `n` times, returning an array of the results of
     * each invocation. The iteratee is invoked with one argument; (index).
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.times(3, String);
     * // => ['0', '1', '2']
     *
     *  _.times(4, _.constant(0));
     * // => [0, 0, 0, 0]
     */
    function times(n, iteratee) {
      n = toInteger(n);
      if (n < 1 || n > MAX_SAFE_INTEGER) {
        return [];
      }
      var index = MAX_ARRAY_LENGTH,
          length = nativeMin(n, MAX_ARRAY_LENGTH);

      iteratee = getIteratee(iteratee);
      n -= MAX_ARRAY_LENGTH;

      var result = baseTimes(length, iteratee);
      while (++index < n) {
        iteratee(index);
      }
      return result;
    }

    /**
     * Converts `value` to a property path array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Util
     * @param {*} value The value to convert.
     * @returns {Array} Returns the new property path array.
     * @example
     *
     * _.toPath('a.b.c');
     * // => ['a', 'b', 'c']
     *
     * _.toPath('a[0].b.c');
     * // => ['a', '0', 'b', 'c']
     */
    function toPath(value) {
      if (isArray(value)) {
        return arrayMap(value, toKey);
      }
      return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
    }

    /**
     * Generates a unique ID. If `prefix` is given, the ID is appended to it.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {string} [prefix=''] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return toString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {number} augend The first number in an addition.
     * @param {number} addend The second number in an addition.
     * @returns {number} Returns the total.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    var add = createMathOperation(function(augend, addend) {
      return augend + addend;
    }, 0);

    /**
     * Computes `number` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Divide two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} dividend The first number in a division.
     * @param {number} divisor The second number in a division.
     * @returns {number} Returns the quotient.
     * @example
     *
     * _.divide(6, 4);
     * // => 1.5
     */
    var divide = createMathOperation(function(dividend, divisor) {
      return dividend / divisor;
    }, 1);

    /**
     * Computes `number` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Computes the maximum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => undefined
     */
    function max(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseGt)
        : undefined;
    }

    /**
     * This method is like `_.max` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.maxBy(objects, function(o) { return o.n; });
     * // => { 'n': 2 }
     *
     * // The `_.property` iteratee shorthand.
     * _.maxBy(objects, 'n');
     * // => { 'n': 2 }
     */
    function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseGt)
        : undefined;
    }

    /**
     * Computes the mean of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the mean.
     * @example
     *
     * _.mean([4, 2, 8, 6]);
     * // => 5
     */
    function mean(array) {
      return baseMean(array, identity);
    }

    /**
     * This method is like `_.mean` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be averaged.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the mean.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.meanBy(objects, function(o) { return o.n; });
     * // => 5
     *
     * // The `_.property` iteratee shorthand.
     * _.meanBy(objects, 'n');
     * // => 5
     */
    function meanBy(array, iteratee) {
      return baseMean(array, getIteratee(iteratee, 2));
    }

    /**
     * Computes the minimum value of `array`. If `array` is empty or falsey,
     * `undefined` is returned.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => undefined
     */
    function min(array) {
      return (array && array.length)
        ? baseExtremum(array, identity, baseLt)
        : undefined;
    }

    /**
     * This method is like `_.min` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the criterion by which
     * the value is ranked. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * var objects = [{ 'n': 1 }, { 'n': 2 }];
     *
     * _.minBy(objects, function(o) { return o.n; });
     * // => { 'n': 1 }
     *
     * // The `_.property` iteratee shorthand.
     * _.minBy(objects, 'n');
     * // => { 'n': 1 }
     */
    function minBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee, 2), baseLt)
        : undefined;
    }

    /**
     * Multiply two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.7.0
     * @category Math
     * @param {number} multiplier The first number in a multiplication.
     * @param {number} multiplicand The second number in a multiplication.
     * @returns {number} Returns the product.
     * @example
     *
     * _.multiply(6, 4);
     * // => 24
     */
    var multiply = createMathOperation(function(multiplier, multiplicand) {
      return multiplier * multiplicand;
    }, 1);

    /**
     * Computes `number` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @since 3.10.0
     * @category Math
     * @param {number} number The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Subtract two numbers.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {number} minuend The first number in a subtraction.
     * @param {number} subtrahend The second number in a subtraction.
     * @returns {number} Returns the difference.
     * @example
     *
     * _.subtract(6, 4);
     * // => 2
     */
    var subtract = createMathOperation(function(minuend, subtrahend) {
      return minuend - subtrahend;
    }, 0);

    /**
     * Computes the sum of the values in `array`.
     *
     * @static
     * @memberOf _
     * @since 3.4.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 2, 8, 6]);
     * // => 20
     */
    function sum(array) {
      return (array && array.length)
        ? baseSum(array, identity)
        : 0;
    }

    /**
     * This method is like `_.sum` except that it accepts `iteratee` which is
     * invoked for each element in `array` to generate the value to be summed.
     * The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Math
     * @param {Array} array The array to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {number} Returns the sum.
     * @example
     *
     * var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];
     *
     * _.sumBy(objects, function(o) { return o.n; });
     * // => 20
     *
     * // The `_.property` iteratee shorthand.
     * _.sumBy(objects, 'n');
     * // => 20
     */
    function sumBy(array, iteratee) {
      return (array && array.length)
        ? baseSum(array, getIteratee(iteratee, 2))
        : 0;
    }

    /*------------------------------------------------------------------------*/

    // Add methods that return wrapped values in chain sequences.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.assignIn = assignIn;
    lodash.assignInWith = assignInWith;
    lodash.assignWith = assignWith;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.castArray = castArray;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.concat = concat;
    lodash.cond = cond;
    lodash.conforms = conforms;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.differenceBy = differenceBy;
    lodash.differenceWith = differenceWith;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatMap = flatMap;
    lodash.flatMapDeep = flatMapDeep;
    lodash.flatMapDepth = flatMapDepth;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flattenDepth = flattenDepth;
    lodash.flip = flip;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.fromPairs = fromPairs;
    lodash.functions = functions;
    lodash.functionsIn = functionsIn;
    lodash.groupBy = groupBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.intersectionBy = intersectionBy;
    lodash.intersectionWith = intersectionWith;
    lodash.invert = invert;
    lodash.invertBy = invertBy;
    lodash.invokeMap = invokeMap;
    lodash.iteratee = iteratee;
    lodash.keyBy = keyBy;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.mergeWith = mergeWith;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.negate = negate;
    lodash.nthArg = nthArg;
    lodash.omit = omit;
    lodash.omitBy = omitBy;
    lodash.once = once;
    lodash.orderBy = orderBy;
    lodash.over = over;
    lodash.overArgs = overArgs;
    lodash.overEvery = overEvery;
    lodash.overSome = overSome;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pickBy = pickBy;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAll = pullAll;
    lodash.pullAllBy = pullAllBy;
    lodash.pullAllWith = pullAllWith;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rangeRight = rangeRight;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.reverse = reverse;
    lodash.sampleSize = sampleSize;
    lodash.set = set;
    lodash.setWith = setWith;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortedUniq = sortedUniq;
    lodash.sortedUniqBy = sortedUniqBy;
    lodash.split = split;
    lodash.spread = spread;
    lodash.tail = tail;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.toArray = toArray;
    lodash.toPairs = toPairs;
    lodash.toPairsIn = toPairsIn;
    lodash.toPath = toPath;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.unary = unary;
    lodash.union = union;
    lodash.unionBy = unionBy;
    lodash.unionWith = unionWith;
    lodash.uniq = uniq;
    lodash.uniqBy = uniqBy;
    lodash.uniqWith = uniqWith;
    lodash.unset = unset;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.update = update;
    lodash.updateWith = updateWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.without = without;
    lodash.words = words;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.xorBy = xorBy;
    lodash.xorWith = xorWith;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipObjectDeep = zipObjectDeep;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.entries = toPairs;
    lodash.entriesIn = toPairsIn;
    lodash.extend = assignIn;
    lodash.extendWith = assignInWith;

    // Add methods to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add methods that return unwrapped values in chain sequences.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clamp = clamp;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.cloneDeepWith = cloneDeepWith;
    lodash.cloneWith = cloneWith;
    lodash.conformsTo = conformsTo;
    lodash.deburr = deburr;
    lodash.defaultTo = defaultTo;
    lodash.divide = divide;
    lodash.endsWith = endsWith;
    lodash.eq = eq;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.floor = floor;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.hasIn = hasIn;
    lodash.head = head;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.invoke = invoke;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isArrayBuffer = isArrayBuffer;
    lodash.isArrayLike = isArrayLike;
    lodash.isArrayLikeObject = isArrayLikeObject;
    lodash.isBoolean = isBoolean;
    lodash.isBuffer = isBuffer;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isEqualWith = isEqualWith;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
    lodash.join = join;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lowerCase = lowerCase;
    lodash.lowerFirst = lowerFirst;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.maxBy = maxBy;
    lodash.mean = mean;
    lodash.meanBy = meanBy;
    lodash.min = min;
    lodash.minBy = minBy;
    lodash.stubArray = stubArray;
    lodash.stubFalse = stubFalse;
    lodash.stubObject = stubObject;
    lodash.stubString = stubString;
    lodash.stubTrue = stubTrue;
    lodash.multiply = multiply;
    lodash.nth = nth;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padEnd = padEnd;
    lodash.padStart = padStart;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.replace = replace;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.sample = sample;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedIndexBy = sortedIndexBy;
    lodash.sortedIndexOf = sortedIndexOf;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.sortedLastIndexBy = sortedLastIndexBy;
    lodash.sortedLastIndexOf = sortedLastIndexOf;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.subtract = subtract;
    lodash.sum = sum;
    lodash.sumBy = sumBy;
    lodash.template = template;
    lodash.times = times;
    lodash.toFinite = toFinite;
    lodash.toInteger = toInteger;
    lodash.toLength = toLength;
    lodash.toLower = toLower;
    lodash.toNumber = toNumber;
    lodash.toSafeInteger = toSafeInteger;
    lodash.toString = toString;
    lodash.toUpper = toUpper;
    lodash.trim = trim;
    lodash.trimEnd = trimEnd;
    lodash.trimStart = trimStart;
    lodash.truncate = truncate;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.upperCase = upperCase;
    lodash.upperFirst = upperFirst;

    // Add aliases.
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.first = head;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!hasOwnProperty.call(lodash.prototype, methodName)) {
          source[methodName] = func;
        }
      });
      return source;
    }()), { 'chain': false });

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type {string}
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        n = n === undefined ? 1 : nativeMax(toInteger(n), 0);

        var result = (this.__filtered__ && !index)
          ? new LazyWrapper(this)
          : this.clone();

        if (result.__filtered__) {
          result.__takeCount__ = nativeMin(n, result.__takeCount__);
        } else {
          result.__views__.push({
            'size': nativeMin(n, MAX_ARRAY_LENGTH),
            'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
          });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee) {
        var result = this.clone();
        result.__iteratees__.push({
          'iteratee': getIteratee(iteratee, 3),
          'type': type
        });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.head` and `_.last`.
    arrayEach(['head', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.tail`.
    arrayEach(['initial', 'tail'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.find = function(predicate) {
      return this.filter(predicate).head();
    };

    LazyWrapper.prototype.findLast = function(predicate) {
      return this.reverse().find(predicate);
    };

    LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
      if (typeof path == 'function') {
        return new LazyWrapper(this);
      }
      return this.map(function(value) {
        return baseInvoke(value, path, args);
      });
    });

    LazyWrapper.prototype.reject = function(predicate) {
      return this.filter(negate(getIteratee(predicate)));
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = toInteger(start);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = toInteger(end);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate) {
      return this.reverse().takeWhile(predicate).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(MAX_ARRAY_LENGTH);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
          isTaker = /^(?:head|last)$/.test(methodName),
          lodashFunc = lodash[isTaker ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName],
          retUnwrapped = isTaker || /^find/.test(methodName);

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var value = this.__wrapped__,
            args = isTaker ? [1] : arguments,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        var interceptor = function(value) {
          var result = lodashFunc.apply(lodash, arrayPush([value], args));
          return (isTaker && chainAll) ? result[0] : result;
        };

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var chainAll = this.__chain__,
            isHybrid = !!this.__actions__.length,
            isUnwrapped = retUnwrapped && !chainAll,
            onlyLazy = isLazy && !isHybrid;

        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
          return new LodashWrapper(result, chainAll);
        }
        if (isUnwrapped && onlyLazy) {
          return func.apply(this, args);
        }
        result = this.thru(interceptor);
        return isUnwrapped ? (isTaker ? result.value()[0] : result.value()) : result;
      };
    });

    // Add `Array` methods to `lodash.prototype`.
    arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
      var func = arrayProto[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:pop|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          var value = this.value();
          return func.apply(isArray(value) ? value : [], args);
        }
        return this[chainName](function(value) {
          return func.apply(isArray(value) ? value : [], args);
        });
      };
    });

    // Map minified method names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name + '';
        if (!hasOwnProperty.call(realNames, key)) {
          realNames[key] = [];
        }
        realNames[key].push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybrid(undefined, WRAP_BIND_KEY_FLAG).name] = [{
      'name': 'wrapper',
      'func': undefined
    }];

    // Add methods to `LazyWrapper`.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chain sequence methods to the `lodash` wrapper.
    lodash.prototype.at = wrapperAt;
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.next = wrapperNext;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add lazy aliases.
    lodash.prototype.first = lodash.prototype.head;

    if (symIterator) {
      lodash.prototype[symIterator] = wrapperToIterator;
    }
    return lodash;
  });

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (true) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else {}
}.call(this));


/***/ }),

/***/ "./resources/css/app.css":
/*!*******************************!*\
  !*** ./resources/css/app.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/tailwindcss/tailwind.css":
/*!***********************************************!*\
  !*** ./node_modules/tailwindcss/tailwind.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_tailwind_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!../postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./tailwind.css */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[6].oneOf[1].use[2]!./node_modules/tailwindcss/tailwind.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_tailwind_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_1_postcss_loader_dist_cjs_js_ruleSet_1_rules_6_oneOf_1_use_2_tailwind_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	// It's empty as some runtime module handles the default behavior
/******/ 	__webpack_require__.x = x => {};
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./resources/js/app.js"],
/******/ 			["./resources/css/app.css"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = x => {};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 		
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = x => {};
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		var startup = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = startup || (x => {});
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;