from xml.etree import ElementTree
from fastapi import HTTPException
import json

# --- Função para extrair coordenadas de arquivos KML ---

def extract_coords_from_kml(kml_bytes: bytes):
    """
    Extrai coordenadas de um KML exportado do Google Earth.
    Valida se o polígono está fechado.
    Retorna lista de polígonos -> cada polígono é uma lista de (lon, lat)
    """
    # converte o conteúdo do KML em uma árvore XML para facilitar a navegação
    root = ElementTree.fromstring(kml_bytes)

    # define o namespace usado no KML (necessário para encontrar as tags corretamente)
    ns = {"kml": "http://www.opengis.net/kml/2.2"}

    # lista que vai armazenar todos os polígonos encontrados no arquivo
    coords_list = []

    # procura todas as tags <coordinates> dentro do KML
    for coord_tag in root.findall(".//kml:coordinates", ns):
        # cada tag <coordinates> contém vários pontos separados por espaço
        raw_coords = coord_tag.text.strip().split()

        # lista que vai armazenar os pontos do polígono atual
        polygon = []

        # para cada ponto (longitude, latitude, altitude)
        for coord in raw_coords:
            # divide a string "lon,lat,alt" em partes
            lon, lat, *_ = coord.split(",")
            # adiciona uma tupla (longitude, latitude) à lista do polígono
            polygon.append((float(lon), float(lat)))

        # verifica se o polígono está fechado (primeiro ponto = último ponto)
        if polygon[0] != polygon[-1]:
            # se não estiver fechado, lança um erro HTTP 400
            raise HTTPException(
                status_code=400,
                detail="Polígono inválido: primeiro e último ponto não coincidem."
            )

        # adiciona o polígono completo à lista de todos os polígonos
        coords_list.append(polygon)

    # retorna a lista de todos os polígonos encontrados
    return coords_list


# --- Função para extrair coordenadas de arquivos GeoJSON ---

def extract_coords_from_geojson(geojson_bytes: bytes):
    # converte o conteúdo do GeoJSON de bytes para um dicionário Python
    data = json.loads(geojson_bytes)

    # lista que vai armazenar todos os polígonos encontrados
    coords_list = []

    # função interna para processar a geometria de cada objeto (Polygon ou MultiPolygon)
    def parse_geometry(geometry):
        # caso seja um polígono simples
        if geometry["type"] == "Polygon":
            for polygon in geometry["coordinates"]:
                # cada ponto é transformado em tupla (lon, lat)
                coords_list.append([tuple(pt) for pt in polygon])
        # caso seja um polígono múltiplo
        elif geometry["type"] == "MultiPolygon":
            for multi in geometry["coordinates"]:
                for polygon in multi:
                    coords_list.append([tuple(pt) for pt in polygon])
        # caso seja outro tipo de geometria não suportado
        else:
            raise HTTPException(status_code=400, detail=f"Tipo de geometria não suportado: {geometry['type']}")

    # geoJSON pode conter várias features ou ser apenas uma geometria simples
    if "features" in data:
        # se houver múltiplas features, processa cada uma
        for feature in data["features"]:
            parse_geometry(feature["geometry"])
    elif "type" in data:
        # se for apenas um objeto Geometry, processa diretamente
        parse_geometry(data)
    else:
        # se não encontrar nenhuma geometria válida, lança erro
        raise HTTPException(status_code=400, detail="GeoJSON inválido")

    # retorna a lista de todos os polígonos encontrados
    return coords_list
