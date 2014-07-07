'use strict';

/* Directives */

var myAppDirectives = angular.module('myApp.directives', []);

/**
 *  @name userList
 *  @description
 *
 *  Displays an interactive list of users. Features include:
 *    * edit user inline
 *    * revert user changes
 *    * add new user
 *    * delete user
 *
 */
myAppDirectives.directive('userList', ['$window',
  function($window) {
    return {
      restrict:    'AE',
      transclude:  true,
      templateUrl: 'partials/user-list.html',
      link: function(scope, el, attrs) {

        // turn editing mode on
        scope.editUser = function(user) {
          user.prevAttrs = angular.copy(user, {});
          user.editing   = true;
        };

        // create a new user with no attrs at the top of the list
        scope.addUser = function() {
          scope.users.unshift({editing: true, active: true});
        };

        // cancel changes and restore previous attrs
        scope.revertUser = function(user) {
          var attr = null,
              prev = user.prevAttrs;

          for(attr in prev) {
            user[attr] = prev[attr];
          }
          delete user.prevAttrs;
          user.editing = false;

          if(!user.id) scope.userFactory.destroy(user);
        };

        // toggle a user's active state
        scope.toggleUserActive = function(user) {
          user.active = !user.active;
        };

        // save changes if attributes validate
        scope.saveUser = function(user) {
          var errors = scope.userFactory.save(user);

          if(errors && errors.duplicateEmail)
            alert("Email address " + user.email + " is already taken, please choose another.");
        };

        // delete a user
        scope.destroyUser = function(user) {
          if($window.confirm("You are about to delete this user. Continue?"))
            scope.userFactory.destroy(user);
        };
      }
    }
  }]);

/**
 *  @name pagination
 *  @description
 *
 *  Displays pagination controls for a list of users.
 */
myAppDirectives.directive('pagination', ['$filter',
  function($filter) {
    var filter = $filter('filter');

    return {
      restrict:    'AE',
      replace:     true,
      templateUrl: 'partials/pagination.html',
      link: function(scope, el, attrs) {
        var setLimits = function() {
              var users = filter(scope.users, scope.search);
              scope.pageMin    = scope.page*scope.perPage+1;
              scope.pageMax    = scope.pageMin+scope.perPage-1;
              scope.pageMax    = scope.pageMax > users.length ? users.length : scope.pageMax;
              scope.pageTotal  = users.length;
              scope.pageSuffix = 'user' + (scope.pageTotal != 1 ? 's' : '');
            },
            resetPage = function() {
              scope.changePage(0);
              setLimits();
            };

        // select the page to view
        scope.changePage = function(p) {
          if(p<0) p = 0;
          if(p>scope.pageMax) p = scope.pageMax;
          scope.page = p;
        }

        // update pagination on model changes
        scope.$watchCollection('users', setLimits);
        scope.$watch('page', setLimits);
        scope.$watch('search', resetPage);
      }
    };
  }]);
