import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface LocationData {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LocationData | ErrorResponse>
) {
  let userIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  
  // If it's a comma-separated list, take the first IP
  userIp = userIp.split(',')[0].trim();

  // Check if it's a localhost IP
  if (userIp === '::1' || userIp === '127.0.0.1' || userIp === 'localhost') {
    // For local development, you can either:
    // 1. Return a mock location
    return res.status(200).json({
      country: 'United States',
      countryCode: 'US',
      region: 'CA',
      regionName: 'California',
      city: 'San Francisco',
      zip: '94105',
      lat: 37.7749,
      lon: -122.4194,
      timezone: 'America/Los_Angeles',
      isp: 'Local ISP',
      org: 'Local Org',
      as: 'AS0000 Local AS',
      query: '8.8.8.8'  // Example public IP
    });

    // 2. Or, use a fallback public IP for testing (uncomment the following lines)
    // userIp = '8.8.8.8';  // Example: Google's public DNS IP
  }

  try {
    const response = await axios.get<LocationData>(`http://ip-api.com/json/${userIp}`);
    res.status(200).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // If the API returns an error response, send it to the client
      res.status(error.response.status).json(error.response.data as ErrorResponse);
    } else {
      // For other types of errors
      res.status(500).json({ error: 'Unable to fetch location data' });
    }
  }
}