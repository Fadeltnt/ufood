UFood
---

### This is a Restaurant rating webApp built with React + Vite

## Usage
### Install Dependencies and Run Server

#### 1. Navigate to the root directory of the project
#### 2. Install Dependencies and run the server

A script has already been written to install the necessary dependencies and run the server on localhost.
Just run the following command:

`npm run livrable3`
#### 3. Open Chome and navigate to localhost:5173
It is crucial that the app starts on the port 5173 since this is the origin that the Google OAuth client is expecting. Otherwise the Google login service will not work.

---

### Our application offers the following endpoints: 

- `/` for the HomePage
- `/restaurant/:id` for a designated restaurant's page
- `/user` for the logged in user's page
- `/login` for the login page
- `/register` for the registration page
- `/VisitModalDetails/:idRestaurant/:name` for the details for a restaurant's reviews
- `/modal` for the general visit modal
