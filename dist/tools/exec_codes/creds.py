import json
import os
from pathlib import Path

# Get the absolute path to the creds.json file
creds_path = Path(__file__).resolve().parents[3] / "creds.json"

# Load the credentials from creds.json
with open(creds_path, 'r') as f:
    creds = json.load(f)

app_name = creds.get('app_name')
app_source = creds.get('app_source')
user_id = creds.get('user_id')
password = creds.get('password')
user_key = creds.get('user_key')
encryption_key = creds.get('encryption_key')
client_code = creds.get('client_code')
TOTP_SECRET = creds.get('TOTP_SECRET') 
pin = creds.get('pin')
