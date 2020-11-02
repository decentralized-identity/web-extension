
        let pageScript = document.createElement('script');
        pageScript.async = false;
        pageScript.textContent = '(' + (function(){ (function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("webextension-polyfill", ["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.browser = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.6.0 - Mon Dec 23 2019 12:32:53 */

  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */

  /* vim: set sts=2 sw=2 et tw=80: */

  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
    const SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)"; // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.

    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }
      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */


      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }

      }
      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */


      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };
      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.rejection
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {integer} metadata.maxResolvedArgs
       *        The maximum number of arguments which may be passed to the
       *        callback created by the wrapped async function.
       *
       * @returns {function}
       *        The generated callback function.
       */


      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(extensionAPIs.runtime.lastError);
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxResolvedArgs
       *        The maximum number of arguments which may be passed to the
       *        callback created by the wrapped async function.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */


      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args); // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.

                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };
      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */


      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }

        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */

      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.
              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,

                get() {
                  return target[prop];
                },

                set(value) {
                  target[prop] = value;
                }

              });
              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }

            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }

        }; // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.

        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };
      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */


      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }

      }); // Keep track if the deprecation warning has been logged at least once.


      let loggedSendResponseDeprecationWarning = false;
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */


        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              if (!loggedSendResponseDeprecationWarning) {
                console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error().stack);
                loggedSendResponseDeprecationWarning = true;
              }

              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;

          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result); // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.

          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          } // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).


          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;

              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          }; // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.


          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          } // Let Chrome know that the listener is replying.


          return true;
        };
      });

      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(extensionAPIs.runtime.lastError);
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map;
(function(){

let env = (() => {
  var extension = globalThis.browser && globalThis.browser.extension;
  if (extension && extension.getBackgroundPage) {
    return extension.getBackgroundPage() === globalThis ? 'background' : 'frame';
  }
  else return !extension || !extension.onMessage ? 'page' : 'content';
})();

let origin = env !== 'page' && browser.runtime.getURL('').replace(/\/+$/, '')

function uuid() {
  return crypto.getRandomValues(new Uint8Array(16)).join('');
}

var EXT = globalThis.EXT = {
  _messageHandlers: {},
  _messageRequests: {},
  _framePorts: {},
  _frame: uuid(),
  ports: {},
  environment: env,
  addMessageHandlers(handlers){
    Object.assign(EXT._messageHandlers, handlers);
  },
  removeMessageHandlers(){
    for (let handler of arguments) delete EXT._messageHandlers[handler];
  },
  messageBackground(message){
    connectBackground();
    EXT.backgroundPort.postMessage(message);
  },
  sendMessage(config = {}, port = null){
    /*
        message = {
          id: uuid(),
          frame: FRAME_NAME,
          type: 'prompt',
          to: 'background'
          props: {...},
          callback: function(){}
        }
    */
    let message = Object.assign({
      id: uuid(),
      origin: env
    }, config, { from: env });

    if (message.callback || message.error) {
      EXT._messageRequests[message.id] = {
        callback: message.callback,
        error: message.error
      }
      delete message.callback;
      delete message.error;
    }
    if (env === 'page') {
      postMessage(JSON.stringify(message), '*');
    }
    else if (env === 'frame'){
      message.frame = globalThis.name;
      if (message.to === 'page' || message.to === 'content') {
        browser.tabs.getCurrent().then(tab => {
          let port = browser.tabs.connect(tab.id);
          port.onMessage.addListener(message => handleMessage(message))
          port.postMessage(message);
        });
      }
      else if (message.to === 'background') EXT.messageBackground(message);
      // else throw `This context has no associated ${message.to} environment to message`;   
    }
    else if (env === 'content') {
      
      message.source = JSON.parse(JSON.stringify(location));
      if (message.to === 'page') {
        message.untrusted = false;
        postMessage(JSON.stringify(message), '*');
      }
      else if (message.to === 'background') EXT.messageBackground(message);
      else if (message.to === 'frame' && message.frame) {
        let port = EXT._framePorts[message.frame];
        if (!port) port = EXT._framePorts[message.frame] = [];
        Array.isArray(port) ? port.push(message) : port.postMessage(message);
      }
    }
    else if (env === 'background') {
      if (port) port.postMessage(message);
      else {
        for (let id in EXT.ports) {
          EXT.ports[id].postMessage(message);
        }
      }
    }
    else EXT.messageBackground(message);
  },
  request (options = {}){
    return new Promise((resolve, reject) => {
      EXT.sendMessage(Object.assign(options, {
        callback (){
          resolve(...arguments);
        },
        error (){
          reject(...arguments);
        }
      }));
    });
  }
};



EXT.self = new Promise(resolve => {
  if (env === 'page') return resolve(null);
  EXT.sendMessage({
    type: 'get_self',
    to: 'background',
    callback: tab => resolve(tab)
  });
});

function connectBackground(){
  if (!EXT.backgroundPort) {  
    EXT.backgroundPort = browser.runtime.connect();
    EXT.sendMessage({ type: 'connect-content-port', to: 'background' });
  }
}

async function handleMessage(message, port){
  if (message.origin !== env) { // Not a callback
    if (message.to === env) { // The message is intended for this environment
      let handler = EXT._messageHandlers[message.type];
      if (handler) {
        try {
          if (message.untrusted && !handler.untrusted) throw 'Access Denied: message from disallowed context';
          if (handler.action) {
            message.response = await handler.action(message, port || null);
          }
        }
        catch (e) { message._error = e }
      }
      message.to = message.origin;
      EXT.sendMessage(message, port || null);
    }
  }
  else { // Is a callback
    let request = EXT._messageRequests[message.id];
    if (request && message.origin === env) { // The callback is for this environment
      if (message._error) {
        if (request.error) request.error(message._error)
      }
      else if (request.callback) request.callback(message.response);
      delete EXT._messageRequests[message.id];
    }
  }
}

function parseJSON(z) {
  try { var json = JSON.parse(z || null) } catch(e) {}
  return json;
}

switch (env) {
  case 'page':

      globalThis.addEventListener('message', function(e) {
        let message = parseJSON(e.data);
        if (message && e.source === globalThis){
          if (message.from !== 'page') handleMessage(message);
        }
      });

      break;

  case 'frame':
  case 'content':

      connectBackground();
      
      EXT.backgroundPort.onMessage.addListener((message, port) => handleMessage(message, port));

      browser.runtime.onConnect.addListener(port => {
        port.onMessage.addListener((message, port) => handleMessage(message, port));
      })

  case 'content':

      globalThis.addEventListener('message', function(e) {
        let message = parseJSON(e.data);
        if (message) {
          if (e.source === globalThis || e.source === globalThis.parent) {
            message.from = 'page';
            message.untrusted = true;
            handleMessage(message);
          }
          if (e.source === globalThis && env === 'content' && message.to === 'background') {
            EXT.sendMessage(message);
          }
        }
        
      });

      EXT.addMessageHandlers({
        'connect_frame': {
          action: (message, port) => {
            let messages = EXT._framePorts[message.frame];
            EXT._framePorts[message.frame] = port;
            if (messages) messages.forEach(m => EXT.sendMessage(m));
          }
        },
      });
  
  case 'frame':
    
      if (globalThis !== globalThis.top){
        EXT.sendMessage({
          type: 'connect_frame',
          to: 'content',
          props: {
            id: window.name
          },
          error: error => console.log(error)
        });
      }

      break;

  case 'background':

      EXT.addMessageHandlers({
        'get_self': {
          action: (message, sender) => sender
        }
      });
  
      browser.runtime.onConnect.addListener(port => {
        let id = port.sender.frameId;
        EXT.ports[id] = port;
        port.onMessage.addListener((message, port) => handleMessage(message, port));
        port.onDisconnect.addListener(() => delete EXT.ports[id])
      });

      break;
}

})();;  
  // check to see if executing in a page script

var PE = {
  "submission_requirements": [
    {
      "name": "Banking Information",
      "purpose": "We need to know if you have an established banking history.",
      "rule": "pick",
      "count": 1,
      "from": "A"
    },
    {
      "name": "Employment Information",
      "purpose": "We need to know that you are currently employed.",
      "rule": "all",
      "from": "B"
    },
    {
      "name": "Citizenship Information",
      "rule": "pick",
      "count": 1,
      "from": "C"
    }
  ],
  "input_descriptors": [
    {
      "id": "banking_input_1",
      "group": ["A"],
      "schema": {
        "uri": ["https://bank-standards.com/customer.json"],
        "name": "Bank Account Information",
        "purpose": "We need your bank and account information."
      },
      "constraints": {
        "limit_disclosure": true,
        "fields": [
          {
            "path": ["$.issuer", "$.vc.issuer", "$.iss"],
            "purpose": "The credential must be from one of the specified issuers",
            "filter": {
              "type": "string",
              "pattern": "did:example:123|did:example:456"
            }
          },
          {
            "path": ["$.credentialSubject.account[*].account_number", "$.vc.credentialSubject.account[*].account_number", "$.account[*].account_number"],
            "purpose": "We need your bank account number for processing purposes",
            "filter": {
              "type": "string",
              "minLength": 10,
              "maxLength": 12
            }
          },
          {
            "path": ["$.credentialSubject.account[*].routing_number", "$.vc.credentialSubject.account[*].routing_number", "$.account[*].routing_number"],
            "purpose": "You must have an account with a German, US, or Japanese bank account",
            "filter": {
              "type": "string",
              "pattern": "^DE|^US|^JP"
            }
          }
        ]
      }
    },
    {
      "id": "banking_input_2",
      "group": ["A"],
      "schema": {
        "uri": [
          "https://bank-schemas.org/1.0.0/accounts.json",
          "https://bank-schemas.org/2.0.0/accounts.json"
        ],
        "name": "Bank Account Information",
        "purpose": "We need your bank and account information."
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.issuer", "$.vc.issuer", "$.iss"],
            "purpose": "The credential must be from one of the specified issuers",
            "filter": {
              "type": "string",
              "pattern": "did:example:123|did:example:456"
            }
          },
          { 
            "path": ["$.credentialSubject.account[*].id", "$.vc.credentialSubject.account[*].id", "$.account[*].id"],
            "purpose": "We need your bank account number for processing purposes",
            "filter": {
              "type": "string",
              "minLength": 10,
              "maxLength": 12
            }
          },
          {
            "path": ["$.credentialSubject.account[*].route", "$.vc.credentialSubject.account[*].route", "$.account[*].route"],
            "purpose": "You must have an account with a German, US, or Japanese bank account",
            "filter": {
              "type": "string",
              "pattern": "^DE|^US|^JP"
            }
          }
        ]
      }
    },
    {
      "id": "employment_input",
      "group": ["B"],
      "schema": {
        "uri": ["https://business-standards.org/schemas/employment-history.json"],
        "name": "Employment History",
        "purpose": "We need to know your work history."
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.jobs[*].active"],
            "filter": {
              "type": "boolean",
              "pattern": "true"
            }
          }
        ]
      }
    },
    {
      "id": "citizenship_input_1",
      "group": ["C"],
      "schema": {
        "uri": ["https://eu.com/claims/DriversLicense.json"],
        "name": "EU Driver's License"
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.issuer", "$.vc.issuer", "$.iss"],
            "purpose": "The credential must be from one of the specified issuers",
            "filter": {
              "type": "string",
              "pattern": "did:example:gov1|did:example:gov2"
            }
          },
          {
            "path": ["$.credentialSubject.dob", "$.vc.credentialSubject.dob", "$.dob"],
            "filter": {
              "type": "string",
              "format": "date",
              "minimum": "1999-5-16"
            }
          }
        ]
      }
    },
    {
      "id": "citizenship_input_2",
      "group": ["C"],
      "schema": {
        "uri": ["hub://did:foo:123/Collections/schema.us.gov/passport.json"],
        "name": "US Passport"
      },
      "constraints": {
        "fields": [
          {
            "path": ["$.credentialSubject.birth_date", "$.vc.credentialSubject.birth_date", "$.birth_date"],
            "filter": {
              "type": "string",
              "format": "date",
              "minimum": "1999-5-16"
            }
          }
        ]
      }
    }
  ]
};

(function(){

  // function mapDescriptorById(type, ddo){
  //   let obj = {};
  //   if (!ddo[type]) (Array.isArray(ddo[type]) ? ddo[type] : [ddo[type]]).forEach(z => {
  //     obj[z.id.split('#').pop()] = z
  //   });
  //   return obj;
  // }

  // class DIDDocumentResult {
  //   constructor (did, src){
  //     this.did = did;
  //     this.resolverData = src;
  //     this.document = src.didDocument;
  //     this.keys = mapDescriptorById('publicKey', this.document);
  //     this.services = mapDescriptorById('services', this.document);
  //   }
  // };


  // ['page', 'frame', 'content', 'background'].forEach(env => {
  //   let message = env + '_to_' + EXT.environment;
  //   if (env !== EXT.environment) {
  //     EXT.addMessageHandlers({
  //       [message]: {
  //         untrusted: true,
  //         action: (props) => {
  //           console.log(message + ' message handled');
  //           return message + ' callback sent to ' + env;
  //         }
  //       }
  //     });
  //   }
  // });

  //window.addEventListener('click', e => {

  //   ['page', 'frame', 'content', 'background'].forEach(env => {
  //     [true, false].forEach(untrusted => {
  //       let message = EXT.environment + '_to_' + env + (untrusted ? '' : '_block');
  //       if (env !== EXT.environment) {
  //         EXT.sendMessage({
  //           type: message,
  //           to: env,
  //           callback: response => {

  //             console.log(message + ' callback arrived at ' + EXT.environment)
  //           },
  //           error: error => {
  //             console.log(error)
  //           }
  //         });   
  //       }
  //     });
  //   });
  // });

  if (!navigator.did) {

    if (EXT.environment === 'page') {

      EXT.addMessageHandlers({
        'sidebar_close': (message) => {
          console.log('page sidebar_close', message.props);
          return 'sidebar_close from page handler';
        }
      });

      Navigator.prototype.did = {
        async resolve (did) { // EXAMPLE: did:btcr:x705-jznz-q3nl-srs
          return EXT.request({
            type: 'did_resolution',
            to: 'content',
            props: { did: did }
          })
        },
        configuration (){
          //return invokeIntent('getDIDConfiguration');
        },
        authenticate (props = {}){
          //return invokeIntent('authenticateDID', props);
        },
        async requestDid (nonce){
          if (!nonce) throw 'DataError: required nonce parameter is missing';
          return EXT.request({
            type: 'did_request',
            to: 'content',
            props: {
              nonce: nonce
            }
          });
        },
        requestCredentials (presentationDefinition = PE){
          return new Promise ((resolve, reject) => {
            EXT.sendMessage({
              type: 'credential_request',
              to: 'content',
              props: {
                presentation_definition: PE
              },
              callback: response => {
                console.log('requestCredentials callback');
                resolve(response);
              },
              error: error => {
                reject(error);
              }
            });
          })
        }

      };
    }
    else {

      // const unlinkedDID = 'Domain invoked authentication with a DID that failed configuration verification';
      // const RESOLVER_ENDPOINT = null; //'http://localhost:3000/1.0/identifiers/';

      // registerIntent({
      //   'resolveDID': did => {
      //     return fetch((RESOLVER_ENDPOINT || 'https://beta.discover.did.microsoft.com/1.0/identifiers/') + did)
      //       .then(async response => new DIDDocumentResult(did, await response.json()))
      //       .catch(e => console.log(e));
      //   },
      //   'authenticateDID': (props = {}) => {
      //     return invokeIntent('getDIDConfiguration').then(async config => {
      //       let entry = config.entries && config.entries[props.did];
      //       if (!entry) throw unlinkedDID;
      //       await invokeIntent('resolveDID', props.did).then(async ddo => {
      //         if (!props.mode) { // assume in-browser UI if no alternate mode declared
      //           return await invokeIntent('openAuthTab')
      //                           .then(tab => authTab = tab)
      //                           .catch(e => console.log(e))
      //         }
      //       });
      //     }).catch(e => {
      //       console.log(e);
      //     })
      //   },
      //   'presentationDefinitionPrompt': (props = {}) => {
      //     return invokeIntent('popup', props).then(async config => {
            
      //     }).catch(e => {
      //       console.log(e);
      //     })
      //   }
      // })

    }
  }

})(); }).toString() + ')()';
        document.documentElement.prepend(pageScript);
        
(async function(){

  const root = document.documentElement;
  const {default: DOM} = await import('/extension/js/modules/dom.js');
  const {default: DID} = await import('/extension/js/modules/did.js');
  const {default: Storage} = await import('/extension/js/modules/storage.js');
  const {default: ExtensionFrame} = await import('/extension/js/modules/extension-frame.js');

  var sidebarInstance;
  var sidebarOpen = false;

  function openSidebar(options = {}){
    if (sidebarOpen) {
      throw 'OperationError: DID interaction in progress, cannot initiate another unil the previous interaction is finished';
    }
    sidebarInstance = sidebarInstance || new ExtensionFrame({
      classes: 'did-extension-sidebar',
      onLoad(sidebar){
        if (options.onLoad) options.onLoad(sidebar);
      },
      onHide(sidebar) {
        sidebar.src = null;
        if (root.contains(sidebar.element)) {
          sidebar.element.parentNode.removeChild(sidebar.element);
        }
        sidebarOpen = false;
        if (options.onHide) options.onHide(sidebar);
      }
    });
    sidebarInstance.src = options.src;
    root.contains(sidebarInstance.element) || root.appendChild(sidebarInstance.element);
    DOM.skipAnimationFrame(() => sidebarInstance.show());
    sidebarOpen = true;
  }

  function sidebarClose(){
    if (sidebarInstance) sidebarInstance.hide();
  }

  EXT.addMessageHandlers({
    'did_resolution': {
      untrusted: true,
      action: async (message) => {
        return await fetch('https://resolver.identity.foundation/1.0/identifiers/' + message.props.did).then(res => res.json());
      }
    },
    'did_request': {
      untrusted: true,
      action: async (message) => {
        if (message.from !== 'page') return;
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
          throw 'NotAllowedError: DID interactions are only permitted in secure contexts (https, localhost)';
        }
        let peer = await DID.getPeer(location.origin);
        if (peer) {
          if (peer.permissions.did_request === false) throw 'AbortError: No DID was returned';
          if (peer.did) return peer.did.uri;
        }
        EXT.addMessageHandlers({
          'did_request_config': {
            action: () => {
              return {
                uri: location.origin,
                nonce: message.props.nonce
              }
            }
          }
        });
        return await new Promise((resolve, reject) => {
          try {
            openSidebar({
              src: '/extension/views/did-request/index.html',
              onLoad(sidebar) {
                EXT.addMessageHandlers({
                  'did_response': {
                    action: async (message) => {
                      console.log(message);
                      if (message.frame == sidebar.name) {
                        resolve(message.props);
                        sidebar.hide();
                        sidebarInstance = null;
                      }
                    }
                  }
                });
              },
              onHide(){
                reject('AbortError: No DID was returned');
                sidebarInstance = null;
              }
            })
          }
          catch (e){ reject(e) }
        }).finally(() => {
          EXT.removeMessageHandlers('did_request_config', 'did_response');
        })
      }
    },
    'credential_request': {
      untrusted: true,
      action: (message) => {
        openSidebar('/extension/views/presentation-exchange/index.html')
      }
    },
    'sidebar_close': {
      action: (message) => {
        sidebarClose();
      }
    }
  });

})()
      