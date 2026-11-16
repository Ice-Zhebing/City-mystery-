/* Curated public venue information. Checked 26 October 2026.
   Coordinates are approximate; no live ratings or opening hours are claimed. */
window.CITY_DATA = [
  {
    id: 'edinburgh', name: 'Edinburgh', country: 'Scotland', image: 'assets/edinburgh.jpg',
    strapline: 'Old streets. New stories.', description: 'Castle views, curious corners and a little Scottish character.',
    sights: [
      {id:'castle',name:'Edinburgh Castle',address:'Castlehill, Edinburgh EH1 2NG',lat:55.9486,lng:-3.1999,description:'A fortress above the city, with centuries of stories to tell.',icon:'castle',website:'https://www.historicenvironment.scot/visit/all/edinburgh-castle/'},
      {id:'museum',name:'National Museum of Scotland',address:'Chambers Street, Edinburgh EH1 1JF',lat:55.9469,lng:-3.1906,description:'Scotland’s stories, science and surprising objects under one roof.',icon:'museum',website:'https://www.nms.ac.uk/national-museum-of-scotland'},
      {id:'calton',name:'Calton Hill',address:'Calton Hill, Edinburgh EH7 5AA',lat:55.9547,lng:-3.1833,description:'A short climb to monuments, open skies and a capital view.',icon:'hill',website:'https://www.edinburghoutdoors.org.uk/directory-record/19/calton-hill'},
      {id:'holyrood',name:'Palace of Holyroodhouse',address:'Canongate, Edinburgh EH8 8DX',lat:55.9527,lng:-3.1723,description:'A royal landmark waiting at the end of the Royal Mile.',icon:'castle',website:'https://www.rct.uk/visit/palace-of-holyroodhouse'},
      {id:'stgiles',name:'St Giles’ Cathedral',address:'High Street, Edinburgh EH1 1RE',lat:55.9494,lng:-3.1909,description:'Look up: a distinctive crown watches over the Old Town.',icon:'church',website:'https://www.stgilescathedral.org.uk/'},
      {"id": "royalmile", "name": "Royal Mile", "address": "High Street, Edinburgh EH1 1RE", "lat": 55.95056, "lng": -3.18556, "description": "Follow the Old Town’s historic spine past closes and stone tenements.", "website": "https://edinburgh.org/neighbourhoods/old-town/", "icon": "pin"},
      {"id": "arthursseat", "name": "Arthur’s Seat", "address": "Holyrood Park, Edinburgh EH8 8AZ", "lat": 55.9441, "lng": -3.1618, "description": "Take the hill paths in Holyrood Park for a view over Edinburgh.", "website": "https://www.historicenvironment.scot/visit/all/holyrood-park/", "icon": "hill"}
    ],
    food: [
      {id:'makars',name:'Makars Mash Bar',address:'9 & 12 Bank Street, Edinburgh EH1 2LN',lat:55.9498,lng:-3.1940,description:'Scottish comfort food with a creative take on mashed potatoes.',tag:'Scottish comfort food',website:'https://makarsmash.com/edinburgh/'},
      {id:'oink',name:'Oink · Victoria Street',address:'34 Victoria Street, Edinburgh EH1 2JW',lat:55.9481,lng:-3.1948,description:'A freshly pulled hog-roast roll in a colourful Old Town street.',tag:'Quick bite',website:'https://www.oinkhogroast.co.uk/shops/'},
      {id:'larder',name:'Edinburgh Larder',address:'15 Blackfriars Street, Edinburgh EH1 1NB',lat:55.9491,lng:-3.1862,description:'Seasonal Scottish breakfast and brunch just off the Royal Mile.',tag:'Breakfast & brunch',website:'https://edinburghlarder.co.uk/',source:'https://edinburghlarder.co.uk/contact/'},
      {id:'howies',name:'Howies · Waterloo Place',address:'29 Waterloo Place, Edinburgh EH1 3BQ',lat:55.9537,lng:-3.1856,description:'A Scottish restaurant for a pause at the foot of Calton Hill.',tag:'Scottish restaurant',website:'https://www.howies.uk.com/',source:'https://www.howies.uk.com/contact/'},
      {id:'hula',name:'Hula · Grassmarket',address:'103–105 West Bow, Edinburgh EH1 2JP',lat:55.9476,lng:-3.1952,description:'Colourful brunch, fresh juices and a relaxed Grassmarket stop.',tag:'Café & brunch',website:'https://www.hula.co.uk/',source:'https://www.hula.co.uk/contact'}
    ]
  },
  {
    id:'london',name:'London',country:'England',image:'assets/london.jpg',
    strapline:'Big landmarks. Little detours.',description:'Riverside icons, grand museums and something delicious around the corner.',
    sights:[
      {id:'bigben',name:'Big Ben',address:'Westminster, London SW1A 0AA',lat:51.5007,lng:-0.1246,description:'Meet Westminster’s famous clock tower beside the Thames.',icon:'clock',website:'https://www.parliament.uk/visiting/visiting-and-tours/big-ben-tour/'},
      {id:'eye',name:'London Eye',address:'Riverside Building, County Hall, London SE1 7PB',lat:51.5033,lng:-0.1195,description:'A landmark wheel and a different perspective on the South Bank.',icon:'wheel',website:'https://www.londoneye.com/'},
      {id:'palace',name:'Buckingham Palace',address:'London SW1A 1AA',lat:51.5014,lng:-0.1419,description:'A royal London landmark at the end of The Mall.',icon:'castle',website:'https://www.rct.uk/visit/buckingham-palace'},
      {id:'britishmuseum',name:'British Museum',address:'Great Russell Street, London WC1B 3DG',lat:51.5194,lng:-0.1270,description:'Find a world of history and culture beneath the Great Court.',icon:'museum',website:'https://www.britishmuseum.org/visit'},
      {id:'towerbridge',name:'Tower Bridge',address:'Tower Bridge Road, London SE1 2UP',lat:51.5055,lng:-0.0754,description:'A defining Victorian river crossing with a skyline all its own.',icon:'bridge',website:'https://www.towerbridge.org.uk/'},
      {"id": "toweroflondon", "name": "Tower of London", "address": "Tower Hill, London EC3N 4AB", "lat": 51.5081, "lng": -0.0759, "description": "Explore the riverside fortress and its medieval White Tower.", "website": "https://www.hrp.org.uk/tower-of-london/", "icon": "castle"},
      {"id": "westminsterabbey", "name": "Westminster Abbey", "address": "20 Deans Yard, London SW1P 3PA", "lat": 51.4993, "lng": -0.1273, "description": "Find Gothic architecture and centuries of royal history beside Parliament Square.", "website": "https://www.westminster-abbey.org/visit-us", "icon": "church"}
    ],
    food:[
      {id:'flatiron',name:'Flat Iron · Southbank',address:'Royal Festival Hall, Belvedere Road, London SE1 8XX',lat:51.5059,lng:-0.1167,description:'Steak and sides on the South Bank, close to the London Eye.',tag:'Steak & sides',website:'https://flatironsteak.co.uk/restaurants/'},
      {id:'dishoom',name:'Dishoom · Covent Garden',address:'12 Upper St Martin’s Lane, London WC2H 9FB',lat:51.5124,lng:-0.1269,description:'Bombay café favourites, breakfast and chai in the West End.',tag:'Indian café',website:'https://www.dishoom.com/covent-garden/',source:'https://www.dishoom.com/locations/'},
      {id:'breadahead',name:'Bread Ahead · Borough Market',address:'Borough Market, Cathedral Street, London SE1 9DE',lat:51.5053,lng:-0.0911,description:'Fresh bread, pastries and filled doughnuts from a market bakery.',tag:'Bakery & doughnuts',website:'https://www.breadahead.com/borough'},
      {id:'padella',name:'Padella',address:'6 Southwark Street, London SE1 1TQ',lat:51.5041,lng:-0.0902,description:'Freshly made pasta beside Borough Market.',tag:'Fresh pasta',website:'https://www.padella.co/',source:'https://boroughmarket.org.uk/traders/padella/',endorsement:'MICHELIN Guide listed',endorsementSource:'https://guide.michelin.com/gb/en/greater-london/london/restaurant/padella'},
      {id:'breakfastclub',name:'The Breakfast Club · London Bridge',address:'11 Southwark Street, London SE1 1RQ',lat:51.5040,lng:-0.0920,description:'Pancakes and classic brunch near Borough Market.',tag:'Breakfast & brunch',website:'https://www.thebreakfastclubcafes.com/london-bridge/'}
    ]
  },
  {
    id:'york',name:'York',country:'England',image:'assets/york.jpg',
    strapline:'Small streets. Big history.',description:'Medieval lanes, a magnificent Minster and a well-earned Yorkshire treat.',
    sights:[
      {id:'minster',name:'York Minster',address:'Deangate, York YO1 7HH',lat:53.9623,lng:-1.0820,description:'Medieval craftsmanship, soaring stone and remarkable stained glass.',icon:'church',website:'https://yorkminster.org/visit/'},
      {id:'shambles',name:'Shambles',address:'Shambles, York YO1 7LZ',lat:53.9594,lng:-1.0801,description:'Wander a wonderfully wonky medieval shopping street.',icon:'street',website:'https://visityork.org/business-directory/category/shambles'},
      {id:'clifford',name:'Clifford’s Tower',address:'Tower Street, York YO1 9SA',lat:53.9559,lng:-1.0807,description:'An ancient keep with a fresh perspective over York.',icon:'castle',website:'https://www.english-heritage.org.uk/visit/places/cliffords-tower-york/'},
      {id:'railway',name:'National Railway Museum',address:'Leeman Road, York YO26 4XJ',lat:53.9608,lng:-1.0979,description:'Legendary locomotives and big ideas that changed travel.',icon:'train',website:'https://www.railwaymuseum.org.uk/visit'},
      {id:'gardens',name:'York Museum Gardens',address:'Museum Street, York YO1 7FR',lat:53.9620,lng:-1.0876,description:'Slow down among botanical gardens and medieval abbey ruins.',icon:'leaf',website:'https://www.yorkmuseumstrust.org.uk/about-us/our-venues/york-museum-gardens/'},
      {"id": "walls", "name": "York City Walls", "address": "Micklegate Bar, Micklegate, York YO1 6JX", "lat": 53.9555, "lng": -1.0901, "description": "Start at Micklegate Bar and follow the stone ramparts around York.", "website": "https://www.york.gov.uk/york-city-centre/city-walls/2", "icon": "castle"},
      {"id": "castlemuseum", "name": "York Castle Museum", "address": "Tower Street, York YO1 9RY", "lat": 53.9552, "lng": -1.0781, "description": "Explore York’s domestic history, including the museum’s re-created Victorian street.", "website": "https://www.yorkcastlemuseum.org.uk/visitor-information/", "icon": "museum"}
    ],
    food:[
      {id:'bettys',name:'Bettys · York',address:'6–8 St Helen’s Square, York YO1 8QP',lat:53.9606,lng:-1.0847,description:'A classic Yorkshire tea-room pause for tea and cakes.',tag:'Tea & cakes',website:'https://www.bettys.co.uk/cafe-tea-rooms/our-locations/bettys-york'},
      {id:'shambleskitchen',name:'Shambles Kitchen',address:'28 Shambles, York YO1 7LX',lat:53.9591,lng:-1.0802,description:'House-smoked sandwiches on York’s medieval shopping street.',tag:'Sandwiches',website:'https://www.shambleskitchen.co.uk/'},
      {id:'yorkroast',name:'The York Roast Co.',address:'78 Low Petergate, York YO1 7HZ',lat:53.9610,lng:-1.0805,description:'Roast-dinner flavours wrapped in a Yorkshire pudding.',tag:'Yorkshire pudding wraps',website:'https://www.yorkroast.co/',source:'https://visityork.org/business-directory/the-york-roast-co-low-petergate'},
      {id:'brewbrownie',name:'Brew & Brownie',address:'5 Museum Street, York YO1 7DT',lat:53.9614,lng:-1.0865,description:'Coffee, brunch and bakes beside Museum Gardens.',tag:'Coffee & brunch',website:'https://www.brewandbrownie.uk/',source:'https://www.brewandbrownie.uk/contact-om'},
      {id:'madness',name:'House of the Trembling Madness',address:'14 Lendal, York YO1 8AA',lat:53.9607,lng:-1.0870,description:'Pub food in a Georgian house close to the river.',tag:'Pub & kitchen',website:'https://tremblingmadnessyork.co.uk/',source:'https://tremblingmadnessyork.co.uk/location-opening-times/'}
    ]
  },
  {
    "id": "brighton",
    "name": "Brighton",
    "country": "England",
    "image": "assets/brighton-pavilion.jpg",
    "strapline": "Sea views. Hidden lanes.",
    "description": "Follow Brighton’s seafront from the pier to the city’s narrow shopping lanes.",
    "sights": [
      {
        "id": "pavilion",
        "name": "Royal Pavilion",
        "address": "4/5 Pavilion Buildings, Brighton BN1 1EE",
        "lat": 50.82306,
        "lng": -0.1375,
        "description": "The seafront’s unexpected palace is topped with domes and minarets.",
        "website": "https://brightonmuseums.org.uk/royalpavilion/",
        "icon": "castle"
      },
      {
        "id": "palacepier",
        "name": "Brighton Palace Pier",
        "address": "Madeira Drive, Brighton BN2 1TW",
        "lat": 50.815,
        "lng": -0.13694,
        "description": "Walk out above the waves for seaside arcades and a view back to the city.",
        "website": "https://www.brightonpier.co.uk/",
        "icon": "bridge"
      },
      {
        "id": "beach",
        "name": "Brighton Beach",
        "address": "King's Road, Brighton BN1 1NB",
        "lat": 50.81897,
        "lng": -0.13802,
        "description": "Take a breather on the pebble beach along Brighton’s seafront.",
        "website": "https://www.visitbrighton.com/things-to-do/brighton-beach-p349601",
        "icon": "hill"
      },
      {
        "id": "i360",
        "name": "Brighton i360",
        "address": "Lower King's Road, Brighton BN1 2LN",
        "lat": 50.82135,
        "lng": -0.15092,
        "description": "Look up for the observation pod on Brighton’s slender seafront tower.",
        "website": "https://www.brightoni360.co.uk/",
        "icon": "wheel"
      },
      {
        "id": "lanes",
        "name": "The Lanes",
        "address": "Meeting House Lane, Brighton BN1 1HB",
        "lat": 50.82158,
        "lng": -0.13989,
        "description": "Wind through a maze of narrow passages, jewellery shops and cafés.",
        "website": "https://www.visitbrighton.com/explore/areas-to-visit/the-lanes",
        "icon": "pin"
      },
      {
        "id": "brightonmuseum",
        "name": "Brighton Museum & Art Gallery",
        "address": "Royal Pavilion Gardens, Brighton BN1 1EE",
        "lat": 50.82344,
        "lng": -0.13795,
        "description": "Explore art and design beside the Royal Pavilion gardens.",
        "website": "https://brightonmuseums.org.uk/brighton-museum-art-gallery/",
        "icon": "museum"
      },
      {
        "id": "sealife",
        "name": "SEA LIFE Brighton",
        "address": "Marine Parade, Brighton BN2 1TB",
        "lat": 50.8195,
        "lng": -0.1357,
        "description": "Explore the city’s historic aquarium under its Victorian arches.",
        "website": "https://www.visitsealife.com/brighton/",
        "icon": "museum"
      }
    ],
    "food": [
      {
        "id": "riddlefinns",
        "name": "Riddle & Finns",
        "address": "12B Meeting House Lane, Brighton BN1 1HB",
        "lat": 50.8217,
        "lng": -0.1408,
        "description": "Oysters and seafood on a narrow lane in Brighton’s Old Town.",
        "website": "https://www.riddleandfinns.co.uk/",
        "tag": "Seafood"
      },
      {
        "id": "burntorange",
        "name": "Burnt Orange",
        "address": "59 Middle Street, Brighton BN1 1AL",
        "lat": 50.8214,
        "lng": -0.143,
        "description": "Wood-fired sharing dishes near the seafront.",
        "website": "https://burnt-orange.co.uk/",
        "tag": "Wood-fired small plates"
      },
      {
        "id": "terreaterre",
        "name": "Terre a Terre",
        "address": "71 East Street, Brighton BN1 1HQ",
        "lat": 50.8207,
        "lng": -0.139,
        "description": "Vegetarian cooking with a playful menu on East Street.",
        "website": "https://terreaterre.co.uk/",
        "tag": "Vegetarian"
      },
      {
        "id": "saltroom",
        "name": "The Salt Room",
        "address": "106 King's Road, Brighton BN1 2FU",
        "lat": 50.8216,
        "lng": -0.147,
        "description": "Grilled seafood near the beach on King’s Road.",
        "website": "https://saltroom-restaurant.co.uk/",
        "tag": "Seafood grill"
      },
      {
        "id": "foodforfriends",
        "name": "Food for Friends",
        "address": "17-18 Prince Albert Street, Brighton BN1 1HF",
        "lat": 50.822,
        "lng": -0.1405,
        "description": "Vegetarian plates in the heart of the Lanes.",
        "website": "https://foodforfriends.com/",
        "tag": "Vegetarian"
      }
    ]
  },
  {
    "id": "bristol",
    "name": "Bristol",
    "country": "England",
    "image": "assets/bristol-clifton.jpg",
    "strapline": "Across the Avon.",
    "description": "Find harbour cranes, hilltop views and old streets beside Bristol’s floating harbour.",
    "sights": [
      {
        "id": "clifton",
        "name": "Clifton Suspension Bridge",
        "address": "Bridge Road, Leigh Woods, Bristol BS8 3PA",
        "lat": 51.4549,
        "lng": -2.6278,
        "description": "See Brunel’s bridge span the Avon Gorge.",
        "website": "https://cliftonbridge.org.uk/",
        "icon": "bridge"
      },
      {
        "id": "ssgreatbritain",
        "name": "SS Great Britain",
        "address": "Great Western Dockyard, Gas Ferry Road, Bristol BS1 6TY",
        "lat": 51.4493,
        "lng": -2.6087,
        "description": "Step aboard Brunel’s iron steamship in its historic dry dock.",
        "website": "https://www.ssgreatbritain.org/",
        "icon": "museum"
      },
      {
        "id": "cathedral",
        "name": "Bristol Cathedral",
        "address": "College Green, Bristol BS1 5TJ",
        "lat": 51.4519,
        "lng": -2.6006,
        "description": "Look for the vaulted ceiling and stained glass just off College Green.",
        "website": "https://bristol-cathedral.co.uk/",
        "icon": "church"
      },
      {
        "id": "mshed",
        "name": "M Shed",
        "address": "Princes Wharf, Wapping Road, Bristol BS1 4RN",
        "lat": 51.4474,
        "lng": -2.5983,
        "description": "Trace Bristol’s stories of work, trade and daily life on the harbourside.",
        "website": "https://www.bristolmuseums.org.uk/m-shed/",
        "icon": "museum"
      },
      {
        "id": "cabottower",
        "name": "Cabot Tower",
        "address": "Brandon Hill, Bristol BS1 5RR",
        "lat": 51.45403,
        "lng": -2.60682,
        "description": "Climb Brandon Hill for city views beside the stone tower.",
        "website": "https://www.bristol.gov.uk/residents/museums-parks-sports-and-culture/parks-and-green-spaces/your-local-park/brandon-hill",
        "icon": "hill"
      },
      {
        "id": "stnicholas",
        "name": "St Nicholas Market",
        "address": "Corn Street, Bristol BS1 1JQ",
        "lat": 51.45433,
        "lng": -2.59305,
        "description": "Explore covered market passages and food stalls in the Old City.",
        "website": "https://www.bristol.gov.uk/st-nicholas-markets",
        "icon": "pin"
      },
      {
        "id": "bristolmuseum",
        "name": "Bristol Museum & Art Gallery",
        "address": "Queens Road, Bristol BS8 1RL",
        "lat": 51.4561,
        "lng": -2.6053,
        "description": "Find art, ancient objects and natural history in a grand Queens Road building.",
        "website": "https://www.bristolmuseums.org.uk/bristol-museum-and-art-gallery/",
        "icon": "museum"
      }
    ],
    "food": [
      {
        "id": "boxe",
        "name": "Box-E",
        "address": "Unit 10, Cargo 1, Wapping Wharf, Bristol BS1 6WP",
        "lat": 51.447,
        "lng": -2.597,
        "description": "A small dining room in converted shipping containers at Wapping Wharf.",
        "website": "https://www.boxebristol.com/",
        "tag": "Seasonal British"
      },
      {
        "id": "berthas",
        "name": "Bertha's Pizza",
        "address": "The Old Gaol Stables, Cumberland Road, Bristol BS1 6WW",
        "lat": 51.4465,
        "lng": -2.5985,
        "description": "Neapolitan-style sourdough pizza by the harbour.",
        "website": "https://berthas.co.uk/",
        "tag": "Sourdough pizza"
      },
      {
        "id": "root",
        "name": "Root",
        "address": "Unit 9, Cargo 1, Wapping Wharf, Bristol BS1 6WP",
        "lat": 51.447,
        "lng": -2.6008,
        "description": "Seasonal small plates with vegetables at the centre of the menu.",
        "website": "https://www.rootbristol.co.uk/",
        "tag": "Vegetable-led small plates"
      },
      {
        "id": "gambas",
        "name": "Gambas",
        "address": "Unit 12, Cargo 2, Wapping Wharf, Bristol BS1 6ZA",
        "lat": 51.4468,
        "lng": -2.6004,
        "description": "Spanish seafood and tapas at Wapping Wharf.",
        "website": "https://www.gambasbristol.co.uk/",
        "tag": "Spanish tapas"
      },
      {
        "id": "sevenlucky",
        "name": "Seven Lucky Gods",
        "address": "Unit 26, Cargo 2, Wapping Wharf, Bristol BS1 6ZA",
        "lat": 51.4466,
        "lng": -2.6005,
        "description": "Japanese-inspired plates by the harbour.",
        "website": "https://7luckygods.com/",
        "tag": "Japanese-inspired plates"
      }
    ]
  },
  {
    "id": "cambridge",
    "name": "Cambridge",
    "country": "England",
    "image": "assets/cambridge-kingschapel.jpg",
    "strapline": "Courts by the Cam.",
    "description": "Explore college chapels, riverside bridges and unexpected collections.",
    "sights": [
      {
        "id": "kingschapel",
        "name": "King’s College Chapel",
        "address": "King's Parade, Cambridge CB2 1ST",
        "lat": 52.20478,
        "lng": 0.11654,
        "description": "Look up at the fan-vaulted ceiling of Cambridge’s landmark chapel.",
        "website": "https://www.kings.cam.ac.uk/visit",
        "icon": "church"
      },
      {
        "id": "fitzwilliam",
        "name": "Fitzwilliam Museum",
        "address": "Trumpington Street, Cambridge CB2 1RB",
        "lat": 52.20028,
        "lng": 0.11944,
        "description": "Find paintings, sculpture and objects from centuries of collecting.",
        "website": "https://fitzmuseum.cam.ac.uk/",
        "icon": "museum"
      },
      {
        "id": "mathbridge",
        "name": "Mathematical Bridge",
        "address": "Queens' College, Silver Street, Cambridge CB3 9ET",
        "lat": 52.20221,
        "lng": 0.11505,
        "description": "Spot the timber bridge linking the two sides of Queens’ College.",
        "website": "https://www.queens.cam.ac.uk/visiting-queens",
        "icon": "bridge"
      },
      {
        "id": "roundchurch",
        "name": "Round Church",
        "address": "Bridge Street, Cambridge CB2 1UB",
        "lat": 52.2084,
        "lng": 0.1189,
        "description": "See the distinctive circular nave of this medieval church.",
        "website": "https://www.roundchurchcambridge.org/",
        "icon": "church"
      },
      {
        "id": "botanicgarden",
        "name": "Cambridge University Botanic Garden",
        "address": "1 Brookside, Cambridge CB2 1JE",
        "lat": 52.19361,
        "lng": 0.12722,
        "description": "Follow garden paths past glasshouses and plant collections.",
        "website": "https://www.botanic.cam.ac.uk/",
        "icon": "hill"
      },
      {
        "id": "greatstmarys",
        "name": "Great St Mary’s",
        "address": "Senate House Hill, Cambridge CB2 3PQ",
        "lat": 52.2053,
        "lng": 0.1182,
        "description": "Climb the university church tower for a view over the colleges.",
        "website": "https://www.greatstmarys.org/",
        "icon": "church"
      },
      {
        "id": "polarmuseum",
        "name": "The Polar Museum",
        "address": "Lensfield Road, Cambridge CB2 1ER",
        "lat": 52.19845,
        "lng": 0.12627,
        "description": "Discover stories of polar expeditions through photographs and equipment.",
        "website": "https://www.spri.cam.ac.uk/museum/",
        "icon": "museum"
      }
    ],
    "food": [
      {
        "id": "midsummer",
        "name": "Midsummer House",
        "address": "Midsummer Common, Cambridge CB4 1HA",
        "lat": 52.212,
        "lng": 0.128,
        "description": "A riverside dining room on Midsummer Common.",
        "website": "https://www.midsummerhouse.co.uk/",
        "tag": "Fine dining"
      },
      {
        "id": "fitzbillies",
        "name": "Fitzbillies",
        "address": "51-52 Trumpington Street, Cambridge CB2 1RG",
        "lat": 52.201,
        "lng": 0.119,
        "description": "A bakery and café known for its Chelsea buns.",
        "website": "https://www.fitzbillies.com/",
        "tag": "Bakery and café"
      },
      {
        "id": "eagle",
        "name": "The Eagle",
        "address": "8 Bene't Street, Cambridge CB2 3QN",
        "lat": 52.2038,
        "lng": 0.1182,
        "description": "A historic pub close to the college entrances.",
        "website": "https://www.greeneking.co.uk/pubs/cambridgeshire/eagle",
        "tag": "Historic pub"
      },
      {
        "id": "parkers",
        "name": "Parker's Tavern",
        "address": "University Arms, Regent Street, Cambridge CB2 1AD",
        "lat": 52.202,
        "lng": 0.126,
        "description": "A brasserie on the edge of Parker’s Piece.",
        "website": "https://parkerstavern.com/",
        "tag": "British brasserie"
      },
      {
        "id": "aromi",
        "name": "Aromi",
        "address": "1 Bene't Street, Cambridge CB2 3QN",
        "lat": 52.204,
        "lng": 0.1185,
        "description": "Sicilian coffee, pastries and lunch options on Bene’t Street.",
        "website": "https://www.aromi.co.uk/",
        "tag": "Sicilian café"
      }
    ]
  },
  {
    "id": "liverpool",
    "name": "Liverpool",
    "country": "England",
    "image": "assets/liverpool-albertdock.jpg",
    "strapline": "Down to the docks.",
    "description": "Follow Liverpool’s waterfront, music history and landmark architecture.",
    "sights": [
      {
        "id": "albertdock",
        "name": "Royal Albert Dock",
        "address": "Royal Albert Dock, Liverpool L3 4AF",
        "lat": 53.4003,
        "lng": -2.9927,
        "description": "Walk between brick warehouses and water at this historic dock.",
        "website": "https://albertdock.com/",
        "icon": "bridge"
      },
      {
        "id": "cavernclub",
        "name": "The Cavern Club",
        "address": "10 Mathew Street, Liverpool L2 6RE",
        "lat": 53.40627,
        "lng": -2.9879,
        "description": "Head down Mathew Street to the cellar venue linked to the Beatles.",
        "website": "https://www.cavernclub.com/",
        "icon": "pin"
      },
      {
        "id": "cathedral",
        "name": "Liverpool Cathedral",
        "address": "St James Mount, Liverpool L1 7AZ",
        "lat": 53.3976,
        "lng": -2.973,
        "description": "See the monumental sandstone cathedral above St James Gardens.",
        "website": "https://liverpoolcathedral.org.uk/",
        "icon": "church"
      },
      {
        "id": "liverbuilding",
        "name": "Royal Liver Building",
        "address": "Pier Head, Liverpool L3 1HU",
        "lat": 53.4058,
        "lng": -2.9958,
        "description": "Look for the Liver birds watching over the waterfront from twin towers.",
        "website": "https://rlb360.com/",
        "icon": "clock"
      },
      {
        "id": "liverpoolmuseum",
        "name": "Museum of Liverpool",
        "address": "Pier Head, Liverpool Waterfront, Liverpool L3 1DG",
        "lat": 53.4031,
        "lng": -2.9956,
        "description": "Explore Liverpool’s local history in an angular building on the waterfront.",
        "website": "https://www.liverpoolmuseums.org.uk/museum-of-liverpool",
        "icon": "museum"
      },
      {
        "id": "walker",
        "name": "Walker Art Gallery",
        "address": "William Brown Street, Liverpool L3 8EL",
        "lat": 53.41,
        "lng": -2.9795,
        "description": "Find paintings and sculpture in the gallery on William Brown Street.",
        "website": "https://www.liverpoolmuseums.org.uk/walker-art-gallery",
        "icon": "museum"
      },
      {
        "id": "worldmuseum",
        "name": "World Museum",
        "address": "William Brown Street, Liverpool L3 8EN",
        "lat": 53.41,
        "lng": -2.9817,
        "description": "Explore natural history and world cultures at the museum near St George’s Hall.",
        "website": "https://www.liverpoolmuseums.org.uk/world-museum",
        "icon": "museum"
      }
    ],
    "food": [
      {
        "id": "maray",
        "name": "Maray",
        "address": "91 Bold Street, Liverpool L1 4HF",
        "lat": 53.4021,
        "lng": -2.978,
        "description": "Sharing plates on Bold Street with Middle Eastern influences.",
        "website": "https://maray.co.uk/",
        "tag": "Middle Eastern-inspired plates"
      },
      {
        "id": "mowgli",
        "name": "Mowgli Street Food",
        "address": "69 Bold Street, Liverpool L1 4EZ",
        "lat": 53.4026,
        "lng": -2.9792,
        "description": "Indian street-food dishes on Bold Street.",
        "website": "https://www.mowglistreetfood.com/",
        "tag": "Indian street food"
      },
      {
        "id": "lunya",
        "name": "Lunya",
        "address": "55 Hanover Street, Liverpool L1 3DN",
        "lat": 53.4033,
        "lng": -2.9839,
        "description": "Catalan-style tapas and a deli on Hanover Street.",
        "website": "https://lunya.co.uk/",
        "tag": "Catalan tapas"
      },
      {
        "id": "baltic",
        "name": "Baltic Market",
        "address": "Cains Brewery Village, Stanhope Street, Liverpool L8 5XJ",
        "lat": 53.395,
        "lng": -2.984,
        "description": "Independent food traders under one roof in the Baltic Triangle.",
        "website": "https://www.balticmarket.co.uk/",
        "tag": "Street-food hall"
      },
      {
        "id": "panoramic",
        "name": "Panoramic 34",
        "address": "34th Floor, West Tower, Brook Street, Liverpool L3 9PJ",
        "lat": 53.41,
        "lng": -2.995,
        "description": "A dining room overlooking the waterfront from West Tower.",
        "website": "https://panoramic34.com/",
        "tag": "Fine dining"
      }
    ]
  },
  {
    "id": "oxford",
    "name": "Oxford",
    "country": "England",
    "image": "assets/oxford-christchurch.jpg",
    "strapline": "Through the college gates.",
    "description": "Discover Oxford’s courtyards, domes and collections on foot.",
    "sights": [
      {
        "id": "christchurch",
        "name": "Christ Church",
        "address": "St Aldate's, Oxford OX1 1DP",
        "lat": 51.75028,
        "lng": -1.25583,
        "description": "Find Tom Tower and college courts on St Aldate’s.",
        "website": "https://www.chch.ox.ac.uk/visiting-christ-church",
        "icon": "church"
      },
      {
        "id": "radcliffe",
        "name": "Radcliffe Camera",
        "address": "Radcliffe Square, Oxford OX1 3BG",
        "lat": 51.7534,
        "lng": -1.254,
        "description": "See Oxford’s domed library from the cobbled Radcliffe Square.",
        "website": "https://visit.bodleian.ox.ac.uk/",
        "icon": "museum"
      },
      {
        "id": "sheldonian",
        "name": "Sheldonian Theatre",
        "address": "Broad Street, Oxford OX1 3AZ",
        "lat": 51.7544,
        "lng": -1.2549,
        "description": "Look for the broad semicircular façade of the university’s ceremonial theatre.",
        "website": "https://www.sheldonian.ox.ac.uk/",
        "icon": "museum"
      },
      {
        "id": "hertfordbridge",
        "name": "Hertford Bridge",
        "address": "New College Lane, Oxford OX1 3BL",
        "lat": 51.7545,
        "lng": -1.2537,
        "description": "Walk below the ornate covered crossing on New College Lane.",
        "website": "https://www.hertford.ox.ac.uk/about/visit",
        "icon": "bridge"
      },
      {
        "id": "ashmolean",
        "name": "Ashmolean Museum",
        "address": "Beaumont Street, Oxford OX1 2PH",
        "lat": 51.7555,
        "lng": -1.26,
        "description": "Explore art and archaeology behind the columned Beaumont Street façade.",
        "website": "https://www.ashmolean.org/",
        "icon": "museum"
      },
      {
        "id": "oxfordcastle",
        "name": "Oxford Castle",
        "address": "44-46 Oxford Castle, Oxford OX1 1AY",
        "lat": 51.7517,
        "lng": -1.2632,
        "description": "See the remains of Oxford’s castle and the mound beside it.",
        "website": "https://www.oxfordcastleandprison.co.uk/",
        "icon": "castle"
      },
      {
        "id": "naturalhistory",
        "name": "Oxford University Museum of Natural History",
        "address": "Parks Road, Oxford OX1 3PW",
        "lat": 51.7586,
        "lng": -1.2556,
        "description": "Discover natural history beneath an intricate iron-and-glass roof.",
        "website": "https://oumnh.ox.ac.uk/",
        "icon": "museum"
      }
    ],
    "food": [
      {
        "id": "gees",
        "name": "Gee's",
        "address": "61 Banbury Road, Oxford OX2 6PE",
        "lat": 51.762,
        "lng": -1.262,
        "description": "Mediterranean dishes in a former plant conservatory.",
        "website": "https://www.geesrestaurant.co.uk/",
        "tag": "Mediterranean"
      },
      {
        "id": "cherwell",
        "name": "The Cherwell Boathouse",
        "address": "50 Bardwell Road, Oxford OX2 6ST",
        "lat": 51.77,
        "lng": -1.258,
        "description": "A riverside dining room by the Cherwell.",
        "website": "https://cherwellboathouse.co.uk/",
        "tag": "Riverside restaurant"
      },
      {
        "id": "arbequina",
        "name": "Arbequina",
        "address": "74 Cowley Road, Oxford OX4 1JB",
        "lat": 51.748,
        "lng": -1.242,
        "description": "Spanish tapas in a small Cowley Road dining room.",
        "website": "https://arbequina.co.uk/",
        "tag": "Spanish tapas"
      },
      {
        "id": "branca",
        "name": "Branca",
        "address": "111 Walton Street, Oxford OX2 6AJ",
        "lat": 51.758,
        "lng": -1.264,
        "description": "An Italian restaurant and deli on Walton Street.",
        "website": "https://www.branca.co.uk/",
        "tag": "Italian restaurant"
      },
      {
        "id": "turftavern",
        "name": "The Turf Tavern",
        "address": "4-5 Bath Place, Oxford OX1 3SU",
        "lat": 51.755,
        "lng": -1.2523,
        "description": "A tucked-away pub reached through a passage off New College Lane.",
        "website": "https://www.greeneking.co.uk/pubs/oxfordshire/turf-tavern",
        "tag": "Historic pub"
      }
    ]
  }
];
