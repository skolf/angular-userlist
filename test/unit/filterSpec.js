'use strict';

describe('myApp filters', function() {
  var data  = null;

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

  beforeEach(module('myApp.filters'));

  /**
   *  @unit: startFrom
   */
  describe('startFrom', function(){
    beforeEach(function() {
      data = [0,1,2,3,4,5];
    });

    it('should return an array starting at the selected index',
      inject(function(startFromFilter) {
        expect(startFromFilter(data,3)).toEqualData([3,4,5]);
      })
    );
  });

  /**
   *  @unit: sortUsers
   */
  describe('sortUsers', function(){
    beforeEach(function() {
      data = [
        {lastname: 'old user', id: 1},
        {lastname: 'editing user', id: 2, editing: true},
        {lastname: 'another user', id: 3},
        {lastname: 'new user'}
      ];
    });

    it('should order new users at the top',
      inject(function(sortUsersFilter) {
        expect(sortUsersFilter(data, 'lastname', false)[0].lastname).toBe('new user');
      })
    );

    it('should order users by prop and direction',
      inject(function(sortUsersFilter) {
        expect(sortUsersFilter(data, 'lastname', false)[1].id).toBe(3);
      })
    );

  });

});
