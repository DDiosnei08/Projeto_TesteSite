export const siteConfig = {
  brand: "Nicolau Autos e Pick-ups",
  city: "União da Vitória — PR",
  phone: "+5542991311244",
  email: "contato@sandronicolau.com.br",
  dpoEmail: "privacidade@sandronicolau.com.br",
  adminTokenHash: "a3f1b2c4d5e6f7081927364554637281aabbccddeeff00112233445566778899"
};

export async function verifyAdminToken(input) {
  if (!input || typeof input !== 'string') return false;
  try {
    const enc = new TextEncoder().encode(input.trim());
    const buf = await crypto.subtle.digest('SHA-256', enc);
    const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    return hex === siteConfig.adminTokenHash;
  } catch (_e) {
    return false;
  }
}
