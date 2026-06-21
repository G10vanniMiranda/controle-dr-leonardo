# Supabase schema

This folder keeps the database preparation for the legal and financial control system.

Current files:

- `schema.sql`: legacy snapshot kept for reference.
- `migrations/20260621000000_initial_legal_financial_schema.sql`: current initial migration to apply when the project is connected to Supabase.

The migration creates:

- Core tables for clients, cases, legal fees, installments, condemnations, debt installments, monthly bills, documents and activity logs.
- Row Level Security policies scoped by `auth.uid() = user_id`.
- Storage bucket `legal-documents` with per-user folder policies.
- `updated_at` trigger helper.
- Indexes for common filters and joins.

Expected Storage path convention:

```text
legal-documents/{user_id}/{module}/{file_name}
```

The application still uses local mocks. Apply this migration only when moving to the database integration phase.
