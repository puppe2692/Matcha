import requests
from faker import Faker
import random
import sys
import json

fake = Faker()

hashtags = ["#hiking", "#cooking", "#movies", "#nature", "#sport", "#foodie", "#well-being", "#cat", "#dog", "#livelaughlove", "#gaming", "#kids"]

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
	res["gender"] = data["gender"].capitalize()
	res["sex_pref"] = random.choice(['Male', 'Female', 'Both'])
	res["bio"] = fake.text(max_nb_chars=200)
	res["hashtags"] = random.sample(hashtags, random.randint(1, 5))
	res["age"] = data["dob"]["age"]
	res["verified"] = True
	res["profile_picture"] = [data["picture"]["large"]]
	res["latitude"] = random.uniform(44.0, 50.0)
	res["longitude"] = random.uniform(0.0, 5.0)
	res["fame_rating"] = random.randint(0, 20)
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
