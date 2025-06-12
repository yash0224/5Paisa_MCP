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

def parse_args(args):
    if len(args) != 5:
        # print("Usage: python script.py <ExchOrderID> <Qty> <Price> <StopLossPrice>")
        # print("Use -1 for Qty, Price, or StopLossPrice if you want to skip them")
        sys.exit(1)
    
    try:
        EID = int(args[1])
        QTY = int(args[2])
        PR = float(args[3])
        SLPR = float(args[4])
    except ValueError:
        # print("Error: Invalid argument types. ExchOrderID and Qty must be int, Price and StopLossPrice must be float.")
        sys.exit(1)
    
    return EID, QTY, PR, SLPR

def build_order_params(EID, QTY, PR, SLPR):
    params = {"ExchOrderID": EID}
    if QTY != -1:
        params["Qty"] = QTY
    if PR != -1.0:
        params["Price"] = PR
    if SLPR != -1.0:
        params["StopLossPrice"] = SLPR
    return params

def main():
    EID, QTY, PR, SLPR = parse_args(sys.argv)
    # print(f"Parameters received - ExchOrderID: {EID}, Qty: {QTY}, Price: {PR}, StopLossPrice: {SLPR}")

    client = create_client()
    order_params = build_order_params(EID, QTY, PR, SLPR)
    response = client.modify_order(**order_params)

    print(json.dumps(response, indent=2))

if __name__ == "__main__":
    main()
