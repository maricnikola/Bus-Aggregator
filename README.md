# BusAggregator - Django Backend

## Overview
**BusAggregator** is a web application that allows users to search for departures and arrivals from various transport carriers between different cities. The backend is built with Django.

## Features
- **Search for Routes**: Users can search for departures by providing:
  - Departure date
  - Departure location
  - Arrival location
  - Number of passengers
  
  The search results include a list of available departures, each with a link to the provider's website.

- **Result Filters**: Users can filter the search results based on:
  - Carrier
  - Time (from-to)
  - Duration of travel (from-to)

- **User Registration**: Secure user registration with an account activation process via email.

- **Token-based Authentication**: Implements token authentication to secure API endpoints.


## Requirements

To run this project, you'll need:

- Python 3.x
- Django 3.x or higher
- Virtual environment management tool (e.g., `venv`, `virtualenv`)

## Installation

### Clone the repository
```bash
git clone http://tiaclab.com:9009/praksa_2024/praksa2024_bus_aggregator_back.git
```

### Create a virtual environment
```bash
python -m venv venv
venv\Scripts\activate
```

### Install dependencies
```bash
pip install -r requirements.txt
```

### Create a superuser (optional)
#### If you want to access the Django admin panel, create a superuser account:
```bash
python manage.py createsuperuser
```

### Run the development server
#### Finally, run the development server:
```bash
python manage.py runserver
```

# BusAggregator - React Frontend

## Overview
**BusAggregator** is a web application that allows users to search for departures and arrivals from various transport carriers between different cities. The frontend is built with Django.

## Prerequisites

Make sure you have the following installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Install Dependencies
```bash
npm install
```
## Run the Application
```bash
npm run dev
```
## Access the Application
**Once the server is running, you can access the application in your web browser at:**
**http://localhost:5173**

