import { Location } from "./Location";

export interface Carrier{
    id:number;
    name:string;
    phone?:string;
    contact_person?:string;
    email?:string;
    website?:string;
    logo?:string;
    headquarters?: Location;
}
