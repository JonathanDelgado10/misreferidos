import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatTabChangeEvent } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { SesionService } from 'app/services/referidos/sesion.service';
import { ReferidosService } from 'app/services/referidos/referidos.service';

import { DialogDetalleSucursalComponent } from 'app/components/dialog-detalle-sucursal/dialog-detalle-sucursal.component';

import { Referido } from 'app/interfaces/referido';
import { UsuarioFirmado } from 'app/interfaces/usuario-firmado';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dialog-nuevo-referido',
  templateUrl: './dialog-nuevo-referido.component.html',
  styleUrls: ['./dialog-nuevo-referido.component.css']
})

export class DialogNuevoReferidoComponent implements OnInit{
    public formaParticular:FormGroup;
    public formaPyme:FormGroup;
    private referido:Referido;
    
    public isParticular: boolean = false;
    public isPyme: boolean = false;

    public isParticularTabActive: boolean = true;
    public isPymeTabActive: boolean = false;
    public recargaMisReferidos: boolean = false;

    private usuarioFirmado:UsuarioFirmado;
    
    public TIPO_PARTICULAR:number = environment.TIPO_PARTICULAR;
    public TIPO_PYME:number = environment.TIPO_PYME;

    public regiones:any[] = [];
    public zonas:any[] = [];
    public sucursales:any[] = [];
        
    public maxDate: Date = new Date();

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef:MatDialogRef<DialogNuevoReferidoComponent>,
                private referidosService: ReferidosService,
                private sesionService: SesionService,
                private router: Router,
                public dialog: MatDialog,
                public snackBar: MatSnackBar) { 
        this.usuarioFirmado = this.sesionService.getUsuarioFirmado();

        this.formaParticular = new FormGroup({
            'nombre': new FormControl('' ,  [
                                            Validators.required
                                            ]),
            'appat': new FormControl('' ,  [
                                            Validators.required
                                            ]),
            'apmat': new FormControl('' ,  [
                                            Validators.required
                                            ]),
            'fechaNacimiento': new FormControl('' ,  [
                                            Validators.required
                                            ]),
            'correo': new FormControl('' ,  [
                                            Validators.required,
                                            Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$")
                                            ]),
            'telefono': new FormControl('' ,  [
                                            Validators.required,
                                            Validators.pattern("^[0-9]+$")
                                            ]),
            'rfc': new FormControl('' , [
                                        Validators.pattern("[a-zA-Z]{3,4}(\\d{6})[A-Za-z|\\d]{0,3}?")
                                        ]),
            'idSucursal': new FormControl('' ,  [
                                        Validators.required
                                        ])
        });

        this.formaPyme = new FormGroup({
            'nombre': new FormControl('' ,  [
                                            Validators.required
                                            ]),
            'appat': new FormControl('' ,  [
                                            Validators.required
                                            ]),
            'apmat': new FormControl('' ,  [
                                            Validators.required
                                            ]),
            'razonSocial': new FormControl('' ,  [
                                            Validators.required
                                            ]),
            'ventasAnuales': new FormControl('' ,  [
                                            Validators.pattern("^[0-9]+$"),
                                            Validators.required
                                            ]),
            'correo': new FormControl('' ,  [
                                            Validators.required,
                                            Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$")
                                            ]),
            'telefono': new FormControl('' ,  [
                                            Validators.required,
                                            Validators.pattern("^[0-9]+$")
                                            ]),
            'rfc': new FormControl('' ,  [
                                            Validators.pattern("[a-zA-Z]{3,4}(\\d{6})[A-Za-z|\\d]{0,3}?")
                                        ]),
            'idSucursal': new FormControl('' ,  [
                                                Validators.required
                                                ])
        });
    }

    ngOnInit(){
        this.getRegiones();
    }

    public guardaReferidoParticular(){
        if (! this.formaParticular.valid) {
            this.muestraAlertaError();
            return;
        }

        this.referido = this.formaParticular.value;
        let fecha = new Date(this.formaParticular.get("fechaNacimiento").value);
        this.referido.fechaNacimiento = fecha.toLocaleDateString();
        this.referido.tipo = this.TIPO_PARTICULAR;
        let token = this.usuarioFirmado.token;
        
        this.isParticular = true;        
        this.referidosService.guardarReferido(this.referido, token)
                        .subscribe(res => {
                            this.isParticular = false;
                            if (res.exitoso) {
                                this.recargaMisReferidos = true;
                                this.muestraAlertaExito()
                                this.dialogRef.close(this.recargaMisReferidos);
                            } else {
                                this.muestraAlertaReintento();
                            }
                        },
                        error => {
                            this.muestraAlertaReintento();
                            this.isParticular = false;
                        });                            
    }

    public guardaReferidoPyme(){
        if (! this.formaPyme.valid) {
            this.muestraAlertaError();
            return;
        }

        this.referido = this.formaPyme.value;
        this.referido.tipo = this.TIPO_PYME;
        let token = this.usuarioFirmado.token;

        this.isPyme = true;
        
        this.referidosService.guardarReferido(this.referido, token)
                        .subscribe(res => {
                            this.isPyme = false;
                            if (res.exitoso) {
                                this.recargaMisReferidos = true;
                                this.muestraAlertaExito();
                                this.dialogRef.close(this.recargaMisReferidos);
                            } else {
                                this.muestraAlertaReintento();
                            }
                        },
                        error => {
                            this.isPyme = false;
                            this.muestraAlertaReintento();
                        });                            
        
    }

    private getRegiones() {
        let token = this.usuarioFirmado.token;
        this.referidosService.getRegiones(token)
                        .subscribe(res => {
                            if (res.exitoso) {
                                this.regiones = res.datos;
                            } else {
                                this.muestraAlertaReintento();
                            }
                        },
                        error => {
                            this.muestraAlertaReintento();
                        });
    }

    public getZonas($idRegion:string) {
        let token = this.usuarioFirmado.token;
        this.referidosService.getZonas($idRegion, token)
                        .subscribe(res => {
                            if (res.exitoso) {
                                this.zonas = res.datos;
                            } else {
                                this.muestraAlertaReintento();
                            }
                        },
                        error => {
                            this.muestraAlertaReintento();
                        });
    }

    public getSucursales($idZona:string) {
        let token = this.usuarioFirmado.token;
        this.referidosService.getSucursales($idZona, token)
                        .subscribe(res => {
                            if (res.exitoso) {
                                this.sucursales = res.datos;
                            } else {
                                this.muestraAlertaReintento();
                            }
                        },
                        error => {
                            this.muestraAlertaReintento();
                        });
    }

    private muestraAlertaExito() {
        this.snackBar.open("¡Has agregado un nuevo referido!", undefined, {
            duration: 3000,
            extraClasses: ['blue-snackbar']
        });
    }

    private muestraAlertaReintento() {
        this.snackBar.open("Operación no completada, vuelva a intentarlo.", undefined, {
            duration: 3000,
            extraClasses: ['success-snackbar']
        });
    }

    private muestraAlertaError(){
        this.snackBar.open("Debes completar todos los campos.", undefined, {
            duration: 3000,
            extraClasses: ['success-snackbar']
        });
    }

    public cerrar() {
        this.dialogRef.close();
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent) {
        let indexTab = tabChangeEvent.index;
        if (indexTab == 0) {
            this.isParticularTabActive = true;
            this.isPymeTabActive = false;
        } else if (indexTab == 1) {
            this.isParticularTabActive = false;
            this.isPymeTabActive = true;
        }
    }

    public verDetalleSucursal($sucursal:string){
        for (let sucursal of this.sucursales) {
            if (sucursal.clave == $sucursal) {
                this.dialog.open(DialogDetalleSucursalComponent, {
                    data: { 'sucursal': sucursal },
                    disableClose: true
                });
                break;
            }
        }        
    }
}
