export type SearchResult = {
    carrier: { name: string };
    start_station: string;
    end_station: string;
    departure_datetime: Date;
    arrival_datetime: Date;
    provider_website: string;
    total_seats: number;
    available_seats: number;
};

export type FormData = {
    departure_date: string;
    start_station: string;
    end_station: string;
    passenger_count: string;
};

export const initialFormData: FormData = {
    departure_date: '',
    start_station: '',
    end_station: '',
    passenger_count: '',
};

export type Filters = {
    carrier: string;
    timeFrom: string;
    timeTo: string;
    durationFrom: string;
    durationTo: string;
};

export const initialFilters: Filters = {
    carrier: '',
    timeFrom: '',
    timeTo: '',
    durationFrom: '',
    durationTo: '',
};
