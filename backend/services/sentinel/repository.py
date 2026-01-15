from backend.services.database_service import get_supabase_client

supabase = get_supabase_client()


def save_satellite_metadata(
    satellite: str,
    acquisition_date: str,
    cloud_coverage: float,
    geometry: dict,
    file_path: str
):
    data = {
        "satellite": satellite,
        "acquisition_date": acquisition_date,
        "cloud_coverage": cloud_coverage,
        "geometry": geometry,
        "file_path": file_path
    }

    response = supabase.table("satellite_images").insert(data).execute()

    return response.data