/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

/**

    ip.nettica.com

    https://ip.nettica.com/
    https://ip.nettica.com/all

 */

export default {
	async fetch(request, env, ctx) {
	  // Get the IP address from the CF-Connecting-IP header
	    const ip = request.headers.get('CF-Connecting-IP');
        var   ah = request.headers.get('Accept');
        const ua = request.headers.get('User-Agent');
        const url = new URL(request.url);
        const path = url.pathname;

        console.log(`ip=${ip} \t path=${path} \t ua=${ua} \t Accept=${ah}`)

        if (request.method === "GET" && (path === "/all" || path === "/all/")) {
            const details = ipDetails(request, ip);
            if (acceptsJson(ah)) {
                return new Response(JSON.stringify(details), { headers: { 'Content-Type': 'application/json' } });
            }
            return new Response(prettyAll(details), { headers: { 'Content-Type': 'text/html' } });
        }

        // if the path is not "/" return static asset
        if (path !== "/") {
            return env.ASSETS.fetch(request);
        }

        if (ah && ah.includes("text/html")) {
            ah = "text/html";
        }

        var html = `<html><body><p>${ip}</p><a href="https://nettica.com/">sponsored by nettica.com</a></body></html>`

        if (isMobile(ua)) {
            html = pretty(ip);
        }

        switch (ah) {

            case "*/*":
            case null:
                return new Response( ip, { headers: { 'Content-Type': 'text/plain' } });

            case "application/json":
            case "text/json":
                return new Response(`{"ip":"${ip}"}`, { headers: { 'Content-Type': ah } });

            case "application/xml":
            case "text/xml":
                return new Response(`<?xml version="1.0"?><ip>${ip}</ip>`, { headers: { 'Content-Type': ah } });

            case "text/html":
                return new Response(html, { headers: { 'Content-Type': ah }});

            default:
                return new Response( ip, { headers: { 'Content-Type': 'text/plain' } });
        }

        return new Response("Invalid request", { status: 400 });
   },


   }

   function isMobile(userAgent) {
    return /Android|Safari|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(userAgent)
  }

   function pretty(ip) {
    return `
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: sans-serif;
            background: #000;
            color: #f7f7f7;
        }
        .boxed-link {
            border: 2px solid #333;
            border-radius: 8px;
            padding: 8px 16px;
            background: #060606;
            box-shadow: 0 2px 8px rgba(51, 102, 153, 1.00);
            text-decoration: none;
            color: #ddd;
            font-weight: bold;
            display: inline-block;
        }
        .boxed-link:hover {
            background: #FFFFFF44;
            box-shadow: 0 4px 12px rgba(51, 102, 153, 1.00);
        }
        p {
            font-size: 2em;
            margin-bottom: 24px;
        }
        .app-links {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-top: 32px;
        }
    </style>
</head>
<body>
    <p>${ip}</p>
    <a href="https://nettica.com/" class="boxed-link">
        <img src="https://nettica.com/nettica.png" alt="Nettica Logo" style="height:24px; vertical-align:middle; margin-right:8px;">
        sponsored by nettica.com
    </a>
    <div class="app-links">
        <a title="Nettica Agent for Android" target="_blank" href="https://play.google.com/store/apps/details?id=com.nettica.agent">
            <img decoding="async" src="https://nettica.com/wp-content/uploads/2024/11/GetItOnGooglePlay_Badge_Web_color_English.png" width="135px" height="40px" class="no-round" alt="install on google play" loading="lazy" />
        </a>
        <span style="width:16px;display:inline-block;"></span>
        <a title="Nettica Agent for iPhone, iPad and Mac" target="_blank" href="https://apps.apple.com/us/app/nettica/id6736854178">
            <img decoding="async" src="https://nettica.com/wp-content/uploads/2024/11/Download_on_the_App_Store.svg" width="135px" height="40px" class="no-round" alt="install on App Store" loading="lazy" />
        </a>
    </div>
</body>
</html>`
};

function acceptsJson(accept) {
    return accept
        ?.split(",")
        .some((value) => value.trim().toLowerCase().startsWith("application/json")) ?? false;
}

function ipDetails(request, ip) {
    return {
        ip,
        country: request.cf?.country ?? "",
        isEUCountry: request.cf?.isEUCountry === "1",
        city: request.cf?.city ?? "",
        region: request.cf?.region ?? "",
        regionCode: request.cf?.regionCode ?? "",
        postalCode: request.cf?.postalCode ?? "",
    };
}

function prettyAll(details) {
    const rows = Object.entries(details)
        .map(([field, value]) => `
        <tr>
            <th>${escapeHtml(field)}</th>
            <td>${escapeHtml(String(value))}</td>
        </tr>`)
        .join("");

    return `
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 32px 16px;
            box-sizing: border-box;
            font-family: sans-serif;
            background: #000;
            color: #f7f7f7;
        }
        table {
            border-collapse: collapse;
            background: #111;
            margin-bottom: 24px;
            min-width: min(520px, 100%);
            max-width: 100%;
            font-size: 1.05em;
        }
        th,
        td {
            border: 1px solid rgba(255, 255, 255, 0.28);
            padding: 10px 14px;
            text-align: left;
            overflow-wrap: anywhere;
        }
        th {
            color: #cfcfcf;
            font-weight: bold;
            white-space: nowrap;
        }
        td {
            color: #fff;
        }
        .boxed-link {
            border: 2px solid #333;
            border-radius: 8px;
            padding: 8px 16px;
            background: #060606;
            box-shadow: 0 2px 8px rgba(51, 102, 153, 1.00);
            text-decoration: none;
            color: #ddd;
            font-weight: bold;
            display: inline-block;
        }
        .boxed-link:hover {
            background: #FFFFFF44;
            box-shadow: 0 4px 12px rgba(51, 102, 153, 1.00);
        }
        .app-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-top: 26px;
        }
        .app-title {
            color: #bbb;
            font-size: 0.9em;
        }
        .app-links {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 16px;
        }
    </style>
</head>
<body>
    <table>
        <tbody>${rows}
        </tbody>
    </table>
    <a href="https://nettica.com/" class="boxed-link">
        <img src="https://nettica.com/nettica.png" alt="Nettica Logo" style="height:24px; vertical-align:middle; margin-right:8px;">
        sponsored by nettica.com
    </a>
    <div class="app-section">
        <div class="app-title">Nettica Agent</div>
        <div class="app-links">
            <a title="Nettica Agent for Android" target="_blank" href="https://play.google.com/store/apps/details?id=com.nettica.agent">
                <img decoding="async" src="https://nettica.com/wp-content/uploads/2024/11/GetItOnGooglePlay_Badge_Web_color_English.png" width="135px" height="40px" class="no-round" alt="install on google play" loading="lazy" />
            </a>
            <a title="Nettica Agent for iPhone, iPad and Mac" target="_blank" href="https://apps.apple.com/us/app/nettica/id6736854178">
                <img decoding="async" src="https://nettica.com/wp-content/uploads/2024/11/Download_on_the_App_Store.svg" width="135px" height="40px" class="no-round" alt="install on App Store" loading="lazy" />
            </a>
        </div>
    </div>
    <div class="app-section">
        <div class="app-title">Filie</div>
        <div class="app-links">
            <a title="Filie for Android" target="_blank" href="https://play.google.com/store/apps/details?id=com.nettica.filie">
                <img decoding="async" src="https://nettica.com/wp-content/uploads/2024/11/GetItOnGooglePlay_Badge_Web_color_English.png" width="135px" height="40px" class="no-round" alt="install on google play" loading="lazy" />
            </a>
            <a title="Filie for iPhone, iPad and Mac" target="_blank" href="https://apps.apple.com/us/app/filie/id6767788522">
                <img decoding="async" src="https://nettica.com/wp-content/uploads/2024/11/Download_on_the_App_Store.svg" width="135px" height="40px" class="no-round" alt="install on App Store" loading="lazy" />
            </a>
        </div>
    </div>
</body>
</html>`
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
