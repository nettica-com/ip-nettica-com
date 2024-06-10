/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
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

        // if the path is not "/" return static asset
        if (path !== "/") {
            return env.ASSETS.fetch(request);
        }

        if (ah && ah.includes("text/html")) {
            ah = "text/html";
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
                return new Response(`<html><body><p>${ip}</p><a href="https://nettica.com/">sponsored by nettica.com</a></body></html>`, { headers: { 'Content-Type': ah }});

            default:
                return new Response( ip, { headers: { 'Content-Type': 'text/plain' } });
        }

        return new Response("Invalid request", { status: 400 });
   },
};
