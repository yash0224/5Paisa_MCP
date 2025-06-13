import sys
import json
from clientCreation import create_client

def fetch_snapshot(client, scrip_code: int, exchange: str, exchange_type: str):
    """Fetches market snapshot for the given parameters."""
    request_data = [{"Exchange": exchange, "ExchangeType": exchange_type, "ScripCode": scrip_code}]
    return client.fetch_market_snapshot(request_data)

def main():
    """Main function to parse arguments and print market snapshot."""

    scrip_code = int(sys.argv[1])
    exchange = sys.argv[2]
    exchange_type = sys.argv[3]

    client = create_client()
    snapshot = fetch_snapshot(client, scrip_code, exchange, exchange_type)
    print(json.dumps(snapshot, indent=2))

if __name__ == "__main__":
    main()
