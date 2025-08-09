export interface Show {
    id: number;
    
    showName: string;
    date: string;
    imgUrl: string;
    otherActs: string[];

    // venue data
    venueName: string;
    address: string;
    city: string;
    ageRestriction: string;

    // Start times (stringified for data transfer)
    doorsTime: string;
    showTime: string;
    setTime: string;

    // Link to external site for tickets
    ticketUrl: string;

    // String as opposed to number for flexibility (ex. "$10 suggested donation")
    price: string;
}

export interface ShowDTO {
    id: number;

    venue_id: string;
    showName: string;

    date: string;
    imgUrl: string;
    otherActs: string;

    doorsTime: string;
    showTime: string;
    setTime: string;

    ticketUrl: string;
    price: string;
}