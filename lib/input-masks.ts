export function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

export function formatCpfCnpj(value: string) {
  const digits = onlyDigits(value).slice(0, 14)

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

export function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2")
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

export function formatCaseNumber(value: string) {
  const digits = onlyDigits(value).slice(0, 20)

  return digits
    .replace(/(\d{7})(\d)/, "$1-$2")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{4})(\d)/, "$1.$2")
    .replace(/(\d)(\d{2})(\d)/, "$1.$2.$3")
    .replace(/(\d{4})(\d)$/, "$1.$2")
}

export function formatMoneyInput(value: string) {
  const digits = onlyDigits(value)
  const cents = Number(digits || "0")

  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(cents / 100)
}

export function parseMoneyToNumber(value: string | number | undefined) {
  if (typeof value === "number") {
    return value
  }

  if (!value) {
    return 0
  }

  return Number(onlyDigits(value)) / 100
}
