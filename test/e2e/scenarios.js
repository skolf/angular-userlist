'use strict';

describe('myApp', function() {

  /**
   *  User list
   */
  describe('User list view', function() {

    // setup
    beforeEach(function() {
      browser.get('app/index.html');
    });

    // ## test
    it('should filter the user list as user types into the search box', function() {

      var users  = element.all(by.repeater('user in users'));
      var search = element(by.model('search'));

      expect(users.count()).toBe(10);

      search.sendKeys('teddy');
      expect(users.count()).toBe(1);

      search.clear();
      search.sendKeys('abe');
      expect(users.count()).toBe(1);
    });

  });
});
