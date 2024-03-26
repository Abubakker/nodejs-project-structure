let api_url = window.location.origin;

var ApiConsoleCtrl = function ($scope, $http, $location) {

    $scope.apiInfo = null;
    $scope.setApiInfo = null;

    // binding variable
    $scope.userAgent = null;
    $scope.sessionId = localStorage.getItem('access_token') || null;
    $scope.refresh_token = localStorage.getItem('refresh_token') || null;
    $scope.method = null;
    $scope.profiler = null;
    $scope.url = null;
    $scope.queryParameter = null;
    $scope.requestSignature = null;
    $scope.baseString = null;
    $scope.requestBody = null;

    $scope.sendTimes = null;

    $scope.response = null;
    $scope.responseHeader = null;
    $scope.responseBody = null;

    server_key = getServerKey();

    // APIデータ読�?�込�?�.
    $http.get(getConsoleBaseDir('js/apis.json')).success(
        function (data) {
            $scope.apiInfo = data;
        });

    // API情報をセット.
    $scope.setApi = function (api) {

        var apidata = $scope.apiInfo[api];

        $scope.method = apidata.method;
        $scope.url = getUrl(apidata.action);
        $scope.queryParameter = apidata.query;
        $scope.requestBody = JSON.stringify(apidata.json, null, 4);

        var crypt = false;
        if (apidata.crypt !== undefined) {
            crypt = apidata.crypt;
        }

        var signature = false;
        if (apidata.signature !== undefined) {
            signature = apidata.signature;
        }

        $scope.setApiInfo = {
            "name": api,
            "title": apidata.title,
            "method": apidata.method,
            "host": getRequestHost(),
            "path": getApiBaseDir(apidata.action),
            "query": apidata.query,
            "url": getUrl(apidata.action, apidata.query),
            "crypt": crypt,
            "signature": signature
        };
        $scope.responseHeader = null;
        $scope.responseBody = null;

        $scope.response = {};

    }

    // �?�在�?�択中�?�API�?�li�?素�?�セット�?�るクラス.
    $scope.activeApiClass = function (api) {

        if ($scope.apiInfo != undefined && api == $scope.apiInfo.name) {
            return "active";
        } else {
            return "";
        }
    }

    // Request Hash用�?�キーを�?�択
    function getServerKey(length) {
        let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    // Requset Hash文字列を計算.
    function getRequestSignature(salt) {
        var signature = "";

        if ($scope.setApi != undefined) {

            signature = CryptoJS.MD5($scope.api_key + salt);
        }

        return signature;
    }

    // APIコンソール�?�ベース
    function getConsoleBaseDir(path) {
        var pathname = window.location.pathname;

        var tmpPath;

        if (pathname.indexOf('sample', 0) !== -1) {
            tmpPath = "/sample" + path;
        } else {
            tmpPath = path;
        }

        return tmpPath;
    }

    // リクエスト URI�?�ベース
    function getApiBaseDir(path) {
        var pathname = window.location.pathname;

        if (pathname.indexOf('sample', 0) !== -1) {
            tmpPath = "/sample/api" + path;
        } else {
            tmpPath = '/api' + path;
        }
        return tmpPath;
    }

    // httpリクエスト�?信先URL生�?.
    function getUrl(action, query) {

        var tmpQuery = "";
        if (query != undefined && "" != query) {
            tmpQuery = "?" + query;
        }

        return getApiBaseDir(action) + tmpQuery;
    }

    function getRequestHost() {
        var scheme = $location.protocol();
        var host = $location.host();
        var port = $location.port();
        /*		if ("" != port && 80 != port) {
         host += ":" + port;
         }*/

        return scheme + ":8000//" + host;
    }

    // API呼�?�出�?�を実行.
    $scope.callApi = function () {
        if (($scope.sendTimes == null) || ($scope.sendTimes < 1))
            $scope.sendTimes = 1;

        if ($scope.apiInfo != undefined) {
            for (var i = 0; i < $scope.sendTimes; i++) {
                $scope.response = {};

                // http header
                $scope.salt = getServerKey(64);
                $scope.requestSignature = getRequestSignature($scope.salt);

                $http.defaults.headers.common["Authorization"] = 'Bearer ' + $scope.sessionId;
                if ($scope.url.includes('refresh-token')) $http.defaults.headers.common["Authorization"] = 'Bearer ' + $scope.refresh_token;
                $http.defaults.headers.common["X-RequestHash"] = $scope.salt + '.' + $scope.requestSignature;

                var opts = {};
                opts.method = $scope.method;
                opts.url = api_url + $scope.url;
                //console.log(opts);

                if ("" != $scope.queryParameter) {
                    opts.url = opts.url + '?' + $scope.queryParameter;

                }

                $scope.baseString = opts.url;

                if ("POST" == $scope.method) {
                    if ($scope.requestBody) {
                        opts.data = JSON.parse($scope.requestBody.trim());
                    }
                    //console.log(opts); //return false;
                }
                //console.log(opts);

                $http(opts).success(function (data, status, headers, config) {
                    //console.log(status);

                    if (200 == status) {
                        $scope.response.statusClass = "alert-success";
                    } else {
                        $scope.response.statusClass = "alert-error";
                    }
                    // セッションID.
                    if (data.result.access_token) {
                        $scope.sessionId = data.result.access_token;
                        localStorage.setItem("access_token", $scope.sessionId)

                        $scope.refresh_token = data.result.refresh_token;
                        localStorage.setItem("refresh_token", $scope.refresh_token)
                    } else if ($scope.url.includes('logout')) {
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        $scope.sessionId = null;
                    }
                    // Result response.
                    $scope.responseBody = JSON.stringify(data, null, 2);
                    $scope.responseHeader = JSON.stringify(headers(), null, 2);
                }).error(function (data, status, headers, config) {
                    $scope.response.statusClass = "alert-error";
                    $scope.responseBody = JSON.stringify(data, null, 2);
                    $scope.responseHeader = JSON.stringify(headers(), null, 2);
                    if (data.result_code == 11) {
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                        $scope.sessionId = null;
                    }
                });


            }
        }
    }

}
