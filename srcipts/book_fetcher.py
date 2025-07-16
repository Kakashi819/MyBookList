

import requests
import json

def get_book_details_by_isbn(isbn):
    """
    Fetches book details from the Open Library API using the book's ISBN.

    Args:
        isbn (str): The ISBN of the book to look up.

    Returns:
        dict: A dictionary containing the book's information, or None if not found.
    """
    url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        book_data = response.json()
        
        if f"ISBN:{isbn}" in book_data:
            return book_data[f"ISBN:{isbn}"]
        else:
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    # Example: Fetch details for "The Hobbit"
    sample_isbn = "9780547928227"
    
    print(f"Fetching book details for ISBN: {sample_isbn}...")
    book_info = get_book_details_by_isbn(sample_isbn)
    
    if book_info:
        print("\n--- Book Information ---")
        print(json.dumps(book_info, indent=4))
        print("----------------------")
    else:
        print(f"Could not find information for ISBN: {sample_isbn}")

