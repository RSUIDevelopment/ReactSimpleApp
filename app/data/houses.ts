import { House, Location } from '../types/GoogleMaps';

export const houses: House[] = [
  {
    id: 1,
    name: 'Mike',
    location: {
      position: { lat: 33.8520094, lng: -84.2745642 },
      pov: {
        heading: 108,
        pitch: 5
      }
    }
  },
  {
    id: 2,
    name: 'Robin',
    location: {
      position: { lat: 33.8392359, lng: -84.2744222 },
      pov: {
        heading: 5,
        pitch: 5
      }
    }
  },
  {
    id: 3,
    name: 'Trey',
    location: {
      position: { lat: 33.837296, lng: -84.284807 },
      pov: {
        heading: 5,
        pitch: 5
      }
    }
  },
  {
    id: 4,
    name: 'Matt',
    location: {
      position: { lat: 33.8221623, lng: -84.2780801 },
      pov: {
        heading: 5,
        pitch: 5
      }
    }
  },
  {
    id: 5,
    name: 'Sri',
    location: {
      position: { lat: 33.8179015, lng: -84.2879042 },
      pov: {
        heading: 180,
        pitch: 5
      }
    }
  }
];

export const getLocationForId = (id: number): Location => {
  const found = houses.find(h => h.id === id) as House;
  return found.location;
};
