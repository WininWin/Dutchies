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
import argparse
import base64
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
    

    parser = argparse.ArgumentParser(description="fill the remote database with the specified number of users and products")
    parser.add_argument('-u', '--url', action='store', dest='url', help='the ip address of the server', default='localhost')
    parser.add_argument('-p', '--port', action='store', dest='port', help='the port on the server', default='3000')
    parser.add_argument('-n', '--users', action='store', dest='users', help='specify the number of users to fill the database with', type=int, default=20)
    parser.add_argument('-r', '--products', action='store', dest='products', help='specify the number of users to fill the database with', type=int, default=200)

    args = parser.parse_args()


    # Server Base URL and port
    baseurl = args.url
    port = args.port

    # Number of POSTs that will be made to the server
    userCount = args.users
    productCount = args.products

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


    products = ["Flavouring- Raspberry","Wine - Rioja Campo Viejo","Cookies - Englishbay Chochip","Appetizer - Assorted Box","Food Colouring - Pink","Chef Hat 20cm","Cheese - Mozzarella, Shredded","Sugar - Brown, Individual","Dome Lid Clear P92008h","Wine - Red, Gallo, Merlot","Bread - Sour Batard","Salami - Genova","Wasabi Paste","Pepper - Green","Lidsoupcont Rp12dn","Wine - Cabernet Sauvignon","Kaffir Lime Leaves","Coconut - Shredded, Sweet","Fish - Soup Base, Bouillon","Muffins - Assorted","Chocolate - Dark Callets","Crab - Back Fin Meat, Canned","Soup - Campbells Tomato Ravioli","Sauce - Demi Glace","Figs","Flax Seed","Sorrel - Fresh","Pear - Asian","Wine - Guy Sage Touraine","Flour - Fast / Rapid","Table Cloth 54x72 Colour","Island Oasis - Cappucino Mix","Oil - Canola","Assorted Desserts","Peach - Fresh","Pie Shell - 5","Sugar - Fine","Juice - Apple 284ml","Ecolab - Lime - A - Way 4/4 L","Bread - Mini Hamburger Bun","Wine - Ej Gallo Sonoma","Potatoes - Mini White 3 Oz","Gatorade - Orange","Wine - Sicilia Igt Nero Avola","Bagel - Whole White Sesame","Tomatoes - Hot House","Trout - Hot Smkd, Dbl Fillet","Puree - Mocha","Pepper - Black, Crushed","Wine - Red, Pinot Noir, Chateau","Sauce - Apple, Unsweetened","Wine - Dubouef Macon - Villages","Sobe - Lizard Fuel","Cookies Cereal Nut","Grenadillo","Soup - Campbells - Chicken Noodle","Cake - Box Window 10x10x2.5","Oregano - Fresh","Pork - Caul Fat","Scampi Tail","Tea - Apple Green Tea","Lotus Root","Wine - Fontanafredda Barolo","Bread - Rye","Milk - Skim","Nescafe - Frothy French Vanilla","Monkfish - Fresh","Corn - On The Cob","Beef - Short Ribs","Pork - Bacon, Sliced","Dill Weed - Dry","Egg Patty Fried","Numi - Assorted Teas","Kohlrabi - Giant, Organic","Veal - Insides Provini","Yogurt - Banana, 175 Gr","Shrimp - Baby, Warm Water","Tamarillo","Energy Drink Bawls","Pork Salted Bellies","Pop Shoppe Cream Soda","Veal - Chops, Split, Frenched","Wine - White, Pelee Island","Scrubbie - Scotchbrite Hand Pad","Lychee","Chinese Foods - Plain Fried Rice","Artichoke - Fresh","Remy Red Berry Infusion","Beer - Upper Canada Lager","Ecolab - Solid Fusion","Clam Nectar","Wine - Barbera Alba Doc 2001","Mangoes","Anchovy Fillets","Placemat - Scallop, White","Cheese - Augre Des Champs","Ostrich - Fan Fillet","Onions Granulated","Carbonated Water - Blackberry","Strawberries - California","Beef - Roasted, Cooked","Sword Pick Asst","Oyster - In Shell","Apple - Royal Gala","Asparagus - White, Fresh","Salmon - Smoked, Sliced","Placemat - Scallop, White","Cookies - Englishbay Wht","Quiche Assorted","Mousse - Banana Chocolate","Beer - Corona","Apple - Northern Spy","Soup - Campbells Asian Noodle","White Fish - Filets","Dasheen","Mustard - Seed","Sauce - Apple, Unsweetened","C - Plus, Orange","Rice - Sushi","Mcgillicuddy Vanilla Schnap","Stock - Beef, Brown","Shrimp - Black Tiger 8 - 12","Wine - Red, Antinori Santa","Dill - Primerba, Paste","Spring Roll Veg Mini","Tomato - Plum With Basil","Lemons","Pastry - Apple Large","Cod - Salted, Boneless","Nantucket - Orange Mango Cktl","Capicola - Hot","Aspic - Clear","Sauerkraut","Muffin Orange Individual","Steam Pan Full Lid","Pants Custom Dry Clean","Red Snapper - Fillet, Skin On","Smirnoff Green Apple Twist","Potatoes - Pei 10 Oz","Clams - Littleneck, Whole","Venison - Denver Leg Boneless","Pasta - Angel Hair","Soup - Campbells, Butternut","Squid U5 - Thailand","Cheese - Cheddar, Medium","Tequila - Sauza Silver","Mushroom - King Eryingii","Beer - Upper Canada Lager","Eggplant - Regular","Wine - Wyndham Estate Bin 777","Pasta - Fett Alfredo, Single Serve","Ecolab - Power Fusion","Syrup - Pancake","Artichoke - Bottom, Canned","Chips Potato Reg 43g","Beef - Tenderloin - Aa","Soup - Campbellschix Stew","Cape Capensis - Fillet","Corn Shoots","Croissants Thaw And Serve","Cake - Cake Sheet Macaroon","Stock - Veal, Brown","Swiss Chard - Red","Wine - Red, Mouton Cadet","Wine - Sawmill Creek Autumn","Lettuce - Mini Greens, Whole","Crackers - Melba Toast","Sugar - Crumb","Wine - Vineland Estate Semi - Dry","Bread - Ciabatta Buns","Duck - Legs","Canadian Emmenthal","Tia Maria","Octopus - Baby, Cleaned","Longos - Cheese Tortellini","Vinegar - White","Food Colouring - Pink","Cake Sheet Combo Party Pack","Muffin Mix - Carrot","Bread Roll Foccacia","Nantucket Apple Juice","Table Cloth 54x72 Colour","Soup - Campbells Chili Veg","Pastry - Plain Baked Croissant","Pepper - Red Thai","Pork - Shoulder","Table Cloth 144x90 White","Salt - Table","Beef - Rib Roast, Capless","Potatoes - Fingerling 4 Oz","Trout - Rainbow, Fresh","Bag - Regular Kraft 20 Lb","Coffee - Hazelnut Cream","Mangoes","Pomello","Soup - Campbells - Chicken Noodle","Wine - Shiraz Wolf Blass Premium","Gatorade - Orange","Soup - Campbells, Cream Of","Beef - Salted"]
    categories = ["Automotive & Powersports","Baby Products (Excluding Apparel)","Beauty","Books","Camera & Photo","Cell Phones","Clothing & Accessories","Collectible Coins","Collectibles (Books)","Collectibles (Entertainment)","Electronics (Accessories)","Electronics (Consumer)","Fine Art","Grocery & Gourmet Food","Handmade","Health & Personal Care","Historical & Advertising Collectibles","Home & Garden","Industrial & Scientific","Jewelry","Luggage & Travel Accessories","Music","Musical Instruments","Office Products","Outdoors","Personal Computers","Shoes, Handbags & Sunglasses","Software & Computer Games","Sports","Sports Collectibles","Tools & Home Improvement","Toys & Games","Video, DVD & Blu-Ray","Video Games & Video Game Consoles","Watches","Wine"]
    # print Seller_Product_Dic
    # Loop 'productCount' number of times
    for i in xrange(productCount):

        # Randomly generate product parameters
        sold = (True if randint(0,10) > 4 else False)
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
        numUsersWatching = 0 if sold else randint(0,userCount/4)
        usersWatching = sample(userIDs,numUsersWatching)

        description = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
        product = choice(products)
        try:
            with open("images/"+product + ".jpg", "rb") as image_file:
                image = "data:image/jpeg;base64," + base64.b64encode(image_file.read())
        except:
            image = ""

        params = urllib.urlencode({'name': product, 'img': image, 'description': description, 'category': choice(categories), 'reservePrice': price,'currentPrice': price + 100,'startPrice': price + 100, 'sold': 'true' if sold else 'false', 'sellerUser': sellerUser, 'sellerUserName': sellerUserName, 'sellerUserEmail': sellerUserEmail, 'dateSold': dateSold, 'soldToUser': soldToUser, 'soldToUserName': soldToUserName, 'soldToUserEmail': soldToUserEmail, 'usersWatching': usersWatching}, True)

        # POST the product
        conn.request("POST", "/api/products", params, headers)
        response = conn.getresponse()
        data = response.read()
        print product
        try:
            d = json.loads(data)
        except:
            print data

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