import pandas as pd
import sys
import os
import file_paths  # Make sure this module defines `scrip_master` path

# Configure pandas to show full output (optional)
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)
pd.set_option('display.max_colwidth', None)
pd.set_option('display.width', None)

def find_scrip_codes_by_keyword_and_type(
    csv_path,
    keyword,
    exchange_type_filter,
    exchange,
    name_column='FullName',
    scrip_code_column='ScripCode',
    exchange_column='Exch',
    exchange_type_column='ExchType'
):
    """Filter scrip codes by keyword, exchange type, and exchange."""
    try:
        df = pd.read_csv(csv_path)
    except FileNotFoundError:
        print(f"Error: File not found at {csv_path}")
        sys.exit(1)

    name_matches = df[df[name_column].str.contains(keyword, case=False, na=False)]
    filtered = name_matches[
        (name_matches[exchange_type_column] == exchange_type_filter) &
        (name_matches[exchange_column] == exchange)
    ]

    if filtered.empty:
        print(f"No matches found for keyword: '{keyword}', Exchange Type: '{exchange_type_filter}', Exchange: '{exchange}'")
        return None

    return filtered[[scrip_code_column, exchange_column, exchange_type_column, name_column]]

def main():
    """Main function to parse args and print matching scrip info."""

    keyword = sys.argv[1]
    exchange_type = sys.argv[2]
    exchange = sys.argv[3]

    results = find_scrip_codes_by_keyword_and_type(
        file_paths.scrip_master,
        keyword,
        exchange_type,
        exchange
    )

    if results is not None:
        print(f"Found {len(results)} match(es):\n")
        print(results)

if __name__ == "__main__":
    main()
