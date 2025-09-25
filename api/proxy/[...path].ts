export default async function handler(req: any, res: any) {
  // Pega URL do backend da env
  const backend = process.env.BACKEND_URL;
  
  console.log('=== PROXY DEBUG ===');
  console.log('BACKEND_URL:', backend);
  console.log('Method:', req.method);
  console.log('Query path:', req.query.path);
  
  if (!backend) {
    console.log('BACKEND_URL não configurada!');
    return res.status(500).json({ 
      error: 'BACKEND_URL não configurada',
      message: 'Configure BACKEND_URL no Vercel Dashboard' 
    });
  }

  // Monta URL final
  const path = req.query.path ? req.query.path.join('/') : '';
  const url = `${backend}/api/${path}`;
  
  console.log('URL final:', url);

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

    console.log('Response status:', response.status);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: 'Erro no proxy', details: error });
  }
}