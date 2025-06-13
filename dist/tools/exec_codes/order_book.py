import json
from clientCreation import create_client

def fetch_order_book(client):
    return client.order_book()

def main():
    client = create_client()
    order_book = fetch_order_book(client)
    print(json.dumps(order_book))

if __name__ == "__main__":
    main()
