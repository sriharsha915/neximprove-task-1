
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Shield, Users, Search, Building, Mail, Calendar, Download, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  clientType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationDate: string;
  status: string;
}

const AdminDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({
    totalClients: 0,
    exporters: 0,
    importers: 0,
    both: 0,
    thisMonth: 0
  });

  useEffect(() => {
    // Load all clients from localStorage
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      const clientsData = JSON.parse(savedClients);
      setClients(clientsData);
      setFilteredClients(clientsData);
      
      // Calculate stats
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      
      const stats = clientsData.reduce((acc: any, client: Client) => {
        acc.totalClients++;
        
        const regDate = new Date(client.registrationDate);
        if (regDate.getMonth() === thisMonth && regDate.getFullYear() === thisYear) {
          acc.thisMonth++;
        }
        
        switch (client.clientType) {
          case 'exporter': acc.exporters++; break;
          case 'importer': acc.importers++; break;
          case 'both': acc.both++; break;
        }
        
        return acc;
      }, { totalClients: 0, exporters: 0, importers: 0, both: 0, thisMonth: 0 });
      
      setStats(stats);
    }
  }, []);

  useEffect(() => {
    // Filter clients based on search and filter type
    let filtered = clients;
    
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.gstin.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(client => client.clientType === filterType);
    }
    
    setFilteredClients(filtered);
  }, [searchTerm, filterType, clients]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'exporter': return 'bg-green-100 text-green-800';
      case 'importer': return 'bg-blue-100 text-blue-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Company Name', 'Contact Person', 'Email', 'Phone', 'GSTIN', 'Client Type', 'City', 'State', 'Registration Date'],
      ...filteredClients.map(client => [
        client.companyName,
        client.contactName,
        client.email,
        client.phone || '',
        client.gstin,
        client.clientType,
        client.city || '',
        client.state || '',
        formatDate(client.registrationDate)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CustomsBridge Admin</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/dashboard">
              <Button variant="outline">Client Dashboard</Button>
            </Link>
            <Link to="/register">
              <Button>Add New Client</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exporters</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.exporters}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Importers</CardTitle>
              <Building className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.importers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Both Types</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.both}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
            </CardContent>
          </Card>
        </div>

        {/* Client Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>
                  Manage all registered exporters and importers
                </CardDescription>
              </div>
              <Button onClick={exportData} variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by company, contact, email, or GSTIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Client Types</SelectItem>
                    <SelectItem value="exporter">Exporters Only</SelectItem>
                    <SelectItem value="importer">Importers Only</SelectItem>
                    <SelectItem value="both">Both Types</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Client List */}
            {filteredClients.length > 0 ? (
              <div className="space-y-4">
                {filteredClients.map((client) => (
                  <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-lg">{client.companyName}</h4>
                          <Badge className={getClientTypeColor(client.clientType)}>
                            {client.clientType}
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {client.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{client.contactName}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{client.email}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">GSTIN: <span className="font-mono">{client.gstin}</span></p>
                            <p className="text-sm text-gray-600">
                              Location: {[client.city, client.state].filter(Boolean).join(', ') || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-500 ml-4">
                        <p>Registered</p>
                        <p className="font-medium">{formatDate(client.registrationDate)}</p>
                        <p className="text-xs mt-1">ID: CB-{client.id}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                {clients.length === 0 ? (
                  <>
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Clients Found</h3>
                    <p className="text-gray-600 mb-6">Start by registering your first client</p>
                    <Link to="/register">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Register First Client
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
