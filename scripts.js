/**
 * Created by Ilya Litmanovich on 23.08.2016.
 */
(function(angular) {
    'use strict';
    var cmTextEditor = angular.module('cmTextEditor', ['ngSanitize', 'dndLists']);

        cmTextEditor.controller('cmTextEditorController', ['$scope', function($scope) {
            $scope.model = {data: ['foo', 'bar', '<i>foo</i> <b>bar</b>']};

            $scope.addElement = function (i) {
                $scope.model.data.splice(i+1, 0, '');
            };

            $scope.removeElement = function (i) {
                $scope.model.data.splice(i, 1);
                if ($scope.model.data.length === 0) {
                    $scope.model.data = [''];
                }
            };

            $scope.drop = function (list, item, newIndex) {
                if (newIndex > $scope.oldIndex) --newIndex;
                list.splice($scope.oldIndex, 1);
                list.splice(newIndex, 0, item);
            };

            $scope.dragStart  = function(i) {
                $scope.oldIndex = i;
            };

            $scope.$watch('model', function(model) {
                $scope.json = angular.toJson(model, true);
            }, true);

        }]);

        cmTextEditor.directive('contenteditable', ['$sce', function($sce) {
            return {
                restrict: 'A',
                require: '?ngModel',
                link: function(scope, element, attrs, ngModel) {
                    if (!ngModel) return;

                    ngModel.$render = function() {
                        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
                    };

                    element.on('blur keyup change', function() {
                        scope.$evalAsync(read);
                    });

                    function read() {
                        var html = element.html();
                        if (attrs.stripBr && html === '<br>') {
                            html = '';
                        }
                        ngModel.$setViewValue(html);
                    }
                }
            };
        }]);
})(window.angular);
