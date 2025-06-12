import json
import creds
import a_token
from py5paisa import FivePaisaClient

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
