type Address = {
  formatted_address: string;
  route: string;
  street_number: string;
  city: string;
  state: string;
  postal: number;
  country: string;
  coordinate: {
    lat: number;
    lng: number;
  };
};

export { type Address };
