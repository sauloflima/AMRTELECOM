import { config } from '../config.mjs';

export function whatsappUrl(message, number = config.contact.whatsapp) {
  const normalized = String(number).replace(/\D/g, '');
  if (!/^[1-9]\d{9,14}$/.test(normalized)) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function messageFor(kind, detail = '') {
  if (kind === 'plan') {
    const plan = config.plans.find(item => item.id === detail);
    if (!plan) return config.messages.general;
    return config.messages.plan.replace('{speed}', plan.speed).replace('{price}', new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price));
  }
  if (kind === 'support') return config.messages.support[detail] || config.messages.support.other;
  if (kind === 'business' && detail === 'Análise técnica') return 'Olá, AMR Telecom! Gostaria de uma análise técnica para minha empresa. Posso compartilhar o endereço, a rede atual e as aplicações principais para avaliarmos uma solução?';
  if (kind === 'business' && ['Cloud', 'Outsourcing de TI', 'Cibersegurança', 'Conectividade'].includes(detail)) return `Olá, AMR Telecom! Gostaria de uma avaliação técnica sobre ${detail} para minha empresa. Podemos conversar sobre escopo e condições?`;
  return config.messages[kind] || config.messages.general;
}

export function validateCoverage(values) {
  const errors = {};
  for (const [field, label] of Object.entries({ name: 'seu nome', city: 'sua cidade', neighborhood: 'seu bairro', street: 'sua rua ou um ponto de referência' })) {
    const value = String(values[field] || '').trim();
    if (!value) errors[field] = `Informe ${label}.`;
    else if (value.length > (field === 'street' ? 200 : 100)) errors[field] = 'Reduza o tamanho deste campo.';
    else if (value.length < 2) errors[field] = 'Informe pelo menos 2 caracteres.';
  }
  return errors;
}

export function selectedPlan(id) {
  return config.plans.find(plan => plan.id === id) || null;
}

export function validateQuickCoverage(values) {
  const errors = {};
  const cep = String(values.cep || '').trim();
  const reference = String(values.reference || '').trim();
  if (!/^\d{5}-?\d{3}$/.test(cep) || /^(\d)\1{7}$/.test(cep.replace('-', ''))) {
    errors.cep = 'Informe um CEP com 8 dígitos.';
  }
  if (!reference) errors.reference = 'Informe o número ou uma referência.';
  else if (reference.length > 160) errors.reference = 'Use até 160 caracteres.';
  return errors;
}

export function quickCoverageMessage(values) {
  const digits = String(values.cep).replace(/\D/g, '');
  const cep = `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return `${config.messages.coverage}\n\nCEP: ${cep}\nNúmero ou referência: ${String(values.reference).trim()}\n\nPodem confirmar a disponibilidade e as condições de instalação?`;
}

export function coverageMessage(values, planId = '') {
  const plan = selectedPlan(planId);
  const intro = plan ? messageFor('plan', plan.id) : config.messages.coverage;
  return `${intro}\n\nNome: ${values.name.trim()}\nCidade: ${values.city.trim()}\nBairro: ${values.neighborhood.trim()}\nRua ou referência: ${values.street.trim()}\n\nAguardo a confirmação de disponibilidade pela equipe.`;
}
