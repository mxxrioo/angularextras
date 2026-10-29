import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Fichero } from '../../models/fichero';
import { ServiceFicheros } from '../../services/service.ficheros';

@Component({
  selector: 'app-subir-imagen-component',
  standalone: false,
  styleUrl: './subir-imagen-component.css',
  templateUrl: './subir-imagen-component.html',
})
export class SubirImagenComponent {
  @ViewChild("cajafichero") cajaFichero!: ElementRef<HTMLInputElement>;
  public fichero: Fichero | null = null;
  public vistaPrevia: string = "";
  public leyendo: boolean = false;
  public subiendo: boolean = false;
  public subidaCorrecta: boolean = false;
  public error: string = "";

  constructor(
    private _cdr: ChangeDetectorRef,
    private _service: ServiceFicheros
  ){}

  seleccionarFichero(): void {
    let archivo = this.cajaFichero.nativeElement.files?.[0];
    if (archivo) {
      this.leerImagen(archivo);
    }
    this.cajaFichero.nativeElement.value = "";
  }

  permitirSoltar(event: DragEvent): void {
    event.preventDefault();
  }

  soltarFichero(event: DragEvent): void {
    event.preventDefault();
    let archivo = event.dataTransfer?.files[0];
    if (archivo) {
      this.leerImagen(archivo);
    }
  }

  leerImagen(archivo: File): void {
    if (this.subiendo || this.leyendo) return;
    this.fichero = null;
    this.vistaPrevia = "";
    this.subidaCorrecta = false;
    this.error = "";
    if (!archivo.type.startsWith("image/") || archivo.type === "image/svg+xml") {
      this.error = "Selecciona una imagen PNG, JPG, GIF o WebP.";
      return;
    }

    // LEEMOS LA IMAGEN PARA CONVERTIRLA A BASE64
    this.leyendo = true;
    let reader = new FileReader();
    reader.onload = () => {
      this.leyendo = false;
      this.vistaPrevia = reader.result as string;
      // QUITAMOS LA CABECERA data:image/...;base64,
      let base64 = this.vistaPrevia.split(",")[1];
      if (base64) {
        this.fichero = new Fichero(archivo.name, base64);
      } else {
        this.error = "La imagen está vacía o no se ha podido leer.";
        this.vistaPrevia = "";
      }
      this._cdr.detectChanges();
    };
    reader.onerror = () => {
      this.leyendo = false;
      this.error = "No se ha podido leer la imagen. Selecciónala de nuevo.";
      this._cdr.detectChanges();
    };
    reader.readAsDataURL(archivo);
  }

  async subirImagen(): Promise<void> {
    if (!this.fichero || this.subiendo || this.leyendo || this.subidaCorrecta) return;
    this.subiendo = true;
    this.error = "";
    try {
      await this._service.subirFicheroAsync(this.fichero);
      this.subidaCorrecta = true;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status !== 0) {
        this.error = "No se ha podido subir la imagen (error " + error.status + "). Puedes intentarlo de nuevo.";
      } else {
        this.error = "No se puede conectar con la API. Comprueba la conexión y que el servidor permita peticiones desde Angular (CORS).";
      }
    } finally {
      this.subiendo = false;
      this._cdr.detectChanges();
    }
  }
}
