interface Position {
  lat: number;
  lng: number;
}

interface POV {
  heading: number;
  pitch: number;
}

export interface Location {
  position: Position;
  pov: POV;
}
