import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.html',
})
export class Splash implements OnInit {

  constructor(private router: Router) { }

  isLeaving = false;

  ngOnInit() {
    setTimeout(() => {
      this.isLeaving = true;

      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 500); 
    }, 2300);
  }
}