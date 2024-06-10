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
        const url = new URL(request.url);
        const path = url.pathname;

        console.log(`ip=${ip}\t path=${path}\t`)

        // if the path is not "/" return static asset
        if (path !== "/") {
            return env.ASSETS.fetch(request);
        }
        
	    console.log(`ip=${ip}`)  
	    // Return the IP address in the response
	    return new Response(ip, {
		    headers: {
		        'Content-Type': 'text/plain'
		    }
	  });
   },
};
