export default async function handler(req: any, res: any) {
  // Pega URL do backend da env
  const backend = process.env.BACKEND_URL;
  if (!backend) {
    return res.status(500).json({ error: 'BACKEND_URL não configurada' });
  }

  // Monta URL final
  const path = req.query.path ? req.query.path.join('/') : '';
  const url = `${backend}/api/${path}`;

  try {
    // Faz o request para o backend
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro no proxy', details: error });
  }
}