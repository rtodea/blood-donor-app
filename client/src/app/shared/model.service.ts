import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ModelService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  create(path, model) {
    return this.http
      .post(path, JSON.stringify(model), { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  find(path) {
    return this.http.get(path)
      .toPromise()
      .then(response => response.json());
  }

  findById(path, id) {
    const url = `${path}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json());
  }

  update(path, model) {
    const url = `${path}/${model.id}`;
    return this.http
      .put(url, JSON.stringify(model), { headers: this.headers })
      .toPromise()
      .then(response => response.json());
  }

  createOrUpdate(path, model) {
    if (model.id) {
      return this.update(path, model);
    } else {
      return this.create(path, model);
    }
  }

  delete(path, id) {
    const url = `${path}/${id}`;
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null);
  }
}
