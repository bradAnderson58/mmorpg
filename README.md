# mmorpg
A Cool Game

## running locally:

in `/frontend` run the following commands:

`npm install .` (only need to do the first time)<br>
`npm run dev` - this will serve client on https://localhost:8080

in top level dir run the following commands (note you should be on python 3.7):
`pip install -r requirements.txt`
`python manage.py runserver` - this will serve the backend on http://localhost:8000

thats it for now

## deploy frontend:
in `/frontend` run the following commands (build pipeline not currently automated):

`npm run build` build the client (targets `dist/` directory)<br>
`aws s3 cp dist/ s3://mmorpg.website --recursive` push the dist to the static hosting s3 bucket