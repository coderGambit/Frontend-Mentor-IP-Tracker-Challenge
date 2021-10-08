package com.example.ipaddresstracker.ipaddress;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class IpAddressController{

	String API_KEY = "at_nzakoX4zoRJs9atEiB51iKqZst93P";
	String BASE_URL = "https://geo.ipify.org/api/v1?";

	@RequestMapping("/locate/defaultIP")
	public String getDefaultIPAddress(){

		URL urlToQuery;
		HttpURLConnection connection = null;
		JSONObject response = null;
		StringBuilder builder = new StringBuilder();

		try{
			urlToQuery  = new URL(BASE_URL + "&apiKey=" + API_KEY);
			connection = (HttpURLConnection) urlToQuery.openConnection();
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
		return builder.toString();
	}

	@RequestMapping("/locate/ipAddress/{ip}")
	public String getIPAddressInfo(@PathVariable String ip){
		return "ip info";
	}

	@RequestMapping("/locate/domain/{domainName}")
	public String getIPAddressInfoFromDomainName(@PathVariable String domainName){
		return "domain info";
	}
}
