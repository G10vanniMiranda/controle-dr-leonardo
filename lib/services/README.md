# Services data provider

The application imports services from `lib/services/*-service.ts`.

Provider selection is controlled by:

```env
NEXT_PUBLIC_DATA_PROVIDER=mock
```

Current behavior:

- `mock`: active implementation using local `lib/mock-data`.
- `supabase`: typed stubs in `lib/services/supabase/*` that intentionally throw until the real database integration phase.

Keep UI code importing only from the public service files. When Supabase is implemented, preserve each public function signature and replace the stub internals.
