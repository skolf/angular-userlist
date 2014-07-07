'use strict';

describe('service', function() {

  // load modules
  beforeEach(module('myApp'));

  // test service availability
  it('check the existence of User factory', inject(function(User) {
    expect(User).toBeDefined();
  }));

  it('check the existence of UnsavedChanges', inject(function(UnsavedChanges) {
    expect(UnsavedChanges).toBeDefined();
  }));

});
