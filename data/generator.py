import json

import requests


def get_ships(limit=500):
    a = requests.get(f"https://starcitizen.tools/api.php?action=query&list=categorymembers&cmtitle=Category:Ships&format=json&cmlimit={limit}")
    ships = a.json()["query"]["categorymembers"]

    result = {}
    result["vaisseaux"] = []
    result["fabricants"] = []
    
    manufacturer_id = 0
    manufacturer_ids = {}
    for ship_id, ship in enumerate(ships):
        try:    
            manufacturer = get_manufacturer(ship["title"])
            if manufacturer not in manufacturer_ids:
                result["fabricants"].append({
                    "id": manufacturer_id,
                    "nom": manufacturer,
                })
                
                manufacturer_ids[manufacturer] = manufacturer_id
                
                manufacturer_id += 1
            
            result["vaisseaux"].append({
                "id": ship_id,
                "nom": ship["title"],
                "image": get_thumbnail(ship["title"]),
                "roles": get_roles(ship["title"]),
                "fabricant": manufacturer_ids[manufacturer],
            })
        
        except:
            pass

    return result


def get_manufacturer(title):
    api_url = f"https://starcitizen.tools/api.php?action=ask&query=[[{title}]]|?Manufacturer&format=json"
    result = requests.get(api_url).json()
    return list(list(result["query"]["results"].values())[0]["printouts"]["Manufacturer"])[0]["fulltext"]


def get_thumbnail(title):
    api_url = f'https://starcitizen.tools/api.php?action=query&prop=pageimages&titles={title}&format=json&pithumbsize=500&origin=*'
    result = requests.get(api_url).json()
    return list(result["query"]["pages"].values())[0]["thumbnail"]["source"]


def get_roles(title):
    api_url = f"https://starcitizen.tools/api.php?action=ask&query=[[{title}]]|?Role&format=json"
    result = requests.get(api_url).json()
    
    return ", ".join(list(result["query"]["results"].values())[0]["printouts"]["Role"])
    

if __name__ == "__main__":
    json.dump(get_ships(), open("data/ships.json", "w"))
