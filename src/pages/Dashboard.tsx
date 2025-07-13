
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Building, Mail, Phone, MapPin, Calendar, FileText, TrendingUp, Users, AlertCircle } from "lucide-react";

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

const Dashboard = () => {
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeDeclarations: 12,
    pendingReviews: 3,
    completedThisMonth: 45
  });

  useEffect(() => {
    // Load current client and all clients from localStorage
    const savedClient = localStorage.getItem('currentClient');
    const savedClients = localStorage.getItem('clients');
    
    if (savedClient) {
      setCurrentClient(JSON.parse(savedClient));
    }
    
    if (savedClients) {
      const clients = JSON.parse(savedClients);
      setAllClients(clients);
      setStats(prev => ({ ...prev, totalClients: clients.length }));
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">CustomsBridge</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/register">
              <Button variant="outline">Add New Client</Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost">Admin View</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">Registered clients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Declarations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDeclarations}</div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
              <p className="text-xs text-muted-foreground">Successful filings</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Client Profile</TabsTrigger>
            <TabsTrigger value="clients">All Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {currentClient ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{currentClient.companyName}</CardTitle>
                        <CardDescription className="text-lg mt-2">
                          Client Profile & Information
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getClientTypeColor(currentClient.clientType)}>
                          {currentClient.clientType}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {currentClient.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Company Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <Building className="h-5 w-5" />
                          <span>Company Details</span>
                        </h3>
                        <div className="space-y-3 pl-7">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Company Name</label>
                            <p className="text-gray-900">{currentClient.companyName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">GSTIN</label>
                            <p className="text-gray-900 font-mono">{currentClient.gstin}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Business Type</label>
                            <p className="text-gray-900 capitalize">{currentClient.clientType}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <User className="h-5 w-5" />
                          <span>Contact Information</span>
                        </h3>
                        <div className="space-y-3 pl-7">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Contact Person</label>
                            <p className="text-gray-900">{currentClient.contactName}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <p className="text-gray-900">{currentClient.email}</p>
                          </div>
                          {currentClient.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <p className="text-gray-900">{currentClient.phone}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address & Registration */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <MapPin className="h-5 w-5" />
                          <span>Business Address</span>
                        </h3>
                        <div className="space-y-2 pl-7">
                          {currentClient.address && <p className="text-gray-900">{currentClient.address}</p>}
                          <p className="text-gray-900">
                            {[currentClient.city, currentClient.state, currentClient.pincode]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <Calendar className="h-5 w-5" />
                          <span>Registration Details</span>
                        </h3>
                        <div className="space-y-2 pl-7">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Registration Date</label>
                            <p className="text-gray-900">{formatDate(currentClient.registrationDate)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Client ID</label>
                            <p className="text-gray-900 font-mono">CB-{currentClient.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Client Selected</h3>
                  <p className="text-gray-600 mb-6">Register a new client to view their profile information</p>
                  <Link to="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Register New Client
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>All Registered Clients</CardTitle>
                <CardDescription>
                  Complete list of exporters and importers registered with your brokerage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allClients.length > 0 ? (
                  <div className="space-y-4">
                    {allClients.map((client) => (
                      <div key={client.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-semibold text-lg">{client.companyName}</h4>
                              <Badge className={getClientTypeColor(client.clientType)}>
                                {client.clientType}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{client.contactName} • {client.email}</p>
                            <p className="text-sm text-gray-500">GSTIN: {client.gstin}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>Registered: {formatDate(client.registrationDate)}</p>
                            <p>ID: CB-{client.id}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Clients Registered</h3>
                    <p className="text-gray-600 mb-6">Start by registering your first client</p>
                    <Link to="/register">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Register First Client
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
