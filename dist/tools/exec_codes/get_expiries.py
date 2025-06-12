import sys
import json
import pandas as pd
import creds
import a_token
from py5paisa import FivePaisaClient

# Optional: Configure pandas to show full data in debug/dev mode
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)
pd.set_option('display.width', None)

def create_client():
    """Initializes and returns a FivePaisaClient with credentials."""
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

def fetch_expiry(client, exchange: str, asset_type: str):
    """Fetches expiry dates of options chains for a given exchange and asset type."""
    return client.get_expiry(exchange, asset_type)

def main():
    """Main function to fetch and display expiry data."""

    exchange = sys.argv[1]
    asset_type = sys.argv[2]

    client = create_client()
    expiry_data = fetch_expiry(client, exchange, asset_type)

    # Output as JSON string if needed, or just print the raw object
    # print(json.dumps(expiry_data, indent=2))
    print(expiry_data)

if __name__ == "__main__":
    main()
