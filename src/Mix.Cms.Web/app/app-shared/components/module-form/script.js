﻿modules.component('moduleForm', {
    templateUrl: '/app/app-shared/components/module-form/view.html',
    controller: ['$scope', '$rootScope', 'ngAppSettings', '$routeParams', '$timeout', '$location', 'AuthService', 'SharedModuleDataService',
        function ($scope, $rootScope, ngAppSettings, $routeParams, $timeout, $location, authService, moduleDataService) {
            var ctrl = this;
            $rootScope.isBusy = false;

            ctrl.initModuleForm = async function () {
                var resp = null;
                if (!$rootScope.isInit) {
                    setTimeout(function () { ctrl.initModuleForm(); }, 500);
                } else {
                    if (!ctrl.moduleId) {
                        resp = await moduleDataService.initModuleForm(ctrl.name);
                    }
                    else {
                        resp = await moduleDataService.getModuleData(ctrl.moduleId, ctrl.d, 'portal');
                    }
                    if (resp && resp.isSucceed) {
                        ctrl.data = resp.data;
                        ctrl.data.articleId = ctrl.articleId;
                        ctrl.data.productId = ctrl.productId;
                        ctrl.data.categoryId = ctrl.categoryId;
                        $rootScope.isBusy = false;
                        $scope.$apply();
                        //ctrl.initEditor();
                    }
                    else {
                        if (resp) { $rootScope.showErrors(resp.errors); }
                        $scope.$apply();
                    }
                }
            };

            ctrl.loadModuleData = async function () {
                $rootScope.isBusy = true;
                var id = $routeParams.id;
                var response = await moduleDataService.getModuleData(ctrl.moduleId, ctrl.d, 'portal');
                if (response.isSucceed) {
                    ctrl.data = response.data;
                    //$rootScope.initEditor();
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
                else {
                    $rootScope.showErrors(response.errors);
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };
            ctrl.submitFormData = async function(){
                if($('.g-recaptcha').length>0)
                {
                    
                }
                else{
                    ctrl.saveModuleData();
                }
            }
            ctrl.saveModuleData = async function () {
                var form = $('#module-' + ctrl.data.moduleId);
                
                $.each(ctrl.data.dataProperties, function (i, e) {
                    switch (e.dataType) {
                        case 5:
                            e.value = $(form).find('.' + e.name).val();
                            break;
                        default:
                            e.value = e.value ? e.value.toString() : null;
                            break;
                    }
                });
                var resp = await moduleDataService.saveModuleData(ctrl.data);
                if (resp && resp.isSucceed) {
                    ctrl.data = resp.data;
                    ctrl.initModuleForm();
                    if (ctrl.saveCallback) {
                        ctrl.saveCallback({ data: ctrl.data });
                    }
                    else {
                        var msg = $rootScope.translate('success');
                        $rootScope.showMessage(msg, 'success');
                        $rootScope.isBusy = false;
                        $scope.$apply();
                    }
                    //$location.path('/portal/moduleData/details/' + resp.data.id);
                }
                else {
                    if (resp) { 
                        if(ctrl.errorCallback){
                            ctrl.errorCallback({ response: resp });
                        }
                        else{
                            $rootScope.showErrors(resp.errors); 
                        }
                    }
                    $rootScope.isBusy = false;
                    $scope.$apply();
                }
            };


        }],
    bindings: {
        moduleId: '=',
        categoryId: '=',
        productId: '=',
        articleId: '=',
        d: '=',
        title: '=',
        name: '=',
        submitText: '=',
        isShowTitle: '=',
        backUrl: '=',
        saveCallback: '&',
        errorCallback: '&',
    }
});
