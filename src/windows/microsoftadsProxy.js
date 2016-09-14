var scriptElem = document.createElement("script");

if (navigator.appVersion.indexOf('MSAppHost/3.0') !== -1) {
    // Windows 10 UWP
    scriptElem.src = '//Microsoft.Advertising.JavaScript/ad.js';
} else if (navigator.appVersion.indexOf("Windows Phone 8.1;") !== -1) {
    // windows phone 8.1 + Mobile IE 11
    scriptElem.src = "/MSAdvertisingJS/ads/ad.js";
} else if (navigator.appVersion.indexOf("MSAppHost/2.0;") !== -1) {
    // windows 8.1 + IE 11
    scriptElem.src = "/MSAdvertisingJS/ads/ad.js";
}

//scriptElem.addEventListener("load", function () {
//});

document.head.appendChild(scriptElem);

var testInterstitialAppId = "d25517cb-12d4-4699-8bdc-52040c712cab",
    testInterstitialUnitId = "11389925";

var provider = {
    isTest: false,
    _ad: null,
    _cb: null,
    _initialize: function () {
        var _this = this;
        var ad = this._ad = new MicrosoftNSJS.Advertising.InterstitialAd();

        ad.onAdReady = function () {
            _this._cb && _this._cb("adReady", { keepCallback: true });
        };
        ad.onErrorOccurred = function (sender, args) {
            _this._cb && _this._cb({ event: "adError", args: args}, { keepCallback: true });
        };
        ad.onCompleted = function () {
            _this._cb && _this._cb("adCompleted", { keepCallback: true });
        };
        ad.onCancelled = function () {
            _this._cb && _this._cb("adCancelled", { keepCallback: true });
        };

        return ad;
    },
    initialize: function (cb, isTest) {
        this._cb = cb;
        this._isTest = isTest;
    },
    preloadInterstitial: function (appId, unitId) {
        var isTest = this.isTest;
        if (!isTest && (!appId || !unitId)) {
            return "AppId and unitId are required when test mode is disabled";
        }

        var ad = this._ad || this._initialize();

        var adType = MicrosoftNSJS.Advertising.InterstitialAdType.video;
        ad.requestAd(adType, isTest ? testInterstitialAppId : appId, isTest ? testInterstitialUnitId : unitId);
    },
    showInterstitial: function () {
        var ad = this._ad;

        if (!ad) {
            return "InterstitialAd is no preloaded. Preload it first.";
        } else if (ad.state != MicrosoftNSJS.Advertising.InterstitialAdState.ready) {
            return "IntersitialAd is not ready. Try to preload it again."
        }

        ad.show();
    }
}

cordova.commandProxy.add("microsoftads", {
    setUp: function (success, error, isTest) {
        provider.initialize(success, isTest);
        success && success("setupOk", { keepCallback: true });
    },
    preloadInterstitialAd: function (success, error, args) {
        var err = provider.preloadInterstitial(args && args[0], args && args[1]);
        if (err) {
            error && error(err);
        } else {
            success && success();
        }
    },
    showInterstitialAd: function (success, error) {
        var err = provider.showInterstitial();
        if (err) {
            error && error(err);
        } else {
            success && success();
        }
    }
});