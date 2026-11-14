export const wedding = {
  groom: {
    first: "Arpit",
    last: "Trivedi",
    relation: "s/o",
    parents: "Mrs. Manju Trivedi & Mr. Rohit Kumar Trivedi",
  },
  bride: {
    first: "Divyanshi",
    last: "Mishra",
    relation: "d/o",
    parents: "Mrs. Poonam Mishra & Mr. Praveen Mishra",
  },
  city: "Udaipur",
  dateLabel: "2nd February 2027",
  countdownTo: "2027-02-02T11:00:00+05:30",
  calendar: {
    start: "2027-02-02T11:00:00+05:30",
    end: "2027-02-06T23:00:00+05:30",
  },
  rsvpBy: "20th January 2027",
  hashtag: "#ArpitWedsDivyanshi",
  venue: {
    name: "Shree Gokul Garden",
    area: "Near Vaishali Apartment, Manwa Kheda Road, Sector 4, Hiran Magri, Udaipur, Rajasthan 313002",
    maps: "https://maps.app.goo.gl/MbGLuCW8Ycuc8Y9MA",
    mapEmbed:
      "https://www.openstreetmap.org/export/embed.html?bbox=75.792%2C26.889%2C75.824%2C26.910&layer=mapnik&marker=26.8988%2C75.8086",
  },
  travel: [
    {
      label: "Nearest airport",
      detail:
        "Maharana Pratap Airport (UDR) — about 12 km, roughly 30 minutes by road.",
    },
    {
      label: "Railway station",
      detail: "Udaipur City (UDR) — about 5 km, roughly 20 minutes by road.",
    },
  ],
  events: [
    {
      key: "Ganpati Sthapna",
      name: "Ganpati Sthapna",
      title: "The First Prayer",
      when: "29th January 2027 · 09:00 AM (Salera Kalan, Udaipur, Rajasthan)",
      dress: "Traditional Indian attire",
    },
    {
      key: "haldi",
      name: "Haldi",
      title: "Sunehra Savera",
      when: "29th January 2027 · 11:00 AM (Salera Kalan, Udaipur, Rajasthan)",
      dress: "Yellow, white, and easy festive wear",
    },
    {
      key: "mehendi",
      name: "Mehendi",
      title: "Rangon Ka Utsav",
      when: "29th January 2027 · 04:00 PM",
      dress: "Playful pastels, florals, and cheerful daytime colours",
    },
    {
      key: "Grah Shanti Pooja",
      name: "Grah Shanti Pooja",
      title: "The Peaceful Prayer",
      when: "30th January 2027 · 09:00 AM (Salera Kalan, Udaipur, Rajasthan)",
      dress: "White and traditional attire",
    },
    {
      key: "Bindoli",
      name: "Bindoli",
      title: "Mehfil-e-Shaam",
      when: "30th January 2027 · 07:00 PM (Salera Kalan, Udaipur, Rajasthan)",
      dress: "Glamorous festive wear with a touch of sparkle",
    },
    {
      key: "Engagement",
      name: "Engagement",
      title: "The Engagement Ceremony",
      when: "1st February 2027 · 04:00 PM (Kanpur, UP)",
      dress: "Elegant evening formals",
    },
    {
      key: "wedding",
      name: "Baraat · Varmala · Phere",
      title: "Saat Phere",
      when: "2nd February 2027 · 08:00 AM (Kanpur, UP)",
      dress: "Traditional Indian attire",
    },
    {
      key: "reception",
      name: "Reception",
      title: "The Marigold Evening",
      when: "6th February 2027 · 07:00 PM (Udaipur, Rajasthan)",
      dress: "Elegant evening formals",
    },
  ],
};

export function coupleNames() {
  return `${wedding.groom.first} & ${wedding.bride.first}`;
}

export function calendarUrl() {
  const stamp = (iso) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Wedding of ${coupleNames()}`,
    dates: `${stamp(wedding.calendar.start)}/${stamp(wedding.calendar.end)}`,
    details: `Join us in ${wedding.city} for the wedding celebrations of ${coupleNames()}.`,
    location: `${wedding.venue.name}, ${wedding.venue.area}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
