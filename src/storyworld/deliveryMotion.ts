import {ease} from '../../video/v4/timing.ts';

export const vanScale=.76;
export const vanDistance=2.3;
export const deliveryTravel = (time:number)=>vanDistance*ease((time-.95)/1.37);
