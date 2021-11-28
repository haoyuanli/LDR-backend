// std
import { ok, strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { ActivitiesController } from './activities.controller';

describe('ActivitiesController', () => {

  let controller: ActivitiesController;

  beforeEach(() => controller = createController(ActivitiesController));

  describe('has a "foo" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ActivitiesController, 'foo'), 'GET');
      strictEqual(getPath(ActivitiesController, 'foo'), '/');
    });

    it('should return an HttpResponseOK.', () => {
      const ctx = new Context({});
      ok(isHttpResponseOK(controller.readActivities(ctx)));
    });

  });

});
