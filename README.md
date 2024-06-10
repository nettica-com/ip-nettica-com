
# <img src="./favicon.ico" height="32px" /> ip-nettica-com

This serverless app hosted on Cloudflare returns the caller's current IP address.
It returns results as plain text, JSON, XML, or HTML.

## History
The venerable <a href="https://ip.nettica.com/">ip.nettica.com</a> has been serving IP addresses since
2006.  It went out of service for almost 10 years until it was resurrected in 2024.  It still receives 
an astonishing amount of traffic, even after being down for so long.  It's been enhanced
to support IPv6; and now will return results in JSON, XML, and HTML, in addition to the original plain text.

## HTTP API
Both HTTP and HTTPS requests are supported.

<table>
  <tr>
    <th>
      Accept Header
    </th>
    <th>
      Results
    </th>
  </tr>
  <tr>
    <td>application/json</td>
    <td>{"ip":"${ip}"}</td>
  </tr>
  <tr>
    <td>application/xml</td>
    <td>&lt;ip&gt;${ip}&lt;/ip&gt;</td>
  </tr>
  <tr>
    <td>text/html</td>
    <td>&lt;p&gt;${ip}&lt;/p&gt;</td>
  </tr>
  <tr>
    <td>text/plain</td>
    <td>${ip}</td>
  </tr>
  <tr>
    <td>(none)</td>
    <td>${ip}</td>
  </tr>
</table>

The result `${ip}` is an IPv4 or IPv6 address.  You will always receive just the IP address with a `text/plain` Accept header.  For HTML,
the IP address is encapsulated in a paragraph tag.  There are other tags on the page to make it valid and well-formed.  For new applications,
it's recommended that you set the Accept header to your desired format.  The `Content-Type` response header will be set accordingly.

## Examples
### curl
```
curl -H "Accept: application/json" https://ip.nettica.com
curl -H "Accept: application/xml"  https://ip.nettica.com
curl ip.nettica.com

```
## Debugging
```
npx wrangler tail ${project}
```
