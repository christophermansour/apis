## Security Note

All apis resources are by default fully CORS and JSONP available. You must use CSRF protection for all your authenticated requests (even for GET requests) and apis supports such protection by default too. Optionally, you can check Origin of your requests or disable CORS/JSONP functionality (completely or for choosen request handlers).

By default, apis philosophy is to allow cross-origin requests and be ready for them.

Also, by default, every resource will have 'options' handler providing resource description and it will not be protected by authentication or something. You can allways override this handler with null or your own variant.

## Handlers

Handler interface:

* `setup(chain)` - can be used to perform some interaction between handlers of chain, used by `Impl` and `Ret`
* `handle(ctx)` - async handle, must not throw any exceptions, use `ctx.error()` instead, usually must call `ctx.next()` at some point

## Test page

To get test page on `/test_page/index.html` add to your contract:

```js
res.subpaths('/test_page', st(apis.tools.testPage.staticPath))
```

## Apps known by Loader

* app - app itself, will be loaded from cwd() + '/lib/app'
* cluster_master - cluster master app, will be loaded from cwd() + '/lib/claster_master' or default will be used
* daemon_master - daemon start/stop app, will be loaded from cwd() + '/lib/daemon_master' or default will be used

## Units known by Loader

* core.app - known by app actually (which also is loader), the app itself
* core.settings - settings, will be loaded from cwd() + '/lib/settings' or default will be used
* core.handler - main app contract, will be loaded from cwd() + '/lib/contract'
* core.uncaught - uncaught exception handler
* core.logging - logging subsystem
	* core.logging.engines.syslog - syslog logging engine
* core.mechanics.web - web mechanics, enables responding on HTTP requests
* core.mechanics.socket - socket mechanics, enables web socket communications, runs on top of web mechanics
	* core.mechanics.socket.connections - web socket connections tracker
	* core.mechanics.socket.stat - web socket statistics

## REST notes

* stateless all the way
* GET must be cacheable !!!
	* think about url & args, how to provide cacheable structure
* PUT vs POST
	* PUT is safe to repeat (example: update something)
	* POST is not safe to repeat - can create copies (example: create)
* DELETE is safe to repeat (just ensures that it's deleted)
