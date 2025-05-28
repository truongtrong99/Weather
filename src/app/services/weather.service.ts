import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IWeatherData } from '../models/weather.model';
import { environment } from '../../environments/environment';
import { catchError, map, retry, timeout } from 'rxjs/operators';

/**
 * Error class for Weather API specific errors
 */
export class WeatherApiError extends Error {
  constructor(public statusCode: number, message: string, public errorResponse?: any) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/**
 * Service for fetching weather data from the WeatherAPI
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // API base URL for current weather
  private readonly currentWeatherUrl = 'https://api.weatherapi.com/v1/current.json';
  // API base URL for forecast weather
  private readonly forecastUrl = 'https://api.weatherapi.com/v1/forecast.json';
  // Timeout value for requests in milliseconds (10 seconds)
  private readonly requestTimeout = 10000;
  // Number of retry attempts for failed requests
  private readonly maxRetryAttempts = 2;

  /**
   * Constructor for WeatherService
   * @param http HttpClient for making API requests
   */
  constructor(private http: HttpClient) { }

  /**
   * Get current weather data for a location
   * @param location Name of the location to get weather data for
   * @returns Observable with weather data
   */
  getWeatherByCountry(location: string): Observable<IWeatherData> {
    // Set up the query parameters for the API request
    const params = new HttpParams()
      .set('key', environment.weatherApiKey)
      .set('q', location)
      .set('aqi', 'no');

    return this.http.get<IWeatherData>(this.currentWeatherUrl, { params })
      .pipe(
        timeout(this.requestTimeout),
        retry(this.maxRetryAttempts),
        catchError(error => this.handleError(error, `Failed to fetch weather data for ${location}`))
      );
  }

  /**
   * Get weather forecast data for a location
   * @param location Name of the location to get forecast for
   * @param days Number of days for the forecast (max 10)
   * @returns Observable with forecast data
   */
  getWeatherForecast(location: string, days: number = 5): Observable<IWeatherData> {
    // Set up the query parameters for the API request
    const params = new HttpParams()
      .set('key', environment.weatherApiKey)
      .set('q', location)
      .set('days', days.toString())
      .set('aqi', 'no')
      .set('alerts', 'no');

    return this.http.get<IWeatherData>(this.forecastUrl, { params })
      .pipe(
        timeout(this.requestTimeout),
        retry(this.maxRetryAttempts),
        catchError(error => this.handleError(error, `Failed to fetch forecast data for ${location}`))
      );
  }

  /**
   * Get current location based on IP address
   * @returns Observable with the user's approximate location
   */
  getCurrentLocation(): Observable<{ city: string; country: string }> {
    return this.http.get<any>('https://api.weatherapi.com/v1/ip.json', {
      params: new HttpParams().set('key', environment.weatherApiKey)
    }).pipe(
      timeout(this.requestTimeout),
      map(response => ({
        city: response.city,
        country: response.country_name
      })),
      catchError(error => {
        console.error('Error detecting location:', error);
        // Fall back to a default location if detection fails
        return of({ city: 'London', country: 'UK' });
      })
    );
  }

  /**
   * Handles HTTP errors from API calls
   * @param error The error from the HTTP request
   * @param fallbackMessage A friendly message for the user
   * @returns An observable that throws a user-friendly error
   */
  private handleError(error: HttpErrorResponse, fallbackMessage: string): Observable<never> {
    let errorMessage = fallbackMessage;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );

      // Handle specific API errors
      if (error.status === 400) {
        // Usually means invalid location
        errorMessage = 'Invalid location. Please check the spelling and try again.';
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = 'API key error. Please check your API credentials.';
      } else if (error.status === 404) {
        errorMessage = 'Location not found. Please try a different location.';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.status >= 500) {
        errorMessage = 'Weather service is currently unavailable. Please try again later.';
      }
    }

    // Return a custom error object
    return throwError(() => new WeatherApiError(
      error.status || 0,
      errorMessage,
      error.error
    ));
  }
}
