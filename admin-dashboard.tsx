import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  School, 
  UserCheck, 
  Settings,
  Shield,
  PlusCircle,
  Edit,
  Trash2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  institutionId?: string;
  institution?: {
    name: string;
    type: string;
  };
  staffCredentials?: {
    title: string;
    department: string;
    yearsExperience: number;
    specializations: string[];
  };
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

interface Institution {
  id: string;
  name: string;
  type: string;
  accreditation?: string;
  website?: string;
  contactEmail?: string;
  isActive: boolean;
  userCount: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "student",
    institutionId: "",
    staffCredentials: {
      title: "",
      department: "",
      yearsExperience: 0,
      specializations: []
    }
  });

  // Fetch platform statistics
  const { data: platformStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/platform-stats"],
    enabled: user?.role === "admin"
  });

  // Fetch all users
  const { data: allUsers, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin"
  });

  // Fetch all institutions
  const { data: institutions, isLoading: institutionsLoading } = useQuery<Institution[]>({
    queryKey: ["/api/admin/institutions"],
    enabled: user?.role === "admin"
  });

  // Update user role mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: { userId: string; updates: Partial<User> }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${data.userId}`, data.updates);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      setEditingUser(null);
    }
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/users", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Success",
        description: "User created successfully"
      });
      setUserForm({
        email: "",
        firstName: "",
        lastName: "",
        role: "student",
        institutionId: "",
        staffCredentials: {
          title: "",
          department: "",
          yearsExperience: 0,
          specializations: []
        }
      });
    }
  });

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!editingUser) return;
    updateUserMutation.mutate({ userId: editingUser.id, updates });
  };

  const handleCreateUser = () => {
    if (!userForm.email || !userForm.firstName || !userForm.lastName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createUserMutation.mutate(userForm);
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold">Admin Access Required</h3>
              <p className="text-muted-foreground">This area is restricted to platform administrators.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockStats = {
    totalUsers: 15842,
    activeStudents: 12341,
    staffMembers: 287,
    institutions: 43,
    dailyActiveUsers: 1523,
    monthlyGrowth: 12.5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Platform administration and user management
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{mockStats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.dailyActiveUsers} active today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.staffMembers}</div>
              <p className="text-xs text-muted-foreground">
                Across {mockStats.institutions} institutions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Institutions</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.institutions}</div>
              <p className="text-xs text-muted-foreground">
                Educational partners
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Platform Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="institutions">Institutions</TabsTrigger>
            <TabsTrigger value="assignments">Role Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                  <CardDescription>Breakdown by user roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Students</span>
                      <span className="text-sm font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Staff</span>
                      <span className="text-sm font-semibold">18%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Administrators</span>
                      <span className="text-sm font-semibold">4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Institution Types</CardTitle>
                  <CardDescription>Partner institutions by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Universities</span>
                      <Badge variant="secondary">24</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">K-12 Schools</span>
                      <Badge variant="secondary">15</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tutoring Centers</span>
                      <Badge variant="secondary">4</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage user accounts and roles</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="text-center py-8">Loading users...</div>
                  ) : (
                    <div className="space-y-4">
                      {allUsers?.slice(0, 10).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {user.firstName[0]}{user.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">
                                {user.firstName} {user.lastName}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={
                                  user.role === 'admin' ? 'destructive' :
                                  user.role === 'staff' ? 'default' :
                                  'secondary'
                                }>
                                  {user.role}
                                </Badge>
                                {user.institution && (
                                  <Badge variant="outline">
                                    {user.institution.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                  <CardDescription>Add users and assign roles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userForm.firstName}
                      onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userForm.lastName}
                      onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={userForm.role} onValueChange={(value) => setUserForm({...userForm, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Select value={userForm.institutionId} onValueChange={(value) => setUserForm({...userForm, institutionId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions?.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {userForm.role === 'staff' && (
                    <div className="space-y-3 pt-4 border-t">
                      <Label>Staff Credentials</Label>
                      <Input
                        placeholder="Job Title"
                        value={userForm.staffCredentials.title}
                        onChange={(e) => setUserForm({
                          ...userForm,
                          staffCredentials: {...userForm.staffCredentials, title: e.target.value}
                        })}
                      />
                      <Input
                        placeholder="Department"
                        value={userForm.staffCredentials.department}
                        onChange={(e) => setUserForm({
                          ...userForm,
                          staffCredentials: {...userForm.staffCredentials, department: e.target.value}
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Years of Experience"
                        value={userForm.staffCredentials.yearsExperience}
                        onChange={(e) => setUserForm({
                          ...userForm,
                          staffCredentials: {...userForm.staffCredentials, yearsExperience: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                  )}

                  <Button 
                    onClick={handleCreateUser}
                    disabled={createUserMutation.isPending}
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {createUserMutation.isPending ? "Creating..." : "Create User"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="institutions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Partner Institutions</CardTitle>
                <CardDescription>Educational institutions using the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {institutionsLoading ? (
                  <div className="text-center py-8">Loading institutions...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {institutions?.map((institution) => (
                      <Card key={institution.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{institution.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {institution.type.replace('_', ' ').toUpperCase()}
                              </p>
                            </div>
                            <Badge variant={institution.isActive ? 'default' : 'secondary'}>
                              {institution.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Users:</span>
                              <span className="font-semibold">{institution.userCount}</span>
                            </div>
                            {institution.website && (
                              <div className="text-sm text-blue-600 truncate">
                                {institution.website}
                              </div>
                            )}
                            {institution.contactEmail && (
                              <div className="text-sm text-muted-foreground truncate">
                                {institution.contactEmail}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff-Student Assignments</CardTitle>
                <CardDescription>Manage educational supervision relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Assignment Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Configure which staff members can access specific student data
                  </p>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Edit User</CardTitle>
                <CardDescription>Update user information and role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm">{editingUser.firstName} {editingUser.lastName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm">{editingUser.email}</p>
                </div>
                <div>
                  <Label htmlFor="editRole">Role</Label>
                  <Select defaultValue={editingUser.role} onValueChange={(value) => handleUpdateUser({ role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setEditingUser(null)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleUpdateUser({ isActive: !editingUser.isActive })}
                    variant={editingUser.isActive ? "destructive" : "default"}
                  >
                    {editingUser.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}