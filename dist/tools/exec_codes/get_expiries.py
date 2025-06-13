import sys
import json
import pandas as pd
from clientCreation import create_client

# Optional: Configure pandas to show full data in debug/dev mode
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)
pd.set_option('display.width', None)

def fetch_expiry(client, exchange: str, asset_type: str):
    """Fetches expiry dates of options chains for a given exchange and asset type."""
    return client.get_expiry(exchange, asset_type)

def main():
    """Main function to fetch and display expiry data."""

    exchange = sys.argv[1]
    asset_type = sys.argv[2]

    client = create_client()
    expiry_data = fetch_expiry(client, exchange, asset_type)

    print(expiry_data)

if __name__ == "__main__":
    main()
