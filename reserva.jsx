// Reservation prototype — Russes Gastrobar
const { useState, useMemo } = React;

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DOWS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

// Mon..Sat services: lunch + dinner. Sunday closed.
const SERVICES = {
  lunch: { mon: ['13:00','13:30','14:00','14:30','15:00','15:30','16:00'], satExtra: '16:30' },
  dinner: ['20:30','21:00','21:30','22:00','22:30','23:00','23:30']
};

function getLunchSlots(dow) {
  // dow: 1=Mon...6=Sat, 0=Sun
  const base = ['13:00','13:30','14:00','14:30','15:00','15:30'];
  if (dow === 1 || dow === 6) return [...base, '16:00'];
  return base;
}
function getDinnerSlots() { return SERVICES.dinner; }

function startOfMonth(year, month) { return new Date(year, month, 1); }
function daysInMonth(year, month) { return new Date(year, month+1, 0).getDate(); }
function isSameDay(a, b) { return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function fmtDate(d) {
  if (!d) return '';
  const dow = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'][d.getDay()];
  return `${dow.charAt(0).toUpperCase()+dow.slice(1)}, ${d.getDate()} de ${MONTHS[d.getMonth()].toLowerCase()}`;
}

function Calendar({ value, onChange }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = startOfMonth(year, month);
  const firstDow = (first.getDay() + 6) % 7; // 0=Mon
  const total = daysInMonth(year, month);

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d));

  const minDate = today;
  const maxDate = new Date(today); maxDate.setMonth(maxDate.getMonth() + 3);

  const canPrev = cursor > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = cursor < new Date(today.getFullYear(), today.getMonth() + 2, 1);

  return (
    <div>
      <div className="cal-head">
        <button className="cal-nav" disabled={!canPrev} onClick={() => setCursor(new Date(year, month-1, 1))}>‹</button>
        <div className="cal-month">{MONTHS[month]} {year}</div>
        <button className="cal-nav" disabled={!canNext} onClick={() => setCursor(new Date(year, month+1, 1))}>›</button>
      </div>
      <div className="cal-grid">
        {DOWS.map(d => <div key={d} className="cal-dow">{d}</div>)}
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="cal-day empty"></div>;
          const dow = d.getDay(); // 0=Sun
          const closed = dow === 0;
          const past = d < minDate;
          const tooFar = d > maxDate;
          const disabled = past || tooFar;
          const selected = isSameDay(d, value);
          const todayMark = isSameDay(d, today);
          const cls = ['cal-day'];
          if (closed) cls.push('closed');
          else if (disabled) cls.push('disabled');
          if (selected) cls.push('selected');
          if (todayMark) cls.push('today');
          return (
            <div
              key={i}
              className={cls.join(' ')}
              onClick={() => !closed && !disabled && onChange(d)}
              title={closed ? 'Domingo · cerrado' : ''}
            >{d.getDate()}</div>
          );
        })}
      </div>
    </div>
  );
}

function ReservaApp() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(null);
  const [service, setService] = useState(null); // 'lunch' | 'dinner'
  const [time, setTime] = useState(null);
  const [guests, setGuests] = useState(2);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [confirmed, setConfirmed] = useState(false);

  const dow = date ? date.getDay() : null;
  const lunchSlots = useMemo(() => date ? getLunchSlots(dow) : [], [date]);
  const dinnerSlots = useMemo(() => getDinnerSlots(), []);

  function pickDate(d) {
    setDate(d);
    setService(null);
    setTime(null);
  }
  function pickService(s) {
    setService(s);
    setTime(null);
  }

  function next() { setStep(s => Math.min(3, s+1)); window.scrollTo({ top: document.querySelector('.reserva-section').offsetTop - 80, behavior: 'smooth' }); }
  function prev() { setStep(s => Math.max(1, s-1)); }
  function submit(e) {
    e.preventDefault();
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const canStep2 = !!(date && service && time);
  const canSubmit = canStep2 && form.name.trim() && form.phone.trim();

  if (confirmed) {
    return (
      <div className="confirm-wrap">
        <div className="confirm-icon">✓</div>
        <h2>Reserva enviada</h2>
        <span className="signature">¡Te esperamos!</span>
        <p>Hemos recibido tu solicitud. <strong>Te confirmaremos en breve por teléfono o WhatsApp</strong> al número que nos has dejado.</p>
        <div className="confirm-card">
          <div className="row"><span className="k">A nombre</span><span className="v">{form.name}</span></div>
          <div className="row"><span className="k">Día</span><span className="v">{fmtDate(date)}</span></div>
          <div className="row"><span className="k">Hora</span><span className="v">{time} · {service === 'lunch' ? 'Comida' : 'Cena'}</span></div>
          <div className="row"><span className="k">Comensales</span><span className="v">{guests} {guests === 1 ? 'persona' : 'personas'}</span></div>
          <div className="row"><span className="k">Teléfono</span><span className="v">{form.phone}</span></div>
        </div>
        <p style={{fontSize: '13px', opacity: 0.7}}>Si necesitas modificar o cancelar la reserva, llámanos al <a href="tel:+34694497322" style={{color: 'var(--bark-deep)', fontWeight: 600}}>694 49 73 22</a>.</p>
        <a href="index.html" className="btn outline" style={{marginTop: 24}}>Volver al inicio</a>
      </div>
    );
  }

  return (
    <div className="reserva-grid">
      <div>
        <div className="steps">
          <div className={`step ${step===1?'active':''} ${step>1?'done':''}`} onClick={() => step>1 && setStep(1)}>
            <span className="num">1</span>Día y hora
          </div>
          <div className={`step ${step===2?'active':''} ${step>2?'done':''}`} onClick={() => canStep2 && setStep(2)}>
            <span className="num">2</span>Comensales
          </div>
          <div className={`step ${step===3?'active':''}`}>
            <span className="num">3</span>Tus datos
          </div>
        </div>

        {step === 1 && (
          <div>
            <h3 className="step-title">¿Qué día os viene bien?</h3>
            <p className="step-sub">Abrimos de lunes a sábado, mediodía y noche. Domingo cerrado.</p>
            <Calendar value={date} onChange={pickDate} />

            {date && (
              <div style={{marginTop: 40}}>
                <h3 className="step-title" style={{fontSize: 22}}>Elige turno</h3>
                <div className="service-toggle">
                  <button className={service==='lunch'?'active':''} onClick={() => pickService('lunch')}>
                    <span className="label">— Comida —</span>
                    <span className="time">13:00 – {dow===1||dow===6 ? '16:30' : '16:00'}</span>
                  </button>
                  <button className={service==='dinner'?'active':''} onClick={() => pickService('dinner')}>
                    <span className="label">— Cena —</span>
                    <span className="time">20:30 – 24:00</span>
                  </button>
                </div>

                {service && (
                  <div>
                    <h3 className="step-title" style={{fontSize: 22}}>A qué hora</h3>
                    <div className="times-grid">
                      {(service === 'lunch' ? lunchSlots : dinnerSlots).map(slot => {
                        // simulate some slots taken
                        const taken = ['14:00','21:30','22:00'].includes(slot) && Math.random() < 0.5;
                        const cls = ['time-slot'];
                        if (slot === time) cls.push('selected');
                        if (taken) cls.push('disabled');
                        return (
                          <div key={slot} className={cls.join(' ')} onClick={() => !taken && setTime(slot)}>{slot}</div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="cta-row">
              <button className="btn" disabled={!canStep2} onClick={next} style={{opacity: canStep2?1:0.4, cursor: canStep2?'pointer':'not-allowed'}}>Siguiente</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="step-title">¿Cuántos seréis?</h3>
            <p className="step-sub">Para grupos de más de 8, llámanos directamente al 694 49 73 22 y te lo organizamos.</p>
            <div className="guests-row">
              {[1,2,3,4,5,6,7,8].map(n => (
                <div key={n} className={'g' + (guests===n?' selected':'')} onClick={() => setGuests(n)}>{n}</div>
              ))}
            </div>
            <p className="bigger">¿Más de 8 personas? <a href="tel:+34694497322">Llámanos</a></p>

            <div className="cta-row">
              <button className="secondary" onClick={prev}>← Atrás</button>
              <button className="btn" onClick={next}>Siguiente</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={submit}>
            <h3 className="step-title">Tus datos</h3>
            <p className="step-sub">Necesitamos un nombre y un teléfono para confirmar tu reserva.</p>
            <div className="form-row">
              <div className="field">
                <label>Nombre</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nombre y apellido" />
              </div>
              <div className="field">
                <label>Teléfono</label>
                <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="6XX XX XX XX" />
              </div>
            </div>
            <div className="field" style={{marginBottom: 16}}>
              <label>Email <span style={{textTransform:'none', letterSpacing:0, opacity: 0.6}}>· opcional</span></label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="tu@email.com" />
            </div>
            <div className="field">
              <label>Notas <span style={{textTransform:'none', letterSpacing:0, opacity: 0.6}}>· alergias, ocasión, peticiones especiales</span></label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Cumpleaños, intolerancia al gluten, mesa junto a la ventana…"></textarea>
            </div>

            <div className="cta-row">
              <button type="button" className="secondary" onClick={prev}>← Atrás</button>
              <button type="submit" className="btn" disabled={!canSubmit} style={{opacity: canSubmit?1:0.4, cursor: canSubmit?'pointer':'not-allowed'}}>Solicitar reserva</button>
            </div>
          </form>
        )}
      </div>

      {/* SUMMARY ASIDE */}
      <aside className="summary">
        <h3>— Resumen de tu reserva —</h3>
        <div className="big">Russes</div>
        <span className="signature">Aracena</span>

        <div className="summary-row">
          <span className="k">Día</span>
          <span className={'v' + (date?'':' empty')}>{date ? fmtDate(date) : 'Por elegir'}</span>
        </div>
        <div className="summary-row">
          <span className="k">Turno</span>
          <span className={'v' + (service?'':' empty')}>{service === 'lunch' ? 'Comida' : service === 'dinner' ? 'Cena' : 'Por elegir'}</span>
        </div>
        <div className="summary-row">
          <span className="k">Hora</span>
          <span className={'v' + (time?'':' empty')}>{time || 'Por elegir'}</span>
        </div>
        <div className="summary-row">
          <span className="k">Comensales</span>
          <span className="v">{guests} {guests === 1 ? 'persona' : 'personas'}</span>
        </div>

        <p className="note">Esta reserva no se confirma automáticamente. Te llamaremos o escribiremos para confirmarla en cuanto la recibamos.</p>
        <p className="note" style={{marginTop: 12}}>¿Prefieres por teléfono? <a href="tel:+34694497322" style={{color: 'var(--gold)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 4}}>694 49 73 22</a></p>
      </aside>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('reservaApp')).render(<ReservaApp />);
