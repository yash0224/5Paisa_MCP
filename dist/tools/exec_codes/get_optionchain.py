import sys
import json
import pandas as pd
from clientCreation import create_client
# Configure pandas output (optional)
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)
pd.set_option('display.width', None)

def fetch_option_chain(client, exchange: str, asset_type: str, expiry: str):
    """Fetches the option chain data for given parameters."""
    return client.get_option_chain(exchange, asset_type, expiry)

def main():
    """Main function to fetch and display option chain data."""

    exchange = sys.argv[1]
    asset_type = sys.argv[2]
    expiry = sys.argv[3]

    client = create_client()
    option_chain = fetch_option_chain(client, exchange, asset_type, expiry)

    print(option_chain)  # If it's already structured for display
    

if __name__ == "__main__":
    main()
