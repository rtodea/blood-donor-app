import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DonorService } from '../shared/donor.service';

@Injectable()
export class DonorEditResolver implements Resolve<any> {
  constructor(
    private donorService: DonorService,
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.donorService.findById(route.params['id']);
  }
}
