import creds
from py5paisa import FivePaisaClient
import json
import pyotp
import os
import requests
import pandas as pd
import io
import a_token
import file_paths


def fetch_scrip_master(saving_path):
    url = file_paths.scrip_master_url
    response = requests.get(url)

    if response.status_code == 200:
        csv_data = response.text
        df = pd.read_csv(io.StringIO(csv_data))  
        df.to_csv(saving_path, index=False)
        return df
    
    return None


def get_and_save_access_token(client: FivePaisaClient, token_path: str) -> str:
    """
    Generates TOTP, gets access token from 5paisa client, and saves it to a file.
    Returns the access token string.
    """
    totp = pyotp.TOTP(creds.TOTP_SECRET).now()
    client.get_totp_session(creds.client_code, totp, creds.pin)
    access_token = client.get_access_token()
    with open(token_path, "w") as f:
        f.write(f'access_token = "{access_token}"\n')
        f.write(f'client_code = "{creds.client_code}"\n')
    return access_token

def set_client():
    cred = {
        "APP_NAME": creds.app_name,
        "APP_SOURCE": creds.app_source,
        "USER_ID": creds.user_id,
        "PASSWORD": creds.password,
        "USER_KEY": creds.user_key,
        "ENCRYPTION_KEY": creds.encryption_key
    }
    client = FivePaisaClient(cred=cred)
    at = get_and_save_access_token(client, file_paths.token_file)
    print(at)
    return client

def main():
    scrip_df = fetch_scrip_master(file_paths.scrip_master)
    set_client()

if __name__ == "__main__":
    main()