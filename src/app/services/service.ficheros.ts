import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Fichero } from "../models/fichero";
import { environment } from "../../environments/environment";

@Injectable()
export class ServiceFicheros {
    url = environment.apiFiles;
    constructor(private _http: HttpClient) {}

    async subirFicheroAsync(fichero: Fichero): Promise<string> {
        let request = "api/TestingFiles";
        let json = JSON.stringify(fichero);
        let header = new HttpHeaders()
            .set("content-type", "application/json");
        return firstValueFrom(
            this._http.post(this.url + request, json, {
                headers: header,
                responseType: "text"
            })
        );
    }
}
