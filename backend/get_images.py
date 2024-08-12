import json
import requests
from requests.exceptions import RequestException

def search_images(query, api_key, cx):
    search_url = "https://www.googleapis.com/customsearch/v1"
    params = {
        'q': query,
        'cx': cx,
        'key': api_key,
        'searchType': 'image',
        'num': 1  # Number of results to return
    }

    try:
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        search_results = response.json()
        
        if 'items' in search_results and len(search_results['items']) > 0:
            first_result = search_results['items'][0]
            return {
                'page_url': first_result['image']['contextLink'],
                'image_url': first_result['link']
            }
        else:
            return {
                'page_url': f'No results found for {query}',
                'image_url': 'No image found'
            }
    except RequestException as e:
        print(f"An error occurred: {e}")
        return {
            'page_url': f'Error occurred while searching for {query}',
            'image_url': 'Error occurred'
        }

# Your Google API key and Custom Search Engine ID
cx = "f5d90e0e4ebf94301"

# Your Google API key
api_key = "AIzaSyD0d9kisByh7PuQJ2Sf3JWyzHaaydH4Jdo"
# Load the JSON data
data = {
  "outfit": [
    "black pants",
    "dark blue jeans",
    "grey chinos",
    "navy chinos",
    "khaki pants",
    "brown pants",
    "burgundy pants",
    "olive green pants",
    "dark green chinos",
    "beige pants"
  ]
}

# Process each outfit item
results = []
for item in data['outfit']:
    search_result = search_images(item, api_key, cx)
    results.append({
        'item': item,
        'page_url': search_result['page_url'],
        'image_url': search_result['image_url']
    })

# Print or save the results
for result in results:
    print(f"Item: {result['item']}")
    print(f"Page URL: {result['page_url']}")
    print(f"Image URL: {result['image_url']}")
    print()