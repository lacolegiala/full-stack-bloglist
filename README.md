# Backend for bloglist

## How to develop

Before running project, do the following steps:
- Create `.env` file to the project root
- Required variables:
  - `MONGODB_URI` the database url
  - `TEST_MONGODB_URI` the database url for testing
  - `BLOG_PASSWORD` password to access the database
  - `SECRET` required for token creation
  - `PORT` the localhost port

The project can be run with the following commands:

- `npm run dev` (development mode)
- `npm start` (production mode)

