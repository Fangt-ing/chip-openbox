'use strict';
// C8051F500 functional data, traced manually from the retained Rev. 1.0 datasheet.
// Shared rendering, selection, dragging and routing remain in unit-diagram.js.
(() => {
 const device=window.ChipOpenboxC8051F500,arch=device.architecture,instance=device.instance;
 const source='https://www.keil.com/dd/docs/datashts/silabs/c8051f50x_51x_ds.pdf';
 const definitions=new Map([...arch.blocks,...instance.blocks].map(d=>[d.id,d])),configs=new Map();
 const reference=(page,section)=>({href:source+'#page='+page,section});
 // Each row is a physical presentation lane, not an execution stage.
 function define(id,page,section,rows,links,bind,note='') {
  const units=rows.flatMap((row,y)=>row.filter(Boolean).map((n,x)=>({id:n[0],name:n[1],value:n[2],x:90+x*220,y:55+y*94,w:140,h:36,ports:[],reference:reference(n[3]||page,section)})));
  configs.set(id,{units,links,bind,reference:reference(page,section),height:Math.max(210,rows.length*94+70),note});
 }
 define('pc',87,'§11 · Figure 11.1',[
  [['pc','PC · 16-bit','reset 0x0000',141],['increment','PC incrementer'],['address','Program address','16-bit register']]
 ],[['pc','increment','Program address'],['increment','pc','Sequential next address'],['pc','address','Instruction address']],{'control':'pc','memory-interface':'address'},'PC reset is documented; instruction-dependent increments and branches are not executed.');
 define('pipeline',87,'§11 · Figure 11.1',[
  [['buffer','Pipeline buffer','Instruction bytes']]
 ],[],{'memory-interface':'buffer','control':'buffer'},'Published atomic buffer; hidden pipeline stages are not inferred.');
 define('control',87,'§11 · Figure 11.1',[
  [['decode','Control logic','CIP-51 instruction decode']]
 ],[],{'*':'decode'},'Published atomic control block; no invented microcode or execution state machine.');
 define('alu',87,'§11 · Figure 11.1',[
  [['tmp1','TMP1','8-bit operand'],['alu','ALU · 8-bit'],['result','Internal data bus','8-bit operands / result']],
  [['tmp2','TMP2','8-bit operand'],['flags','PSW flag results','CY / AC / OV / parity']]
 ],[['tmp1','alu','Operand 1'],['tmp2','alu','Operand 2'],['alu','result','Arithmetic / logic result'],['alu','flags','Flags'],['result','tmp1','Data bus operand'],['result','tmp2','Data bus operand']],{'control':'alu','registers':'result'},'Functional ALU paths from Figure 11.1; individual arithmetic gates are not disclosed.');
 define('registers',94,'§11.2 · ACC / B / PSW',[
  [['bus','Internal data bus','8-bit'],['acc','ACC','reset 0x00'],['psw','PSW','reset 0x00',95]],
  [null,['b','B','reset 0x00']]
 ],[['bus','acc','ACC read / write',true],['bus','b','B read / write',true],['bus','psw','PSW read / write',true]],{'*':'bus'},'PSW contains flags and register-bank selection; RAM register banks remain in internal RAM.');
 define('pointers',93,'§11.2 · DPTR / SP',[
  [['dptr','DPH : DPL','DPTR · reset 0x0000'],['bus','Internal data bus','8-bit'],['sp','SP','reset 0x07',94]]
 ],[['bus','dptr','DPTR read / write',true],['bus','sp','SP read / write',true]],{'memory-interface':'dptr','sram-address':'sp','sfr-interface':'bus'},'DPTR and the stack pointer serve different addressing operations. No stack access is executed.');
 define('memory-interface',87,'§11 · Figure 11.1',[
  [['addr','MEM_ADDRESS','16-bit'],['iface','Memory interface'],['rd','MEM_READ_DATA','8-bit']],
  [['ctrl','MEM_CONTROL'],['wr','MEM_WRITE_DATA','8-bit']]
 ],[['iface','addr','MEM_ADDRESS output'],['iface','ctrl','MEM_CONTROL output'],['iface','wr','MEM_WRITE_DATA output'],['rd','iface','MEM_READ_DATA input']],{'pc':'iface','pointers':'iface','pipeline':'iface','emif':'iface','xram.address':'addr','xram.input':'wr','xram.control':'ctrl','xram.output':'rd','program.address':'addr','program.input':'wr','program.control':'ctrl','program.program-control':'ctrl','program.output':'rd','*':'iface'},'Separate CODE / XDATA accesses share the published memory interface; no invented Flash controller.');
 define('sfr-interface',87,'§11 / §13 · SFR interface',[
  [['address','SFR_ADDRESS'],['iface','SFR bus interface'],['read','SFR_READ_DATA','8-bit']],
  [['control','SFR_CONTROL'],['write','SFR_WRITE_DATA','8-bit'],['page','SFRPAGE / SFR stack','Paged SFR access',100]]
 ],[['iface','address','SFR_ADDRESS output'],['iface','control','SFR_CONTROL output'],['iface','write','SFR_WRITE_DATA output'],['read','iface','SFR_READ_DATA input'],['page','iface','Selected SFR page',true]],{'control':'iface','registers':'iface','*':'iface'},'Lines to peripherals represent address / data / control bundles, not one-bit signals. SFR paging is not executed.');
 define('interrupts',117,'§14 · Interrupt handler',[
  [['flags','Source requests','Flags belong to peripherals'],['enable','IE / EIE1 / EIE2','Interrupt enables'],['priority','IP / EIP1 / EIP2','Two priority levels']],
  [['debug','EMULATION_IRQ'],['handler','Interrupt interface','18 interrupt sources'],['vector','Vector address selection']]
 ],[['flags','enable','Pending sources'],['enable','priority','Enabled sources'],['priority','handler','Priority decision'],['debug','handler','Debug request'],['handler','vector','Accepted interrupt']],{'debug':'debug','control':'vector','sfr-interface':'enable','*':'flags'},'Requests, enables and priority are functional abstractions; interrupt acceptance and vector entry are not simulated.');
 define('sram-address',87,'§11 · Figure 11.1',[
  [['address','SRAM address register','8-bit']]
 ],[],{'*':'address'},'The internal SRAM address is distinct from CODE, XDATA and SFR addresses.');
 define('power-control',140,'§16 · PCON',[
  [['pcon','PCON · 0x87','reset 0x00'],['idle','IDLE','Stops CPU clock'],['stop','STOP','Stops internal oscillator']]
 ],[['pcon','idle','IDLE control'],['pcon','stop','STOP control']],{'control':'pcon','sfr-interface':'pcon','clock':'stop'},'Mode controls only; no power-state transition is executed. Peripheral behavior differs between IDLE and STOP.');
 define('reset',141,'§17 · Figure 17.1',[
  [['por','Power-on reset'],['vdd','VDD monitor'],['rst','External RST']],
  [['mcd','Missing-clock detector'],['sw','Software / Flash error'],['src','RSTSRC','Flags depend on reset cause']],
  [['cp','Comparator 0 reset'],['wdt','PCA watchdog'],['logic','Reset generation']]
 ],[['por','logic','Power-on reset'],['vdd','logic','Supply fault'],['rst','logic','External reset'],['mcd','logic','Clock fault'],['sw','logic','Software / Flash reset'],['cp','logic','Comparator reset'],['wdt','logic','Watchdog reset'],['logic','src','Reset-source flags']],{'regulator':'vdd','comparators':'cp','pca':'wdt','sfr-interface':'src','clock':'logic','control':'logic','pin:c2-clock':'rst','pin:supply':'vdd','*':'logic'},'Normal reset does not clear RAM. RAM power-on contents are undefined; demo zero cells are not hardware reset state.');
 define('regulator',84,'§10 · Voltage regulator',[
  [['input','VREGIN'],['ldo','REG0 · LDO','2.6 V / 2.1 V modes'],['supply','VDD']],
  [['cn','REG0CN','reset 0x10',85],['drop','Dropout indication']]
 ],[['input','ldo','Regulator supply'],['cn','ldo','Enable / voltage selection'],['ldo','supply','Regulated supply'],['ldo','drop','Dropout status'],['drop','cn','DROPOUT status']],{'pin:power':'input','reset':'supply','sfr-interface':'cn','interrupts':'drop'},'Functional regulator, not a transistor model. Bypass capacitors belong to the board.');
 define('debug',314,'§28 · C2 interface',[
  [['pins','C2CK / C2D','Two-wire interface'],['addr','C2ADD','C2 register selection'],['data','C2DAT','Read / write transactions']],
  [['id','Device / revision ID','Read-only'],['flash','FPCTL / FPDAT','Flash commands',316],['debug','On-chip debug','Breakpoint / run / halt',87]]
 ],[['pins','addr','Address transaction'],['pins','data','Data transaction',true],['addr','data','Selected register'],['data','id','ID read',true],['data','flash','Programming commands',true],['data','debug','Debug transactions',true]],{'pin:program':'pins','pin:c2-clock':'pins','program':'flash','interrupts':'debug'},'C2 and on-chip debug share this unit. Flash erase/write and debug transport are not executed. Archive ID descriptions are inconsistent; no ID constant is invented.');
 define('timers',272,'§26 · Timers 0–3',[
  [['clock','CKCON / clock choices','SYSCLK, divided clocks, EXOSC/8',273],['t0','Timer 0 · TL0 / TH0','13 / 16 / 8-bit modes',274],['t1','Timer 1 · TL1 / TH1','13 / 16 / 8-bit modes',274]],
  [['control','TMOD / TCON','Mode / gate / run control',279],['t2','Timer 2','TMR2 / TMR2RL · 16 or 2×8',282],['t3','Timer 3','TMR3 / TMR3RL · 16 or 2×8',288]],
  [['io','T0 / T1 / INT0 / INT1','External count / gate'],['flags','Overflow / interrupt flags'],['reload','TMR2CN / TMR3CN','Auto-reload / split control']]
 ],[['clock','t0','Selected clock'],['clock','t1','Selected clock'],['clock','t2','Selected clock'],['clock','t3','Selected clock'],['control','t0','Mode / enable'],['control','t1','Mode / enable'],['io','t0','Counter / gate input'],['io','t1','Counter / gate input'],['reload','t2','Control / reload'],['reload','t3','Control / reload'],['t0','flags','TF0 / overflow'],['t1','flags','TF1 / overflow'],['t2','flags','TF2H / TF2L'],['t3','flags','TF3H / TF3L']],{'clock':'clock','sfr-interface':'control','crossbar':'io','interrupts':'flags','pca':'t0','smbus':'flags','adc':'flags'},'C8051 timers, not the M85 CMSDK timer. Clock alternatives and overflow routes are shown; counters do not run.');
 define('pca',294,'§27 · Figure 27.1',[
  [['clock','PCA clock selection','SYSCLK, /4, /12, EXOSC/8'],['counter','PCA0H : PCA0L','16-bit counter'],['control','PCA0CN / PCA0MD','WDTE enabled after reset']],
  [['cc0','Capture / compare 0'],['cc1','Capture / compare 1'],['cc2','Capture / compare 2']],
  [['cc3','Capture / compare 3'],['cc4','Capture / compare 4'],['cc5','Capture / compare 5','Watchdog option']],
  [['io','CEX0–5 / ECI'],['flags','CF / CCF0–5'],['wdt','Watchdog reset request']]
 ],[['clock','counter','Selected PCA clock'],['control','counter','Run / control'],['counter','flags','CF · counter overflow'],...Array.from({length:6},(_,i)=>['counter','cc'+i,'Counter value']),...Array.from({length:6},(_,i)=>['cc'+i,'io','CEX'+i,true]),...Array.from({length:6},(_,i)=>['cc'+i,'flags','CCF'+i]),['io','clock','ECI clock option'],['cc5','wdt','Watchdog timeout']],{'clock':'clock','timers':'clock','sfr-interface':'control','crossbar':'io','interrupts':'flags','reset':'wdt'},'Six actual capture/compare modules. Module 5 watchdog is enabled at reset; mode-specific circuits are not all expanded.');
 define('uart',250,'§24 · Figure 24.1',[
  [['txbuf','SBUF0 write','TX holding register'],['tx','UART0 transmitter'],['pins','TX0 / RX0']],
  [['rxbuf','SBUF0 read','RX FIFO · 3 bytes'],['rx','UART0 receiver'],['baud','Dedicated baud timer','SBRLH0 : SBRLL0']],
  [['cn','SCON0 / SMOD0'],['irq','TI0 / RI0'],['scale','SBCON0 / prescaler','Overflow / 1, 4, 12, 48']]
 ],[['txbuf','tx','Transmit byte'],['tx','pins','TX0 serial'],['pins','rx','RX0 serial'],['rx','rxbuf','Received byte'],['baud','scale','Timer overflow'],['scale','tx','TX timing'],['scale','rx','RX timing'],['cn','tx','Transmit configuration'],['cn','rx','Receive configuration'],['tx','irq','TI0'],['rx','irq','RI0']],{'sfr-interface':'cn','crossbar':'pins','interrupts':'irq','clock':'baud'},'SBUF0 reads and writes select different storage. This UART has a dedicated baud-rate timer.');
 define('spi',259,'§25 · Figure 25.1',[
  [['tx','Transmit buffer'],['shift','SPI0 shift register','8-bit'],['rx','Receive buffer']],
  [['cfg','SPI0CFG / SPI0CN'],['baud','SPI0CKR clock divider'],['pins','MOSI / MISO / SCK / NSS']],
  [['data','SPI0DAT','Write TX / read RX'],['irq','SPIF / WCOL / MODF / RXOVRN']]
 ],[['data','tx','Write byte'],['tx','shift','Load transmit data'],['shift','rx','Received byte'],['rx','data','Read byte'],['cfg','shift','Master / slave control'],['baud','shift','Shift timing'],['shift','pins','Serial data',true],['cfg','pins','Pin control'],['shift','irq','Transfer status']],{'sfr-interface':'data','crossbar':'pins','interrupts':'irq','clock':'baud'},'Master/slave alternatives are present; no SPI bus transaction is generated.');
 define('smbus',228,'§23 · Figure 23.1',[
  [['data','SMB0DAT','8-bit data register'],['logic','SMBus control','Arbitration / synchronization'],['pins','SDA / SCL','Input filters / open-drain I/O']],
  [['cn','SMB0CN / SMB0CF'],['clock','Clock / timeout logic','Timer overflow sources'],['address','SMB0ADR / SMB0ADM','Address match / auto ACK']],
  [['irq','SI · interrupt flag']]
 ],[['data','logic','Data transfer',true],['logic','pins','Bus signals',true],['cn','logic','Control'],['clock','logic','Clock timing'],['address','logic','Address / ACK decision'],['logic','irq','Interrupt status']],{'sfr-interface':'data','crossbar':'pins','interrupts':'irq','timers':'clock'},'External pull-ups belong to the board. Timer 0/1/2 overflow clock choices are not selected or simulated.');
 define('can',221,'§22 · Figure 22.2',[
  [['regs','CAN registers','SFR page 0x0C'],['handler','Message handler'],['ram','Message RAM','32 message objects']],
  [['clock','CAN0CFG clock divider','CAN clock ≤25 MHz'],['core','CAN protocol core'],['pins','CAN_TX / CAN_RX']]
 ],[['regs','core','CAN register access',true],['handler','ram','Message storage',true],['ram','core','Frame storage',true],['handler','core','Frames',true],['clock','core','CAN clock'],['core','pins','CAN logic signals',true]],{'sfr-interface':'regs','crossbar':'pins','interrupts':'regs','clock':'clock'},'Published CAN subsystem blocks; a physical CAN transceiver is external to the MCU. Protocol internals are not invented.');
 define('lin',201,'§21 · Figure 21.1',[
  [['access','LIN0ADR / LIN0DAT / LIN0CF','SFR access registers'],['control','Indirect control registers'],['data','LIN data registers']],
  [['machine','LIN control state machine','Master / slave controller'],['pins','LIN_TX / LIN_RX'],['irq','LIN interrupt status']]
 ],[['access','control','Indirect register access',true],['access','data','Data access',true],['access','machine','LIN0CF configuration'],['control','machine','Configuration / status',true],['data','machine','Frame data',true],['machine','pins','LIN serial signals',true],['machine','irq','Interrupt request']],{'sfr-interface':'access','crossbar':'pins','interrupts':'irq','clock':'machine'},'A physical LIN transceiver is on the board. SYSCLK ≥8 MHz is required; the reset clock is not a working LIN configuration.');
 define('crossbar',177,'§20 · Figures 20.1 / 20.3',[
  [['regs','XBR0 / XBR1 / XBR2','Enable / routing controls'],['priority','Priority decoder'],['skip','PnSKIP','Port allocation exclusions']],
  [['signals','Peripheral signals'],['routing','Digital crossbar'],['fixed','UART0 / CAN0 routes','P0.4/5 and P0.6/7',181]]
 ],[['regs','priority','Enabled functions'],['skip','priority','Skipped pins'],['priority','routing','Port assignment'],['signals','routing','Routable functions',true],['signals','fixed','Fixed UART0 / CAN0 routes',true],['fixed','routing','Fixed pad routes',true]],{'sfr-interface':'regs','ports':'routing','uart':'fixed','can':'fixed','*':'signals'},'Logical routing does not imply additional pins. UART0 and CAN0 have documented fixed assignments; no routes are enabled here.');
 define('ports',178,'§20 · Figure 20.2',[
  [['latch','P0–P4 data latches','40 digital I/O'],['driver','Output drivers','Open-drain / push-pull'],['pads','Multiplexed port pads']],
  [['config','PnMDIN / PnMDOUT','Analog / digital / drive mode'],['read','Digital input readback'],['pull','Weak pull-ups']],
  [['skip','PnSKIP'],['analog','Analog path','Digital input bypass'],['emif','EMIF port functions']]
 ],[['latch','driver','Output latch data'],['config','driver','Driver mode'],['driver','pads','Output drive'],['pull','pads','Weak pull-up'],['pads','read','Digital input'],['config','read','Digital enable'],['pads','analog','Analog voltage'],['emif','driver','External memory outputs'],['pads','emif','External memory inputs'],['skip','config','Port skip configuration']],{'pin:io':'pads','crossbar':'latch','sfr-interface':'config','emif':'emif','amux':'analog','comparators':'analog','interrupts':'read','adc':'read','*':'pads'},'Repeated pin circuitry is grouped; not 40 individually drawn cells. Shared analog and C2 pad functions are not extra pins.');
 define('emif',147,'§18 · External memory interface',[
  [['address','MOVX address selection','DPTR or R0/R1 + EMI0CN'],['decode','On-chip / external selection','EMI0CF'],['timing','Bus timing','EMI0TC']],
  [['data','8-bit data path'],['bus','Multiplexed / nonmux bus','Address / data'],['strobe','ALE / RD / WR']]
 ],[['address','decode','XDATA address'],['decode','bus','External address'],['data','bus','Read / write data',true],['timing','strobe','Strobe timing'],['strobe','bus','External control']],{'memory-interface':'address','ports':'bus','sfr-interface':'decode'},'EMIF is separate from on-chip XRAM. External memory hardware and MOVX bus cycles are not implemented.');
 define('amux',70,'§6.5 · Figure 6.8',[
  [['pins','P0–P3 analog inputs','32 port candidates'],['mux','ADC input selector','ADC0MX'],['temp','Internal temperature / VDD / GND']]
 ],[['pins','mux','External analog candidates'],['temp','mux','Internal analog candidates']],{'ports':'pins','pin:analog':'pins','temperature':'temp','adc':'mux','sfr-interface':'mux'},'One selected ADC input at a time. The grouped candidates are not extra analog pins.');
 define('adc',52,'§6 · Figure 6.1',[
  [['track','Gain / attenuation + track/hold'],['sar','12-bit SAR ADC'],['result','Accumulator / ADC0H:L']],
  [['ref','Reference / analog bias'],['control','ADC0CN / ADC0CF / ADC0TK'],['window','Window comparator','ADC0GT / ADC0LT']],
  [['trigger','Conversion start selection','AD0BUSY / T1 / T2 / CNVSTR'],['burst','Burst oscillator / control'],['irq','AD0INT / AD0WINT']]
 ],[['track','sar','Sample voltage'],['ref','sar','Reference'],['control','track','Acquisition configuration'],['control','sar','Conversion configuration'],['trigger','sar','Conversion start'],['burst','sar','Burst timing'],['sar','result','Conversion value'],['result','window','Window comparison'],['sar','irq','Conversion complete'],['window','irq','Window event']],{'amux':'track','reference':'ref','sfr-interface':'control','interrupts':'irq','timers':'trigger','ports':'trigger','clock':'burst'},'Analog functional paths only. No sampled voltage, conversion or accumulation is calculated.');
 define('reference',73,'§8 · Figure 8.1',[
  [['bandgap','Internal reference'],['gain','Gain / reference buffer','1.5 V / 2.25 V options'],['vref','VREF pin interface']],
  [['control','REF0CN','Reference / temperature enable'],['select','ADC reference selection','VREF or VDD'],['bias','Bias generator']]
 ],[['bandgap','gain','Reference voltage'],['gain','vref','Internal reference output'],['vref','select','Reference / analog bias'],['control','gain','Buffer configuration'],['control','select','REFSL'],['control','bias','Bias / temperature control']],{'pin:reference':'vref','adc':'select','sfr-interface':'control','temperature':'control','clock':'bias'},'Functional reference / bias blocks; external decoupling is board circuitry. No analog voltage is solved.');
 define('temperature',72,'§7 · Temperature sensor',[
  [['enable','TEMPE','REF0CN control'],['sensor','Temperature sensor','Analog VTEMP output']]
 ],[['enable','sensor','Sensor enable']],{'reference':'enable','amux':'sensor'},'The sensor produces an analog voltage for the ADC multiplexer; it does not directly produce a digital temperature.');
 define('comparators',75,'§9 · Figure 9.1',[
  [['mux0','CPT0MX','Positive / negative inputs',81],['cp0','Comparator 0','Hysteresis / raw CP0A'],['sync0','CP0 synchronization']],
  [['mux1','CPT1MX','Positive / negative inputs',81],['cp1','Comparator 1','Hysteresis / raw CP1A'],['sync1','CP1 synchronization']],
  [['control','CPT0CN/MD · CPT1CN/MD','Enable / hysteresis / edges'],['flags','Rising / falling flags'],['inputs','Analog port candidates']]
 ],[['inputs','mux0','Port input candidates'],['inputs','mux1','Port input candidates'],['mux0','cp0','Selected input pair'],['mux1','cp1','Selected input pair'],['cp0','sync0','CP0A'],['cp1','sync1','CP1A'],['control','cp0','Configuration'],['control','cp1','Configuration'],['sync0','flags','Comparator 0 edge'],['sync1','flags','Comparator 1 edge']],{'ports':'inputs','sfr-interface':'control','interrupts':'flags','reset':'cp0','crossbar':'sync0'},'Two comparator channels; each has its own input selection and status. No analog comparator switching is executed.');
 // Published interface fields are laid out with incoming read data on the left.
 for(const [id,x,y]of [['rd',90,55],['iface',310,149],['addr',530,55],['ctrl',530,149],['wr',530,243]]){
  Object.assign(configs.get('memory-interface').units.find(n=>n.id===id),{x,y});
 }
 configs.get('memory-interface').height=352;
 for(const [id,x,y]of [['read',90,55],['iface',310,149],['address',530,55],['control',530,149],['write',530,243],['page',90,243]])Object.assign(configs.get('sfr-interface').units.find(n=>n.id===id),{x,y});
 configs.get('sfr-interface').height=352;
 // Add documented connections absent from the original coarse overview.
 function link(a,b,both,label,from,to,kind='data',net) {
  const i=arch.links.length;arch.links.push([a,b,both,label,kind]);
  instance.connectionPorts['architecture:'+i]={from,to,fromSide:'right',toSide:'left',...(net?{net}:{})};return i;
 }
 for(const id of ['pointers','interrupts','power-control','regulator','reference','amux','emif','crossbar'])link('sfr-interface',id,true,'SFR access','SFR_ADDRESS / DATA / CONTROL','SFR');
 for(const id of ['uart','spi','can','lin'])link('clock',id,false,'System clock','SYSCLK','SYSCLK','clock','chip.clock.sysclk');
 link('timers','pca',false,'Timer 0 overflow','T0 overflow','T0 overflow','clock');
 link('timers','smbus',false,'Timer overflow clock','T0 / T1 / T2 overflow','Timer clock','clock');
 link('timers','adc',false,'Timer conversion start','T1 / T2 overflow','Conversion trigger','control');
 link('ports','adc',false,'External conversion start','CNVSTR','CNVSTR','control');
 link('ports','comparators',false,'Comparator input candidates','Analog inputs','Analog inputs','analog');
 link('comparators','crossbar',false,'Comparator outputs','CP0 / CP1 / CP0A / CP1A','Comparator outputs','data');
 link('reference','temperature',false,'Temperature sensor enable','TEMPE','TEMPE','control');
 link('regulator','interrupts',false,'Regulator dropout interrupt','DROPOUT','Regulator dropout','irq');
 link('registers','memory-interface',true,'Internal data bus','Internal data bus','Internal data bus');
 const flagsLink=link('alu','registers',false,'ALU status flags','PSW flags','PSW flags','control');
 configs.get('alu').bind['link-'+flagsLink+'-from']='flags';
 configs.get('registers').bind['link-'+flagsLink+'-to']='psw';
 const adcBias=link('reference','adc',false,'Analog bias','BIAS','BIAS','analog','chip.reference.bias');
 configs.get('reference').bind['link-'+adcBias+'-from']='bias';
 const sensorBias=link('reference','temperature',false,'Sensor bias','BIAS','BIAS','analog','chip.reference.bias');
 configs.get('reference').bind['link-'+sensorBias+'-from']='bias';
 configs.get('temperature').bind['link-'+sensorBias+'-to']='sensor';
 const oscillatorBias=link('reference','clock',false,'Oscillator bias','BIAS','BIAS','analog','chip.reference.bias');
 instance.connectionPorts['architecture:'+oscillatorBias].toDetail='BIAS';
 const clockDiagram=definitions.get('clock').diagram;
 clockDiagram.ports.push({id:'BIAS',label:'BIAS',side:'left',direction:'input',y:105});
 clockDiagram.units.find(n=>n.id==='iosc').ports.push({id:'bias',side:'left',direction:'input',at:0.5});
 clockDiagram.wires.push({id:'analog-bias',from:'boundary.BIAS',to:'iosc.bias',label:'Internal oscillator analog bias · §8',kind:'analog',net:'chip.reference.bias'});
 // Link-specific boundary contacts preserve existing outer net identities. They are
 // presentation contacts on the unit, not extra silicon blocks or package pins.
 function targetFor(c,peer,key,outgoing) {
  const binding=c.bind[key]||c.bind[peer]||c.bind['*'];
  if(!binding)throw new Error('Missing functional binding '+peer+' / '+key);
  return Array.isArray(binding)?binding[outgoing?1:0]:binding;
 }
 function setup(id,c) {
  const definition=definitions.get(id);definition.detailView='functional';
  const diagram=definition.diagram={width:800,height:c.height,units:c.units,ports:[],wires:[],reference:c.reference,note:c.note+' Static inspection; workflows remain separate.'};
  definition.reference=c.reference.section;definition.referenceHref=c.reference.href;
  const map=new Map(c.units.map(n=>[n.id,n]));let index=0;
  function port(node,side,direction,name) {
   const unit=map.get(node);if(!unit)throw new Error('Unknown box '+id+'.'+node);
   const spec={id:'p'+index++,side,direction,name};unit.ports.push(spec);return node+'.'+spec.id;
  }
  function wire(from,to,label,both=false,net,kind) {diagram.wires.push({id:'wire-'+diagram.wires.length,from,to,label,both,net,kind});}
  for(const [a,b,label,both] of c.links)wire(port(a,'right',both?'bidirectional':'output',label),port(b,'left',both?'bidirectional':'input',label),label,!!both);
  c.contact=(key,label,outgoing,both,peer,net,kind)=>{
   const side=outgoing?'right':'left',direction=both?'bidirectional':outgoing?'output':'input';
   const node=targetFor(c,peer,key,outgoing),boundary={id:key,label,side,direction,y:0};if(diagram.ports.some(p=>p.id===key))return;diagram.ports.push(boundary);
   const terminal=port(node,side,direction,label),edge='boundary.'+key;
   wire(outgoing?terminal:edge,outgoing?edge:terminal,label,both,net,kind);
  };
 }
 for(const [id,c]of configs)setup(id,c);
 arch.links.forEach(([a,b,both,label,kind],i)=>{
  const hint=instance.connectionPorts['architecture:'+i];if(!hint)return;
  const sfrBus=a==='sfr-interface'&&b!=='registers';
  hint.net ||= 'chip.connection.'+i;
  if(sfrBus)hint.net='chip.sfr.bus';
  for(const [id,peer,role,outgoing]of [[a,b,'from',true],[b,a,'to',false]]){
   const c=configs.get(id);if(!c)continue;
   // Coarse memory links are replaced by the memory fixture's four/five nets.
   if(instance.memoryPreviews[peer]&&id==='memory-interface')continue;
   const key=sfrBus&&role==='from'?'sfr-bus':'link-'+i+'-'+role;hint[role+'Detail']=key;
   c.contact(key,(hint[role]||label).replace('SFR_ADDRESS / DATA / CONTROL','SFR bus'),outgoing,both,peer,hint.net,kind);
  }
 });
 for(const pin of instance.pins)for(const id of pin.targets||[pin.target]){
  const c=configs.get(id);if(!c)continue;
  pin.detailPorts ||= {};const key='pin:'+pin.id;pin.detailPorts[id]=key;
  pin.net ||= 'chip.pin.'+pin.id;
  c.contact(key,pin.label,pin.direction==='output',!!pin.both,'pin:'+pin.id,pin.net,pin.signalKind);
 }
 for(const [memory,m]of Object.entries(instance.memoryPreviews))for(const signal of ['address','input','control','output',...(m.kind==='program'?['program-control']:[])]){
  const peer=m.netPeers?.[signal]||m.peer,c=configs.get(peer);if(!c)continue;
  c.contact(memory+'.'+signal,memory.toUpperCase()+' '+signal,signal!=='output',false,memory,'chip.'+memory+'.'+signal,'data');
 }
 for(const [id,c]of configs){
  const diagram=definitions.get(id).diagram;
  // Incoming and outgoing edge labels are separate lanes, not repeated large boxes.
  for(const side of ['left','right']){
   const ports=diagram.ports.filter(p=>p.side===side);diagram.height=Math.max(diagram.height,ports.length*24+42);
   ports.forEach((p,i)=>p.y=30+i*24);
  }
  // Re-space dense box ports after the graph is complete.
  for(const n of diagram.units)for(const side of ['left','right','top','bottom']){
   const ports=n.ports.filter(p=>p.side===side);ports.forEach((p,i)=>p.at=(i+1)/(ports.length+1));
  }
 }
 for(const wire of definitions.get('clock').diagram.wires)if(wire.net==='chip.clock.sfr')wire.net='chip.sfr.bus';
 window.ChipOpenboxC8051F500Details={unitIds:[...configs.keys()],sourceRevision:'Rev. 1.0',static:true};
})();
