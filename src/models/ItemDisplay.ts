export class ItemDisplay extends Object {
    filters?: { [key:string]: any };
    sortColumn?:string = '';
    sortDirection?:string = 'ASC';
    pageSize?:number = 0;
    pageNumber?:number = 0;

    static extractFromUrlQuery(query: Record<string, unknown>): ItemDisplay {
        const template = new ItemDisplay();
        return template;
    }
}