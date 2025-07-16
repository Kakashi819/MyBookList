

import requests
import json

def get_single_book():
    """Fetches a single book and its details."""
    # 1. Fetch one book from the "History" genre
    genre_url = "https://openlibrary.org/subjects/history.json?limit=1"
    try:
        response = requests.get(genre_url)
        response.raise_for_status()
        genre_data = response.json()
        if not genre_data.get("works"):
            print("Could not find any books for the genre.")
            return
        
        book_olid = genre_data["works"][0].get("key").replace("/works/", "")
        print(f"Found book OLID: {book_olid}")

        # 2. Fetch the details for that single book
        details_url = f"https://openlibrary.org/api/books?bibkeys=OLID:{book_olid}&format=json&jscmd=data"
        print(f"Fetching details from: {details_url}")
        
        details_response = requests.get(details_url)
        details_response.raise_for_status()
        book_details = details_response.json()

        # 3. Print the details
        print("\n--- Book Details ---")
        print(json.dumps(book_details, indent=4))
        print("--------------------")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    get_single_book()

