import { Location } from "./Location";

export interface Provider{
    id:number;
    name:string;
    phone?:string;
    contact_person?:string;
    email?:string;
    website?:string;
    headquarters?: Location;
}