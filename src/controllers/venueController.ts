import { ItemController } from "./itemController";
import { Venue } from "../models/Venue";
import { VenueService } from "../services/venueService";

export class VenueController extends ItemController<Venue> {
    service = new VenueService();

    constructor() {
        super();
        this.getAll = this.getAll.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
}