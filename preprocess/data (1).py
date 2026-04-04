import requests
import datetime
import os

# 📁 Folder create
SAVE_DIR = "methane_data"
os.makedirs(SAVE_DIR, exist_ok=True)

# 🔗 STAC API base
STAC_URL = "https://browser.stac.dataspace.copernicus.eu/api/v1/search"

# 📅 Last 7 days
end_date = datetime.datetime.utcnow()
start_date = end_date - datetime.timedelta(days=7)

# 🔍 Query parameters
query = {
    "collections": ["sentinel-5p-l2-ch4-offl"],
    "datetime": f"{start_date.isoformat()}Z/{end_date.isoformat()}Z",
    "limit": 20  # increase if needed
}

print("🔍 Fetching metadata...")

response = requests.post(STAC_URL, json=query)
data = response.json()

items = data.get("features", [])

print(f"✅ Found {len(items)} items")

# 📥 Download loop
for i, item in enumerate(items):
    try:
        assets = item["assets"]

        if "product" not in assets:
            continue

        file_url = assets["product"]["href"]

        filename = f"{SAVE_DIR}/methane_{i}.nc"

        print(f"⬇️ Downloading {filename}")

        r = requests.get(file_url, stream=True)

        with open(filename, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        print(f"✅ Saved: {filename}")

    except Exception as e:
        print(f"❌ Error: {e}")

print("🎉 All downloads complete!")