# Accommodation Search

## Technical Coding Test

This project has a simple setup with an api, hooked up to MongoDB and a frontend piece initiated with [vite](https://vitejs.dev/).

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

## Task at hand

When the project is up and running, you should see a search-bar on the screen. This one is currently hooked up to the `/hotels` endpoint.
When you type in a partial string that is part of the name of the hotel, it should appear on the screen.
Ie. type in `resort` and you should see some Hotels where the word `resort` is present.

You will also see 2 headings called **"Countries"** and **"Cities"**.

The assignment is to build a performant way to search for Hotels, Cities or Countries.
Partial searches will be fine. Hotels will need to filterable by location as well.
Ie. The search `uni` should render

- Hotels that are located in the United States, United Kingdom or have the word `uni` in the hotel name.
- Countries that have `uni` in their name Ie. United States, United Kingdom
- No Cities as there is no match

Clicking the close button within the search field should clear out the field and results.

When clicking on one of the `Hotels`, `Cities` or `Countries` links, the application should redirect to the relevant page and render the selected `Hotel`, `City` or `Country` as a heading.

### Limitations

Given the time constraints, we do not expect a fully production-ready solution. We're primarily interested in the approach and the overall quality of the solution.
Feel free to modify the current codebase as needed, including adding or removing dependencies.
For larger or more time-intensive changes, you're welcome to outline your ideas in the write-up section below and discuss them further during the call.

<img src="./assets/search-example.png" width="400px" />

### Write-up

<!-- Write-up/conclusion section -->

#### Setup

- I am using my own MongoDB server, so before starting the applications, you will need to copy `.env.sample` into `.env` on the api folder

#### Decisions I've taken regarding developing a performant solution are explained below on both ends:

##### Backend:

- I've decided to use atlas search index for searching among the hotels collection, which in real life app can scale big. Index definition is:

```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "addressline1": {
        "type": "string"
      },
      "chain_name": {
        "type": "string"
      },
      "city": [
        {
          "type": "autocomplete"
        },
        {
          "type": "string"
        }
      ],
      "country": [
        {
          "type": "autocomplete"
        },
        {
          "type": "string"
        }
      ],
      "hotel_name": [
        {
          "type": "autocomplete"
        },
        {
          "type": "string"
        }
      ],
      "state": {
        "type": "string"
      },
      "zipcode": {
        "type": "string"
      }
    }
  },
  "storedSource": {
    "include": ["hotel_name"]
  }
}
```

I chose to use autocomplete for partially match hotel name, country and city, as well as string for full text search of hotel and chain name, and above mentioned location fields. Atlas search brings too many benefits when having complex search queries in collections that tends to be scalable and considered big, compared to other options as regex which can bring performance issues on big data queries. storedSource is including hotel name, because for this solution we only need the hotel name to display to the user interface, which is another addition to the performance optimizations. In real life app, we could also use fuzzy search and its options, to accomodate better product needs and implement a more refined search rules.

- I am boosting atlas search rules, which helps returning more relevant data on top of the list
- For countries and cities, which also in real life app can be a defined size collection, using atlas search for querying name would be an overkill compared to just using plain regex for querying on partial string matches, so I've decided to use regex for these two cases
- Last improvement I added on this scenario on the backend side, is paginating the hotels search. In this case is mostly a hack, as the search endpoint should query through three different collections, making pagination challenging. However, given the acceptance criteria of this scenario, countries and cities will be always rendered at the bottom of the hotels list, even if unpaginated. This detail gives us the freedom and ability to safely paginate hotels while scrolling down the list and not query for countries and cities until all hotels have been queried, reducing by this the response size and eventually the response time.

##### Frontend:

- On the frontend size, first improvement is to debounce the search input to only call the backend when the user stops typing
- Another improvement on the frontend sides is using tanstack query (or similar products for external state management) with built in cache functionalities. With that, we are creating cache entries for every search query the user is calling the backend, so the next time the user queries for the exact same search, we show immediate feedback on the screen while the api call is being resolved, and update right after if the backend response differs from the cached one. This will reduce the waiting time on the frontend on possible repeated api calls.
- Last improvement we can add on the frontend, although the response is paginated, is to use a virtualized list, which not only acts as an infinite scroller, but also removes list items that are no longer visible to the list viewport from the DOM, making the DOM not heavy when having big lists.

#### Assumptions

For timely reasons, I've not put any effort on the ui and nor proper folder structures, although still tried to have meaningful logic separations.

### Database structure

#### Hotels Collection

```json
[
  {
    "chain_name": "Samed Resorts Group",
    "hotel_name": "Sai Kaew Beach Resort",
    "addressline1": "8/1 Moo 4 Tumbon Phe Muang",
    "addressline2": "",
    "zipcode": "21160",
    "city": "Koh Samet",
    "state": "Rayong",
    "country": "Thailand",
    "countryisocode": "TH",
    "star_rating": 4
  },
  {
    /* ... */
  }
]
```

#### Cities Collection

```json
[
  { "name": "Auckland" },
  {
    /* ... */
  }
]
```

#### Countries Collection

```json
[
  {
    "country": "Belgium",
    "countryisocode": "BE"
  },
  {
    /* ... */
  }
]
```
