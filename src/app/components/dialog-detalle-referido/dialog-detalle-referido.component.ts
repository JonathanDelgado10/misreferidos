import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { SesionService } from 'app/services/referidos/sesion.service';
import { ReferidosService } from 'app/services/referidos/referidos.service';

import { DialogDetalleSucursalComponent } from 'app/components/dialog-detalle-sucursal/dialog-detalle-sucursal.component';

import { Referido } from 'app/interfaces/referido';
import { UsuarioFirmado } from 'app/interfaces/usuario-firmado';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dialog-detalle-referido',
  templateUrl: './dialog-detalle-referido.component.html',
  styleUrls: ['./dialog-detalle-referido.component.css']
})

export class DialogDetalleReferidoComponent implements OnInit{
    public formaParticular:FormGroup;
    public formaPyme:FormGroup;
    private referido:Referido;

    public isParticular: boolean = false;
    public isPyme: boolean = false;
    
    public isDisabledCamposParticular: boolean = true;
    public isDisabledCamposPyme: boolean = true;

    private recargaMisReferidos:boolean = false;

    private usuarioFirmado:UsuarioFirmado;
    
    public TIPO_PARTICULAR:number = environment.TIPO_PARTICULAR;
    public TIPO_PYME:number = environment.TIPO_PYME;

    public regionesParticular:any[] = [];
    public regionesPyme:any[] = [];
    public zonasParticular:any[] = [];
    public zonasPyme:any[] = [];
    public sucursalesParticular:any[] = [];
    public sucursalesPyme:any[] = [];

    public maxDate: Date = new Date();

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef:MatDialogRef<DialogDetalleReferidoComponent>,
                private referidosService: ReferidosService,
                private sesionService: SesionService,
                private router: Router,
                public dialog: MatDialog,
                public snackBar: MatSnackBar) { 
        this.usuarioFirmado = this.sesionService.getUsuarioFirmado();
        if (data.referido.tipo == this.TIPO_PARTICULAR) {
            this.formaParticular = new FormGroup({
                'nombre': new FormControl({value: data.referido.nombre, disabled: this.isDisabledCamposParticular},  [
                                                Validators.required
                                                ]),
                'appat': new FormControl({value: data.referido.apPat, disabled: this.isDisabledCamposParticular},  [
                                                Validators.required
                                                ]),
                'apmat': new FormControl({value: data.referido.apMat, disabled: this.isDisabledCamposParticular},  [
                                                Validators.required
                                                ]),
                'fechaNacimiento': new FormControl({value: new Date(data.referido.fecNac), disabled: this.isDisabledCamposParticular},  [
                                                Validators.required
                                                ]),
                'correo': new FormControl({value: data.referido.correo, disabled: this.isDisabledCamposParticular},  [
                                                Validators.required,
                                                Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$")
                                                ]),
                'telefono': new FormControl({value: data.referido.telefono, disabled: this.isDisabledCamposParticular},  [
                                                Validators.required,
                                                Validators.pattern("^[0-9]+$")
                                                ]),
                'rfc': new FormControl({value: data.referido.rfc, disabled: this.isDisabledCamposParticular},  [
                                                Validators.pattern("[a-zA-Z]{3,4}(\\d{6})[A-Za-z|\\d]{0,3}?")
                                                ]),
                'idSucursal': new FormControl({value: data.referido.sucursal, disabled: this.isDisabledCamposParticular} , [
                                                Validators.required,
                                            ]),
                'id': new FormControl(data.referido.idProsp , [])
            });
        } else if (data.referido.tipo == this.TIPO_PYME) {
            this.formaPyme = new FormGroup({
                'nombre': new FormControl({value: data.referido.nombre, disabled: this.isDisabledCamposPyme}, [
                                                Validators.required
                                                ]),
                'appat': new FormControl({value: data.referido.apPat, disabled: this.isDisabledCamposParticular},  [
                                                Validators.required
                                                ]),
                'apmat': new FormControl({value: data.referido.apMat, disabled: this.isDisabledCamposParticular},  [
                                                Validators.required
                                                ]),
                'razonSocial': new FormControl({value: data.referido.razonSocial, disabled: this.isDisabledCamposPyme},  [
                                                Validators.required
                                                ]),
                'ventasAnuales': new FormControl({value: data.referido.ventas, disabled: this.isDisabledCamposPyme},  [
                                                Validators.pattern("^[0-9]+$"),
                                                Validators.required
                                                ]),
                'correo': new FormControl({value: data.referido.correo, disabled: this.isDisabledCamposPyme},  [
                                                Validators.required,
                                                Validators.pattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$")
                                                ]),
                'telefono': new FormControl({value: data.referido.telefono, disabled: this.isDisabledCamposPyme} ,  [
                                                Validators.required,
                                                Validators.pattern("^[0-9]+$")
                                                ]),
                'rfc': new FormControl({value: data.referido.rfc, disabled: this.isDisabledCamposPyme} , [
                                                Validators.pattern("[a-zA-Z]{3,4}(\\d{6})[A-Za-z|\\d]{0,3}?")
                                                ]),
                'idSucursal': new FormControl({value: data.referido.sucursal, disabled: this.isDisabledCamposPyme} , [
                                                Validators.required,
                                            ]),
                'id': new FormControl(data.referido.idProsp , [])
            });
        }
    }

    ngOnInit(){
        this.getRegiones();
    }

    private getRegiones() {
        let token = this.usuarioFirmado.token;
        this.referidosService.getRegiones(token)
                        .subscribe(res => {
                            if (res.exitoso) {
                                if (this.data.referido.tipo == this.TIPO_PARTICULAR) {
                                    this.regionesParticular = res.datos;                                    
                                } else if (this.data.referido.tipo == this.TIPO_PYME) {
                                    this.regionesPyme = res.datos;
                                }

                                if (this.data.referido.region != 0) {
                                    this.getZonas(this.data.referido.region);
                                }
                            } else {
                                this.muestraAlertaReintento();
                            }
                        },
                        error => {
                            this.muestraAlertaReintento();
                        });
    }

    public getZonas($idRegion) {
        let token = this.usuarioFirmado.token;
        this.referidosService.getZonas($idRegion, token)
                        .subscribe(res => {
                            if (res.exitoso) {
                                if (this.data.referido.tipo == this.TIPO_PARTICULAR) {
                                    this.zonasParticular = res.datos;
                                } else if (this.data.referido.tipo == this.TIPO_PYME) {
                                    this.zonasPyme = res.datos;
                                }

                                if (this.data.referido.zona != 0) {
                                    this.getSucursales(this.data.referido.zona);
                                }
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
                                if (this.data.referido.tipo == this.TIPO_PARTICULAR) {
                                    this.sucursalesParticular = res.datos;
                                } else if (this.data.referido.tipo == this.TIPO_PYME) {
                                    this.sucursalesPyme = res.datos;
                                }
                            } else {
                                this.muestraAlertaReintento();
                            }
                        },
                        error => {
                            this.muestraAlertaReintento();
                        });
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
                                this.editarCamposParticular();
                                this.muestraAlertaExito();
                                this.recargaMisReferidos = true;
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
                                this.editarCamposPyme();
                                this.muestraAlertaExito();
                                this.recargaMisReferidos = true;
                            } else {
                                this.muestraAlertaReintento();
                            }
                        },
                        error => {
                            this.isPyme = false;
                            this.muestraAlertaReintento();
                        });                            
        
    }

    public cerrar() {
        this.dialogRef.close(this.recargaMisReferidos);
    }

    public editarCamposParticular(){
        this.isDisabledCamposParticular = ! this.isDisabledCamposParticular;
        
        if (this.isDisabledCamposParticular) {
            this.formaParticular.get('nombre').disable();
            this.formaParticular.get('appat').disable();
            this.formaParticular.get('apmat').disable();
            this.formaParticular.get('fechaNacimiento').disable();
            this.formaParticular.get('correo').disable();
            this.formaParticular.get('telefono').disable();
            this.formaParticular.get('rfc').disable();
            this.formaParticular.get('idSucursal').disable();
        } else {
            this.formaParticular.get('nombre').enable();
            this.formaParticular.get('appat').enable();
            this.formaParticular.get('apmat').enable();
            this.formaParticular.get('fechaNacimiento').enable();
            this.formaParticular.get('correo').enable();
            this.formaParticular.get('telefono').enable();
            this.formaParticular.get('rfc').enable();
            this.formaParticular.get('idSucursal').enable();
        }
    }

    public editarCamposPyme(){
        this.isDisabledCamposPyme = ! this.isDisabledCamposPyme;
        if (this.isDisabledCamposPyme) {
            this.formaPyme.get('nombre').disable();
            this.formaPyme.get('appat').disable();
            this.formaPyme.get('apmat').disable();
            this.formaPyme.get('razonSocial').disable();
            this.formaPyme.get('ventasAnuales').disable();
            this.formaPyme.get('telefono').disable();
            this.formaPyme.get('correo').disable();
            this.formaPyme.get('rfc').disable();
            this.formaPyme.get('idSucursal').disable();
        } else {
            this.formaPyme.get('nombre').enable();
            this.formaPyme.get('appat').enable();
            this.formaPyme.get('apmat').enable();
            this.formaPyme.get('razonSocial').enable();
            this.formaPyme.get('ventasAnuales').enable();
            this.formaPyme.get('telefono').enable();
            this.formaPyme.get('correo').enable();
            this.formaPyme.get('rfc').enable();
            this.formaPyme.get('idSucursal').enable();
        }
    }

    private muestraAlertaError() {
        this.snackBar.open("Debes completar todos los campos.", undefined, {
            duration: 3000,
            extraClasses: ['success-snackbar']
        });
    }

    private muestraAlertaReintento() {
        this.snackBar.open("Operación no completada, vuelva a intentarlo.", undefined, {
            duration: 3000,
            extraClasses: ['success-snackbar']
        });
    }

    private muestraAlertaExito() {
        this.snackBar.open("Referido actualizado", undefined, {
            duration: 3000,
            extraClasses: ['blue-snackbar']
        });
    }

    public verDetalleSucursal($sucursal:string){
        let sucursales:any[] = [];

        if (this.data.referido.tipo == this.TIPO_PARTICULAR) {
            sucursales = this.sucursalesParticular;
        } else if (this.data.referido.tipo == this.TIPO_PYME) {
            sucursales = this.sucursalesPyme;
        }

        for (let sucursal of sucursales) {
            if (sucursal.clave == $sucursal) {
                if (this.data.referido.tipo == this.TIPO_PARTICULAR) {
                    this.formaParticular.get('idSucursal').setValue($sucursal);
                } else if (this.data.referido.tipo == this.TIPO_PYME) {
                    this.formaPyme.get('idSucursal').setValue($sucursal);
                }

                this.dialog.open(DialogDetalleSucursalComponent, {
                    data: { 'sucursal': sucursal },
                    disableClose: true
                });
                break;
            }
        }        
    }
}
