import { HttpService } from '@nestjs/axios';
export type IP = string;
export interface IPLocation {
    country: string;
    country_code: string;
    region: string;
    region_code: string;
    city: string;
    zip: string;
    [key: string]: any;
}
export declare class IPService {
    private readonly httpService;
    constructor(httpService: HttpService);
    private queryLocationByIP_API;
    private queryLocationByAPICo;
    queryLocation(ip: IP): Promise<IPLocation | null>;
}
