import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html'
})
export class DonorComponent implements OnInit {
  currentDonor;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.params
      .subscribe((params) => {
        this.currentDonor = params['id'];
      });
  }
}
