'use strict';

/* Services */

var myAppServices = angular.module('myApp.services', []);

/**
 *  @name User
 *  @description
 *
 *  Performs CRUD operations and sorting for users in the system.
 *
 *  The `$http` service is used rather than `$resource` because
 *  local storage is used for persistence instead of a backend.
 */
myAppServices.factory('User', ['$http',
  function($http){
    var service = {
      defaults: {
        firstname: '',
        lastname:  '',
        age:       null,
        email:     '',
        active:    null,
        created:   null,
        updated:   null },
      required: ['lastname', 'firstname', 'email'],
      localStorage: 'localStorage' in window,
      nextId: 1,
      users: [],
      buildUserList: function(rawList) {
        rawList.forEach(function(attr) {
          if(attr.id >= service.nextId) service.nextId = attr.id+1;

          service.users.push(angular.extend({}, service.defaults, attr));
        });
      },
      query: function() {
        var savedUsers = null;

        // first check local storage
        if(service.localStorage) savedUsers = localStorage['users'];

        if(savedUsers)
          service.buildUserList(angular.fromJson(savedUsers));
        else
          $http.get('data/users.json').then(function(response) {
            service.buildUserList(response.data);
            service.commitUsers();
          });
        return service.users;
      },
      save: function(user) {
        var now    = Math.round(Date.now()/1000),
            errors = service.validate(user);

        if(!errors) {
          if(!user.id) {
            user.id = service.nextId++;
            user.created = now;
          }
          user.updated = now;
          user.editing = false;

          service.commitUsers();

          return null;
        } else
          return errors;
      },
      validate: function(user) {
        var errors = {
              missing: [],
              duplicateEmail: false
            };

        angular.forEach(service.required, function(a) {
          if(!user[a] || user[a] == '')
            errors.missing.push(a);
        });

        angular.forEach(service.users, function(u) {
          if(u.id != user.id && u.email == user.email)
            errors.duplicateEmail = true;
        });

        return (errors.missing.length == 0 && !errors.duplicateEmail) ? null : errors;
      },
      destroy: function(user) {
        service.users.splice(service.users.indexOf(user), 1);
        service.commitUsers();
      },
      commitUsers: function() {
        if(service.localStorage)
          localStorage['users'] = angular.toJson(service.users);
      }
    };

    return service;
  }]);

/**
 *  @name UnsavedChanges
 *  @description
 *
 *  This service catches page navigation events and displays a confirmation box
 *  if there are any unsaved changes in the watched models.
 *
 *  To watch models:
 *    UnsavedChanges.watch([my models...])
 *
 *  A model is considered to have unsaved changes if its :editing property
 *  is set to true.
 */
myAppServices.service("UnsavedChanges", ['$window', '$rootScope', '$route', '$location',
  function($window, $rootScope, $route, $location) {
    var watching = [],
        confirm  = function(e) {
          var msg = "You have unsaved changes that will be lost.";

          if(watching.every(function(u) { return !u.editing; }))
            return null;

          e = e || $window.e;

          if(e) e.returnValue = msg;

          return msg;
        };

    $window.onbeforeunload = confirm;
    $rootScope.$on('$locationChangeStart', confirm);

    return {
      watch: function(models) {
        watching = models;
      }
    };
  }]);
