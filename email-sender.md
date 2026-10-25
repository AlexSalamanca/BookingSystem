# Amenity room booking emails

The booking page can't send email itself, so a scheduled sender does it. The sender runs every
hour, reads the page's database, sends whatever is due and records what it sent so nothing goes
out twice. The page shows the status of each booking in the office view, for example
"Office email sent · key reminder on Thu, Nov 5".

## Addresses

| | Address |
|---|---|
| Sender (placeholder) | `amenitybooking@example.com` (replace it once the real mailbox exists) |
| Office (new booking alerts) | `alexsalamanca94@hotmail.com` |

## Where the data is

Artifact: https://claude.ai/artifact/1PPpNUdZ22jko4gEMxkE5a

- `bookings/<ownerId>` → `{bookings: [{id, date "YYYY-MM-DD", start, end (minutes after midnight), title, unit, guests, status, createdAt}]}`
- `contacts/<ownerId>` → `{<bookingId>: {name, unit, phone, email, ...}}`
- `notices/<bookingId>` → `{officeSentAt, reminderSentAt}` (ISO timestamps written by the sender)

## Rules

1. **New booking → office.** For every booking that has no `notices/<id>.officeSentAt`, email the
   office address, then set `officeSentAt`.
2. **Key pickup reminder → resident.** The reminder date is 2 days before the booking. A Sunday
   booking moves back to the Thursday before, and for a Saturday booking 2 days before is already
   Thursday. If 2 days before lands on a weekend (Monday and Tuesday bookings), the reminder moves
   to the Friday before. Once today is on or after that date, and the booking hasn't happened yet, email the
   address in `contacts/<ownerId>.<bookingId>.email`, then set `reminderSentAt`. A booking made
   after its reminder date gets the reminder on the next run.
3. Skip bookings whose date has already passed. A cancelled booking disappears from `bookings`,
   so it never gets an email.
4. If a booking has no contact email, don't send the reminder, and say so in the run summary.

## Templates

Times are minutes after midnight: 600 is 10:00 AM.

**New booking (to the office)**

> Subject: New amenity room booking: {date} {start}–{end}, unit {unit}
>
> A new amenity room booking was submitted and is awaiting confirmation.
>
> Function: {title}
> Date: {date}, {start} – {end}
> Guests: {guests}
> Unit: {unit}
> Name: {name} · Phone: {phone} · Email: {email}
>
> Confirm it on the booking page: https://claude.ai/artifact/1PPpNUdZ22jko4gEMxkE5a

**Key pickup reminder (to the resident)**

> Subject: Reminder: pick up the amenity room keys for {date}
>
> Hi {name},
>
> Your amenity room booking, "{title}", is on {weekday, date} from {start} to {end}.
>
> Please pick up the FOB and washroom key from the FVT Admin Office before your event. The office
> is open 8 AM – 11 AM and 2 PM – 4 PM. Bring photo ID, because keys are only released with proof
> of photo ID.
>
> Remember to leave the room clean and as you found it.
>
> Amenity Room Bookings

## Turning it on

Once the `amenitybooking` mailbox exists and is connected to Claude (for example a Gmail or
Outlook connector), ask Claude to create an hourly scheduled task from this file, with the
placeholder sender replaced by the real address.
