
export interface VenueInfo {
  name: string;
  address: string;
  description: string;
  mapUri?: string;
  placeId?: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
  };
}
