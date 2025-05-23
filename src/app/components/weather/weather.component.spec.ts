import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';

import { WeatherComponent } from './weather.component';
import { WeatherService } from '../../services/weather.service';
import { IWeatherData } from '../../models/weather.model';

// Mock weather data for testing
const mockWeatherData: IWeatherData = {
  location: {
    name: 'London',
    country: 'United Kingdom',
    region: 'City of London, Greater London',
    lat: 51.52,
    lon: -0.11,
    localtime: '2025-05-22 14:30',
  },
  current: {
    temp_c: 18.0,
    temp_f: 64.4,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003,
    },
    humidity: 72,
    wind_kph: 14.4,
    wind_mph: 8.9,
    wind_dir: 'WSW',
    pressure_mb: 1012.0,
    pressure_in: 29.88,
    feelslike_c: 18.0,
    feelslike_f: 64.4,
  },
};

// Mock weather service
class MockWeatherService {
  getWeatherByCountry = jasmine
    .createSpy('getWeatherByCountry')
    .and.returnValue(of(mockWeatherData));
}

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherService: WeatherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, WeatherComponent],
      providers: [
        FormBuilder,
        { provide: WeatherService, useClass: MockWeatherService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a form with country control', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('country')).toBeDefined();
  });

  it('should validate country input - required', () => {
    const countryControl = component.form.get('country');

    countryControl?.setValue('');
    expect(countryControl?.valid).toBeFalsy();
    expect(countryControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate country input - minLength', () => {
    const countryControl = component.form.get('country');

    countryControl?.setValue('A');
    expect(countryControl?.valid).toBeFalsy();
    expect(countryControl?.errors?.['minlength']).toBeTruthy();

    countryControl?.setValue('UK');
    expect(countryControl?.valid).toBeTruthy();
  });

  it('isControlInvalid should return true for invalid and touched/dirty control', () => {
    const countryControl = component.form.get('country');

    countryControl?.setValue('');
    countryControl?.markAsTouched();

    expect(component.isControlInvalid('country')).toBeTruthy();
  });

  it('isControlInvalid should return false for valid control', () => {
    const countryControl = component.form.get('country');

    countryControl?.setValue('UK');
    countryControl?.markAsTouched();

    expect(component.isControlInvalid('country')).toBeFalsy();
  });

  it('should not call getWeatherByCountry when form is invalid', () => {
    // Form is initially empty and invalid
    component.getWeather();
    expect(weatherService.getWeatherByCountry).not.toHaveBeenCalled();
  });

  it('should call getWeatherByCountry with correct country and set weatherData on success', fakeAsync(() => {
    // Set a valid country
    component.form.get('country')?.setValue('UK');

    component.getWeather();
    tick();

    expect(weatherService.getWeatherByCountry).toHaveBeenCalledWith('UK');
    expect(component.weatherData).toEqual(mockWeatherData);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  }));

  it('should handle error when getWeatherByCountry fails', fakeAsync(() => {
    const errorResponse = {
      error: {
        error: {
          message: 'Country not found',
        },
      },
    };

    (weatherService.getWeatherByCountry as jasmine.Spy).and.returnValue(
      throwError(() => errorResponse)
    );

    // Set a valid country
    component.form.get('country')?.setValue('NonExistentCountry');

    component.getWeather();
    tick();

    expect(component.weatherData).toBeNull();
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Country not found');
  }));

  it('should handle error with default message when specific error message is not available', fakeAsync(() => {
    const errorResponse = { status: 500 }; // No specific error message

    (weatherService.getWeatherByCountry as jasmine.Spy).and.returnValue(
      throwError(() => errorResponse)
    );

    // Set a valid country
    component.form.get('country')?.setValue('UK');

    component.getWeather();
    tick();

    expect(component.error).toBe(
      'An error occurred while fetching weather data'
    );
  }));

  it('should show loading state while fetching data', fakeAsync(() => {
    // Use a delayed response to test loading state
    (weatherService.getWeatherByCountry as jasmine.Spy).and.returnValue(
      of(mockWeatherData).pipe(delay(100))
    );

    component.form.get('country')?.setValue('UK');
    component.getWeather();

    expect(component.loading).toBeTrue();

    tick(100);
    expect(component.loading).toBeFalse();
  }));

  // Test DOM interactions
  it('should disable submit button when form is invalid', () => {
    component.form.get('country')?.setValue(''); // Invalid
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('.search-button')
    ).nativeElement;
    expect(submitButton.disabled).toBeTrue();
  });

  it('should show error message when country control is invalid and touched', () => {
    const countryControl = component.form.get('country');
    countryControl?.setValue('');
    countryControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain(
      'Please enter a valid country name'
    );
  });

  it('should display weather data after successful API call', fakeAsync(() => {
    component.form.get('country')?.setValue('UK');
    component.getWeather();
    tick();
    fixture.detectChanges();

    const locationElement = fixture.debugElement.query(
      By.css('.location-info h2')
    );
    const temperatureElement = fixture.debugElement.query(
      By.css('.temperature h3')
    );

    expect(locationElement.nativeElement.textContent).toContain(
      'London, United Kingdom'
    );
    expect(temperatureElement.nativeElement.textContent).toContain(
      '18°C / 64.4°F'
    );
  }));
});

// Helper function to mock delay
function delay(ms: number) {
  return (observable: any) =>
    new Observable((subscriber) => {
      const subscription = observable.subscribe({
        next(value: any) {
          setTimeout(() => subscriber.next(value), ms);
        },
        error(error: any) {
          setTimeout(() => subscriber.error(error), ms);
        },
        complete() {
          setTimeout(() => subscriber.complete(), ms);
        },
      });

      return () => subscription.unsubscribe();
    });
}
