'use strict';

var myAppFilters = angular.module('myApp.filters', []);

/**
 *  @name startFrom
 *  @description
 *
 *  Returns an array starting from the selected index.
 */
myAppFilters.filter('startFrom',
  function() {
    return function(data, index) {
      return data.slice(index);
    };
  });

/**
 *  @name sortUsers
 *  @description
 *
 *  Custom sorting of a user list. Ensures new users stay at the top
 *  and no users jump around while being edited.
 */
myAppFilters.filter('sortUsers', ['$filter',
  function($filter) {
    var orderBy = $filter('orderBy');

    return function(data, prop, desc) {
      // manually call the order filter to ensure new users stay at the top
      var sorted   = [],
          newUsers = [];

      data = data.map(function(u) {
        return {
          user: u,
          val: (u.id && u.editing && u.prevAttrs) ? u.prevAttrs[prop] : u[prop]
        }
      });

      angular.forEach(orderBy(data, 'val', desc),
        function(u) {
          if(!u.user.id)
            newUsers.push(u.user);
          else
            sorted.push(u.user); });

      newUsers.sort(function(a,b) {
        if(a.$$hashKey > b.$$hashKey) return -1;
        if(a.$$hashKey < b.$$hashKey) return 1;
        return 0;
      })

      return newUsers.concat(sorted);
    };
  }]);
