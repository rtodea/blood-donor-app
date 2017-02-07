export class Donor {

  constructor(
    public id: string|null,

    public firstName: string,
    public lastName: string,
    public contactNo: string,
    public email: string,
    public bloodGroup: string,

    public longitude: number,
    public latitude: number,

    public ip: string,
    public countryCode: string,
    public city: string,
    public street: string
) {  }
}
