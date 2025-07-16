

import os
from supabase import create_client, Client
import json

# Get Supabase credentials from environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

def get_schemas(table_names):
    """Retrieves the schema for a list of tables."""
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        all_schemas = {}
        for table_name in table_names:
            print(f"Fetching schema for table: {table_name}")
            response = supabase.rpc('get_table_schema', {'table_name_input': table_name}).execute()
            if response.data:
                all_schemas[table_name] = response.data
            else:
                print(f"Could not retrieve schema for table: {table_name}")
                if hasattr(response, 'error') and response.error:
                    print(f"Supabase error: {response.error}")
        
        print("\n--- Database Schema ---")
        print(json.dumps(all_schemas, indent=4))
        print("-----------------------")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required.")
    else:
        tables_to_inspect = ["books", "genres", "book_genres"]
        get_schemas(tables_to_inspect)

