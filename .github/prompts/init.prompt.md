---
mode: 'agent'
---
# Initialize Angular Weather Project

## Goal
Create a new Angular project (latest version) named "WeatherApp". This application will allow users to entera country name and view its current weather.
Create full MVP, don't skip until the end and don't leave any part of the code incomplete. Use the latest Angular version and ensure that the project is well-structured, using best practices for Angular development.

## Project Structure and Components
1.  **Core Structure**:
    *   Generate a new Angular project using `ng new WeatherApp --routing --style=scss`.
    *   Ensure the project uses standalone components where appropriate.
2.  **Main Component (`weather.component.ts`)**:
    *   This component will contain an input field for the country name and a button to trigger the weather search.
    *   It will display the weather information (e.g., temperature, description, humidity) for the entered country.
    *   Implement basic form handling (e.g., using `FormsModule` and `ngModel` or `ReactiveFormsModule`).
3.  **Service (`weather.service.ts`)**:
    *   Create a service to handle API calls to a weather data provider (use WeatherAPI).
    *   The service should have a method like `getWeatherByCountry(countryName: string)` that returns an Observable.
    *   **Note**: For the purpose of this initialization, you can mock the API response or use a free, public weather API. If a specific API key is needed, clearly state this in the `INSTRUCTIONS.md` and use a placeholder for the key in the service.
4.  **Interface/Model (`weather.model.ts`)**:
    *   Define an interface for the weather data structure.

## Functionality
1.  User types a country name into an input field.
2.  User clicks a "Get Weather" button.
3.  The application calls the weather service with the country name.
4.  The weather service fetches data from the weather API.
5.  The application displays the weather information for that country.
6.  Handle basic error scenarios (e.g., country not found, API error).

## Instructions
1.  Use the file Instructions: [./Code_styles.instructions.md](../instructions/Code_styles.instructions.md) to ensure the code is formatted correctly.

