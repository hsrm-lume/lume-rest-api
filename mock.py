import requests
import random
import datetime
import uuid


def iso_to_date(iso_date):
    return datetime.datetime.strptime(iso_date, "%Y-%m-%d")


def add_minutes(date, minutes):
    return date + datetime.timedelta(minutes=minutes)


def rnd(low, high, clip=False):
    low = int(low)
    high = int(high)
    if not clip:
        return random.randint(low, high)
    if low == high or low < 0 or high < 0:
        return 0
    return max(random.randint(low, high), 0)


class Point():
    def __init__(self, lat, lng, age, uuid):
        self.lat = lat
        self.lng = lng
        self.age = age
        self.uuid = uuid


class Tree():
    def __init__(self, p: Point):
        self.p = p
        self.children = list()

    def save(self):
        pass
        for c in self.children:
            requests.post("http://localhost:3000/v1/new", json={
                "uuidParent": self.p.uuid,
                "uuidChild": c.p.uuid,
                "position": {
                    "lat": c.p.lat,
                    "lng": c.p.lng
                },
                "date": c.p.age.timestamp()  # for dev purposes manual setting of date
            })
            c.save()

    def randomize(self, m) -> 'Tree':
        r = rnd(m/2, m, clip=True)
        for _ in range(r):
            age = add_minutes(self.p.age, rnd(0, 60*24))
            pointDiff = list(
                map(lambda x: x/10000, [rnd(-1000, 1000), rnd(-1000, 1000)]))
            self.children.append(
                Tree(
                    Point(
                        self.p.lat + pointDiff[0],
                        self.p.lng + pointDiff[1],
                        age,
                        str(uuid.uuid4())
                    )
                ).randomize(m-2)
            )
        return self


root = Tree(
    Point(
        50.09692895957101,
        8.21682929992676,
        iso_to_date("2021-01-01"),
        "00000000-0000-4000-A000-000000000000"
    )
).randomize(10)

print(root.save())
print("ok")
