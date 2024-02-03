from flask import Flask, render_template, jsonify

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import os
import matplotlib.pyplot as plt # to generate the visualizations
import math
from flask import request
import json
import boto3
from glob import glob
import re
from datetime import datetime
from time import strptime
import redis
import requests
#from flask_cors import CORS

app = Flask(__name__)

r = redis.Redis(host='192.168.56.70', port=6379, db=0)
# Send a ping request and check the response
response = r.ping()
print("Response:", response)

s3 = boto3.resource(
    service_name='s3',
    region_name='us-east-2',
    aws_access_key_id='',
    aws_secret_access_key=''
)

s3_client = boto3.client(
    service_name='s3',
    region_name='us-east-2',
    aws_access_key_id='',
    aws_secret_access_key=''
)

bucket_name = 'flight-departures'
pattern = 'output/emissions/*.json'
#prefix = 'output/emissions/'

api_url = "https://api.eia.gov/v2/co2-emissions/co2-emissions-aggregates/data/"
params = {   
    "api_key": "pGfJj7H80BEVlDAOXJgmKRn5Z53CjjVTaw9IAMAM"
    }



@app.route('/')
def index():
    return render_template('index.html')


@app.route('/sectorfuel_calculation')
def sectorfuel_calc():
    
    key="fuelemissions"
    result = r.get(key)

    if result is None:
        #result = {}
        fuel_emissions = []
        emissions_data = None
        start_flag = True
        counter=0

        headers = {
                "X-Params": json.dumps({
                    "frequency": "annual",
                    "data": ["value"],
                    "facets": {
                        "sectorId": [
                            "CC",
                            "IC",
                            "RC",
                            "TT"
                        ]
                    },
                    "start": 1970,
                    "end": 2021,
                    "sort": [{"column": "period", "direction": "desc"}],
                    "length": 5000,
                    "offset":0
                }),
                "User-Agent": "Your User Agent Here",
                "Content-Type": "application/json"
        }

        while start_flag or len(emissions_data['response']['data'])>0:
            start_flag=False
            response = requests.get(api_url, params = params, headers=headers)
            if response.status_code == 200:
                emissions_data = response.json()
                #print(emissions_data['response']['total'])
                for doc in emissions_data['response']['data']:
                    fuel_emissions.append(doc)
                counter+=5000
                headers = {
                    "X-Params": json.dumps({
                        "frequency": "annual",
                        "data": ["value"],
                        "facets": {
                            "sectorId": [
                                "CC",
                                "IC",
                                "RC",
                                "TT"
                            ]
                        },
                        "start": 1970,
                        "end": 2021,
                        "sort": [{"column": "period", "direction": "desc"}],
                        "length": 5000,
                        "offset":counter
                    }),
                    "User-Agent": "Your User Agent Here",
                    "Content-Type": "application/json"
                }
            else:
                print("Failed to retrieve data. Status code:",response.status_code)
        
        fuel_emissions_json = {'data':fuel_emissions}
        r.set(key, json.dumps(fuel_emissions_json))
    else:
        fuel_emissions_json = json.loads(result)
        fuel_emissions = fuel_emissions_json['data']

    df = pd.DataFrame(fuel_emissions)
    fueltype_emissions = df[(df["sectorId"]=="TT") & (df["stateId"]=="US") & ~(df["fuelId"]=="TO")].groupby(["period","fuel-name"])['value'].agg(total_emissions='sum').reset_index()
    fuel_barchart = pd.pivot_table(fueltype_emissions,values='total_emissions',index='period',columns='fuel-name',aggfunc='sum').reset_index()
    fuel_barchart = fuel_barchart[fuel_barchart['period'].isin([2013,2014,2015,2016,2017,2018,2019,2020,2021])]

    fuel_barchart = fuel_barchart.to_dict(orient='list')

    result = {}

    result['fuel_barchart'] = fuel_barchart

    return jsonify(result)



@app.route('/fuelemissions_calculation')
def fuelemissions_calc():
    #Computing sector and fuel emissions

    fuel_type = request.args.get('fuel_type')
    if fuel_type is None or fuel_type=="null":
        fuel_type = "TO"
    
    sector_id = request.args.get('sector_id')  
    if sector_id is None or sector_id=="null":
        sector_id = "TT"

    regions = {"US":["United States"],"CA":["California"],"NY":["New York"],"TX":["Texas"],"CAR":["North Carolina","South Carolina"],"MW":["Illinois","Indiana","Michigan","Ohio","Wisconsin","Iowa",
                    "Kansas","Minnesota","Missouri","Nebraska","North Dakota","South Dakota"],"NE":["Connecticut","Maine","Massachussets","New Hampshire","Vermont","Rhode Island"],
                    "PN":["Washington","Oregon","Alaska"],"MW":["Arizona","Colorado","Idaho","Nevada","New Mexico","Utah","Wyoming"],"SC":["Alabama","Kentucky","Mississippi",
                    "Tennessee","Arkansas","Louisiana","Oklahoma"],"SA":["Delaware","Georgia","Florida","Maryland","Virginia","West Virginia"],"MA":["New Jersey","Pennsylvania"]}

    state_id = request.args.get('state_id')
    if state_id is None or state_id=="null":
        state_id = "US"

    print(fuel_type, sector_id, state_id)
    key="fuelemissions"

    result = r.get(key)

    if result is None:
        #result = {}
        fuel_emissions = []
        emissions_data = None
        start_flag = True
        counter=0

        headers = {
                "X-Params": json.dumps({
                    "frequency": "annual",
                    "data": ["value"],
                    "facets": {
                        "sectorId": [
                            "CC",
                            "IC",
                            "RC",
                            "TT"
                        ]
                    },
                    "start": 1970,
                    "end": 2021,
                    "sort": [{"column": "period", "direction": "desc"}],
                    "length": 5000,
                    "offset":0
                }),
                "User-Agent": "Your User Agent Here",
                "Content-Type": "application/json"
        }

        while start_flag or len(emissions_data['response']['data'])>0:
            start_flag=False
            response = requests.get(api_url, params = params, headers=headers)
            if response.status_code == 200:
                emissions_data = response.json()
                #print(emissions_data['response']['total'])
                for doc in emissions_data['response']['data']:
                    fuel_emissions.append(doc)
                counter+=5000
                headers = {
                    "X-Params": json.dumps({
                        "frequency": "annual",
                        "data": ["value"],
                        "facets": {
                            "sectorId": [
                                "CC",
                                "IC",
                                "RC",
                                "TT"
                            ]
                        },
                        "start": 1970,
                        "end": 2021,
                        "sort": [{"column": "period", "direction": "desc"}],
                        "length": 5000,
                        "offset":counter
                    }),
                    "User-Agent": "Your User Agent Here",
                    "Content-Type": "application/json"
                }
            else:
                print("Failed to retrieve data. Status code:",response.status_code)
        
        fuel_emissions_json = {'data':fuel_emissions}
        r.set(key, json.dumps(fuel_emissions_json))
    else:
        fuel_emissions_json = json.loads(result)
        fuel_emissions = fuel_emissions_json['data']
    
    emissions_df = pd.DataFrame(fuel_emissions)
    regions_formatted = {"US":["United States"],"California":["California"],"New York":["New York"],"Texas":["Texas"],"Carolinas":["North Carolina","South Carolina"],"Midwest":["Illinois","Indiana","Michigan","Ohio","Wisconsin","Iowa",
                    "Kansas","Minnesota","Missouri","Nebraska","North Dakota","South Dakota"],"New England":["Connecticut","Maine","Massachussets","New Hampshire","Vermont","Rhode Island"],
                    "Pacific Northwest":["Washington","Oregon","Alaska"],"Mountain West":["Arizona","Colorado","Idaho","Nevada","New Mexico","Utah","Wyoming"],"South Central":["Alabama","Kentucky","Mississippi",
                    "Tennessee","Arkansas","Louisiana","Oklahoma"],"South Atlantic":["Delaware","Georgia","Florida","Maryland","Virginia","West Virginia","District of Columbia"],"Middle Atlantic":["New Jersey","Pennsylvania"]}

    def calc(x):
        for key in regions_formatted.keys():
            if x in regions_formatted[key]:
                return key

    emissions_df['region'] = emissions_df['state-name'].apply(lambda x: calc(x))

    #Computing sector statistics by year
    sector_statistics_raw = emissions_df[~(emissions_df["sectorId"]=="TT") & (emissions_df["region"]=="US")].groupby(['period','sector-name','fuelId'])['value'].agg(total_emissions='sum')
    sector_statistics_yearly = sector_statistics_raw.reset_index().rename(columns={"sector-name":"sector_name"})


    if fuel_type=="TO":
        df = emissions_df[(emissions_df['fuelId']=="TO") & (emissions_df['sectorId']==sector_id) & (emissions_df['state-name'].isin(regions[state_id]))].reset_index().drop(columns=["index"])
        fuel_statistics = df.groupby('period')['value'].agg(total_emissions='sum',
                                                        max_emissions='max',
                                                        avg_emissions='mean').reset_index()
        fuel_statistics = fuel_statistics.to_dict(orient='list')

        sector_statistics_formatted = sector_statistics_yearly[(sector_statistics_yearly["fuelId"]=="TO")].drop(columns=["fuelId"])
        sector_statistics_transformed = pd.pivot_table(sector_statistics_formatted,values='total_emissions',index='period',columns='sector_name',aggfunc='sum').reset_index()
        sector_statistics_transformed = sector_statistics_transformed.to_dict(orient='list')

    elif fuel_type=="CO":
        df = emissions_df[(emissions_df['fuelId']=="CO") & (emissions_df['sectorId']==sector_id) & (emissions_df['state-name'].isin(regions[state_id]))].reset_index().drop(columns=["index"])
        fuel_statistics = df.groupby('period')['value'].agg(total_emissions='sum',
                                                        max_emissions='max',
                                                        avg_emissions='mean').reset_index()
        fuel_statistics = fuel_statistics.to_dict(orient='list')
        sector_statistics_formatted = sector_statistics_yearly[(sector_statistics_yearly['fuelId']=="CO")].drop(columns=["fuelId"])
        sector_statistics_transformed = pd.pivot_table(sector_statistics_formatted,values='total_emissions',index='period',columns='sector_name',aggfunc='sum').reset_index()
        sector_statistics_transformed = sector_statistics_transformed.to_dict(orient='list')
        
    elif fuel_type=="PE":
        df = emissions_df[(emissions_df['fuelId']=="PE") & (emissions_df['sectorId']==sector_id) & (emissions_df['state-name'].isin(regions[state_id]))].reset_index().drop(columns=["index"])
        fuel_statistics = df.groupby('period')['value'].agg(total_emissions='sum',
                                                        max_emissions='max',
                                                        avg_emissions='mean').reset_index()
        fuel_statistics = fuel_statistics.to_dict(orient='list')

        sector_statistics_formatted = sector_statistics_yearly[(sector_statistics_yearly["fuelId"]=="PE")].drop(columns=["fuelId"])
        sector_statistics_transformed = pd.pivot_table(sector_statistics_formatted,values='total_emissions',index='period',columns='sector_name',aggfunc='sum').reset_index()
        sector_statistics_transformed = sector_statistics_transformed.to_dict(orient='list')
        
    elif fuel_type=="NG":
        df = emissions_df[(emissions_df['fuelId']=="NG") & (emissions_df['sectorId']==sector_id) & (emissions_df['state-name'].isin(regions[state_id]))].reset_index().drop(columns=["index"])
        fuel_statistics = df.groupby('period')['value'].agg(total_emissions='sum',
                                                        max_emissions='max',
                                                        avg_emissions='mean').reset_index()
        fuel_statistics = fuel_statistics.to_dict(orient='list')

        sector_statistics_formatted = sector_statistics_yearly[(sector_statistics_yearly["fuelId"]=="NG")].drop(columns=["fuelId"])
        sector_statistics_transformed = pd.pivot_table(sector_statistics_formatted,values='total_emissions',index='period',columns='sector_name',aggfunc='sum').reset_index()
        sector_statistics_transformed = sector_statistics_transformed.to_dict(orient='list')
    

    #Computing region statistics based on fuel type for all sectors
    region_statistics = emissions_df[(emissions_df["sectorId"]=="TT") & ~(emissions_df["region"]=="US")].groupby(['region','fuelId'])['value'].agg(total_emissions='sum').reset_index()
    region_stats_formatted = pd.pivot_table(region_statistics,values='total_emissions',index='region',columns='fuelId',aggfunc='sum').reset_index()

    region_final_stats = region_stats_formatted.to_dict(orient='list')

    #Computing sector statistics base on fuel type for entire US
    sector_statistics = emissions_df[~(emissions_df["sectorId"]=="TT") & (emissions_df["region"]=="US")].groupby(['sector-name','fuelId'])['value'].agg(total_emissions='sum').reset_index()
    sector_statistics = sector_statistics.rename(columns={"sector-name":"sector_name"})
    sector_stats_formatted = pd.pivot_table(sector_statistics,values='total_emissions',index='sector_name',columns='fuelId',aggfunc='sum').reset_index()

    sector_final_stats = sector_stats_formatted.to_dict(orient='list')

    result = {}

    result['yearly_statistics'] = fuel_statistics
    result['region_statistics'] = region_final_stats
    result['sector_statistics'] = sector_final_stats
    result['sector_statistics_yearly'] = sector_statistics_transformed


    return jsonify(result)


@app.route('/data')
def get_data():
    # Return data as JSON
    #data = {'labels': ['A', 'B', 'C'], 'values': [10, 20, 30]}
    datestmp=datetime.utcnow().strftime('%Y-%m-%d')
    year = int(datetime.utcnow().strftime('%Y-%m-%d').split('-')[0])
    month = int(datetime.utcnow().strftime('%Y-%m-%d').split('-')[1])
    day = int(datetime.utcnow().strftime('%Y-%m-%d').split('-')[2])
    
    date_time = datetime(year, month, day, 0, 0, 0)
    
    utc_today = int(date_time.timestamp())

    result = r.get(utc_today)

    if result is None:
        flight_emissions_df = pd.DataFrame(columns=['timestamp','date','month','departureAirportName','departureAirportCountry',
                                            'arrivalAirportName','arrivalAirportCountry','distanceBetweenAirports',
                                            'CO2Emissions'])
        for obj in s3.Bucket('flight-departures').objects.filter(Prefix="output/emissions/"):
            prefix = obj.key
            #print(prefix)
            pattern = r'_([0-9]+)\.json$'
            match = re.search(pattern, prefix)
            try:
                timestamp = int(match.group(1))
                response = s3_client.get_object(Bucket=bucket_name, Key=prefix)
                date = datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d')
                month = datetime.utcfromtimestamp(timestamp).strftime('%b')
                week = datetime.utcfromtimestamp(timestamp).strftime('%U')
                obj_content = response['Body'].read().decode('utf-8')
                emissions = json.loads(obj_content)
                #obj_name = 'emissions_'+date
                emissions_df = pd.DataFrame.from_dict(emissions)
                emissions_df['timestamp'] = timestamp
                emissions_df['date'] = date
                emissions_df['month'] = month
                emissions_df['week'] = week
                #print(emissions_df)
                
                flight_emissions_df = pd.concat([flight_emissions_df,emissions_df],ignore_index=True)
                #print(flight_emissions_df)
            except:
                continue
        


        monthly_statistics = flight_emissions_df.groupby('month')['CO2Emissions'].agg(total_emissions='sum',
                                                                                max_emissions='max',
                                                                                min_emissions='min',
                                                                                avg_emissions='mean').reset_index()

        monthly_statistics['avg_emissions'] = round(monthly_statistics['avg_emissions'],2)
        monthly_statistics['month_no'] = monthly_statistics['month'].apply(lambda x: strptime(x,'%b').tm_mon)

        #Converting CO2 emissions to metric tonnes
        monthly_statistics['total_emissions'] = round(monthly_statistics['total_emissions'].apply(lambda x: x/1000),2)
        monthly_statistics['avg_emissions'] = round(monthly_statistics['avg_emissions'].apply(lambda x: x/1000),2)
        monthly_statistics['max_emissions'] = round(monthly_statistics['max_emissions'].apply(lambda x: x/1000),2)

        monthly_statistics = monthly_statistics.sort_values(by='month_no')
        monthly_statistics = monthly_statistics.to_dict(orient='list')

        # Computing weekly statistics
        weekly_statistics = flight_emissions_df.groupby('week')['CO2Emissions'].agg(total_emissions='sum',
                                                                                max_emissions='max',
                                                                                avg_emissions='mean').reset_index()

        weekly_statistics['total_emissions'] = round(weekly_statistics['total_emissions'].apply(lambda x: x/1000),2)
        weekly_statistics['max_emissions'] = round(weekly_statistics['max_emissions'].apply(lambda x: x/1000),2)
        weekly_statistics['avg_emissions'] = round(weekly_statistics['avg_emissions'].apply(lambda x: x/1000),2)

        weekly_statistics = weekly_statistics.to_dict(orient='list')

        # Computing Airport Statistics

        airport_statistics = flight_emissions_df.groupby(['month','departureAirportName'])['CO2Emissions'].agg(total_emissions='sum').reset_index()
        month_order = ['May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov']
        airport_statistics['month'] = pd.Categorical(airport_statistics['month'], categories=month_order, ordered=True)
        airport_stats_pivot = pd.pivot_table(airport_statistics, values = 'total_emissions',
                                        index='departureAirportName',columns='month',aggfunc='sum')
        airport_stats_pivot = airport_stats_pivot.reindex(columns=month_order)
        airport_stats_pivot = airport_stats_pivot.reset_index()

        airport_formatted_stats = airport_stats_pivot[airport_stats_pivot['departureAirportName'].isin(["Los Angeles International Airport","John F Kennedy International Airport",
                                                    "Chicago O'Hare International Airport","San Francisco International Airport",
                                                    "Hartsfield Jackson Atlanta International Airport",
                                                    "Dallas Fort Worth International Airport",
                                                    "Seattle Tacoma International Airport"])]

        airport_final_stats = airport_formatted_stats.to_dict(orient='list')

        # Computing Airport emissions percentage
        airport_emission_stats = flight_emissions_df.groupby(['departureAirportName'])['CO2Emissions'].agg(total_emissions='sum').sort_values(by="total_emissions",ascending=False).reset_index()
        airport_emission_stats['total_emissions'] = round(airport_emission_stats['total_emissions'], 2)
        year_total_emissions = airport_emission_stats['total_emissions'].agg('sum')
        airport_emission_stats['emissions_percentage'] = round((airport_emission_stats['total_emissions']/year_total_emissions)*100, 2)

        sliced_airport_stats = airport_emission_stats[0:9]
        sliced_total_emissions = sliced_airport_stats['total_emissions'].agg('sum')
        sliced_total_percentage = sliced_airport_stats['emissions_percentage'].agg('sum')

        sliced_airport_stats = pd.concat([sliced_airport_stats, pd.DataFrame([{'departureAirportName':'Other',
                             'total_emissions': round((year_total_emissions - sliced_total_emissions),2),
                             'emissions_percentage': round((100 - (sliced_total_percentage)),2)}])
                             ], ignore_index=True)

        sliced_airport_stats = sliced_airport_stats.to_dict(orient='list')

        #Comparing airport emissions on line chart
        airport_comparison_stats = airport_statistics[airport_statistics['departureAirportName'].isin(["Los Angeles International Airport","John F Kennedy International Airport",
                                                    "Chicago O'Hare International Airport"])]
        airport_comparison_pivot = pd.pivot_table(airport_comparison_stats, values = 'total_emissions',
                                        index='month',columns='departureAirportName',aggfunc='sum')
        airport_comparison_pivot = airport_comparison_pivot.reset_index()
        airport_comparison_stats = airport_comparison_pivot.to_dict(orient='list')


        #Computing total emissions and departures
        total_yearly_emissions = flight_emissions_df['CO2Emissions'].agg("sum")
        total_yearly_emissions = round(total_yearly_emissions/1000000000,2)
        emissions_dict = {"emissions":str(total_yearly_emissions)}

        monthly_departures = flight_emissions_df.groupby('month')['departureAirportName'].agg(count_departures='count').reset_index()
        monthly_departures['month_no'] = monthly_departures['month'].apply(lambda x: strptime(x,'%b').tm_mon)
        monthly_departures = monthly_departures.sort_values(by='month_no').reset_index(drop=True)
        total_departures = monthly_departures['count_departures'].agg("sum")
        departures_dict = {"departures":str(total_departures)}

        #Computing distance statistics
        distance_statistics = flight_emissions_df.groupby('month')['distanceBetweenAirports'].agg(total_distance='sum').reset_index()

        distance_statistics['total_distance'] = round(distance_statistics['total_distance'],2)
        distance_statistics['month_no'] = distance_statistics['month'].apply(lambda x: strptime(x,'%b').tm_mon)
        distance_statistics = distance_statistics.sort_values(by='month_no')
        distance_statistics = distance_statistics.to_dict(orient='list')

        result = {}
        result['monthly_statistics'] = monthly_statistics
        result['airport_statistics'] = airport_final_stats
        result['weekly_statistics'] = weekly_statistics
        result['total_yearly_emissions'] = emissions_dict
        result['total_departures'] = departures_dict
        result['airport_emissions_percent'] = sliced_airport_stats
        result['airport_comparison_stats'] = airport_comparison_stats
        result['distance_statistics'] = distance_statistics

        r.set(utc_today, json.dumps(result))

    else:
        result = json.loads(result)

    print(result)
    return jsonify(result)

@app.route('/charts')
def charts():
    return render_template('charts-chartjs.html')

@app.route('/fuelemissions')
def fuelemissions():
    return render_template('sector-fuel.html')


if __name__ == "__main__":
    app.run(debug=True)