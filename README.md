# Natures-Mood
Allows users to search for locations within the United States and view its weather. Users are able to save and track desired locations.

### Technologies Used
* JavaScript ES6
* Express.js
* ReactJS
* PG-Promise
* AJAX
* CSS/HTML
* babel

### API Data
##### wunderground - <https://www.wunderground.com>

<p>
wunderground allows for multiple search parameters as well as provides JSON and XML
formatting.
Currently Nature's Mood uses the free version of the API.
</p>

Limitations of the free version include:
* 500 API request a day
* 10 API request a min
* Users can only request the same location once every 10 mins.

### Forking and Using Nature's Mood!
<p>If you wish to fork and play around with the code, follow these steps to get it up and running on your computer!</p>
* Clone git repo
* npm install with node.js
* Create a .env file with the following and fill with your personal info. Make sure this file is in your .gitignore.
  * DB=
  * DB_USER=
  * DB_PASS=
  * SECRET=
  * API_KEY=
* In your bash terminal run the following commands in different tabs.
  * npm run bundle (compiles react components)
  * node server.js (runs server)
  * pg_ctl start  -D '/usr/local/var/postgres' (conects to database)
