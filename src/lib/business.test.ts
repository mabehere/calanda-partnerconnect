import {describe,it,expect} from 'vitest';
import {calculate,defaults,mvpEffect} from './business';
import {SCENES} from '../content/scenes';
import {PLAN} from '../data/case';
describe('Wirtschaftlichkeit ohne Nutzenvermischung',()=>{
 it('reproduziert die verbindliche Ausgangsrechnung',()=>{const r=calculate(defaults);expect(r.manual).toBe(480);expect(r.baselineHours).toBe(96);expect(r.baselineValue).toBe(5760);expect(r.baselineAnnual).toBe(69120)});
 it('setzt Kapazität nicht mit Einsparungen gleich',()=>{const r=calculate({...defaults,automation:100});expect(r.value).toBe(5760);expect(r.savings).toBe(0);expect(r.remaining).toBe(0)});
 it('berücksichtigt explizite Realisierung und Betriebskosten',()=>{const r=calculate({...defaults,automation:50,realization:25});expect(r.released).toBe(48);expect(r.savings).toBe(720);expect(r.netAnnual).toBe(8640-31200)});
 it('respektiert Nullwerte und Grenzfälle',()=>{expect(calculate({...defaults,automation:0}).released).toBe(0);expect(calculate({...defaults,manualShare:0}).value).toBe(0);expect(()=>calculate({...defaults,automation:101})).toThrow();expect(()=>calculate({...defaults,minutes:NaN})).toThrow()});
 it('rechnet die MVP-Wirkung aus Case-Werten und offenen Annahmen',()=>{const m=mvpEffect();expect(m.fewerIncomplete).toBe(40);expect(m.hours).toBeCloseTo(13.33,2);expect(m.value).toBeCloseTo(800,5);expect(m.extraPartners).toBe(8);expect(m.ordersPerPartner).toBe(96);expect(m.extraOrders).toBe(768)});
 it('leitet Kosten aus Personentagen und Nutzerzahl ab',()=>{expect(PLAN.days*PLAN.dayRate+10600).toBe(PLAN.investment);expect(PLAN.users*PLAN.userPrice).toBe(PLAN.recurring[0][1]);expect(PLAN.userSplit.reduce((s,x)=>s+x[1],0)).toBe(PLAN.users);expect(PLAN.followUp.portalMonthly).toBe(150*PLAN.followUp.portalPricePerPartner)});
 it('plant 19 Szenen und exakt 30 Minuten',()=>{expect(SCENES).toHaveLength(19);expect(SCENES.reduce((s,x)=>s+x.seconds,0)).toBe(1800)});
 it('hält beide MVP-Budgetgrenzen ein',()=>{expect(PLAN.costs.reduce((s,x)=>s+x[1],0)).toBe(PLAN.investment);expect(PLAN.recurring.reduce((s,x)=>s+x[1],0)).toBe(PLAN.monthly);expect(PLAN.investment).toBeLessThanOrEqual(150000);expect(PLAN.monthly).toBeLessThanOrEqual(3000)});
});
