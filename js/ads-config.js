/**
 * Google AdSense configuration — MS Tech Solution
 *
 * STANDARD HTML SITE (not AMP):
 * - Head script (adsbygoogle.js) is on every page
 * - ads-auto.js runs after <body> for Google Auto ads
 *
 * OPTIONAL manual ad units (.ms-ad-slot):
 * - Set enabled: true and add slot IDs when you create units in AdSense
 *
 * AMP ONLY (if you ever convert to AMP HTML):
 * - Set isAmpSite: true and use valid AMP pages
 */
window.MS_ADS_CONFIG = {
    client: 'ca-pub-9548818639099496',

    /**
     * Google Auto ads — Google places ads automatically on the site.
     * Uses the head script + page-level init in ads-auto.js
     */
    autoAdsEnabled: true,

    /**
     * Optional manual ad units in .ms-ad-slot placeholders.
     * Leave false until you add slot IDs below.
     */
    enabled: false,

    // AMP Auto ads — only for valid AMP HTML pages (this site is standard HTML)
    isAmpSite: false,

    testMode: false,
    fillTimeoutMs: 5000,

    slots: {
        'home-mid': '',
        'home-services': '',
        'home-bottom': '',
        'services-mid': '',
        'services-bottom': '',
        'page-mid': '',
        'page-bottom': '',
    },
};
