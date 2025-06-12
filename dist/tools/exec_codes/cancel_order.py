import sys
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

def cancel_order(client, exch_order_id):
    return client.cancel_order(exch_order_id=exch_order_id)

def main():
    
    exch_order_id = int(sys.argv[1])

    client = create_client()
    response = cancel_order(client, exch_order_id)
    print(json.dumps(response, indent=2))

if __name__ == "__main__":
    main()
