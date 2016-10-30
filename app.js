(function () {
    'use strict';
    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com')
        .directive('listItemDescription', ListItemDescription)
        .directive('foundItems', FoundItemsDirective);

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                title: '@title',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'list',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {

    }

    function ListItemDescription() {
        return {
            template: '{{item.name}}, {{item.short_name}}, {{item.description}}'
        };
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var list = this;
        list.items = [];
        list.nothing = false;
        list.search = function () {
            // The text box is empty and user clicks the "Narrow It Down For Me!" button
            if (list.searchTerm === "") {
                list.nothing = true;
                return;
            }
            var promise = MenuSearchService.getMatchedMenuItems(list.searchTerm);
            promise.then(function (response) {
                list.items = response || [];
                // If nothing is found as the search result
                if (list.items.length === 0) {
                    list.nothing = true;
                    return;
                }
                list.nothing = false;
            });
        };
        list.removeItem = function (idx) {
            list.items.splice(idx, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: 'GET',
                url: ApiBasePath + '/menu_items.json'
            }).then(function (result) {
                var foundItems = [], menuItems = result.data.menu_items;
                for (var i = 0; i < menuItems.length; i++) {
                    if (menuItems[i].description.indexOf(searchTerm) !== -1) {
                        foundItems.push(menuItems[i]);
                    }
                }
                return foundItems;
            }).catch(function (error) {
                console.log(error);
            });
        };
    }

})();