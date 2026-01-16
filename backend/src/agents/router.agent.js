function routeMessage(text) {
  const message = text.toLowerCase();

  if (
    message.includes('order') ||
    message.includes('delivery') ||
    message.includes('track')
  ) {
    return 'order';
  }

  if (
    message.includes('payment') ||
    message.includes('refund') ||
    message.includes('invoice')
  ) {
    return 'billing';
  }

  return 'support';
}

module.exports = { routeMessage };
