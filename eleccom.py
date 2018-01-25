import os
from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'eleccon_clean')
#MONGODB_PORT = 27017
COLLECTION_NAME = 'projects'


@app.route("/")
def index():
    """
    A Flask view to serve the main dashboard page.
    """
    return render_template("index.html")


@app.route("/electric/projects")
def eleccom_projects():
    """
    A Flask view to serve the project data from
    MongoDB in JSON format.
    """

    # A constant that defines the record fields that we wish to retrieve.


    FIELDS = {
       '_id': False,
       'date': True,
       'led': True,
       'lighting_total': True,
       'cold_total': True,
       'wet_total': True,
       'tv': True,
       'set_top_box': True,
       'dvd_vcr': True,
       'games': True,
       'power_units': True,
       'electronics_total': True,
       'computing_total': True,
       'cooking_total': True,
       'oil_equivalent': True,
       'electric_consumed': True,
      }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    # with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
    with MongoClient(MONGO_URI) as conn:
    # Define which collection we wish to access
        collection = conn[DBS_NAME][COLLECTION_NAME]
    # Retrieve a result set only with the fields defined in FIELDS
    # and limit the the results to 55000
        projects = collection.find(projection=FIELDS, limit=20000)
    # Convert projects to a list in a JSON object and return the JSON data
        return json.dumps(list(projects))


if __name__ == "__main__":
    app.run(debug=True)
