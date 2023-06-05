from pcpartpicker import API
import json

api = API()
all_data = api.retrieve_all()

n = json.loads(all_data.to_json())
for x in all_data:
    print(x)
    with open("supabase/src/data/" + str(x) + ".json", "w") as f:
        json.dump({"data": n[x]}, f)
