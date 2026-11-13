import {describe,it,expect} from 'vitest';
import {calculate,defaults} from './business';
import {SCENES} from '../content/scenes';
import {PLAN} from '../data/case';
describe('Wirtschaftlichkeit ohne Nutzenvermischung',()=>{
 it('reproduziert die verbindliche Ausgangsrechnung',()=>{const r=calculate(defaults);expect(r.manual).toBe(480);expect(r.baselineHours).toBe(96);expect(r.baselineValue).toBe(5760);expect(r.baselineAnnual).toBe(69120)});
 it('setzt Kapazität nicht mit Einsparungen gleich',()=>{const r=calculate({...defaults,automation:100});expect(r.value).toBe(5760);expect(r.savings).toBe(0);expect(r.remaining).toBe(0)});
 it('berücksichtigt explizite Realisierung und Betriebskosten',()=>{const r=calculate({...defaults,automation:50,realization:25});expect(r.released).toBe(48);expect(r.savings).toBe(720);expect(r.netAnnual).toBe(8640-31200)});
 it('respektiert Nullwerte und Grenzfälle',()=>{expect(calculate({...defaults,automation:0}).released).toBe(0);expect(calculate({...defaults,manualShare:0}).value).toBe(0);expect(()=>calculate({...defaults,automation:101})).toThrow();expect(()=>calculate({...defaults,minutes:NaN})).toThrow()});
 it('plant 19 Szenen und exakt 30 Minuten',()=>{expect(SCENES).toHaveLength(19);expect(SCENES.reduce((s,x)=>s+x.seconds,0)).toBe(1800)});
 it('hält beide MVP-Budgetgrenzen ein',()=>{expect(PLAN.costs.reduce((s,x)=>s+x[1],0)).toBe(PLAN.investment);expect(PLAN.recurring.reduce((s,x)=>s+x[1],0)).toBe(PLAN.monthly);expect(PLAN.investment).toBeLessThanOrEqual(150000);expect(PLAN.monthly).toBeLessThanOrEqual(3000)});
});
