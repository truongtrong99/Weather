# Weather App Instructions

## Overview
This is a simple Angular application that allows users to search for weather information by country name. The app uses the WeatherAPI service to fetch weather data.

## Setup

### Prerequisites
- Node.js and npm installed
- Angular CLI installed globally (`npm install -g @angular/cli`)

### Installation
1. Clone or download this repository
2. Navigate to the project directory
3. Run `npm install` to install dependencies

### WeatherAPI Key Setup
This application requires a WeatherAPI key to function properly. Follow these steps to set it up:

1. Sign up for a free account at [WeatherAPI](https://www.weatherapi.com/)
2. After signing up, obtain your API key from the dashboard
3. Open the following files and replace `YOUR_WEATHERAPI_KEY_HERE` with your actual API key:
   - `src/environments/environment.ts`
   - `src/environments/environment.development.ts`

### Running the Application
1. After completing the setup, run `ng serve` to start the development server
2. Open your browser and navigate to `http://localhost:4200/`

## Features
- Search for weather information by country name
- View current temperature, conditions, humidity, wind speed, and more
- Error handling for invalid country names or API issues
- Responsive design

## Technology Stack
- Angular (latest version)
- TypeScript
- SCSS for styling
- WeatherAPI for weather data
