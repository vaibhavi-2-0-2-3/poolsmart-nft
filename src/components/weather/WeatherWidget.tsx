
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Cloud, Sun, CloudRain, CloudSnow, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherWidgetProps {
  location: string;
  date: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location, date }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, [location, date]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock weather data since we don't have a real API key
      // In production, you would use: https://api.openweathermap.org/data/2.5/forecast
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      const mockWeatherData: WeatherData = {
        temperature: Math.floor(Math.random() * 20) + 10, // 10-30°C
        description: ['Clear sky', 'Light rain', 'Partly cloudy', 'Sunny'][Math.floor(Math.random() * 4)],
        icon: ['01d', '10d', '03d', '01d'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
      };

      setWeather(mockWeatherData);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    switch (iconCode) {
      case '01d':
      case '01n':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case '10d':
      case '10n':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case '13d':
      case '13n':
        return <CloudSnow className="h-8 w-8 text-blue-200" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          <div>
            <p className="font-medium">Loading weather...</p>
            <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Cloud className="h-8 w-8 text-gray-400" />
          <div>
            <p className="font-medium text-muted-foreground">Weather unavailable</p>
            <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getWeatherIcon(weather.icon)}
          <div>
            <p className="font-medium">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground">{weather.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{formatDate(date)}</p>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Wind className="h-3 w-3 mr-1" />
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
