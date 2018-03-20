import { Device } from './device';

export interface Project{
  // _id:string;
  updatedAt:string;
  createdAt:string;
  segment:string;
  country:string;
  countryCatalog:string;
  status: string;
  projectName: string;
  finalClientCity:string;
  surface:string;
  numberFloors: string;
  user: string;
  devices: Device[];
}
