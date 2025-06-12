import sys
import json
import pandas as pd
import creds
import a_token
from py5paisa import FivePaisaClient

# Configure pandas output (optional)
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)
pd.set_option('display.width', None)

def create_client():
    """Initializes and returns a FivePaisaClient instance."""
    credentials = {
        "APP_NAME": creds.app_name,
        "APP_SOURCE": creds.app_source,
        "USER_ID": creds.user_id,
        "PASSWORD": creds.password,
        "USER_KEY": creds.user_key,
        "ENCRYPTION_KEY": creds.encription_key,
    }
    client = FivePaisaClient(cred=credentials)
    client.set_access_token(a_token.access_token, a_token.client_code)
    return client

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
    # Uncomment below to pretty-print as JSON if applicable
    # print(json.dumps(option_chain, indent=2))

if __name__ == "__main__":
    main()
