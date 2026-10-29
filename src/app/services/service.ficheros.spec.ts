import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ServiceFicheros } from './service.ficheros';
import { Fichero } from '../models/fichero';

describe('ServiceFicheros', () => {
  it('envía el nombre y el base64 como JSON al endpoint del profesor', async () => {
    TestBed.configureTestingModule({ providers: [ServiceFicheros, provideHttpClient(), provideHttpClientTesting()] });
    const service = TestBed.inject(ServiceFicheros);
    const http = TestBed.inject(HttpTestingController);
    const fichero = new Fichero('prueba.png', 'aW1hZ2Vu');
    const respuesta = service.subirFicheroAsync(fichero);
    const peticion = http.expectOne('https://apipostfiles.azurewebsites.net/api/TestingFiles');
    
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.headers.get('content-type')).toBe('application/json');
    expect(JSON.parse(peticion.request.body)).toEqual({ fileName: 'prueba.png', fileContent: 'aW1hZ2Vu' });
    peticion.flush('Imagen subida');
    expect(await respuesta).toBe('Imagen subida');
    http.verify();
  });
});
