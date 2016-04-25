#!/usr/bin/env python

"""
 * @file dbFill.py
 * Used in CS498RK FP to populate database with randomly generated users and products.
 *
 * @date Created: Spring 2015
 * @date Modified: Spring 2015
"""

import sys
import getopt
import httplib
import urllib
import json
from random import randint
from random import choice
from random import sample
from datetime import date
from datetime import datetime
from time import mktime

def usage():
    print 'dbFill.py -u <baseurl> -p <port> -n <numUsers> -r <numProducts>'

def getUsers(conn):
    # Retrieve the list of users
    conn.request("GET","""/api/users?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)

    # Array of user IDs
    users = [str(d['data'][x]['_id']) for x in xrange(len(d['data']))]

    return users

def main(argv):
    Seller_Product_Dic =  {}
    SoldTo_Product_Dic =  {}
    Watching_Product_Dic =  {}
    # Server Base URL and port
    baseurl = "localhost"
    port = 3000

    # Number of POSTs that will be made to the server
    userCount = 10
    productCount = 50

    try:
        opts, args = getopt.getopt(argv,"hu:p:n:t:",["url=","port=","users=","products="])
    except getopt.GetoptError:
        usage()
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
             usage()
             sys.exit()
        elif opt in ("-u", "--url"):
             baseurl = str(arg)
        elif opt in ("-p", "--port"):
             port = int(arg)
        elif opt in ("-n", "--users"):
             userCount = int(arg)
        elif opt in ("-r", "--products"):
             productCount = int(arg)

    # Python array containing common first names and last names
    firstNames = ["james","john","robert","michael","william","david","richard","charles","joseph","thomas","christopher","daniel","paul","mark","donald","george","kenneth","steven","edward","brian","ronald","anthony","kevin","jason","matthew","gary","timothy","jose","larry","jeffrey","frank","scott","eric","stephen","andrew","raymond","gregory","joshua","jerry","dennis","walter","patrick","peter","harold","douglas","henry","carl","arthur","ryan","roger","joe","juan","jack","albert","jonathan","justin","terry","gerald","keith","samuel","willie","ralph","lawrence","nicholas","roy","benjamin","bruce","brandon","adam","harry","fred","wayne","billy","steve","louis","jeremy","aaron","randy","howard","eugene","carlos","russell","bobby","victor","martin","ernest","phillip","todd","jesse","craig","alan","shawn","clarence","sean","philip","chris","johnny","earl","jimmy","antonio","danny","bryan","tony","luis","mike","stanley","leonard","nathan","dale","manuel","rodney","curtis","norman","allen","marvin","vincent","glenn","jeffery","travis","jeff","chad","jacob","lee","melvin","alfred","kyle","francis","bradley","jesus","herbert","frederick","ray","joel","edwin","don","eddie","ricky","troy","randall","barry","alexander","bernard","mario","leroy","francisco","marcus","micheal","theodore","clifford","miguel","oscar","jay","jim","tom","calvin","alex","jon","ronnie","bill","lloyd","tommy","leon","derek","warren","darrell","jerome","floyd","leo","alvin","tim","wesley","gordon","dean","greg","jorge","dustin","pedro","derrick","dan","lewis","zachary","corey","herman","maurice","vernon","roberto","clyde","glen","hector","shane","ricardo","sam","rick","lester","brent","ramon","charlie","tyler","gilbert","gene"]
    lastNames = ["smith","johnson","williams","jones","brown","davis","miller","wilson","moore","taylor","anderson","thomas","jackson","white","harris","martin","thompson","garcia","martinez","robinson","clark","rodriguez","lewis","lee","walker","hall","allen","young","hernandez","king","wright","lopez","hill","scott","green","adams","baker","gonzalez","nelson","carter","mitchell","perez","roberts","turner","phillips","campbell","parker","evans","edwards","collins","stewart","sanchez","morris","rogers","reed","cook","morgan","bell","murphy","bailey","rivera","cooper","richardson","cox","howard","ward","torres","peterson","gray","ramirez","james","watson","brooks","kelly","sanders","price","bennett","wood","barnes","ross","henderson","coleman","jenkins","perry","powell","long","patterson","hughes","flores","washington","butler","simmons","foster","gonzales","bryant","alexander","russell","griffin","diaz","hayes"]
    states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", 
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    cities = ["North Lawrence","Conception Junction","Gardena","Fairford","Hudson","Zebulon","McKinley Heights","Cheviot","Chauvin","Rustburg","Kukuihaele","Salvisa","Winterstown","Verde Village","Gresham Park","Alamillo","Rozel","Venersborg","Prinsburg","Monett","Casselman","Green Springs","Shark River Hills","Tower Lakes","Friendswood","Schofield","Goldendale","West Union","Warrensburg","Mount Calm","Black Jack","Abilene","Wolcottville","Funkley","Brogan","Estill","Woodlands","Terlton","West Peoria","Davis Junction","Wheat Ridge","Rolette","Escudilla Bonita","Challis","Marblehead","Pismo Beach","Papillion","Clark Mills","Peterson","Orwigsburg"]
 

    # Server to connect to (1: url, 2: port number)
    conn = httplib.HTTPConnection(baseurl, port)

    # HTTP Headers
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}

    # Array of user IDs
    userIDs = []
    userNames = []
    userEmails = []

    # Loop 'userCount' number of times
    for i in xrange(userCount):


        # Pick a random first name and last name
        x = randint(0,99)
        y = randint(0,99)


        cardnum = "4"+str(randint(0,999999999999999))
        expdate = str(randint(1,12))+"/"+str(randint(2016,2035))
        holdername = firstNames[x]+lastNames[y]

        z = randint(0,99)
        statesidx = randint(0,50)

        adds = str(randint(000,999)) + ' ' +  lastNames[z] + ' Street'
        zipcode = str(randint(00000,99999))

        phone = str(randint(0000000000,9999999999))


        params = urllib.urlencode({'name': firstNames[x].capitalize() + ' ' + lastNames[y].capitalize(), 'password': '$2a$08$IHT/ZGctDuBr03Fq1eRbf.9rN6tJCuwgFdT7RFJflmedHaS51q5SC', 'email': firstNames[x] + "@" + lastNames[y] + ".com", 
            'mobilePhone':phone, 'card.number':cardnum,'card.holderName':firstNames[x].capitalize()+ " " + lastNames[y].capitalize(),'card.ExpireDate':expdate,
            'address.streetAddress':adds, 'address.city': choice(cities), 'address.state':states[statesidx],'address.zipcode':zipcode})
        
        # POST the user
        conn.request("POST", "/api/users", params, headers)
        response = conn.getresponse()
        data = response.read()
       #print data
        d = json.loads(data)

        # Store the users id
        userIDs.append(str(d['data']['_id']))
        userNames.append(str(d['data']['name']))
        userEmails.append(str(d['data']['email']))
        Seller_Product_Dic[str(d['data']['_id'])] = []
        SoldTo_Product_Dic[str(d['data']['_id'])] = []
        Watching_Product_Dic[str(d['data']['_id'])] = []


    products = ["feminine","Lithium Carbonate","Torsemide","Dust, House Mixture","ULTRA HYDRA TONER","Senna","PHENDIMETRAZINE TARTRATE","Gold","NIGHTTIME TEETHING","Anacin","Prevail-FX One Step","Shaving Factory","Glimepiride","AVAR LS","Levetiracetam","Anastrozole","Metoprolol Tartrate","PrameGel","Fentanyl","Tan Expert Finish Makeup Makeup Broad Spectrum SPF 25","Colgate Optic White Dual Action Crystal Mint","Pravastatin Sodium","Stem Cell Wrinkle Serum","Fibromyalgia Relief","Treatment Set TS331634","Oxycodone Hydrochloride","Ferric Subsulfate","LEVORPHANOL TARTRATE","Oxygen","Motion sickness","CVS Nighttime Cold/Flu Relief","Crest Pro-Health","AHC Revitalizing Special Gen Solution","Diphenoxylate Hydrochloride and Atropine Sulfate","Topiramate","BLACK WALNUT POLLEN","Labetalol hydrochloride","Old Spice Red Zone Sweat Defense","Hydralazine Hydrochloride","Sertraline Hydrochloride","Mucor","GRAIN SORGHUM POLLEN","POPULUS DELTOIDES POLLEN","Oil-Free Foaming Acne Wash Facial Cleanser","Losartan Potassium","Ritussin Expectorant","GMC Medical","Torsemide","Jute","Milk of Magnesia Mint","NARS PURE RADIANT TINTED MOISTURIZER","Stratuscare Antacid and Antigas Regular Strength","Bupropion Hydrochloride","equate Fiber Therapy Smooth Texture Orange Flavor","Quetiapine Fumarate","Ofloxacin","NEXT CHOICE","Bromocriptine mesylate","Therapytion Nokmosu Neutral and oily Hair","etomidate","EPIVIR","Nifedipine","Pioglitazone","Cetirizine Hydrochloride","Amoxicillin","levocetirizine dihydrochloride","Sodium Citrate and Citric Acid","care one pain relief","PULMICORT RESPULES","acid reducer","Naproxen","Penicillin V Potassium","EMINENCE Red Currant Protective Moisturizer","Anti-Bacterial Hand","Tangerine","Trifluoperazine Hydrochloride","Trandolapril","Diclofenac Potassium","Neova DNA Damage Control - Everyday","Mustard Pollen","Immediate Comfort","ibuprofen","Family Wellness","Cold Sores and Herpes","Propranolol Hydrochloride","INFANTS GAS AND COLIC RELIEF","Phenazopyridine HCl","Lorazepam","Aurum Prunus","Berkley and Jensen Naproxen Sodium","Zyprexa","Lotensin","acid reducer complete","Triple Antibiotic Ointment","Non-Drowsy Sinus Congestion and Pain Relief","QUERCUS ALBA POLLEN","Kitchen Citrus","Nitroglycerin Transdermal Delivery System","SACCHAROMYCES CEREVISIAE","In-7-One"]
    categories = ["Automotive & Powersports","Baby Products (Excluding Apparel)","Beauty","Books","Camera & Photo","Cell Phones","Clothing & Accessories","Collectible Coins","Collectibles (Books)","Collectibles (Entertainment)","Electronics (Accessories)","Electronics (Consumer)","Fine Art","Grocery & Gourmet Food","Handmade","Health & Personal Care","Historical & Advertising Collectibles","Home & Garden","Industrial & Scientific","Jewelry","Luggage & Travel Accessories","Music","Musical Instruments","Office Products","Outdoors","Personal Computers","Shoes, Handbags & Sunglasses","Software & Computer Games","Sports","Sports Collectibles","Tools & Home Improvement","Toys & Games","Video, DVD & Blu-Ray","Video Games & Video Game Consoles","Watches","Wine"]
    # print Seller_Product_Dic
    # Loop 'productCount' number of times
    for i in xrange(productCount):

        # Randomly generate product parameters
        sold = (randint(0,10) > 4)
        soldToUserIndex = randint(0,len(userIDs)-1) if sold else ''
        soldToUser = userIDs[soldToUserIndex] if sold else ''
        soldToUserName = userNames[soldToUserIndex] if sold else ''
        soldToUserEmail = userEmails[soldToUserIndex] if sold else ''

        # make a random sell date
        dateSold = datetime(randint(2010,2015), randint(1,12), randint(1,28))
        
        sellerUserIndex = randint(0,len(userIDs)-1)
        sellerUser = userIDs[sellerUserIndex]
        sellerUserName = userNames[sellerUserIndex]
        sellerUserEmail = userEmails[sellerUserIndex]
        
        price = randint(50,200)

        # users watching
        # choose a number of users who will be watching
        numUsersWatching = randint(0,userCount/2)
        usersWatching = sample(userIDs,numUsersWatching)
        shipping = randint(0,99)
        description = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
        
        params = urllib.urlencode({'name': choice(products), 'description': description, 'category': choice(categories), 'reservePrice': price,'currentPrice': price + 100, 'sold': sold, 'sellerUser': sellerUser, 'sellerUserName': sellerUserName, 'sellerUserEmail': sellerUserEmail, 'dateSold': dateSold, 'soldToUser': soldToUser, 'soldToUserName': soldToUserName, 'soldToUserEmail': soldToUserEmail, 'usersWatching': usersWatching, 'shipping':str(shipping)}, True)

        # POST the product
        conn.request("POST", "/api/products", params, headers)
        response = conn.getresponse()
        data = response.read()
        d = json.loads(data)

        productID = str(d['data']['_id'])
        Seller_Product_Dic[sellerUser].append(productID)
        for watcherID in usersWatching:
            Watching_Product_Dic[watcherID].append(productID)
        if sold:
            SoldTo_Product_Dic[soldToUser].append(productID)

        
    for key in Seller_Product_Dic:
        
        productlist = Seller_Product_Dic[key]
        if (len(productlist)!=0):
            putDict = {'productsSelling': [str(x).replace('[','').replace(']','').replace("'",'').replace('"','') for x in productlist]}
            params = urllib.urlencode(putDict,True)
            conn.request("PUT", "/api/users/"+key, params, headers)
            response = conn.getresponse()
            data = response.read()
            d = json.loads(data)

    for key in SoldTo_Product_Dic:
        
        productlist = SoldTo_Product_Dic[key]
        if (len(productlist)!=0):
            putDict = {'productsBought': [str(x).replace('[','').replace(']','').replace("'",'').replace('"','') for x in productlist]}
            params = urllib.urlencode(putDict,True)
            conn.request("PUT", "/api/users/"+key, params, headers)
            response = conn.getresponse()
            data = response.read()
            d = json.loads(data)

    for key in Watching_Product_Dic:
        
        productlist = Watching_Product_Dic[key]
        if (len(productlist)!=0):
            putDict = {'productsWatching': [str(x).replace('[','').replace(']','').replace("'",'').replace('"','') for x in productlist]}
            params = urllib.urlencode(putDict,True)
            conn.request("PUT", "/api/users/"+key, params, headers)
            response = conn.getresponse()
            data = response.read()
            d = json.loads(data)

    # Exit gracefully
    conn.close()
    print str(userCount)+" users and "+str(productCount)+" products added at "+baseurl+":"+str(port)
    # print Seller_Product_Dic

if __name__ == "__main__":
     main(sys.argv[1:])