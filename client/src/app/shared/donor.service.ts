import { Injectable } from '@angular/core';
import { ModelService } from './model.service';

@Injectable()
export class DonorService {

  DONOR_API_URL = '/api/donor';

  constructor(private modelService: ModelService) {}

  create(model) {
    return this.modelService.create(this.DONOR_API_URL, model);
  }

  find() {
    return this.modelService.find(this.DONOR_API_URL);
  }

  findById(id) {
    return this.modelService.findById(this.DONOR_API_URL, id);
  }

  update(model) {
    return this.modelService.update(this.DONOR_API_URL, model);
  }

  createOrUpdate(model) {
    return this.modelService.createOrUpdate(this.DONOR_API_URL, model);
  }

  delete(id) {
    return this.modelService.delete(this.DONOR_API_URL, id);
  }
}
