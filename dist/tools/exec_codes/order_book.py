import json
import creds
import a_token
from py5paisa import FivePaisaClient

def create_client():
    cred = {
        "APP_NAME": creds.app_name,
        "APP_SOURCE": creds.app_source,
        "USER_ID": creds.user_id,
        "PASSWORD": creds.password,
        "USER_KEY": creds.user_key,
        "ENCRYPTION_KEY": creds.encription_key
    }
    client = FivePaisaClient(cred=cred)
    client.set_access_token(a_token.access_token, a_token.client_code)
    return client

def fetch_order_book(client):
    return client.order_book()

def main():
    client = create_client()
    order_book = fetch_order_book(client)
    print(json.dumps(order_book))

if __name__ == "__main__":
    main()
