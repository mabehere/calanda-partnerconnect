import {beforeEach,describe,it,expect} from 'vitest';
import {useDemo} from './demo';
beforeEach(()=>useDemo.getState().reset());
describe('B2B-Prozessregeln',()=>{
 it('erkennt Dubletten und schützt Freigabereihenfolge',()=>{const d=useDemo.getState();d.submitLead(' TEST@EXAMPLE.COM ','Nord');d.leadAction('approve');expect(useDemo.getState().lead?.erp).toBe('');d.submitLead('test@example.com','Nord');expect(useDemo.getState().notice).toContain('Dublette');for(const a of ['qualify','assign','task','delegate','opportunity','approve'])d.leadAction(a);expect(useDemo.getState().lead?.stage).toBe(3);expect(useDemo.getState().lead?.owner).toContain('Stellvertretung')});
 it('überträgt nach Fehler und Retry dieselbe Bestellung nur einmal',()=>{const d=useDemo.getState();d.sendOrder('TX-1',{'ALP-80':4},true);d.sendOrder('TX-1',{'ALP-80':4},false);d.sendOrder('TX-1',{'ALP-80':8},false);expect(useDemo.getState().orders).toHaveLength(1);expect(useDemo.getState().orders[0].items['ALP-80']).toBe(4);expect(useDemo.getState().orders[0].status).toBe('Bestätigt')});
 it('verhindert Abschluss ohne Lösung und Benachrichtigung',()=>{const d=useDemo.getState();d.ticketAction('create');d.ticketAction('close');expect(useDemo.getState().ticket?.status).toBe('Angaben fehlen');for(const a of ['request','photo','assign','work','escalate'])d.ticketAction(a);d.ticketAction('solve','Glasscheibe ersetzt');d.ticketAction('close');expect(useDemo.getState().ticket?.status).toBe('Gelöst');d.ticketAction('notify');d.ticketAction('close');expect(useDemo.getState().ticket?.status).toBe('Geschlossen')});
});
