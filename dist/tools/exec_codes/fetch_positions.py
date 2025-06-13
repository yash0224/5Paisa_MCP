import json
from clientCreation import create_client

def fetch_positions(client):
    """Fetches current open positions."""
    return client.positions()

def main():
    """Main function to get and print positions as JSON."""
    client = create_client()
    positions = fetch_positions(client)
    print(json.dumps(positions))  

if __name__ == "__main__":
    main()
