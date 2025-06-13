import sys
import json
from clientCreation import create_client

def parse_args(args):
    if len(args) != 5:
        sys.exit(1)
    
    try:
        EID = int(args[1])
        QTY = int(args[2])
        PR = float(args[3])
        SLPR = float(args[4])
    except ValueError:
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

    client = create_client()
    order_params = build_order_params(EID, QTY, PR, SLPR)
    response = client.modify_order(**order_params)

    print(json.dumps(response, indent=2))

if __name__ == "__main__":
    main()
