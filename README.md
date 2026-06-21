# Dr. Leonardo Controle

Sistema web de controle juridico e financeiro para escritorio de advocacia.

## Desenvolvimento

```bash
npm install
npm run dev
```

Ambiente local sem banco:

```env
NEXT_PUBLIC_DATA_PROVIDER=mock
```

## Validacao

```bash
npm run lint
npm run build
```

## Producao

Antes de publicar, rode:

```bash
npm run check:production
```

O deploy real deve usar:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_DATA_PROVIDER=supabase
```

## O que ainda bloqueia producao real

- Implementar os services em `lib/services/supabase/*` sem `notImplementedForSupabase`.
- Aplicar as migrations em `supabase/migrations`.
- Configurar Supabase Auth e confirmar que `proxy.ts` protege todas as rotas privadas.
- Configurar Storage protegido para documentos.
- Executar `npm run lint`, `npm run build` e `npm run check:production` antes do deploy.

Enquanto `NEXT_PUBLIC_DATA_PROVIDER=mock`, o sistema serve para validacao visual e funcional, mas nao deve ser usado em producao com dados reais.
