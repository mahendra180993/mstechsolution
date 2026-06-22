/**
 * Google AdSense configuration — MS Tech Solution
 *
 * HOW TO ENABLE ADS IN THE FUTURE:
 * 1. Get AdSense approval for mstechsolution.in
 * 2. In AdSense dashboard, create ad units and copy each "data-ad-slot" ID
 * 3. Paste slot IDs below (replace empty strings)
 * 4. Set enabled: true
 * 5. Deploy — ads show ONLY when Google fills the slot; empty slots stay hidden
 */
window.MS_ADS_CONFIG = {
    // Set to true only after AdSense is approved and slot IDs are added
    enabled: false,

    // Your publisher ID (already on the site)
    client: 'ca-pub-9548818639099496',

    // Optional: use during testing in AdSense (set false for production)
    testMode: false,

    // Max milliseconds to wait before hiding an unfilled slot
    fillTimeoutMs: 5000,

    /**
     * Ad unit slot IDs from AdSense dashboard.
     * Leave empty until you create each unit — empty = no ad, no empty box.
     */
    slots: {
        // Homepage — between Stats and About
        'home-mid': '',

        // Homepage — after Services section
        'home-services': '',

        // Homepage — above footer
        'home-bottom': '',

        // Services page — between service sections
        'services-mid': '',

        // Services page — above footer
        'services-bottom': '',

        // About, Projects, FAQ, Contact — mid content
        'page-mid': '',

        // About, Projects, FAQ, Contact — above footer
        'page-bottom': '',
    },
};
