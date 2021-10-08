package com.example.ipaddresstracker.ipaddress;


import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;


@RestController
public class IpAddressController{

	static final String API_KEY = "at_nzakoX4zoRJs9atEiB51iKqZst93P";
	static final String BASE_URL = "https://geo.ipify.org/api/v1?";
	static final String REQUIRED_URL = BASE_URL + "&apiKey=" + API_KEY;

	@RequestMapping("/locate/defaultIP")
	public String getDefaultIPAddress(){

		StringBuilder builder = new StringBuilder();
		URL urlToQuery = getUrl(null, null);

		if(urlToQuery != null)
			makeHttpRequest(builder, urlToQuery);

		return builder.toString();
	}

	@RequestMapping("/locate/ipAddress/{ip}")
	public String getIPAddressInfo(@PathVariable String ip){

		StringBuilder builder = new StringBuilder();
		String param = "&ipAddress";
		URL urlToQuery = getUrl(ip, param);

		if(urlToQuery != null)
			makeHttpRequest(builder, urlToQuery);

		return builder.toString();
	}

	@RequestMapping("/locate/domain/{domainName}")
	public String getIPAddressInfoFromDomainName(@PathVariable String domainName){

		StringBuilder builder = new StringBuilder();
		String param = "&domain";
		URL urlToQuery = getUrl(domainName, param);

		if(urlToQuery != null)
			makeHttpRequest(builder, urlToQuery);

		return builder.toString();
	}

	private URL getUrl(String value, String param){

		URL urlToQuery = null;
		try{
			if(param == null)
				urlToQuery = new URL(REQUIRED_URL);
			else
				urlToQuery = new URL(REQUIRED_URL + param + "=" + value);
		}
		catch(MalformedURLException e){
			e.printStackTrace();
		}
		return urlToQuery;
	}

	private void makeHttpRequest(StringBuilder builder, URL urlToQuery){

		HttpURLConnection connection = null;

		try{
			connection = (HttpURLConnection)urlToQuery.openConnection();
			connection.setRequestMethod("GET");
			connection.setRequestProperty("Accept", "application/json");
			connection.connect();

			if(connection.getResponseCode() == 200
					|| connection.getResponseCode() == 201){

				BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
				String line;
				while((line = bufferedReader.readLine()) != null){
					builder.append(line);
				}
				bufferedReader.close();
			}
		}
		catch(IOException e){
			e.printStackTrace();
		}
		finally{
			if(connection != null)
				connection.disconnect();
		}
	}
}