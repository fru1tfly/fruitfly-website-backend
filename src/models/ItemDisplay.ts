export interface ItemDisplay extends Object {
    filters?: { [key:string]: any };
    sortColumn?:string;
    sortDirection?:string;
    pageSize?:number;
    pageNumber?:number;
}