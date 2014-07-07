'use strict';

/* Controllers */

var myAppControllers = angular.module('myApp.controllers', []);

/**
 *  @name UserListCtrl
 *  @description
 *
 *  Maintains a sorted list of users. Sort property and order
 *  are selectable.
 *
 *  Provides models for pagination.
 *
 *  Watches users to detect any unsaved changes on navigation.
 */
myAppControllers.controller('UserListCtrl', ['$scope', 'User', 'UnsavedChanges',
  function($scope, User, UnsavedChanges) {
    $scope.users     = User.query();
    $scope.columns   = [
      {val: 'lastname',  label: 'Last Name',   size: 3},
      {val: 'firstname', label: 'First Name',  size: 2},
      {val: 'age',       label: 'Age',         size: 1},
      {val: 'email',     label: 'Email',       size: 3},
      {val: 'created',   label: 'Created on',  size: 1},
      {val: 'updated',   label: 'Last edited', size: 1},
      {val: 'active',    label: 'Active',      size: 1}
    ];
    $scope.orderProp   = $scope.columns[0].val;
    $scope.orderDesc   = false;
    $scope.page        = 0;
    $scope.perPage     = 10;
    $scope.userFactory = User;

    // set which column to order by
    $scope.setOrder = function(prop) {
      if($scope.orderProp == prop)
        $scope.orderDesc = !$scope.orderDesc;
      else
        $scope.orderProp = prop;
    };

    // returns a sort class if the specified column is active, false otherwise
    $scope.activeCol = function(c) {
      return $scope.orderProp == c && 'sort-'+$scope.orderDesc;
    };

    // warn if leaving page with unsaved users
    UnsavedChanges.watch($scope.users);
  }]);
