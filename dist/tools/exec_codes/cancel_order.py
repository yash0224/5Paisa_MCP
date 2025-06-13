import sys
import json
from clientCreation import create_client

def cancel_order(client, exch_order_id):
    return client.cancel_order(exch_order_id=exch_order_id)

def main():
    
    exch_order_id = int(sys.argv[1])

    client = create_client()
    response = cancel_order(client, exch_order_id)
    print(json.dumps(response, indent=2))

if __name__ == "__main__":
    main()
