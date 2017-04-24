var isLoaded = {};

module.exports = {
	onInterstitialEvent: null,
	isImageAdLoaded: function () {
		return !!isLoaded["image"];
	},
	isVideoAdLoaded: function () {
		return !!isLoaded["video"];
	},
	setUp: function (isTest, errorCallback) {
		var _this = this;
		cordova.exec(
			function (ev) {
				switch (ev.state) {
					case "adReady":
						isLoaded[ev.adType] = true;
						break;

					case "adError":
					case "adCompleted":
					case "adCancelled":
						isLoaded[ev.adType] = false;
						break;

					case "setupOk":
					default:
						break;
				}
				_this.onInterstitialEvent && _this.onInterstitialEvent(ev);
			},
			function (error) {
				errorCallback(error);
			},
			'microsoftads',
			'setUp',
			[isTest]
		);
	},
	preloadImageAd: function (appId, unitId) {
		var _this = this;
		cordova.exec(
			null,
			function (err) {
				_this.onInterstitialEvent && _this.onInterstitialEvent({ adType: "image", state: "error", err: err });
			},
			'microsoftads',
			'preloadImageAd',
			[appId, unitId]
		);
	},
	showImageAd: function () {
		var _this = this;
		cordova.exec(
			null,
			function (err) {
				_this.onInterstitialEvent && _this.onInterstitialEvent({ adType: "image", state: "error", err: err });
			},
			'microsoftads',
			'showImageAd',
			[]
		);
	},
	preloadVideoAd: function (appId, unitId) {
		var _this = this;
		cordova.exec(
			null,
			function (err) {
				_this.onInterstitialEvent && _this.onInterstitialEvent({ adType: "video", state: "error", err: err });
			},
			'microsoftads',
			'preloadVideoAd',
			[appId, unitId]
		);
	},
	showVideoAd: function () {
		var _this = this;
		cordova.exec(
			null,
			function (err) {
				_this.onInterstitialEvent && _this.onInterstitialEvent({ adType: "video", state: "error", err: err });
			},
			'microsoftads',
			'showVideoAd',
			[]
		);
	}
};