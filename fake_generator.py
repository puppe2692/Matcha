from faker import Faker

t1 = Faker("fr_FR")
for _ in range(10):
	print(t1.name())
