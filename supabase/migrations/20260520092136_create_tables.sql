create table flights (
  id uuid primary key default gen_random_uuid(),

  flight_no text not null,
  origin text not null,
  destination text not null,

  departs_at timestamptz not null,
  arrives_at timestamptz not null,

  aircraft_type text not null,

  status text not null default 'scheduled',

  base_price numeric(10,2) not null,

  created_at timestamptz default now()
);

create table seats(
    id uuid primary key default gen_random_uuid(),

    flight_id uuid not null references flights(id) on delete cascade,

    seat_number text not null,

    class text not null check(
        class in('economy','business','first')
    ),

    is_available boolean default true,

    extra_fee numeric(10,2) default 0,

    created_at timestamptz default now(),

    unique(flight_id,seat_number)
);


create table bookings (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references auth.users(id),

    flight_id uuid not null references flights(id),

    seat_id uuid not null references seats(id),

    status text not null default 'confirmed' check(
        status in ('confirmed','cancelled','rescheduled')
    ),

    booked_at timestamptz default now(),

    total_price numeric(10,2) not null,

    pnr_code text unique not null,

    created_at timestamptz default now()
);

create table passengers(
    id uuid primary key default gen_random_uuid(),

    booking_id uuid not null references bookings(id) on delete cascade,

    full_name text not null,

    passport_no text not null,

    nationality text not null,

    dob date not null,

    created_at timestamptz default now()
);


create table reschedules (
    id uuid primary key default gen_random_uuid(),

    booking_id uuid not null references bookings(id),

    old_flight_id uuid not null references flights(id),

    new_flight_id uuid not null references flights(id),

    requested_at timestamptz default now(),

    fee_charged numeric(10,2) default 0
);

