import {CASE,PLAN} from '../data/case';
export type Inputs={monthlyOrders:number;manualShare:number;minutes:number;hourlyValue:number;automation:number;realization:number;investment:number;monthlyCost:number};
export const defaults:Inputs={monthlyOrders:CASE.orders.monthly,manualShare:CASE.orders.manualShare,minutes:CASE.orders.minutes,hourlyValue:CASE.orders.hourlyValue,automation:60,realization:0,investment:PLAN.investment,monthlyCost:PLAN.monthly};
export function calculate(i:Inputs){
  const vals=Object.values(i);if(vals.some(v=>!Number.isFinite(v)||v<0)||[i.manualShare,i.automation,i.realization].some(v=>v>100))throw new Error('Ungültige Modellparameter');
  const manual=i.monthlyOrders*i.manualShare/100;const baselineHours=manual*i.minutes/60;
  const released=baselineHours*i.automation/100;const value=released*i.hourlyValue;
  const savings=value*i.realization/100;
  return {manual,remaining:manual*(1-i.automation/100),baselineHours,baselineValue:baselineHours*i.hourlyValue,baselineAnnual:baselineHours*i.hourlyValue*12,released,value,annual:value*12,savings,annualSavings:savings*12,annualOperating:i.monthlyCost*12,netAnnual:savings*12-i.monthlyCost*12};
}
