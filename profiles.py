import requests
from faker import Faker
import random
import sys
import json

fake = Faker()

def fetch_random_user():
	try:
		response = requests.get('https://randomuser.me/api/')
		response.raise_for_status()
		data = response.json()
		return data
	except requests.RequestException as e:
		print('Error fetching data:', e)
		return None

def convert_data(data):
	res = {}
	res["username"] = data["login"]["username"]
	res["email"] = data["email"]
	res["password"] = "Password1"
	res["firstname"] = data["name"]["first"]
	res["lastname"] = data["name"]["last"]
	res["gender"] = data["gender"]
	res["sex_pref"] = random.choice(['Man', 'Woman', 'Both'])
	res["bio"] = fake.text(max_nb_chars=200)
	res["hashtags"] = ",".join([f'#{fake.word()}' for _ in range(random.randint(1, 5))])
	res["age"] = data["dob"]["age"]
	res["verified"] = True
	res["profile_picture"] = [data["picture"]["medium"]]
	return res


profiles = []

nb = 50
for _ in range(nb):
	print(f"{_ + 1}/{nb}")
	user_data = fetch_random_user()
	if user_data:
		profiles.append(convert_data(user_data["results"][0]))

json_data = json.dumps(profiles, indent=4)

with open("fake_profiles.json", "w") as f:
	f.write(json_data)
