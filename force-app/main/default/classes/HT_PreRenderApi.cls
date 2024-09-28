/**
* @File Name : HT_PreRenderApi.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : September 27, 2024
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | September 24, 2024 |   | Initial Version
**/

public class HT_PreRenderApi {
    
    public String baseUrl = 'https://api.prerender.io/';
    public String recacheUrl = 'recache';
    public String clearCacheUrl = 'cache-clear';
    public String sitemapUrl = 'sitemap';
    public String prerenderToken = '9yX0wd0IhdjJIuB5VYUP';
    //public String prerenderToken = '';
    HttpRequest req;
    RequestBuilder reqBody;
    
    public void performRecache() {
        List<String> urls = new List<String> ();
        //urls.add('https://csdev8sb0.help.sfdc.sh/s/articleView?id=sf.console_lex_custom_pages.htm&type=5');
        //urls.add('https://help.salesforce.com/s/articleView?language=en_US&id=sf.console_lex_custom_pages.htm&type=5');
        urls.add('https://help.salesforce.com/s/articleView?id=000385203&type=1');
        performRecache(urls);
    }
    
    public void performRecache(List<String> urls) {
        fetchbaseRequestBuilder();
        reqBody.initUrls()
            .addToUrls(urls);
        sendPreRenderRequest(recacheUrl);
    }
    
    public void clearCache(String query) {
		fetchbaseRequestBuilder();
		reqBody.query = query;
        sendPreRenderRequest(clearCacheUrl);
    }
    public List<String> fetchProductsMainUrls() {
		return new List<String> {
			'https://help.salesforce.com/apex/Help_SiteMapIndexExternal?producttype=release-notes'
		};
		/*
		return new List<String> {
			'https://help.salesforce.com/apex/Help_SiteMapIndexExternal?producttype=release-notes', 
			'https://help.salesforce.com/apex/Help_SiteMapIndexExternal?producttype=sf', 
			'https://help.salesforce.com/apex/Help_SiteMapIndexExternal?producttype=sfdo', 
			'https://help.salesforce.com/apex/Help_SiteMapIndexExternal?producttype=ind', 
			'https://help.salesforce.com/apex/Help_SiteMapIndexExternal?producttype=cc', 
			'https://help.salesforce.com/apex/Help_SiteMapIndexExternal?producttype=xcloud', 
			'https://help.salesforce.com/apex/Help_SiteMapIndexExternalKB'
		};
		*/
	}
	public void preformSiteRecache() {
		for (String productSiteIndexUrl : fetchProductsMainUrls()) {
			fetchbaseRequestBuilder();
			reqBody.recacheAll = true;
			reqBody.url = productSiteIndexUrl;
			sendPreRenderRequest(sitemapUrl);
		}
	}

    
    public HttpResponse sendPreRenderRequest(String endPoint) {
        return sendPreRenderRequest(endPoint, 'POST');
    }
    
    public HttpResponse sendPreRenderRequest(String endPoint, String method) {
        reqBody.setToken(prerenderToken);
        prepareBaseRequest(endPoint, method);
        String body = JSON.serialize(reqBody, TRUE);
        System.debug('$$$ body ' + body);
        req.setBody(body);
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('accept', '*/*');
        
        return sendRequest();
    }
    
    public void prepareBaseRequest(String endPoint, String method) {
        req = new HttpRequest();
        req.setEndpoint(baseUrl + endPoint);
        req.setMethod(method);
    }
    
    public HttpResponse sendRequest() {
        Http htp = new Http();
        return htp.send(req);
    }
    
    public void fetchbaseRequestBuilder() {
        reqBody = new RequestBuilder();
    }
    
    public class RequestBuilder {
        public String prerenderToken;
        public List<String> urls;
        public String url;
		public Boolean recacheAll;
        public String query;
        public void setToken(String prerenderToken) {
            this.prerenderToken = prerenderToken;
        }
        
        public RequestBuilder initUrls() {
            urls = new List<String>();
            return this;
        }
        /*
		public RequestBuilder addToUrls(String urlToAdd) {
		this.urls.add(urlToAdd);
		return this;
		}
		*/
        public RequestBuilder addToUrls(List<String> urlsToAdd) {
            this.urls.addAll(urlsToAdd);
            return this;
        }
    }
    
}
