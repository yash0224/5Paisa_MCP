import json
from clientCreation import create_client

def fetch_holdings(client):
    """Fetches holdings from the client's account."""
    holdings = client.holdings()
    return holdings

def main():
    """Main function to get and print holdings as JSON."""
    client = create_client()
    holdings = fetch_holdings(client)
    print(json.dumps(holdings))  # Ensure pure JSON output

if __name__ == "__main__":
    main()
