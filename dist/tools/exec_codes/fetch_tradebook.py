import json
from clientCreation import create_client

def fetch_tradebook(client):
    """Fetches the tradebook (executed orders)."""
    return client.get_tradebook()

def main():
    """Main function to print the tradebook as pure JSON."""
    client = create_client()
    tradebook = fetch_tradebook(client)
    print(json.dumps(tradebook))  # Pure JSON output

if __name__ == "__main__":
    main()
