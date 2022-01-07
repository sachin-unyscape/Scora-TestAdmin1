import { Component, OnInit } from '@angular/core';
import { Routes,Router,NavigationEnd,RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-page-load',
  templateUrl: './page-load.component.html',
  styleUrls: ['./page-load.component.scss']
})
export class PageLoadComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(()=>{ 
      this.router.navigateByUrl('/author');
    },2000);
   
  }

}
