import json
import re
from collections import defaultdict

import requests


def get_ships(limit=500):
    """ Récupère la liste des vaisseaux et génère un JSON structuré """
    print("Récupération de la liste des vaisseaux...")
    response = requests.get(f"https://starcitizen.tools/api.php?action=query&list=categorymembers&cmtitle=Category:Ships&format=json&cmlimit={limit}")
    ships = response.json()["query"]["categorymembers"]

    result = {
        "vaisseaux": [],
        "fabricants": [],
        "roles": [],
        "votes": [],
    }

    manufacturer_id = 0
    manufacturer_ids = {}
    role_id = 0
    role_ids = {}

    manufacturers_ships = defaultdict(list)
    roles_ships = defaultdict(list)

    for ship_id, ship in enumerate(ships):
        try:
            print(f"Traitement du vaisseau : {ship['title']} ({ship_id+1}/{len(ships)})")
            ship_details = get_ship_details(ship["title"])

            if not ship_details:
                print(f"❌ Impossible de récupérer les détails pour {ship['title']}")
                continue

            # Vérification des données
            if not ship_details["fabricant"]:
                print(f"⚠️ {ship['title']} ignoré : fabricant manquant")
                continue
            if not ship_details["roles"]:
                print(f"⚠️ {ship['title']} ignoré : rôle manquant")
                continue
            if not ship_details["image"]:
                print(f"⚠️ {ship['title']} ignoré : image manquante")
                continue

            # Gestion des fabricants
            manufacturer = ship_details["fabricant"]
            if manufacturer not in manufacturer_ids:
                result["fabricants"].append({
                    "id": manufacturer_id,
                    "nom": manufacturer,
                    "logo": get_thumbnail(manufacturer),
                })
                manufacturer_ids[manufacturer] = manufacturer_id
                manufacturer_id += 1

            # Gestion des rôles
            ship_roles = ship_details["roles"]
            role_refs = []
            for role in ship_roles:
                if role not in role_ids:
                    result["roles"].append({
                        "id": role_id,
                        "nom": role
                    })
                    role_ids[role] = role_id
                    role_id += 1
                role_refs.append(role_ids[role])

            # Ajout du vaisseau au résultat
            result["vaisseaux"].append({
                "id": ship_id,
                "nom": ship["title"],
                "image": ship_details["image"],
                "rolesIds": role_refs,
                "fabricantId": manufacturer_ids[manufacturer],
                "score": 0,
                "prix": ship_details["prix"],
                "trailer_url": ship_details["trailer_url"],
            })

            fabricant_id = manufacturer_ids[manufacturer]
            manufacturers_ships[fabricant_id].append(ship_id)
            for role_id_ref in role_refs:
                roles_ships[role_id_ref].append(ship_id)

        except Exception as e:
            print(f"⚠️ Erreur avec {ship['title']} : {e}")

    for fab in result["fabricants"]:
        fab["vaisseauxIds"] = manufacturers_ships[fab["id"]]

    for role in result["roles"]:
        role["vaisseauxIds"] = roles_ships[role["id"]]

    return result

def get_ship_details(title):
    """ Récupère toutes les informations d'un vaisseau depuis StarCitizen.tools """
    wikitext = get_wikitext(title)
    if not wikitext:
        return None

    return {
        "nom": title,
        "prix": extract_value(r"\| pledgecost\s*=\s*(\d+)", wikitext),
        "fabricant": get_full_manufacturer(title, wikitext),
        "image": get_thumbnail(title),
        "trailer_url": extract_trailer_url(wikitext),
        "roles": get_roles(title)
    }

def get_wikitext(title):
    """ Récupère le wikitext brut de la page du vaisseau """
    api_url = f"https://starcitizen.tools/api.php?action=parse&page={title}&prop=wikitext&format=json"
    response = requests.get(api_url)

    if response.status_code != 200:
        return None

    data = response.json()
    return data.get("parse", {}).get("wikitext", {}).get("*", None)

def extract_value(pattern, text):
    """ Extrait une valeur unique depuis le wikitext avec une regex """
    match = re.search(pattern, text)
    return match.group(1).strip() if match else None

def get_roles(title):
    api_url = f"https://starcitizen.tools/api.php?action=ask&query=[[{title}]]|?Role&format=json"
    result = requests.get(api_url).json()
    roles = list(result["query"]["results"].values())[0]["printouts"]["Role"] 
    
    if roles:
        if "/" in roles[0]:
            roles = roles[0].split("/")
            
        if "," in roles[0]:
            roles = roles[0].split(",")
        
        roles = list(map(lambda x: x.strip(), roles))
    
    return roles            
            
def extract_trailer_url(wikitext):
    """ Extrait l'URL du trailer YouTube (supporte les deux formats) """
    match = re.search(r"\| trailerurl\s*=\s*(https?://(?:www\.youtube\.com/watch\?v=|youtu\.be/)[\w-]+)", wikitext)
    return match.group(1).replace("https://youtu.be/", "").replace("https://www.youtube.com/watch?v=", "") if match else None

def get_full_manufacturer(title, wikitext):
    """ Récupère le fabricant en version complète depuis l'API ask, avec fallback sur le wikitext """
    api_url = f"https://starcitizen.tools/api.php?action=ask&query=[[{title}]]|?Manufacturer&format=json"
    response = requests.get(api_url).json()
    try:
        return response["query"]["results"][title]["printouts"]["Manufacturer"][0]["fulltext"]
    except (KeyError, IndexError):
        pass

    return extract_value(r"\| manufacturer\s*=\s*([\w\s]+)", wikitext)

def get_thumbnail(title):
    """ Récupère l'URL de l'image du vaisseau via l'API MediaWiki """
    api_url = f'https://starcitizen.tools/api.php?action=query&prop=pageimages&titles={title}&format=json&pithumbsize=500&origin=*'
    response = requests.get(api_url).json()
    
    pages = response.get("query", {}).get("pages", {})
    if not pages:
        return None

    for page in pages.values():
        if "thumbnail" in page:
            return page["thumbnail"]["source"]
    
    return None

# Génération du JSON
if __name__ == "__main__":
    print("Début de la génération du JSON...")
    ships_data = get_ships()
    json.dump(ships_data, open("server/data/vaisseaux.json", "w"), indent=4)
    print("✅ Fichier JSON généré avec succès : server/data/vaisseaux.json")
