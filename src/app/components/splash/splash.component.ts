import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SesionService } from 'app/services/referidos/sesion.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
  public urlFondo1: string = "url('assets/img/splashscreen_background.svg')";

  
  constructor(private router: Router,
              private sesionService: SesionService,
              private route: ActivatedRoute) {      
  }

  ngOnInit() {
    let usuario:string;
    let imei:string;

    this.route.queryParams.subscribe(params=>{
        usuario = params["usuario"] ? params["usuario"] : '';  
        imei = params["imei"] ? params["imei"] : '';
        
        this.sesionService.agregarDatosTelefono(usuario, imei);
    });

    setTimeout(() => {
        this.router.navigate(['/login']);
    }, 3000);
  }
}
