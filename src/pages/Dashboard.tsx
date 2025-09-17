import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogOut, 
  User, 
  Shield, 
  Settings, 
  Activity,
  UserCheck,
  Code,
  Layers
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const getRoleIcon = () => {
    if (user.administrador) return <Shield className="h-4 w-4" />;
    if (user.desenvolvedor) return <Code className="h-4 w-4" />;
    if (user.integrador) return <Layers className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getRoleText = () => {
    if (user.administrador) return 'Administrador';
    if (user.desenvolvedor) return 'Desenvolvedor';
    if (user.integrador) return 'Integrador';
    return 'Usuário';
  };

  const getRoleColor = () => {
    if (user.administrador) return 'destructive';
    if (user.desenvolvedor) return 'default';
    if (user.integrador) return 'secondary';
    return 'outline';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo, {user.nome}</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-border hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card className="bg-gradient-card border-border shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nome:</span>
                <span className="font-medium">{user.nome}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Usuário:</span>
                <span className="font-medium">{user.usuario}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ID:</span>
                <span className="font-medium">#{user.id}</span>
              </div>
            </CardContent>
          </Card>

          {/* Role & Permissions Card */}
          <Card className="bg-gradient-card border-border shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Função & Permissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Função:</span>
                <Badge variant={getRoleColor() as any} className="flex items-center gap-1">
                  {getRoleIcon()}
                  {getRoleText()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Nível:</span>
                <Badge variant="outline">{user.nivel}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Perfil ID:</span>
                <span className="font-medium">#{user.perfil_id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={user.ativo ? "default" : "destructive"}>
                  <Activity className="h-3 w-3 mr-1" />
                  {user.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* System Access Card */}
          <Card className="bg-gradient-card border-border shadow-elegant md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Acesso ao Sistema
              </CardTitle>
              <CardDescription>
                Suas permissões de acesso aos módulos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Administrador</span>
                </div>
                <Badge variant={user.administrador ? "default" : "outline"}>
                  {user.administrador ? <UserCheck className="h-3 w-3 mr-1" /> : null}
                  {user.administrador ? 'Sim' : 'Não'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Desenvolvedor</span>
                </div>
                <Badge variant={user.desenvolvedor ? "default" : "outline"}>
                  {user.desenvolvedor ? <UserCheck className="h-3 w-3 mr-1" /> : null}
                  {user.desenvolvedor ? 'Sim' : 'Não'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Integrador</span>
                </div>
                <Badge variant={user.integrador ? "default" : "outline"}>
                  {user.integrador ? <UserCheck className="h-3 w-3 mr-1" /> : null}
                  {user.integrador ? 'Sim' : 'Não'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="mt-6 bg-gradient-card border-border shadow-elegant">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Sistema!</h2>
              <p className="text-muted-foreground">
                Você está logado como <strong>{user.nome}</strong> com função de <strong>{getRoleText()}</strong>.
                Use o menu de navegação para acessar as funcionalidades disponíveis para seu perfil.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;