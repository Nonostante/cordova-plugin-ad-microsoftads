var isAdLoaded = false;

module.exports = {
	onInterstitialAdReady: null,
	onInterstitialAdCompleted: null,
	onInterstitialAdError: null,
	onInterstitialAdCancelled: null,
	isInterstitialAdLoaded: function () {
		return isAdLoaded;
	},
	setUp: function (isTest) {
		var _this = this;
		cordova.exec(
			function (result) {
				var ev = typeof result === "string" ? result : result.event;

				switch (ev) {
					case "setupOk":
						break;
					case "adReady":
						isAdLoaded = true;
						_this.onInterstitialAdReady && _this.onInterstitialAdReady();
						break;
					case "adError":
						isAdLoaded = false;
						_this.onInterstitialAdError && _this.onInterstitialAdError(result.args);
						break;
					case "adCompleted":
						isAdLoaded = false;
						_this.onInterstitialAdCompleted && _this.onInterstitialAdCompleted();
						break;
					case "adCancelled":
						isAdLoaded = false;
						_this.onInterstitialAdCancelled && _this.onInterstitialAdCancelled();
						break;
					default:
						break;
				}
			},
			function (error) {
				console.log('setUp failed.');
			},
			'microsoftads',
			'setUp',
			[isTest]
		);
	},
	preloadInterstitialAd: function (appId, unitId) {
		var _this = this;
		cordova.exec(
			null,
			function (err) {
				_this.onInterstitialAdError && _this.onInterstitialAdError(err);
			},
			'microsoftads',
			'preloadInterstitialAd',
			[appId, unitId]
		);
	},
	showInterstitialAd: function () {
		var _this = this;
		cordova.exec(
			null,
			function (err) {
				_this.onInterstitialAdError && _this.onInterstitialAdError(err);
			},
			'microsoftads',
			'showInterstitialAd',
			[]
		);
	}
};