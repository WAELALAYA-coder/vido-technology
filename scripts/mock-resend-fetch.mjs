// Test-only global fetch shim. The auth integration test preloads this file in its
// child backend process so password-recovery tests never contact a real mail provider.
const nativeFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string'
    ? input
    : input instanceof URL
      ? input.href
      : input?.url;

  if (url === 'https://api.resend.com/emails') {
    return new Response(JSON.stringify({ error: 'simulated_mail_provider_failure' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }

  return nativeFetch(input, init);
};
