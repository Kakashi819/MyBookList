
import os
from supabase import create_client, Client

# Get Supabase credentials from environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

def get_table_names():
    """Retrieves all table names from the public schema."""
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        response = supabase.rpc('get_all_table_names').execute()
        
        if response.data:
            table_names = [item['table_name'] for item in response.data]
            print("Found the following tables:")
            for name in table_names:
                print(f"- {name}")
        else:
            print("Could not retrieve table names.")
            if hasattr(response, 'error') and response.error:
                print(f"Supabase error: {response.error}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required.")
    else:
        get_table_names()
