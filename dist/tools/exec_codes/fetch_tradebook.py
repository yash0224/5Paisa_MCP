import json
import creds
import a_token
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
