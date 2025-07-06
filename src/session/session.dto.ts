export interface SESSION {
  sessionid: string;
  authToken: string;
  userDetails: object; // TOOD type this properly
  orderDetails: object; // TODO type this properly
}