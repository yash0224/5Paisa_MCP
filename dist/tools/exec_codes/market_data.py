import sys
import json
import pandas as pd
from clientCreation import create_client

# Optional: Pretty display for debugging
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)
pd.set_option('display.width', None)

def fetch_historical_data(client, exchange, exchange_type, scrip_code, time_frame, from_date, to_date):
    """Fetches historical candle data."""
    return client.historical_data(exchange, exchange_type, scrip_code, time_frame, from_date, to_date)

def main():
    """Main function for CLI argument parsing and data printing."""

    exchange = sys.argv[1]
    exchange_type = sys.argv[2]
    scrip_code = int(sys.argv[3])
    time_frame = sys.argv[4]
    from_date = sys.argv[5]
    to_date = sys.argv[6]

    client = create_client()
    data = fetch_historical_data(client, exchange, exchange_type, scrip_code, time_frame, from_date, to_date)

    print(data)  # This is usually a list of dicts; can convert to DataFrame if needed

if __name__ == "__main__":
    main()
