import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { IWeatherData, IForecastDay } from '../../models/weather.model';
import { catchError, finalize, takeUntil, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';

/**
 * Component for displaying weather information and search
 */
@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent extends BaseFormComponent implements OnInit {
  public form!: FormGroup;
  public weatherData: IWeatherData | null = null;
  public isMetric = true; // Default to metric units (Celsius)
  public forecastDays: IForecastDay[] = [];
  public currentDate = new Date();
  public activeTab: 'current' | 'forecast' | 'hourly' = 'current';
  public selectedDayIndex = 0;
  public hourlyForecast: any[] = [];

  /**
   * Constructor for WeatherComponent
   * @param formBuilder FormBuilder for creating reactive forms
   * @param weatherService Service for fetching weather data
   */
  constructor(
    private formBuilder: FormBuilder,
    private weatherService: WeatherService
  ) {
    super();
    this.form = this.formBuilder.group({
      location: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  /**
   * Initialize component with user's location
   */
  ngOnInit(): void {
    this.detectLocation();
  }

  /**
   * Detect user's location and get weather data
   */
  detectLocation(): void {
    this.setLoading(true);
    this.weatherService
      .getCurrentLocation()
      .pipe(
        switchMap((location) => {
          const locationQuery = `${location.city}, ${location.country}`;
          this.form.get('location')?.setValue(locationQuery);
          return this.weatherService.getWeatherForecast(locationQuery);
        }),
        catchError((error) => {
          if (error.name === 'WeatherApiError') {
            this.setError(error.message);
          } else {
            this.setError(
              'Could not detect your location. Please enter a location manually.'
            );
          }
          console.error('Location detection error:', error);
          return of(null);
        }),
        finalize(() => {
          this.setLoading(false);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          this.processWeatherData(data);
        }
      });
  }

  /**
   * Get weather data for the entered location
   */
  getWeather(): void {
    if (this.form.invalid) {
      return;
    }

    const location = this.form.get('location')?.value;
    this.setLoading(true);
    this.setError(null);
    this.weatherData = null;
    this.weatherService
      .getWeatherForecast(location)
      .pipe(
        catchError((error) => {
          // If it's our custom WeatherApiError, we can use its message
          if (error.name === 'WeatherApiError') {
            this.setError(error.message);
          } else {
            this.setError(
              error.message || 'An error occurred while fetching weather data'
            );
          }
          console.error('Weather fetch error:', error);
          return of(null);
        }),
        finalize(() => {
          this.setLoading(false);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          this.processWeatherData(data);
        }
      });
  }

  /**
   * Process the weather data received from the API
   * @param data The weather data to process
   */
  private processWeatherData(data: IWeatherData): void {
    this.weatherData = data;

    // Process forecast data if available
    if (data.forecast && data.forecast.forecastday) {
      this.forecastDays = data.forecast.forecastday;
      this.updateHourlyForecast(0); // Default to first day's hourly forecast
    }
  }

  /**
   * Update hourly forecast data based on selected day
   * @param dayIndex Index of the selected day
   */
  updateHourlyForecast(dayIndex: number): void {
    if (this.forecastDays && this.forecastDays.length > dayIndex) {
      this.selectedDayIndex = dayIndex;
      this.hourlyForecast = this.forecastDays[dayIndex].hour;
    }
  }

  /**
   * Switch between tabs (current, forecast, hourly)
   * @param tab The tab to switch to
   */
  switchTab(tab: 'current' | 'forecast' | 'hourly'): void {
    this.activeTab = tab;
  }

  /**
   * Toggle between metric and imperial units
   */
  toggleUnits(): void {
    this.isMetric = !this.isMetric;
  }

  /**
   * Format a date string to display day name
   * @param dateStr Date string to format
   * @returns Day name (e.g., "Monday")
   */
  formatDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  /**
   * Check if a form control is invalid and touched/dirty
   * @param controlName Name of the form control to check
   * @returns Whether the control is invalid and touched/dirty
   * @override from BaseFormComponent
   */
  override isControlInvalid(controlName: string): boolean {
    return super.isControlInvalid(controlName);
  }
}
