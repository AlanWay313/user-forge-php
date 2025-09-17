# Instruções para API PHP

Este sistema frontend espera uma API PHP que responda nos seguintes endpoints:

## Configuração Base

1. **URL da API**: Altere a variável `API_BASE_URL` no arquivo `src/contexts/AuthContext.tsx`
   ```typescript
   const API_BASE_URL = 'http://localhost/api'; // Mude para sua URL
   ```

## Endpoints Necessários

### 1. Login - POST `/api/login.php`

**Request Body:**
```json
{
  "usuario": "string",
  "senha": "string"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "token": "jwt_token_aqui",
  "user": {
    "id": 1,
    "personId": 123,
    "nome": "Nome do Usuário",
    "email": "usuario@email.com",
    "usuario": "username",
    "nivel": "usuario",
    "perfil_id": 1,
    "administrador": false,
    "desenvolvedor": false,
    "integrador": false,
    "ativo": true
  }
}
```

**Response (Erro):**
```json
{
  "success": false,
  "message": "Usuário ou senha incorretos"
}
```

### 2. Cadastro - POST `/api/register.php`

**Request Body:**
```json
{
  "nome": "string",
  "email": "string",
  "usuario": "string",
  "senha": "string",
  "doc": "string (opcional)",
  "nivel": "usuario"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso"
}
```

**Response (Erro):**
```json
{
  "success": false,
  "message": "Erro ao criar usuário"
}
```

## Estrutura da Tabela MySQL

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  personId INT,
  doc VARCHAR(20),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  usuario VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nivel ENUM('usuario', 'admin', 'moderador') DEFAULT 'usuario',
  token VARCHAR(255),
  perfil_id INT DEFAULT 1,
  administrador TINYINT(1) DEFAULT 0,
  desenvolvedor TINYINT(1) DEFAULT 0,
  integrador TINYINT(1) DEFAULT 0,
  ativo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Exemplo de Implementação PHP

### login.php
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$usuario = $input['usuario'] ?? '';
$senha = $input['senha'] ?? '';

if (empty($usuario) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Campos obrigatórios']);
    exit;
}

// Conectar com o banco
$pdo = new PDO('mysql:host=localhost;dbname=seu_banco', 'usuario', 'senha');

// Buscar usuário
$stmt = $pdo->prepare('SELECT * FROM usuarios WHERE usuario = ? AND ativo = 1');
$stmt->execute([$usuario]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($senha, $user['senha'])) {
    // Gerar token (simplificado)
    $token = bin2hex(random_bytes(32));
    
    // Atualizar token no banco
    $stmt = $pdo->prepare('UPDATE usuarios SET token = ? WHERE id = ?');
    $stmt->execute([$token, $user['id']]);
    
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => (int)$user['id'],
            'personId' => (int)$user['personId'],
            'nome' => $user['nome'],
            'email' => $user['email'],
            'usuario' => $user['usuario'],
            'nivel' => $user['nivel'],
            'perfil_id' => (int)$user['perfil_id'],
            'administrador' => (bool)$user['administrador'],
            'desenvolvedor' => (bool)$user['desenvolvedor'],
            'integrador' => (bool)$user['integrador'],
            'ativo' => (bool)$user['ativo']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Credenciais inválidas']);
}
?>
```

### register.php
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$nome = $input['nome'] ?? '';
$email = $input['email'] ?? '';
$usuario = $input['usuario'] ?? '';
$senha = $input['senha'] ?? '';
$doc = $input['doc'] ?? '';
$nivel = $input['nivel'] ?? 'usuario';

if (empty($nome) || empty($email) || empty($usuario) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Campos obrigatórios']);
    exit;
}

// Conectar com o banco
$pdo = new PDO('mysql:host=localhost;dbname=seu_banco', 'usuario', 'senha');

// Verificar se usuário ou email já existem
$stmt = $pdo->prepare('SELECT id FROM usuarios WHERE usuario = ? OR email = ?');
$stmt->execute([$usuario, $email]);

if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Usuário ou email já existem']);
    exit;
}

// Hash da senha
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

// Inserir usuário
$stmt = $pdo->prepare('
    INSERT INTO usuarios (nome, email, usuario, senha, doc, nivel, ativo) 
    VALUES (?, ?, ?, ?, ?, ?, 1)
');

if ($stmt->execute([$nome, $email, $usuario, $senhaHash, $doc, $nivel])) {
    echo json_encode(['success' => true, 'message' => 'Usuário criado com sucesso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao criar usuário']);
}
?>
```

## Funcionalidades Implementadas

✅ **Tela de Login** - Autenticação com usuário/senha  
✅ **Tela de Cadastro** - Registro de novos usuários  
✅ **Dashboard** - Painel com informações do usuário  
✅ **Sistema de Permissões** - Administrador, Desenvolvedor, Integrador  
✅ **Proteção de Rotas** - Redirecionamento automático  
✅ **Design Moderno** - Interface dark com gradientes  
✅ **Responsivo** - Funciona em mobile e desktop  
✅ **Validações** - Formulários com validação completa  
✅ **Toasts** - Notificações de sucesso/erro  

## Como Testar

1. Configure sua API PHP conforme as instruções
2. Ajuste a URL da API no `AuthContext.tsx`
3. Acesse o sistema pela tela de login
4. Crie uma conta na tela de cadastro
5. Faça login e acesse o dashboard