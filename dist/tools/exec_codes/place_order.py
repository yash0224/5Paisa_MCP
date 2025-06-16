import sys
import json
from clientCreation import create_client
import creds
import pyotp
from datetime import datetime

def generate_mcp_string():
    now = datetime.now()
    mcp_string = now.strftime("MCP%Y%m%d%H%M%S") + f"{now.microsecond // 1000:02d}"  
    return mcp_string

def parse_args(args):

    OT = args[1]
    EX = args[2]  
    ET = args[3]  
    SC = int(args[4])  
    QT = int(args[5])  
    PR = float(args[6])  
    SLP = float(args[7])
    ID = args[8]
    AHP = args[9]
    TOTP = int(args[10])

    return OT, EX, ET, SC, QT, PR, SLP, ID, AHP, TOTP

def build_order_params(OT, EX, ET, SC, QT, PR, SLP, ID, AHP, ROI):
    
    params = {"OrderType": OT}
    params["Exchange"] = EX
    params["ExchangeType"] = ET
    params["ScripCode"] = SC
    params["Qty"] = QT
    params["Price"] = PR
    if SLP != -1:
        params["StopLossPrice"] = SLP
    if ID != 'false':
        params["IsIntraday"] = ID
    if AHP != 'N':
        params["AHPlaced"] = AHP
    params["RemoteOrderID"] = ROI
    return params


def main():
    OT, EX, ET, SC, QT, PR, SLP, ID, AHP, TOTP = parse_args(sys.argv)
    ROI = generate_mcp_string()
    order_params = build_order_params(OT, EX, ET, SC, QT, PR, SLP, ID, AHP, ROI)
    
    client = create_client()
    
    otp = pyotp.TOTP(creds.TOTP_SECRET).now()
    
    if int(otp) == int(TOTP):
        order_response = client.place_order(**order_params)
    else:
        order_response = "{Enter right TOTP}"

    print(json.dumps(order_response, indent=2))

if __name__ == "__main__":
    main()
