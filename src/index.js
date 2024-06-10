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
	  const ipAddress = request.headers.get('CF-Connecting-IP');
  
	  // Return the IP address in the response
	  return new Response(ipAddress, {
		    headers: {
		      'Content-Type': 'text/plain'
		    }
	  });
   },
};
