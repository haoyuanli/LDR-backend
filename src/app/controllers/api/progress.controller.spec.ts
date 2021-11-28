// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { ProgressController } from './progress.controller';

describe('ProgressController', () => {

  let controller: ProgressController;

  beforeEach(() => controller = createController(ProgressController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ProgressController, 'foo'), 'GET');
      strictEqual(getPath(ProgressController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.foo(ctx)));
    });

  });

});
