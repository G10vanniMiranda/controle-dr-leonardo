# Plano de Desenvolvimento — Sistema de Controle Jurídico e Financeiro Dr. Leonardo

## 1. Objetivo do Projeto

Criar um sistema web profissional para o Dr. Leonardo controlar:

* Contas pessoais e mensais
* Clientes
* Processos jurídicos
* Honorários contratuais
* Condenações da parte contrária
* Quitação de dívidas
* Parcelamentos
* Recebimentos
* Relatórios financeiros
* Documentos vinculados aos processos

O sistema deve ser moderno, seguro, responsivo e fácil de usar.

---

## 2. Stack Recomendada

Utilizar:

* Next.js com App Router
* TypeScript
* Tailwind CSS
* Shadcn UI
* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* React Hook Form
* Zod
* TanStack Table
* Recharts
* date-fns
* lucide-react

---

## 3. Estrutura Inicial do Sistema

Criar as seguintes páginas principais:

### Área pública

* `/login`

### Área autenticada

* `/dashboard`
* `/clientes`
* `/clientes/novo`
* `/clientes/[id]`
* `/processos`
* `/processos/novo`
* `/processos/[id]`
* `/honorarios`
* `/condenacoes`
* `/parcelamentos`
* `/contas`
* `/relatorios`
* `/documentos`
* `/configuracoes`

---

## 4. Layout Administrativo

Criar um painel profissional com:

* Sidebar fixa no desktop
* Menu inferior ou drawer no mobile
* Header com nome do usuário
* Cards de resumo
* Tabelas modernas
* Filtros por mês, status e cliente
* Botões claros de ação
* Estados de loading
* Estados vazios
* Confirmação antes de excluir registros
* Design limpo, jurídico, premium e profissional

Visual desejado:

* Fundo claro ou dark elegante
* Cores sóbrias
* Tipografia moderna
* Ícones discretos
* Interface parecida com ERP/SaaS profissional

---

## 5. Módulo Dashboard

Criar dashboard com os seguintes indicadores:

* Total recebido no mês
* Total a receber no mês
* Total vencido
* Total de processos ativos
* Honorários pendentes
* Parcelamentos ativos
* Contas mensais pendentes
* Condenações em aberto

Adicionar gráficos:

* Entradas por mês
* Saídas por mês
* Recebimentos por categoria
* Status dos processos

---

## 6. Módulo Clientes

Cada cliente deve ter:

* Nome completo
* CPF/CNPJ
* Telefone
* E-mail
* Endereço
* Observações
* Data de cadastro
* Status: ativo ou inativo

Funcionalidades:

* Listar clientes
* Pesquisar por nome, CPF/CNPJ ou telefone
* Criar cliente
* Editar cliente
* Excluir cliente com confirmação
* Ver detalhes do cliente
* Mostrar processos vinculados ao cliente
* Mostrar valores financeiros vinculados ao cliente

---

## 7. Módulo Processos

Cada processo deve ter:

* Cliente vinculado
* Número do processo
* Tipo da ação
* Vara
* Comarca
* Estado
* Parte contrária
* Valor da causa
* Status do processo
* Fase processual
* Data de início
* Observações
* Documentos anexados

Status sugeridos:

* Em análise
* Em andamento
* Aguardando audiência
* Sentença
* Execução
* Acordo
* Arquivado
* Encerrado

Funcionalidades:

* Criar processo
* Editar processo
* Excluir processo
* Filtrar por cliente, status, fase e data
* Ver detalhes completos
* Histórico interno de movimentações

---

## 8. Módulo Honorários Contratuais

Cada honorário deve ter:

* Cliente vinculado
* Processo vinculado
* Valor total contratado
* Valor de entrada
* Quantidade de parcelas
* Valor de cada parcela
* Data de vencimento
* Status: pendente, pago, vencido, cancelado
* Observações
* Contrato anexado

Funcionalidades:

* Criar contrato de honorários
* Gerar parcelas automaticamente
* Marcar parcela como paga
* Registrar data de pagamento
* Registrar forma de pagamento
* Calcular saldo restante
* Exibir parcelas vencidas
* Exibir parcelas pagas
* Exibir total recebido

---

## 9. Módulo Condenações

Cada condenação deve ter:

* Processo vinculado
* Parte devedora
* Parte credora
* Valor da condenação
* Valor atualizado
* Juros
* Multa
* Data da decisão
* Status: em aberto, parcelado, quitado, em execução
* Observações

Funcionalidades:

* Criar condenação
* Editar condenação
* Vincular ao processo
* Registrar pagamentos recebidos
* Controlar saldo restante
* Transformar em parcelamento
* Marcar como quitada

---

## 10. Módulo Quitação de Dívidas e Parcelamentos

Cada parcelamento deve ter:

* Cliente vinculado
* Processo vinculado, se houver
* Descrição da dívida
* Valor total
* Entrada
* Quantidade de parcelas
* Valor da parcela
* Dia de vencimento
* Status: ativo, quitado, vencido, cancelado
* Observações

Funcionalidades:

* Criar parcelamento
* Gerar parcelas automaticamente
* Marcar parcela como paga
* Anexar comprovante
* Mostrar saldo devedor
* Mostrar parcelas vencidas
* Mostrar previsão de recebimento
* Marcar dívida como quitada automaticamente quando todas as parcelas forem pagas

---

## 11. Módulo Contas Mensais

Cada conta deve ter:

* Descrição
* Categoria
* Valor
* Data de vencimento
* Data de pagamento
* Status: pendente, pago, vencido
* Recorrente: sim ou não
* Observações

Categorias sugeridas:

* Escritório
* Pessoal
* Funcionário
* Sistema
* Marketing
* Custas processuais
* Impostos
* Cartão
* Outros

Funcionalidades:

* Criar conta
* Editar conta
* Marcar como paga
* Criar contas recorrentes
* Filtrar por mês, categoria e status
* Mostrar total de despesas do mês

---

## 12. Módulo Documentos

Permitir anexar documentos em:

* Cliente
* Processo
* Honorários
* Condenação
* Parcelamento

Tipos de documentos:

* Contrato
* Procuração
* RG/CPF
* Comprovante de pagamento
* Petição
* Sentença
* Acordo
* Outros

Usar Supabase Storage para armazenar os arquivos.

---

## 13. Módulo Relatórios

Criar relatórios com filtros por:

* Período
* Cliente
* Processo
* Categoria
* Status

Relatórios necessários:

* Recebimentos mensais
* Despesas mensais
* Honorários pendentes
* Parcelas vencidas
* Processos ativos
* Condenações em aberto
* Saldo financeiro mensal

Permitir exportação futura para PDF e Excel.

---

## 14. Banco de Dados

Criar as tabelas principais:

* users
* clients
* cases
* legal_fees
* fee_installments
* condemnations
* condemnation_payments
* debt_installments
* monthly_bills
* documents
* activity_logs

Todas as tabelas devem ter:

* id UUID
* created_at
* updated_at
* user_id
* campos principais do módulo

Aplicar Row Level Security no Supabase para cada usuário acessar apenas seus próprios registros.

---

## 15. Segurança

Implementar:

* Login obrigatório
* Proteção de rotas privadas
* Row Level Security no Supabase
* Validação com Zod
* Sanitização dos inputs
* Tratamento de erros
* Controle de permissões
* Logs de atividades importantes
* Confirmação antes de ações destrutivas

Nunca deixar chaves sensíveis expostas no frontend.

---

## 16. Experiência do Usuário

O sistema deve ter:

* Interface responsiva
* Feedback visual ao salvar, editar ou excluir
* Toasts de sucesso e erro
* Máscaras para CPF, CNPJ, telefone e dinheiro
* Formatação em Real brasileiro
* Datas no padrão brasileiro
* Busca rápida
* Filtros claros
* Paginação em tabelas grandes

---

## 17. Ordem de Implementação

Implementar em fases:

### Fase 1

* Configurar projeto Next.js
* Configurar Tailwind
* Configurar Shadcn UI
* Configurar Supabase
* Criar autenticação
* Criar layout do painel
* Criar dashboard inicial

### Fase 2

* Criar módulo de clientes
* Criar módulo de processos
* Vincular processos aos clientes

### Fase 3

* Criar módulo de honorários
* Criar geração automática de parcelas
* Criar controle de pagamentos

### Fase 4

* Criar módulo de contas mensais
* Criar dashboard financeiro
* Criar filtros mensais

### Fase 5

* Criar módulo de condenações
* Criar quitação de dívidas
* Criar parcelamentos

### Fase 6

* Criar upload de documentos
* Criar relatórios
* Criar logs de atividades
* Refinar segurança e responsividade

---

## 18. Regras de Negócio Importantes

* Todo processo deve estar vinculado a um cliente.
* Honorários podem estar vinculados a cliente e processo.
* Parcelas vencidas devem ser calculadas automaticamente pela data de vencimento.
* Quando todas as parcelas forem pagas, o status do honorário ou parcelamento deve mudar para quitado.
* O dashboard deve considerar apenas registros do usuário logado.
* Valores devem ser tratados como centavos no banco de dados para evitar erro financeiro.
* Nenhuma informação financeira deve ser exibida para usuários não autenticados.
* Documentos devem ficar protegidos por usuário.

---

## 19. Padrão Visual

Criar um sistema com aparência:

* Jurídica
* Premium
* Corporativa
* Limpa
* Moderna
* Confiável

Evitar excesso de animações.

A filosofia visual deve ser:

“Premium não significa animar tudo. Premium significa animar apenas o que realmente agrega valor.”

---

## 20. Entrega Esperada

Ao final, o sistema deve permitir que o Dr. Leonardo tenha controle completo sobre:

* Clientes
* Processos
* Valores contratados
* Valores recebidos
* Parcelas em aberto
* Parcelas vencidas
* Dívidas quitadas
* Condenações da parte contrária
* Contas mensais
* Relatórios financeiros

O sistema deve ser preparado para evoluir futuramente com:

* Notificações por WhatsApp
* Relatórios em PDF
* Exportação Excel
* Integração com agenda
* Controle de equipe
* Permissões por usuário
