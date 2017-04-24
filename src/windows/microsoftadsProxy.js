var scriptElem = document.createElement("script"),
    isUwp = false;

if (navigator.appVersion.indexOf('MSAppHost/3.0') !== -1) {
    // Windows 10 UWP
    scriptElem.src = '//Microsoft.Advertising.JavaScript/ad.js';
    isUwp = true;
} else if (navigator.appVersion.indexOf("Windows Phone 8.1;") !== -1) {
    // windows phone 8.1 + Mobile IE 11
    scriptElem.src = "/MSAdvertisingJS/ads/ad.js";
} else if (navigator.appVersion.indexOf("MSAppHost/2.0;") !== -1) {
    // windows 8.1 + IE 11
    scriptElem.src = "/MSAdvertisingJS/ads/ad.js";
}

document.head.appendChild(scriptElem);

var testInterstitialAppId = "d25517cb-12d4-4699-8bdc-52040c712cab",
    testInterstitialUnitId = isUwp ? "test" : "11389925";

function InterstitialProvider(adType) {
    this.isTest = false;
    this.adType = adType || MicrosoftNSJS.Advertising.InterstitialAdType.video;
    this.adTypeString = this.adType === MicrosoftNSJS.Advertising.InterstitialAdType.video ? "video" : "image";
    this._ad = null;
    this._cb = null;
}
InterstitialProvider.prototype.createAd = function () {
    var _this = this;
    var ad = this._ad = new MicrosoftNSJS.Advertising.InterstitialAd();

    ad.onAdReady = function () {
        _this._cb && _this._cb({ adType: _this.adTypeString, state: "adReady" }, { keepCallback: true });
    };
    ad.onErrorOccurred = function (sender, args) {
        _this._cb && _this._cb({ adType: _this.adTypeString, state: "adError", args: args }, { keepCallback: true });
    };
    ad.onCompleted = function () {
        _this._cb && _this._cb({ adType: _this.adTypeString, state: "adCompleted" }, { keepCallback: true });
    };
    ad.onCancelled = function () {
        _this._cb && _this._cb({ adType: _this.adTypeString, state: "adCancelled" }, { keepCallback: true });
    };

    return ad;
}
InterstitialProvider.prototype.initialize = function (cb, isTest) {
    this._cb = cb;
    this.isTest = isTest;
}
InterstitialProvider.prototype.preload = function (appId, unitId) {
    var isTest = this.isTest;
    if (!isTest && (!appId || !unitId)) {
        return "AppId and unitId are required when test mode is disabled";
    }

    var ad = this._ad || this.createAd();

    ad.requestAd(this.adType, isTest ? testInterstitialAppId : appId, isTest ? testInterstitialUnitId : unitId);
}

InterstitialProvider.prototype.show = function () {
    var ad = this._ad;

    if (!ad) {
        return "InterstitialAd is not pre-loaded. Preload it first.";
    } else if (ad.state != MicrosoftNSJS.Advertising.InterstitialAdState.ready) {
        return "InterstitialAd is not ready. Try to preload it again."
    }

    ad.show();
}

var provider = {
    video: null,
    image: null
};

cordova.commandProxy.add("microsoftads", {
    setUp: function (success, error, args) {
        provider.video = new InterstitialProvider(MicrosoftNSJS.Advertising.InterstitialAdType.video);
        provider.image = new InterstitialProvider(MicrosoftNSJS.Advertising.InterstitialAdType.display);

        var isTest = args && args[0];
        provider.video.initialize(success, isTest);
        provider.image.initialize(success, isTest);

        success && success("setupOk", { keepCallback: true });
    },
    preloadImageAd: function (success, error, args) {
        var err = provider.image.preload(args && args[0], args && args[1]);
        if (err) {
            error && error(err);
        } else {
            success && success();
        }
    },
    showImageAd: function (success, error) {
        var err = provider.image.show();
        if (err) {
            error && error(err);
        } else {
            success && success();
        }
    },
    preloadVideoAd: function (success, error, args) {
        var err = provider.video.preload(args && args[0], args && args[1]);
        if (err) {
            error && error(err);
        } else {
            success && success();
        }
    },
    showVideoAd: function (success, error) {
        var err = provider.video.show();
        if (err) {
            error && error(err);
        } else {
            success && success();
        }
    }
});