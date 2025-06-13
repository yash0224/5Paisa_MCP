import json
from clientCreation import create_client

def fetch_margin(client):
    """Fetches margin details of the client."""
    return client.margin()

def main():
    """Main function to get and print margin as pure JSON."""
    client = create_client()
    margin = fetch_margin(client)
    print(json.dumps(margin))  # Pure JSON output

if __name__ == "__main__":
    main()
