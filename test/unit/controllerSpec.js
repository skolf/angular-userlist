'use strict';

describe('myApp controllers', function() {

  /**
   *  setup
   */
  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('myApp'));
  beforeEach(module('myApp.controllers'));
  beforeEach(module('myApp.services'));

  /**
   *  @unit: UserListCtrl
   */
  describe('UserListCtrl', function(){
    var scope, ctrl, $httpBackend, testUsers = [
      {firstname: 'test', lastname: 'user', age: 1, email: 'me@you.com', active: true, created: 1, updated: 2},
      {firstname: 'roddy', lastname: 'piper', age: 3, email: 'rpipes@wwe.com', active: true, created: 3, updated: 4}
    ];

    // setup
    beforeEach(function() {
      localStorage.clear();
    });

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('data/users.json').respond(testUsers);

      scope = $rootScope.$new();
      ctrl = $controller('UserListCtrl', {$scope: scope});
    }));

    // ## test
    it('should create "users" model with 2 users fetched from xhr', function() {
      expect(scope.users).toEqualData([]);
      $httpBackend.flush();

      expect(scope.users).toEqualData(testUsers);
    });

    // ## test
    it('should set the default value of orderProp model', function() {
      expect(scope.orderProp).toBe('lastname');
    });

    // ## test
    it('should set the default value of orderDesc model', function() {
      expect(scope.orderDesc).toBe(false);
    });

    // ## test
    it('should set the default value of page model', function() {
      expect(scope.page).toBe(0);
    });

    // ## test
    it('should set the default value of perPage model', function() {
      expect(scope.perPage).toBe(10);
    });

    // ## test
    it('should set the column tables to be displayed', function() {
      expect(scope.columns.length).toBe(7);
    });

    // ## test
    it('should be able to change orderProp', function() {
      expect(scope.orderProp).toBe('lastname');
      scope.setOrder('firstname');
      expect(scope.orderProp).toBe('firstname');
    });

    // ## test
    it('should toggle orderDesc if same orderProp is provided', function() {
      expect(scope.orderDesc).toBe(false);
      scope.setOrder('lastname');
      expect(scope.orderDesc).toBe(true);
    });

    // ## test
    it('should return a sort class for the active column', function() {
      expect(scope.activeCol('lastname')).toBe('sort-false');
    });

    // ## test
    it('should return false for inactive columns', function() {
      expect(scope.activeCol('firstname')).toBe(false);
    });

  });

});
