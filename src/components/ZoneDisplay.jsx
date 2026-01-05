function ZoneDisplay({ zoneName, className, range, zone, cene }) {
  return (
    <div className={className}>
      <div className="spec">
        <span className="label">{zoneName} ({range}):</span> {zone.ukupno.toFixed(0)} kWh
      </div>
      <div className="spec indent">
        VT: {zone.vt.toFixed(0)} kWh × {cene.visa} = {(zone.vt * cene.visa).toFixed(2)} RSD
      </div>
      <div className="spec indent">
        NT: {zone.nt.toFixed(0)} kWh × {cene.niza} = {(zone.nt * cene.niza).toFixed(2)} RSD
      </div>
      <div className="spec indent">
        <strong>Ukupno {zoneName.toLowerCase()}: {(zone.vt * cene.visa + zone.nt * cene.niza).toFixed(2)} RSD</strong>
      </div>
    </div>
  );
}

export default ZoneDisplay;
