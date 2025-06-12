import creds
import a_token
import json
from py5paisa import FivePaisaClient

def create_client():
    """Initializes and returns a FivePaisaClient instance with credentials."""
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
