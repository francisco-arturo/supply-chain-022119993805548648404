/*
 * Pure quoting logic. No DOM, no framework. Imported by app.js in the browser
 * and by check.mjs in Node so the price on screen is the price the tests check.
 */

const EARTH_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function distanceKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function money(n) {
  return Math.round(n);
}

export function findLocation(content, id) {
  const found = content.quote.locations.find((location) => location.id === id);
  if (!found) throw new Error(`Unknown location: ${id}`);
  return found;
}

export function priceQuote(content, selection) {
  const quote = content.quote;
  const origin = findLocation(content, selection.origin);
  const destination = findLocation(content, selection.destination);
  if (origin.id === destination.id) throw new Error("Origin and destination must differ");

  const mode = quote.modes.find((item) => item.id === selection.mode);
  const service = quote.services.find((item) => item.id === selection.service);
  if (!mode) throw new Error(`Unknown mode: ${selection.mode}`);
  if (!service) throw new Error(`Unknown service: ${selection.service}`);

  const rate = quote.rates[mode.id];
  if (!rate) throw new Error(`No rate table for mode: ${mode.id}`);

  const km = distanceKm(origin, destination);
  const weight = Math.min(
    quote.common.maxWeight,
    Math.max(quote.common.minWeight, Number(selection.weight) || quote.common.minWeight)
  );

  // Heavier cargo costs more per kilo, but not linearly: handling and slot
  // costs dominate the first few tonnes.
  const weightFactor = 1 + Math.min(0.6, Math.max(0, Math.log10(weight / 50)) * 0.16);
  const freight = (rate.base + rate.perKg * weight * weightFactor + rate.perKm * km) * service.multiplier;

  const items = [
    { key: "freight", label: `${mode.name}, ${Math.round(km).toLocaleString("en-US")} km`, amount: money(freight) },
    {
      key: "fuel",
      label: `Fuel surcharge (${Math.round(quote.common.fuelPercent * 100)}%)`,
      amount: money(freight * quote.common.fuelPercent)
    },
    { key: "terminal", label: "Terminal handling", amount: money(rate.terminal) },
    { key: "security", label: "Security and screening", amount: money(rate.security) },
    { key: "docs", label: "Documentation", amount: money(quote.common.documentation) }
  ];

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const transitDays = Math.max(
    1,
    Math.round((rate.fixedDays + km / rate.kmPerDay) * service.transitFactor)
  );
  const tonnes = weight / 1000;
  const co2Kg = Math.round(tonnes * km * rate.co2);

  return {
    origin,
    destination,
    mode,
    service,
    km: Math.round(km),
    weight,
    transitDays,
    items,
    total,
    co2Kg,
    perKg: Math.round((total / weight) * 100) / 100
  };
}
