/**
 * Google AdSense Auto ads — runs immediately after <body> on every page.
 *
 * Standard HTML: enable_page_level_ads (Google Auto ads)
 * AMP sites only: loads amp-auto-ads when MS_ADS_CONFIG.isAmpSite === true
 */
(function () {
    const config = window.MS_ADS_CONFIG;
    if (!config || !config.client) return;

    function pushStandardAutoAds() {
        if (!config.autoAdsEnabled) return;
        if (window.__msAdsAutoInit) return;
        window.__msAdsAutoInit = true;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: config.client,
                enable_page_level_ads: true,
            });
        } catch (e) {
            /* AdSense not ready yet */
        }
    }

    function initAmpAutoAds() {
        if (!config.isAmpSite) return;
        if (document.documentElement.getAttribute('amp') === '' || document.documentElement.hasAttribute('⚡')) {
            if (!document.querySelector('script[src*="amp-auto-ads-0.1.js"]')) {
                const ampScript = document.createElement('script');
                ampScript.async = true;
                ampScript.setAttribute('custom-element', 'amp-auto-ads');
                ampScript.src = 'https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js';
                document.head.appendChild(ampScript);
            }
            if (!document.querySelector('amp-auto-ads')) {
                const ampAds = document.createElement('amp-auto-ads');
                ampAds.setAttribute('type', 'adsense');
                ampAds.setAttribute('data-ad-client', config.client);
                document.body.insertBefore(ampAds, document.body.firstChild);
            }
        }
    }

    function run() {
        initAmpAutoAds();
        pushStandardAutoAds();
    }

    if (document.readyState === 'complete') {
        run();
    } else {
        window.addEventListener('load', run, { once: true });
    }
})();
