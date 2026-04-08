# 101488823 - Lab Test 2 - COMP3133

## SpaceX Mission Tracker

An Angular application that displays SpaceX launch data using the SpaceX REST API. Users can browse all missions, filter by launch year and success status, and view detailed information about each mission.

## Features Implemented

- **Mission List** - Displays all SpaceX launches with mission patch, name, year, details, and rocket info
- **Mission Filter** - Filter missions by launch year, successful launch (true/false), and successful landing (true/false) using the SpaceX API query parameters
- **Mission Details** - View full details of a selected mission including rocket info, launch site, launch date, and links to articles/Wikipedia/videos
- **SpaceX API Service** - Angular service using HttpClient to fetch data from the SpaceX v3 REST API
- **TypeScript Interfaces** - Strongly typed Mission interface for API response data
- **Angular Material UI** - Material toolbar, cards, buttons, icons, select dropdown, spinner, and form fields
- **Angular Signals** - All component state managed with Angular signals
- **Reactive Forms** - Year selection dropdown uses FormControl with ReactiveFormsModule
- **New Control Flow** - Uses @for, @if, @else, and @switch throughout all templates
- **Pipes** - UpperCasePipe for rocket names, DatePipe for launch dates

## Screenshots

### Mission List Page
Displays all SpaceX launches in a scrollable card list. Each card shows the mission patch, mission name, launch year, details, and rocket information.

![Mission List](screenshots/Screenshot%202026-04-08%20170006.png)

### Mission Filter Page
Sidebar with year buttons, successful launch filter, and successful landing filter. Results display in a grid with mission patches and key info.

![Mission Filter](screenshots/Screenshot%202026-04-08%20170032.png)

### Mission Details Page
Shows full mission details including the large mission patch, mission name, flight number, launch year, launch date, launch success status, rocket name and type, launch site, launch details text, and links to external resources.

![Mission Details](screenshots/Screenshot%202026-04-08%20170044.png)

## Instructions to Run the Project

### Prerequisites
- Node.js (v18 or higher)
- npm

### Steps

1. Clone the repository:
```bash
git clone https://github.com/vynguyen175/COMP3133.git
cd COMP3133/101488823-lab-test2-comp3133
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npx ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

## Live Deployment

The application is deployed on Vercel: [https://101488823-lab-test2-comp3133.vercel.app](https://101488823-lab-test2-comp3133.vercel.app)

## API Reference

- All launches: `https://api.spacexdata.com/v3/launches`
- Filter by year: `https://api.spacexdata.com/v3/launches?launch_year=2016`
- Mission details: `https://api.spacexdata.com/v3/launches/{flight_number}`

## Tech Stack

- Angular 21
- Angular Material
- TypeScript
- SpaceX REST API v3
