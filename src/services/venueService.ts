import { Venue } from "../models/Venue";
import { ItemService } from "./itemService";

export class VenueService extends ItemService<Venue>{
    constructor() {
        super('Venues', 'venue');
    }
}