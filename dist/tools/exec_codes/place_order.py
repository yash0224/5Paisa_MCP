import sys
import json
import creds
import a_token
from py5paisa import FivePaisaClient
import pyotp

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

def get_last_traded_price(client, exchange, exchange_type, scrip_code):
    market_snapshot = client.fetch_market_snapshot([{
        "Exchange": exchange,
        "ExchangeType": exchange_type,
        "ScripCode": scrip_code
    }])
    ltp = float(market_snapshot['Data'][0]['LastTradedPrice'])
    return ltp

def parse_args(args):

    OT = sys.argv[1]
    EX = sys.argv[2]  
    ET = sys.argv[3]  
    SC = int(sys.argv[4])  
    QT = int(sys.argv[5])  
    PR = float(sys.argv[6])  
    try:
        SLP = sys.argv[7]
    except IndexError:
        SLP = 0
    try:
        ID = sys.argv[8]
    except IndexError:
        ID = 0
    TOTP = int(sys.argv[9])

    return OT, EX, ET, SC, QT, PR, SLP, ID, TOTP

def place_order(client, OT, EX, ET, SC, QT, PR, SLP, ID):
    # If price is 0, use adjusted LTP:
    # For Buy (B): LTP * 1.01
    # For Sell (S): LTP * 0.99
    if PR == 0:
        ltp = get_last_traded_price(client, EX, ET, SC)
        if OT.upper() == 'B':
            PR = round(ltp * 1.01, 2)
        elif OT.upper() == 'S':
            PR = round(ltp * 0.99, 2)
        else:
            raise ValueError(f"Unsupported OrderType '{OT}'. Expected 'B' or 'S'.")

    order = client.place_order(
        OrderType=OT,
        Exchange=EX,
        ExchangeType=ET,
        ScripCode=SC,
        Qty=QT,
        Price=PR,
        StopLossPrice=SLP,
        IsIntraday=ID
    )
    return order

def main():
    OT, EX, ET, SC, QT, PR, SLP, ID, TOTP = parse_args(sys)
    client = create_client()
    otp = pyotp.TOTP(creds.TOTP_SECRET).now()
    if int(TOTP) == int(otp):
        order_response = place_order(client, OT, EX, ET, SC, QT, PR, SLP, ID)
    else:
        order_response = "{Enter right TOTP}"

    print(json.dumps(order_response, indent=2))

if __name__ == "__main__":
    main()
