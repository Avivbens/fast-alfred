export const GOOGLE_ANALYTICS_ID = 'G-STCMH1XZ54'
export const GOOGLE_ANALYTICS_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ANALYTICS_ID}');
`
